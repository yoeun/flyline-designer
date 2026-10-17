import { createServer } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp, rateLimiter } from './app.js';
import { cleanRack, isShareId } from './shares.js';
import { memoryStore, postgresStore } from './store.js';

const ORIGIN = 'https://flyline.example';
const RACK = [{ id: 'a', title: 'Dry 5', styles: ['dry'], notes: '', reel: { model: 'r' }, line: { weight: 5 }, backing: { color: 'white' } }];

// With TEST_DATABASE_URL (and `npm ci` in server/) the API runs on that Postgres database instead of memory.
const newStore = () => (process.env.TEST_DATABASE_URL ? postgresStore(process.env.TEST_DATABASE_URL) : memoryStore());

async function start(limits) {
  const server = createServer(createApp({ store: await newStore(), allowedOrigins: [ORIGIN], limits }));
  await new Promise((resolve) => server.listen(0, resolve));
  return { server, base: `http://localhost:${server.address().port}` };
}

let server, base;
beforeAll(async () => ({ server, base } = await start()));
afterAll(() => server.close());

const call = (path, { method = 'GET', body, token, headers = {} } = {}, root = base) =>
  fetch(root + path, {
    method,
    headers: { ...(body && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }), ...headers },
    body: body && JSON.stringify(body),
  });

const share = async (rack = RACK) => (await call('/api/shares', { method: 'POST', body: { rack } })).json();

describe('shares API', () => {
  it('shares a rack under a random id, separate from the owner token', async () => {
    const res = await call('/api/shares', { method: 'POST', body: { rack: RACK } });
    expect(res.status).toBe(201);
    const { shareId, ownerToken } = await res.json();
    expect(isShareId(shareId)).toBe(true);
    expect(ownerToken).toHaveLength(43);
    expect(ownerToken).not.toContain(shareId);
    const other = await share();
    expect(other.shareId).not.toBe(shareId);
  });

  it('lets anyone with the id read the rack, but never returns the owner token', async () => {
    const { shareId, ownerToken } = await share();
    const res = await call(`/api/shares/${shareId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.rack).toEqual(RACK);
    expect(JSON.stringify(body)).not.toContain(ownerToken);
  });

  it('updates the rack only with the owner token', async () => {
    const { shareId, ownerToken } = await share();
    const next = [{ ...RACK[0], title: 'Changed' }];
    expect((await call(`/api/shares/${shareId}`, { method: 'PUT', body: { rack: next } })).status).toBe(401);
    const { ownerToken: otherToken } = await share();
    expect((await call(`/api/shares/${shareId}`, { method: 'PUT', body: { rack: next }, token: otherToken })).status).toBe(404);
    expect((await (await call(`/api/shares/${shareId}`)).json()).rack[0].title).toBe('Dry 5');

    expect((await call(`/api/shares/${shareId}`, { method: 'PUT', body: { rack: next }, token: ownerToken })).status).toBe(204);
    expect((await (await call(`/api/shares/${shareId}`)).json()).rack[0].title).toBe('Changed');
  });

  it('gives the owner a new link and retires the old one', async () => {
    const { shareId, ownerToken } = await share();
    const { ownerToken: otherToken } = await share();
    expect((await call(`/api/shares/${shareId}/rotate`, { method: 'POST', token: otherToken })).status).toBe(404);

    const res = await call(`/api/shares/${shareId}/rotate`, { method: 'POST', token: ownerToken });
    const { shareId: newId } = await res.json();
    expect(newId).not.toBe(shareId);
    expect((await call(`/api/shares/${shareId}`)).status).toBe(404);
    expect((await call(`/api/shares/${newId}`)).status).toBe(200);
    expect((await call(`/api/shares/${newId}`, { method: 'PUT', body: { rack: [] }, token: ownerToken })).status).toBe(204);
  });

  it('stops sharing only for the owner', async () => {
    const { shareId, ownerToken } = await share();
    const { ownerToken: otherToken } = await share();
    expect((await call(`/api/shares/${shareId}`, { method: 'DELETE', token: otherToken })).status).toBe(404);
    expect((await call(`/api/shares/${shareId}`, { method: 'DELETE', token: ownerToken })).status).toBe(204);
    expect((await call(`/api/shares/${shareId}`)).status).toBe(404);
  });

  it('rejects bodies that are not a rack', async () => {
    expect((await call('/api/shares', { method: 'POST', body: { rack: 'nope' } })).status).toBe(400);
    expect((await call('/api/shares', { method: 'POST', body: { rack: [1] } })).status).toBe(400);
    const bad = await fetch(`${base}/api/shares`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    expect(bad.status).toBe(400);
  });

  it('answers CORS only for allowed origins', async () => {
    const allowed = await call('/api/shares', { method: 'OPTIONS', headers: { Origin: ORIGIN } });
    expect(allowed.headers.get('access-control-allow-origin')).toBe(ORIGIN);
    const other = await call('/api/shares', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } });
    expect(other.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('limits new links per caller', async () => {
    const limited = await start({ perIp: 2 });
    const post = (ip) => call('/api/shares', { method: 'POST', body: { rack: [] }, headers: { 'X-Forwarded-For': ip } }, limited.base).then((r) => r.status);
    expect([await post('203.0.113.9'), await post('203.0.113.9'), await post('203.0.113.9'), await post('203.0.113.10')]).toEqual([201, 201, 429, 201]);
    limited.server.close();
  });
});

describe('cleanRack', () => {
  it('keeps only setup fields', () => {
    expect(cleanRack({ rack: [{ title: 'x', extra: 1 }] })).toEqual([{ title: 'x' }]);
  });

  it('refuses racks that are too long', () => {
    expect(cleanRack({ rack: Array.from({ length: 501 }, () => ({})) })).toBeNull();
  });
});

describe('rateLimiter', () => {
  it('opens a new window once the old one ends', () => {
    const allow = rateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow('k', 0)).toBe(true);
    expect(allow('k', 500)).toBe(false);
    expect(allow('k', 1000)).toBe(true);
  });
});
