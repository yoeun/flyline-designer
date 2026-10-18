// Palettes, reel models, line types and presets. Maker lines live in src/data/lines, one file per maker.
import * as airflo from './lines/airflo.js';
import * as cortland from './lines/cortland.js';
import * as orvis from './lines/orvis.js';
import * as rio from './lines/rio.js';
import * as royalWulff from './lines/royal-wulff.js';
import * as scientificAnglers from './lines/scientific-anglers.js';

// Each exports COLORS and PRODUCTS, and LEGACY_IDS if any of its old preset ids changed.
const MAKERS = [rio, scientificAnglers, airflo, cortland, orvis, royalWulff];

// Reel files in file-name order: generic first, then makers A–Z.
const REEL_FILES = Object.entries(import.meta.glob('./reels/*.json', { eager: true, import: 'default' }))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, file]) => file);

// Old preset ids (from saved share links) mapped to the size that replaced them.
export const LEGACY_PRESET_IDS = Object.assign({}, ...MAKERS.map((m) => m.LEGACY_IDS));

export const LINE_COLORS = [
  { id: 'black', name: 'Black', hex: '#1e2022' },
  { id: 'white', name: 'White', hex: '#f1f1ec' },
  { id: 'smoke', name: 'Smoke', hex: '#a6b0ac' },
  { id: 'chartreuse', name: 'Chartreuse', hex: '#c8e03c' },
  { id: 'green', name: 'Green', hex: '#4c9a3e' },
  { id: 'yellow', name: 'Yellow', hex: '#f2c92b' },
  { id: 'orange', name: 'Orange', hex: '#ee8728' },
  { id: 'red', name: 'Red', hex: '#d63b2f' },
  { id: 'blue', name: 'Blue', hex: '#2f6ccf' },
  { id: 'purple', name: 'Purple', hex: '#7a4bc3' },
];

export const REEL_COLORS = [
  { id: 'black', name: 'Black', hex: '#222426' },
  { id: 'gunmetal', name: 'Gunmetal', hex: '#4b5056' },
  { id: 'silver', name: 'Silver', hex: '#b8bdc2' },
  { id: 'champagne', name: 'Champagne', hex: '#c9b48a' },
  { id: 'forest', name: 'Forest green', hex: '#2f5a43' },
  { id: 'red', name: 'Red', hex: '#8f2c27' },
  { id: 'blue', name: 'Blue', hex: '#2c4f7c' },
  // Maker finishes come from the reel files (see REEL_FILES).
  // A finish's `accent` colors the parts a design marks as accents (see scripts/reel-designs/lib.mjs).
  ...REEL_FILES.flatMap((f) => f.finishes ?? []).map(({ id, name, hex, accent }) => ({ id, name, hex, ...(accent ? { accent } : {}) })),
];

// Colors for reels without their own list.
const GENERIC_REEL_COLORS = ['black', 'gunmetal', 'silver', 'champagne', 'forest', 'red', 'blue'];

// Colors as makers name them, offered only on lines that use them (see lineSwatches).
export const MAKER_LINE_COLORS = MAKERS.flatMap((m) => m.COLORS);

const lineColor = (id) => LINE_COLORS.find((c) => c.id === id) ?? MAKER_LINE_COLORS.find((c) => c.id === id);

// Backing colors in gradient order.
export const BACKING_COLORS = ['red', 'orange', 'yellow', 'chartreuse', 'green', 'blue', 'purple', 'white', 'black'].map(lineColor);

export const LINE_TYPES = [
  { id: 'floating', name: 'Floating', family: 'cool', diameterFactor: 1, suggested: null },
  // Sinks very slowly (about 0.5 ips), just under the film; drawn between floating and intermediate.
  { id: 'hover', name: 'Hover', family: 'neutral', diameterFactor: 0.95, suggested: null },
  { id: 'intermediate', name: 'Intermediate', family: 'neutral', diameterFactor: 0.9, suggested: null },
  { id: 'sink3', name: 'Sinking · Type 3', family: 'hot', diameterFactor: 0.82, suggested: 'yellow' },
  { id: 'sink5', name: 'Sinking · Type 5', family: 'hot', diameterFactor: 0.82, suggested: 'orange' },
  { id: 'sink7', name: 'Sinking · Type 7', family: 'hot', diameterFactor: 0.82, suggested: 'red' },
  // Sinking head on a floating running line.
  { id: 'sinktip', name: 'Sink tip', family: 'hot', diameterFactor: 0.82, runningDiameterFactor: 1, suggested: null },
  // Sinking head on an intermediate running line.
  { id: 'sinkhead-int', name: 'Sink head · int. running line', family: 'hot', diameterFactor: 0.82, runningDiameterFactor: 0.9, suggested: null },
];

