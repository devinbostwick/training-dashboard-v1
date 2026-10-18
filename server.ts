import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });
dotenv.config(); // also load .env if present

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

const API_BASE = 'https://api.trainual.com';
const API_HOST = 'api.trainual.com';
const API_TOKEN = process.env.TRAINUAL_API_TOKEN || '';

function authHeaders() {
  return {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

class TrainualApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    super(`Trainual API error ${status}`);
    this.status = status;
    this.body = body;
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// No Retry-After header on v3 — exponential backoff on 429 and 5xx (reads only; see trainualFetch).
function backoffMs(attempt: number) {
  return Math.min(1000 * Math.pow(2, attempt), 16000);
}

async function safeJson(response: Response) {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500) };
  }
}

// `path` may be a full URL (e.g. a JSON:API `links.next` page) or a /v3/... path.
// Writes (POST/DELETE/PATCH/PUT) only retry on 429 — retrying a 5xx on a write risks
// double-executing a side effect the server may have already applied. Reads retry on
// 429 and 5xx since they're idempotent.
async function trainualFetch(path: string, method: string = 'GET', payload?: any): Promise<any> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const options: RequestInit = { method, headers: authHeaders() };
  if (payload !== undefined) options.body = JSON.stringify(payload);
  const isWrite = method !== 'GET';

  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (e) {
      if (attempt === maxAttempts - 1) throw new TrainualApiError(502, { error: 'Network error contacting Trainual' });
      await sleep(backoffMs(attempt));
      continue;
    }

    const retryable = response.status === 429 || (!isWrite && response.status >= 500);
    if (retryable) {
      if (attempt === maxAttempts - 1) throw new TrainualApiError(response.status, await safeJson(response));
      await sleep(backoffMs(attempt));
      continue;
    }

    if (response.status === 204) return null;
    if (response.ok) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }

    throw new TrainualApiError(response.status, await safeJson(response));
  }
  return null;
}

// Follows JSON:API `links.next` (max page[size] is 100) to collect every page.
// Only follows links whose host is api.trainual.com — an upstream response should
// never be able to redirect this server into fetching an arbitrary URL.
async function fetchAllPages(path: string): Promise<any[]> {
  let url: string | undefined = path;
  let results: any[] = [];
  let guard = 0;
  while (url && guard < 200) {
    const data: any = await trainualFetch(url);
    if (!data) break;
    results = results.concat(data.data || []);
    const next = data.links?.next;
    if (next) {
      try {
        if (new URL(next).host === API_HOST) {
          url = next;
        } else {
          console.error(`Ignoring links.next with unexpected host: ${next}`);
          url = undefined;
        }
      } catch {
        url = undefined;
      }
    } else {
      url = undefined;
    }
    guard++;
  }
  return results;
}

// Runs async tasks with a bounded concurrency so bulk operations (Assign All, per-subject
// calls) don't fire dozens of simultaneous requests at the upstream API.
async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

const UPSTREAM_CONCURRENCY = 5;

function handleTrainualError(res: express.Response, e: any) {
  if (e instanceof TrainualApiError) {
    // Never forward upstream response bodies to the client — they can contain detail
    // that isn't ours to leak. Log the detail server-side (headers carry the token, not
    // the body, so this is safe), return a generic message keyed off the status class.
    console.error(`Trainual API error ${e.status}:`, JSON.stringify(e.body).slice(0, 500));
    const status = e.status;
    let message = 'Trainual API error';
    if (status === 401 || status === 403) message = 'Not authorized to perform this action in Trainual';
    else if (status === 404) message = 'The requested Trainual resource was not found';
    else if (status === 422) message = 'Trainual rejected the request';
    else if (status === 429) message = 'Rate limited by Trainual, please retry shortly';
    else if (status >= 500) message = 'Trainual is currently unavailable';
    res.status(status).json({ error: message });
    return;
  }
  console.error('Trainual proxy error:', e);
  res.status(502).json({ error: 'Trainual proxy error' });
}

