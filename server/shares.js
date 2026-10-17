// Share ids, owner tokens and the rack a share carries. Kept apart from HTTP so the rules are easy to test.
import { createHash, randomBytes } from 'node:crypto';

// 128 random bits for the id people pass around, 256 for the secret only the owner's browser keeps.
// Neither comes from the rack or a counter, and the token is never stored, only its hash.
export const newShareId = () => randomBytes(16).toString('base64url');
export const newOwnerToken = () => randomBytes(32).toString('base64url');
export const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export const isShareId = (id) => typeof id === 'string' && /^[A-Za-z0-9_-]{22}$/.test(id);
export const isOwnerToken = (token) => typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token);

export const MAX_ENTRIES = 500;
const FIELDS = ['id', 'title', 'styles', 'notes', 'reel', 'line', 'backing'];

// The rack from a request body, keeping only the fields a setup has; null if it isn't a rack.
// The app checks each entry again when it shows them, so this only bounds what gets stored.
export function cleanRack(body) {
  const rack = body?.rack;
  if (!Array.isArray(rack) || rack.length > MAX_ENTRIES) return null;
  if (!rack.every((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))) return null;
  return rack.map((entry) => Object.fromEntries(FIELDS.filter((f) => f in entry).map((f) => [f, entry[f]])));
}