// Reel models, one JSON file per maker in src/data/reels (see its README). Adding a reel is a data change.
export const REEL_MODELS = REEL_FILES.flatMap((f) => f.models.map((m) => ({ ...m, maker: f.maker })));

// Every reel size, carrying its model's shared fields. A setup's reel.model is one of these ids.
export const REELS = REEL_MODELS.flatMap(({ id: product, name: productName, sizes, notes, ...model }) =>
  sizes.map((size) => ({ ...model, product, productName, name: `${productName} ${size.size}`, ...size })),
);

export const BACKING_DIAMETER = { 20: 0.021, 30: 0.025 };
export const BACKING_LENGTHS = [100, 150, 200, 250];

// Taper lengths in feet; zones run from the tip back, the last one takes the rest.
export const LINE_PRESETS = [
  {
    id: 'twotone-wf5f',
    name: 'Generic WF5 Floating Two-Tone',
    line: {
      type: 'floating',
      weight: 5,
      taper: { front: 4, body: 28.5, back: 4.5, running: 53 },
      zones: [
        { length: 20, color: 'chartreuse' },
        { length: 17, color: 'green' },
        { length: 0, color: 'orange' },
      ],
    },
  },
  {
    id: 'wf6i',
    name: 'Generic WF6 Intermediate',
    line: {
      type: 'intermediate',
      weight: 6,
      taper: { front: 6, body: 30, back: 6, running: 48 },
      zones: [
        { length: 42, color: 'smoke' },
        { length: 0, color: 'blue' },
      ],
    },
  },
  {
    id: 'wf8-sink5',
    name: 'Generic WF8 Sinking Type 5',
    line: {
      type: 'sink5',
      weight: 8,
      taper: { front: 6, body: 24, back: 4, running: 66 },
      zones: [
        { length: 34, color: 'black' },
        { length: 0, color: 'chartreuse' },
      ],
    },
  },
  {
    id: 'generic-wf5f',
    name: 'Generic WF5 Floating',
    line: {
      type: 'floating',
      weight: 5,
      taper: { front: 5.5, body: 30, back: 11.5, running: 43 },
      zones: [
        { length: 47, color: 'green' },
        { length: 0, color: 'yellow' },
      ],
    },
  },
  {
    id: 'generic-wf7i',
    name: 'Generic WF7 Intermediate',
    line: {
      type: 'intermediate',
      weight: 7,
      taper: { front: 6, body: 26, back: 8, running: 50 },
      zones: [{ length: 0, color: 'smoke' }],
    },
  },
  {
    id: 'generic-wf8-sinktip',
    name: 'Generic WF8 Sink Tip',
    line: {
      type: 'sinktip',
      weight: 8,
      taper: { front: 4, body: 16, back: 7, running: 73 },
      zones: [
        { length: 18, color: 'black' },
        { length: 9, color: 'blue' },
        { length: 0, color: 'chartreuse' },
      ],
    },
  },
  // Real lines, one preset per size of each maker product (see src/data/lines). Head and total
  // length from maker specs unless noted; taper splits are read off the maker's taper diagram where
  // one exists and estimated otherwise. Zones follow each colorway tip to running line. Haul zones
  // count as running line.
  ...MAKERS.flatMap((m) => m.PRODUCTS.flat()),

  {
    id: 'single-wf5f',
    name: 'Generic WF5 Floating Single-Color',
    line: {
      type: 'floating',
      weight: 5,
      taper: { front: 5, body: 30, back: 5, running: 50 },
      zones: [{ length: 0, color: 'yellow' }],
    },
  },
];

export const findById = (list, id) => list.find((x) => x.id === id);

const sameZones = (a, b) => a.length === b.length && a.every((z, i) => z.length === b[i].length && z.color === b[i].color);

// The maker colorway a line is in, if its preset comes in fixed colorways.
export const lineColorway = (preset, line) => preset?.colorways?.find((cw) => sameZones(cw.zones, line.zones));

const TAPER_KEYS = ['front', 'body', 'back', 'running'];

// The preset a line matches unedited, in any of its colorways, or 'custom'. Saved setups keep
// only the line, so this recovers which preset to show when one is loaded back.
export function presetForLine(line) {
  const matches = (preset) =>
    preset.line.type === line.type &&
    preset.line.weight === line.weight &&
    TAPER_KEYS.every((k) => preset.line.taper[k] === line.taper[k]) &&
    (sameZones(preset.line.zones, line.zones) || Boolean(lineColorway(preset, line)));
  return LINE_PRESETS.find(matches)?.id ?? 'custom';
}

// The sizes a maker product comes in, in catalog order; none for anything else.
export const productSizes = (product) => LINE_PRESETS.filter((p) => p.product === product);