function isPositiveInteger(value: any): value is number {
  return Number.isInteger(value) && value > 0;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: 'ok',
    tokenConfigured: !!API_TOKEN
  });
});

// API Routes
app.get("/api/trainual/users", async (req, res) => {
  try {
    const [usersRes, assignments, groupsRes] = await Promise.all([
      trainualFetch('/v3/users'),
      fetchAllPages('/v3/assignments?content_type=subject&include=user,subject&page[size]=100'),
      trainualFetch('/v3/groups?kind=role&include=users')
    ]);

    const subjectsByUser = new Map<string, Set<string>>();
    let skippedAssignments = 0;
    for (const a of assignments) {
      const userId = a?.relationships?.user?.data?.id;
      const subjectId = a?.relationships?.subject?.data?.id;
      if (!userId || !subjectId) {
        // Missing relationship data means we can't tell who/what this assignment is
        // for — count and skip it rather than silently treating it as "not assigned".
        skippedAssignments++;
        continue;
      }
      if (!subjectsByUser.has(userId)) subjectsByUser.set(userId, new Set());
      subjectsByUser.get(userId)!.add(subjectId);
    }
    if (skippedAssignments > 0) {
      console.error(`Skipped ${skippedAssignments} assignment(s) missing user/subject relationship data`);
    }

    // v1's "roles_assigned" maps to v3 groups of kind=role.
    const rolesByUser = new Map<string, string[]>();
    for (const g of (groupsRes?.data || [])) {
      const name = g?.attributes?.name;
      const userRefs = g?.relationships?.users?.data || [];
      for (const u of userRefs) {
        const uid = u?.id;
        if (!uid || !name) continue;
        if (!rolesByUser.has(uid)) rolesByUser.set(uid, []);
        rolesByUser.get(uid)!.push(name);
      }
    }

    const users = (usersRes?.data || []).map((u: any) => ({
      id: Number(u.id),
      name: u.attributes?.name || '',
      email: u.attributes?.email || '',
      status: u.attributes?.status || '',
      curriculums_assigned: Array.from(subjectsByUser.get(u.id) || []).map(id => ({ id: Number(id) })),
      roles_assigned: (rolesByUser.get(u.id) || []).map(name => ({ name }))
    }));

    res.json(users);
  } catch (e) {
    handleTrainualError(res, e);
  }
});

app.get("/api/trainual/subjects", async (req, res) => {
  try {
    const [subjectsRes, testsRes] = await Promise.all([
      trainualFetch('/v3/subjects'),
      trainualFetch('/v3/content?filter[type]=tests')
    ]);

    const testCountBySubject = new Map<string, number>();
    for (const t of (testsRes?.data || [])) {
      const subjectId = t?.attributes?.subject_id;
      if (subjectId == null) continue;
      const key = String(subjectId);
      testCountBySubject.set(key, (testCountBySubject.get(key) || 0) + 1);
    }

    const subjects = (subjectsRes?.data || []).map((s: any) => ({
      id: Number(s.id),
      title: s.attributes?.title || 'Untitled',
      surveys_count: testCountBySubject.get(s.id) || 0
    }));

    res.json(subjects);
  } catch (e) {
    handleTrainualError(res, e);
  }
});

app.get("/api/trainual/subjects/:id/tests", async (req, res) => {
  try {
    const testsRes = await trainualFetch('/v3/content?filter[type]=tests');
    const subjectId = req.params.id;
    const tests = (testsRes?.data || [])
      .filter((t: any) => String(t?.attributes?.subject_id) === String(subjectId))
      .map((t: any) => ({ id: Number(t.id), name: t.attributes?.title || 'Unnamed Test' }));
    res.json(tests);
  } catch (e) {
    handleTrainualError(res, e);
  }
});

