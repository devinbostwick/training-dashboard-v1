/**
 * Client-side Trainual API service.
 * Routes through a CORS proxy since Trainual's API doesn't support
 * cross-origin browser requests directly.
 *
 * CORS Proxy options (set VITE_TRAINUAL_PROXY in .env.local):
 *   - Local dev:  http://localhost:3001  (run: npm run dev:server)
 *   - Production: Deploy server.ts to Render/Railway and set the URL
 */

import { getConfig, hasConfig } from './localConfig';

// Proxy base URL and password are read at call-time from localConfig
// so that dashboard edits take effect without a page reload.
function getProxyBase(): string {
  const proxy = getConfig('TRAINUAL_PROXY');
  return (proxy && proxy !== 'undefined')
    ? `${proxy.replace(/\/$/, '')}/api/trainual`
    : '/api/trainual';
}

function getPassword(): string {
  return getConfig('TRAINUAL_PASSWORD');
}

const TRAINUAL_CONFIG = {
  ADMIN_EMAIL: 'devin@threepointshospitality.com',
  ACCOUNT_ID: 'f9e05a9e-ccec-463e-beae-d1c5489f4c52',
  API_BASE: 'https://api.trainual.com/v1'
};

async function trainualFetch(endpoint: string, method: string = 'GET', payload?: any): Promise<any> {
  // Use the proxy — direct browser calls to Trainual are blocked by CORS
  const url = `${getProxyBase()}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (payload) options.body = JSON.stringify(payload);

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 200 || response.status === 201) {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
      }
      if (response.status === 204) return {};
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt + 1) * 1000));
        continue;
      }
      throw new Error(`Trainual API Error: ${response.status} ${response.statusText}`);
    } catch (e: any) {
      if (attempt === 2) throw e;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  return null;
}

export interface BulkWriteResult {
  success: boolean;
  succeeded: number[];
  failed: number[];
  error?: string;
}

// Assign/unassign are writes against the proxy's own bulk endpoints, which report
// per-item success/failure. Retry only on 429 — a 5xx or 502 (partial failure) must
// not be blindly retried since some items may have already succeeded upstream.
async function trainualWrite(endpoint: string, payload: any, allIds: number[]): Promise<BulkWriteResult> {
  const url = `${getProxyBase()}${endpoint}`;
  const options: RequestInit = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (e: any) {
      if (attempt === 2) return { success: false, succeeded: [], failed: allIds, error: e?.message || 'Network error' };
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      continue;
    }

    if (response.status === 429) {
      if (attempt === 2) return { success: false, succeeded: [], failed: allIds, error: 'Rate limited, please retry' };
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt + 1) * 1000));
      continue;
    }

    const text = await response.text().catch(() => '');
    let body: any = {};
    try { body = text ? JSON.parse(text) : {}; } catch { body = {}; }

    if (response.ok) {
      return { success: true, succeeded: body.succeeded ?? allIds, failed: body.failed ?? [] };
    }
    // Non-429 failure: don't retry, surface whatever succeeded/failed the proxy reported.
    return {
      success: false,
      succeeded: body.succeeded ?? [],
      failed: body.failed ?? allIds,
      error: body.error || `Trainual API Error: ${response.status}`
    };
  }
  return { success: false, succeeded: [], failed: allIds, error: 'Rate limited, please retry' };
}

export async function fetchUsers() {
  return await trainualFetch('/users') || [];
}

export async function fetchSubjects() {
  return await trainualFetch('/subjects') || [];
}

export async function fetchSubjectTests(subjectId: number) {
  return await trainualFetch(`/subjects/${subjectId}/tests`) || [];
}

// Every test with its subject_id, fetched once and grouped client-side — avoids
// issuing one request per subject.
export async function fetchAllTests(): Promise<{ id: number; name: string; subject_id: number | null }[]> {
  return await trainualFetch('/tests') || [];
}

export async function assignCurriculums(userId: number, curriculumIds: number[]): Promise<BulkWriteResult> {
  return trainualWrite(`/users/${userId}/assign`, { curriculum_ids: curriculumIds }, curriculumIds);
}

export async function unassignCurriculums(userId: number, curriculumIds: number[]): Promise<BulkWriteResult> {
  return trainualWrite(`/users/${userId}/unassign`, { curriculum_ids: curriculumIds }, curriculumIds);
}

export function isTrainualConfigured(): boolean {
  return hasConfig('TRAINUAL_PROXY') || hasConfig('TRAINUAL_PASSWORD');
}