// Line weights the app offers. Over- and underlining stay within them.
const MIN_WEIGHT = 2;
const MAX_WEIGHT = 12;

// How a line weight suits a reel size: 'in' its range, one 'over' or 'under' it (over- or
// underlining), else 'out'. Without a reel, anything goes.
export function reelWeightFit(reel, weight) {
  if (!reel) return 'in';
  const [lo, hi] = reel.weights;
  if (lo <= weight && weight <= hi) return 'in';
  if (weight === hi + 1 && weight <= MAX_WEIGHT) return 'over';
  if (weight === lo - 1 && weight >= MIN_WEIGHT) return 'under';
  return 'out';
}

const fitsReel = (reel, weight) => reelWeightFit(reel, weight) !== 'out';

// Every weight a reel takes, light to heavy, over- and underlines included.
export function allowedWeights(reel) {
  const [lo, hi] = reel?.weights ?? [MIN_WEIGHT, MAX_WEIGHT];
  return Array.from({ length: hi - lo + 3 }, (_, i) => lo - 1 + i).filter((w) => fitsReel(reel, w));
}

const closest = (sizes, weight) =>
  sizes.reduce((best, s) => {
    const d = Math.abs(s.line.weight - weight), bestD = Math.abs(best.line.weight - weight);
    return d < bestD || (d === bestD && s.line.weight < best.line.weight) ? s : best;
  });

// The first size at a weight, otherwise the one nearest it (ties go lighter). Given a reel, only
// sizes it takes count: one at the weight, else the nearest in its range, else the nearest over-
// or underline, else null.
export function nearestSize(sizes, weight, reel) {
  if (!reel) return closest(sizes, weight);
  const fits = sizes.filter((s) => fitsReel(reel, s.line.weight));
  const inRange = fits.filter((s) => reelWeightFit(reel, s.line.weight) === 'in');
  if (!fits.length) return null;
  return fits.find((s) => s.line.weight === weight) ?? closest(inRange.length ? inRange : fits, weight);
}

// The preset and a copy of its line for an id picked from the Preset menu (a product or a generic
// preset) or the Weight menu (a size), or null if nothing has that id. A product lands on its size
// at the line's current weight, or the nearest (one the reel takes, if given and there is one); a
// maker line keeps its colorway when the new size comes in it.
export function switchLine(id, line, fromPresetId, reel) {
  const sizes = productSizes(id);
  const preset = sizes.length ? (nearestSize(sizes, line.weight, reel) ?? closest(sizes, line.weight)) : findById(LINE_PRESETS, id);
  if (!preset) return null;
  const keep = lineColorway(findById(LINE_PRESETS, fromPresetId), line);
  const colorway = preset.colorways?.find((cw) => cw.id === keep?.id);
  return { presetId: preset.id, line: structuredClone({ ...preset.line, zones: colorway?.zones ?? preset.line.zones }) };
}

// The line moved to a weight a new reel takes, or null when it already does or can't: a maker line
// to its nearest size the reel takes (keeping its colorway), any other line to the nearest weight in
// the reel's range, keeping its taper and colors (a generic preset then turns Custom).
export function fitLineToReel(line, presetId, reel) {
  if (fitsReel(reel, line.weight)) return null;
  const product = findById(LINE_PRESETS, presetId)?.product;
  if (product) {
    const size = nearestSize(productSizes(product), line.weight, reel);
    return size ? switchLine(size.id, line, presetId) : null;
  }
  const [lo, hi] = reel.weights;
  const next = { ...line, weight: Math.min(hi, Math.max(lo, line.weight)) };
  return { presetId: presetForLine(next), line: next };
}

const FIT_LABELS = { in: '', over: ' · overline', under: ' · underline', out: ' · out of range' };

// Weight menu entries for a reel: a maker line's sizes, else weights, the reel takes, plus the line's
// own weight if it doesn't (a setup loaded that way keeps it).
export function weightMenu(reel, line, presetId) {
  const product = findById(LINE_PRESETS, presetId)?.product;
  const label = (text, weight) => `${text}${FIT_LABELS[reelWeightFit(reel, weight)]}`;
  if (product) {
    return productSizes(product)
      .filter((s) => s.id === presetId || fitsReel(reel, s.line.weight))
      .map((s) => ({ value: s.id, label: label(s.sizeLabel, s.line.weight) }));
  }
  const weights = allowedWeights(reel);
  if (!weights.includes(line.weight)) weights.push(line.weight);
  return weights.sort((a, b) => a - b).map((w) => ({ value: w, label: label(`${w} wt`, w) }));
}