// Returns every test with its subject_id so callers can group client-side instead of
// issuing one request per subject (the tests list is fetched once here, not N times).
app.get("/api/trainual/tests", async (req, res) => {
  try {
    const testsRes = await trainualFetch('/v3/content?filter[type]=tests');
    const tests = (testsRes?.data || []).map((t: any) => ({
      id: Number(t.id),
      name: t.attributes?.title || 'Unnamed Test',
      subject_id: t.attributes?.subject_id != null ? Number(t.attributes.subject_id) : null
    }));
    res.json(tests);
  } catch (e) {
    handleTrainualError(res, e);
  }
});

app.put("/api/trainual/users/:id/assign", async (req, res) => {
  const userId = Number(req.params.id);
  const curriculumIds: number[] = req.body?.curriculum_ids || [];
  if (!isPositiveInteger(userId)) {
    res.status(400).json({ error: 'userId must be a positive integer' });
    return;
  }
  if (!curriculumIds.every(isPositiveInteger)) {
    res.status(400).json({ error: 'curriculum_ids must all be positive integers' });
    return;
  }
  try {
    const results = await mapWithConcurrency(curriculumIds, UPSTREAM_CONCURRENCY, async (subjectId) => {
      try {
        await trainualFetch('/v3/assignments', 'POST', {
          data: { type: 'assignments', attributes: { user_id: userId, subject_id: subjectId } }
        });
        return { subjectId, ok: true };
      } catch (e: any) {
        console.error(`Failed to assign subject ${subjectId} to user ${userId}:`, e?.status, e?.body && JSON.stringify(e.body).slice(0, 300));
        return { subjectId, ok: false };
      }
    });
    const succeeded = results.filter(r => r.ok).map(r => r.subjectId);
    const failed = results.filter(r => !r.ok).map(r => r.subjectId);
    if (failed.length > 0) {
      res.status(502).json({ error: 'One or more assignments failed', succeeded, failed });
      return;
    }
    res.json({ success: true, succeeded, failed: [] });
  } catch (e) {
    handleTrainualError(res, e);
  }
});

app.put("/api/trainual/users/:id/unassign", async (req, res) => {
  const userId = Number(req.params.id);
  const curriculumIds: number[] = req.body?.curriculum_ids || [];
  if (!isPositiveInteger(userId)) {
    res.status(400).json({ error: 'userId must be a positive integer' });
    return;
  }
  if (!curriculumIds.every(isPositiveInteger)) {
    res.status(400).json({ error: 'curriculum_ids must all be positive integers' });
    return;
  }
  try {
    const results = await mapWithConcurrency(curriculumIds, UPSTREAM_CONCURRENCY, async (subjectId) => {
      try {
        const query = new URLSearchParams({
          user_id: String(userId),
          content_type: 'subject',
          content_id: String(subjectId),
          include: 'user,subject'
        });
        const existing = await trainualFetch(`/v3/assignments?${query.toString()}`);
        const assignment = (existing?.data || []).find((a: any) =>
          String(a?.relationships?.user?.data?.id) === String(userId) &&
          String(a?.relationships?.subject?.data?.id) === String(subjectId)
        );
        if (!assignment) return { subjectId, ok: false };
        await trainualFetch(`/v3/assignments/${assignment.id}`, 'DELETE');
        return { subjectId, ok: true };
      } catch (e: any) {
        console.error(`Failed to unassign subject ${subjectId} from user ${userId}:`, e?.status, e?.body && JSON.stringify(e.body).slice(0, 300));
        return { subjectId, ok: false };
      }
    });
    const succeeded = results.filter(r => r.ok).map(r => r.subjectId);
    const failed = results.filter(r => !r.ok).map(r => r.subjectId);
    if (failed.length > 0) {
      res.status(502).json({ error: 'One or more unassignments failed', succeeded, failed });
      return;
    }
    res.json({ success: true, succeeded, failed: [] });
  } catch (e) {
    handleTrainualError(res, e);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Trainual API server running on http://localhost:${PORT}`);
});
