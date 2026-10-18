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

// No Retry-After header on v3 — exponential backoff on 429 and 5xx.
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
async function trainualFetch(path: string, method: string = 'GET', payload?: any): Promise<any> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const options: RequestInit = { method, headers: authHeaders() };
  if (payload !== undefined) options.body = JSON.stringify(payload);

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

    if (response.status === 429 || response.status >= 500) {
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
async function fetchAllPages(path: string): Promise<any[]> {
  let url: string | undefined = path;
  let results: any[] = [];
  let guard = 0;
  while (url && guard < 200) {
    const data: any = await trainualFetch(url);
    if (!data) break;
    results = results.concat(data.data || []);
    url = data.links?.next;
    guard++;
  }
  return results;
}

function handleTrainualError(res: express.Response, e: any) {
  if (e instanceof TrainualApiError) {
    console.error(`Trainual API error ${e.status}:`, JSON.stringify(e.body).slice(0, 500));
    res.status(e.status).json(e.body ?? { error: 'Trainual API error' });
    return;
  }
  console.error('Trainual proxy error:', e);
  res.status(502).json({ error: 'Trainual proxy error' });
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
    const [usersRes, assignments, responsibilitiesRes] = await Promise.all([
      trainualFetch('/v3/users'),
      fetchAllPages('/v3/assignments?content_type=subject&page[size]=100'),
      trainualFetch('/v3/responsibilities?include=users')
    ]);

    const subjectsByUser = new Map<string, Set<string>>();
    for (const a of assignments) {
      const userId = a?.relationships?.user?.data?.id;
      const subjectId = a?.relationships?.subject?.data?.id;
      if (!userId || !subjectId) continue;
      if (!subjectsByUser.has(userId)) subjectsByUser.set(userId, new Set());
      subjectsByUser.get(userId)!.add(subjectId);
    }

    const rolesByUser = new Map<string, string[]>();
    for (const r of (responsibilitiesRes?.data || [])) {
      const name = r?.attributes?.name;
      const userRefs = r?.relationships?.users?.data || [];
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

app.put("/api/trainual/users/:id/assign", async (req, res) => {
  const userId = Number(req.params.id);
  const curriculumIds: number[] = req.body?.curriculum_ids || [];
  try {
    const results = await Promise.all(curriculumIds.map(async (subjectId) => {
      try {
        await trainualFetch('/v3/assignments', 'POST', {
          data: { type: 'assignments', attributes: { user_id: userId, subject_id: subjectId } }
        });
        return true;
      } catch (e: any) {
        console.error(`Failed to assign subject ${subjectId} to user ${userId}:`, e?.status, e?.body && JSON.stringify(e.body).slice(0, 300));
        return false;
      }
    }));
    res.json({
      success: results.every(Boolean),
      assigned: results.filter(Boolean).length,
      failed: results.filter(r => !r).length
    });
  } catch (e) {
    handleTrainualError(res, e);
  }
});

app.put("/api/trainual/users/:id/unassign", async (req, res) => {
  const userId = Number(req.params.id);
  const curriculumIds: number[] = req.body?.curriculum_ids || [];
  try {
    const results = await Promise.all(curriculumIds.map(async (subjectId) => {
      try {
        const existing = await trainualFetch(`/v3/assignments?user_id=${userId}&content_type=subject&content_id=${subjectId}`);
        const assignment = (existing?.data || [])[0];
        if (!assignment) return false;
        await trainualFetch(`/v3/assignments/${assignment.id}`, 'DELETE');
        return true;
      } catch (e: any) {
        console.error(`Failed to unassign subject ${subjectId} from user ${userId}:`, e?.status, e?.body && JSON.stringify(e.body).slice(0, 300));
        return false;
      }
    }));
    res.json({
      success: results.every(Boolean),
      unassigned: results.filter(Boolean).length,
      failed: results.filter(r => !r).length
    });
  } catch (e) {
    handleTrainualError(res, e);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Trainual API server running on http://localhost:${PORT}`);
});
