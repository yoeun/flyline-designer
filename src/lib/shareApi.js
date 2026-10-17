// Sharing a rack through the shares API (server/app.js). The share id goes in the view link; the owner
// token stays in this browser and is the only way to update, renew or stop that link.

// The API's address: VITE_API_URL in a build, the dev server's /api proxy otherwise.
const API = `${import.meta.env.VITE_API_URL ?? ''}/api/shares`;
const SHARE_KEY = 'flyline-designer:share';

export const SHARE_PATH = /^\/r\/([A-Za-z0-9_-]{22})\/?$/;

// The share id in a view link's path, or null.
export const shareIdFromPath = (pathname) => SHARE_PATH.exec(pathname)?.[1] ?? null;

export const shareUrl = (shareId, origin = window.location.origin) => `${origin}/r/${shareId}`;

// This browser's share, { shareId, ownerToken }, or null.
export function loadShare() {
  try {
    const share = JSON.parse(localStorage.getItem(SHARE_KEY));
    return typeof share?.shareId === 'string' && typeof share?.ownerToken === 'string' ? share : null;
  } catch {
    return null;
  }
}

export function storeShare(share) {
  try {
    if (share) localStorage.setItem(SHARE_KEY, JSON.stringify(share));
    else localStorage.removeItem(SHARE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the share then lasts for this visit only.
  }
}

// A failed call. status is the HTTP status, or 0 when the API couldn't be reached.
export class ShareError extends Error {
  constructor(status) {
    super(status ? `Shares API answered ${status}` : 'Shares API unreachable');
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(API + path, {
      method,
      headers: { ...(body && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }) },
      body: body && JSON.stringify(body),
    });
  } catch {
    throw new ShareError(0);
  }
  if (!res.ok) throw new ShareError(res.status);
  return res.status === 204 ? null : res.json();
}

// Rack entries are sent without anything the app adds while it runs.
const payload = (rack) => ({ rack: rack.map(({ id, title, styles, notes, reel, line, backing }) => ({ id, title, styles, notes, reel, line, backing })) });

export const createShare = (rack) => request('', { method: 'POST', body: payload(rack) });
export const fetchShare = (shareId) => request(`/${shareId}`);
export const updateShare = ({ shareId, ownerToken }, rack) => request(`/${shareId}`, { method: 'PUT', body: payload(rack), token: ownerToken });
export const rotateShare = ({ shareId, ownerToken }) => request(`/${shareId}/rotate`, { method: 'POST', token: ownerToken });
export const deleteShare = ({ shareId, ownerToken }) => request(`/${shareId}`, { method: 'DELETE', token: ownerToken });
