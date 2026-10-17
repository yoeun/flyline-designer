import { totalLength, zoneRanges } from './geometry.js';

export const STEP = 0.5;
export const MIN_LENGTH = 0.5;
export const TAPER_KEYS = ['front', 'body', 'back', 'running'];
export const TAPER_NAMES = { front: 'Front taper', body: 'Body', back: 'Back taper', running: 'Running line' };

export const snap = (ft) => Math.round(ft / STEP) * STEP;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

export function zoneName(index, count) {
  if (count === 1) return 'Whole line';
  if (index === 0) return 'Tip';
  return index === count - 1 ? 'Rest' : `Zone ${index + 1}`;
}

export function clampSelection(selection, line) {
  if (selection?.kind === 'taper' && TAPER_KEYS.includes(selection.key)) return selection;
  const index = selection?.kind === 'zone' ? Math.min(selection.index, line.zones.length - 1) : 0;
  return index === selection?.index ? selection : { kind: 'zone', index };
}

// Boundary k sits between TAPER_KEYS[k - 1] and TAPER_KEYS[k]; toFt is its new distance from the tip.
export function moveTaperBoundary(line, k, toFt) {
  const before = TAPER_KEYS[k - 1];
  const after = TAPER_KEYS[k];
  const start = TAPER_KEYS.slice(0, k - 1).reduce((sum, key) => sum + line.taper[key], 0);
  const pair = line.taper[before] + line.taper[after];
  const length = clamp(snap(toFt - start), MIN_LENGTH, pair - MIN_LENGTH);
  return { ...line, taper: { ...line.taper, [before]: length, [after]: pair - length } };
}

// Boundary after zone i. The last zone has no stored length, so the zone before it changes alone.
export function moveZoneBoundary(line, i, toFt) {
  const ranges = zoneRanges(line);
  const nextIsLast = i + 1 === line.zones.length - 1;
  const pair = ranges[i].length + ranges[i + 1].length;
  const max = nextIsLast ? totalLength(line) - ranges[i].start - MIN_LENGTH : pair - MIN_LENGTH;
  const length = clamp(snap(toFt - ranges[i].start), MIN_LENGTH, max);
  const zones = line.zones.map((z, j) => {
    if (j === i) return { ...z, length };
    if (j === i + 1 && !nextIsLast) return { ...z, length: pair - length };
    return z;
  });
  return { ...line, zones };
}

export const setTaperLength = (line, key, ft) => ({ ...line, taper: { ...line.taper, [key]: Math.max(MIN_LENGTH, ft) } });

export function setZoneLength(line, i, ft) {
  if (i === line.zones.length - 1) return line;
  return { ...line, zones: line.zones.map((z, j) => (j === i ? { ...z, length: Math.max(MIN_LENGTH, ft) } : z)) };
}

// The new tip-side half is inserted at i, so a selection at i stays on it.
export function splitZone(line, i) {
  const length = zoneRanges(line)[i].length;
  const half = Math.max(MIN_LENGTH, snap(length / 2));
  const zones = [...line.zones];
  const last = i === zones.length - 1;
  zones.splice(i, 1, { ...zones[i], length: half }, { ...zones[i], length: last ? 0 : length - half });
  return { ...line, zones };
}

export function removeZone(line, i) {
  if (line.zones.length < 2) return line;
  const ranges = zoneRanges(line);
  const zones = line.zones.map((z, j) => (j === i + 1 ? { ...z, length: ranges[i + 1].length + ranges[i].length } : z));
  zones.splice(i, 1);
  return { ...line, zones };
}

// Editor x scale: tip at `width`, end of the running line at 0. Each taper section gets at least
// minPx so short tapers stay clickable; the running line gives up the difference.
export function editorScale(line, width, minPx) {
  const total = totalLength(line);
  const px = TAPER_KEYS.map((key) => (total ? (line.taper[key] / total) * width : 0));
  for (let k = 0; k < 3; k++) px[k] = Math.max(px[k], minPx);
  px[3] = Math.max(minPx, width - px[0] - px[1] - px[2]);
  const fit = width / px.reduce((a, b) => a + b, 0);

  const edges = [];
  let ft = 0;
  let x = width;
  TAPER_KEYS.forEach((key, k) => {
    const w = px[k] * fit;
    edges.push({ key, fromFt: ft, toFt: ft + line.taper[key], x0: x, x1: x - w });
    ft += line.taper[key];
    x -= w;
  });

  const toX = (f) => {
    const e = edges.find((s) => f <= s.toFt) ?? edges[3];
    const len = e.toFt - e.fromFt;
    return e.x0 - (len ? clamp((f - e.fromFt) / len, 0, 1) : 0) * (e.x0 - e.x1);
  };
  const toFt = (p) => {
    const e = edges.find((s) => p >= s.x1) ?? edges[3];
    const span = e.x0 - e.x1;
    return e.fromFt + (span ? clamp((e.x0 - p) / span, 0, 1) : 0) * (e.toFt - e.fromFt);
  };
  return { x: toX, ft: toFt, edges };
}