// Preset menu entries: one per maker product (named without a size) and one per generic preset.
// Discontinued products say so and go last, so they come after the current ones once grouped by maker.
// Given a reel, lines it takes no size of are disabled and go after those.
export function lineMenu(presets, reel) {
  const seen = new Set();
  const entries = [];
  for (const p of presets) {
    if (!p.product) entries.push(p);
    else if (!seen.has(p.product)) {
      seen.add(p.product);
      entries.push({ ...p, id: p.product, name: p.discontinued ? `${p.productName} (discontinued)` : p.productName });
    }
  }
  const fits = (e) => (e.product ? presets.some((p) => p.product === e.product && fitsReel(reel, p.line.weight)) : fitsReel(reel, e.line.weight));
  const rank = (e) => (e.disabled ? 2 : 0) + (e.discontinued ? 1 : 0);
  return entries.map((e) => (fits(e) ? e : { ...e, disabled: true })).sort((a, b) => rank(a) - rank(b));
}

// The Preset menu entry showing for a preset id: its product, or the preset itself.
export const menuId = (presetId) => findById(LINE_PRESETS, presetId)?.product ?? presetId;

// Swatches for a line's zones: the base palette plus any maker colors the line already uses.
export const lineSwatches = (line) => [...LINE_COLORS, ...MAKER_LINE_COLORS.filter((c) => line.zones.some((z) => z.color === c.id))];

// The accent color for a reel in a finish: the model's own for that finish, else the finish's, else none.
export const reelAccent = (reel, colorId) => reel?.accents?.[colorId] ?? findById(REEL_COLORS, colorId)?.accent ?? null;
// The trim color for a reel in a finish (parts like a foot that differ from frame and accent), or none.
export const reelTrim = (reel, colorId) => reel?.trims?.[colorId] ?? null;

export const reelColors = (reel) => (reel?.colors ?? GENERIC_REEL_COLORS).map((id) => findById(REEL_COLORS, id));

// The reel switched to another size, keeping its color when the new size comes in it.
export function withReelModel(reel, model) {
  const ids = reelColors(findById(REELS, model)).map((c) => c.id);
  return { ...reel, model, color: ids.includes(reel.color) ? reel.color : ids[0] };
}

// Model menu entries: discontinued models say so and go last, so they come after the current ones once grouped by maker.
export const reelMenu = (models) => [
  ...models.filter((m) => !m.discontinued),
  ...models.filter((m) => m.discontinued).map((m) => ({ ...m, name: `${m.name} (discontinued)` })),
];

// The sizes a reel model comes in, small to large.
export const reelSizes = (product) => REELS.filter((r) => r.product === product);

// A reel size as the Size menu shows it: every line weight it suits, then the maker's label when that
// says something the weights don't, e.g. "4/5/6 wt (-5+)", "5/6/7 wt (III)", "7/8 wt".
export function reelSizeLabel(size) {
  const [lo, hi] = size.weights;
  const weights = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).join('/');
  const label = size.size.replace(/\s*wt$/, '').replace('–', '/');
  return label === weights ? `${weights} wt` : `${weights} wt (${size.size})`;
}

// The reel switched to another model: the first size that suits the line weight, otherwise the one
// nearest the current reel's rim (ties go smaller). Keeps the color when the new model comes in it.
export function switchReelModel(reel, product, weight) {
  const sizes = reelSizes(product);
  if (!sizes.length) return reel;
  const rim = findById(REELS, reel.model)?.rim ?? 0;
  const nearest = sizes.reduce((best, s) => (Math.abs(s.rim - rim) < Math.abs(best.rim - rim) ? s : best));
  const fits = sizes.find((s) => s.weights[0] <= weight && weight <= s.weights[1]);
  return withReelModel(reel, (fits ?? nearest).id);
}

// Items for a grouped menu, as [label, items]: makers A–Z, then everything without one under `other`.
export function makerGroups(items, other) {
  const byMaker = new Map();
  for (const item of items) {
    const label = item.maker ?? other;
    byMaker.set(label, [...(byMaker.get(label) ?? []), item]);
  }
  const makers = [...byMaker.keys()].filter((k) => k !== other).sort((a, b) => a.localeCompare(b));
  return [...makers, other].filter((k) => byMaker.has(k)).map((k) => [k, byMaker.get(k)]);
}
export const hexOf = (id) => (lineColor(id) ?? LINE_COLORS[0]).hex;
export const nameOf = (id) => (lineColor(id) ?? { name: id }).name;

export const DEFAULT_SETUP = {
  title: '',
  styles: [],
  notes: '',
  reel: { model: 'g56', color: 'silver' },
  line: structuredClone(LINE_PRESETS[0].line),
  backing: { yards: 100, pounds: 20, color: 'blue' },
};
