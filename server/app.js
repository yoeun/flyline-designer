// The shares API. Anyone with a share id can read that rack; changing or removing it takes the owner
// token from when it was shared, sent as `Authorization: Bearer <token>`.
//
//   POST   /api/shares             { rack }  → 201 { shareId, ownerToken }
//   GET    /api/shares/:id                   → 200 { rack, updatedAt }
//   PUT    /api/shares/:id         { rack }  → 204           (owner)
//   POST   /api/shares/:id/rotate            → 200 { shareId } (owner; the old id stops working)
//   DELETE /api/shares/:id                   → 204           (owner)
//
// A write with an unknown id or the wrong token gets 404 either way.
import { cleanRack, hashToken, isOwnerToken, isShareId, newOwnerToken, newShareId } from './shares.js';

const MAX_BODY = 512 * 1024;
const HOUR = 60 * 60 * 1000;

// At most `limit` calls per key in each window.
export function rateLimiter({ limit, windowMs }) {
  const windows = new Map();
  return (key, now = Date.now()) => {
    const w = windows.get(key);
    if (!w || now >= w.resetAt) {
      if (windows.size > 10_000) for (const [k, v] of windows) if (now >= v.resetAt) windows.delete(k);
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    return ++w.count <= limit;
  };
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new HttpError(413, 'Rack too large');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || 'null');
  } catch {
    throw new HttpError(400, 'Invalid JSON');
  }
}

const bearer = (req) => {
  const token = /^Bearer (.+)$/.exec(req.headers.authorization ?? '')?.[1];
  return isOwnerToken(token) ? token : null;
};

// The caller's address as Render's proxy reports it, for rate limits.
const clientIp = (req) => (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket.remoteAddress;

export function createApp({ store, allowedOrigins = [], limits = {} }) {
  // New shares and new links write rows, so they are limited per caller and overall.
  const perIp = rateLimiter({ limit: limits.perIp ?? 30, windowMs: HOUR });
  const overall = rateLimiter({ limit: limits.overall ?? 1000, windowMs: HOUR });
  const allowWrite = (req) => {
    if (!perIp(clientIp(req)) || !overall('*')) throw new HttpError(429, 'Too many new links, try again later');
  };

  const send = (res, status, body) => {
    if (body === undefined) res.writeHead(status).end();
    else res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(body));
  };

  async function route(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const [, api, collection, id, action, ...rest] = url.pathname.split('/');
    if (req.method === 'GET' && url.pathname === '/healthz') return send(res, 200, { ok: true });
    if (api !== 'api' || collection !== 'shares' || rest.length) throw new HttpError(404, 'Not found');

    if (!id) {
      if (req.method !== 'POST') throw new HttpError(405, 'Method not allowed');
      const rack = cleanRack(await readJson(req));
      if (!rack) throw new HttpError(400, 'Expected { rack: [...] }');
      allowWrite(req);
      const shareId = newShareId();
      const ownerToken = newOwnerToken();
      await store.create(shareId, hashToken(ownerToken), rack);
      return send(res, 201, { shareId, ownerToken });
    }

    if (!isShareId(id)) throw new HttpError(404, 'Not found');
    if (req.method === 'GET' && !action) {
      const share = await store.get(id);
      if (!share) throw new HttpError(404, 'Not found');
      return send(res, 200, share);
    }

    const token = bearer(req);
    if (!token) throw new HttpError(401, 'Owner token required');
    const ownerHash = hashToken(token);
    let done;
    if (req.method === 'PUT' && !action) {
      const rack = cleanRack(await readJson(req));
      if (!rack) throw new HttpError(400, 'Expected { rack: [...] }');
      done = await store.update(id, ownerHash, rack);
    } else if (req.method === 'POST' && action === 'rotate') {
      allowWrite(req);
      const shareId = newShareId();
      if (await store.rename(id, ownerHash, shareId)) return send(res, 200, { shareId });
      done = false;
    } else if (req.method === 'DELETE' && !action) {
      done = await store.remove(id, ownerHash);
    } else {
      throw new HttpError(405, 'Method not allowed');
    }
    if (!done) throw new HttpError(404, 'Not found');
    send(res, 204);
  }

  return async (req, res) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Max-Age', '86400');
      return send(res, 204);
    }
    try {
      await route(req, res);
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message });
      console.error(err);
      send(res, 500, { error: 'Server error' });
    }
  };
}
