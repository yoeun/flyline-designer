// Palettes, reel models, line types and presets. Maker lines live in src/data/lines, one file per maker.
import * as airflo from './lines/airflo.js';
import * as cortland from './lines/cortland.js';
import * as orvis from './lines/orvis.js';
import * as rio from './lines/rio.js';
import * as royalWulff from './lines/royal-wulff.js';
import * as scientificAnglers from './lines/scientific-anglers.js';

// Each exports COLORS and PRODUCTS, and LEGACY_IDS if any of its old preset ids changed.
const MAKERS = [rio, scientificAnglers, airflo, cortland, orvis, royalWulff];

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
  // Maker finishes, offered only on the reels that come in them. Sampled from the makers' studio photos (lit faces).
  { id: 'smoke', name: 'Smoke', hex: '#7f8184' },
  { id: 'day-break', name: 'Day Break', hex: '#5b6270' },
  { id: 'coffee', name: 'Coffee', hex: '#786052' },
  { id: 'flats-blue', name: 'Flats Blue', hex: '#62acd8' },
  { id: 'olive', name: 'Olive', hex: '#746b48' },
  { id: 'charcoal', name: 'Charcoal', hex: '#7f7d83' },
  { id: 'dark-pine', name: 'Dark Pine', hex: '#565d44' },
  { id: 'burgundy', name: 'Burgundy', hex: '#783f43' },
  { id: 'coyote', name: 'Coyote', hex: '#85694f' },
  // A silvery taupe; Redington's own image files call it Silver.
  { id: 'sand', name: 'Sand', hex: '#a09891' },
  // Sold as "O.D. Green" (olive drab).
  { id: 'army-green', name: 'Army green', hex: '#5e5f48' },
];

// Colors for reels without their own list.
const GENERIC_REEL_COLORS = ['black', 'gunmetal', 'silver', 'champagne', 'forest', 'red', 'blue'];

// Finishes per reel line, from maker and retailer listings.
const LIQUID_S_COLORS = ['smoke', 'day-break'];
const HYDROS_COLORS = ['black', 'silver', 'coffee', 'flats-blue', 'olive'];
const CLEARWATER_COLORS = ['black', 'charcoal', 'dark-pine'];
const RUN_COLORS = ['black', 'burgundy', 'coyote', 'sand'];
const BEHEMOTH_COLORS = ['black', 'gunmetal', 'army-green'];

// Colors as makers name them, offered only on lines that use them (see lineSwatches).
export const MAKER_LINE_COLORS = MAKERS.flatMap((m) => m.COLORS);

const lineColor = (id) => LINE_COLORS.find((c) => c.id === id) ?? MAKER_LINE_COLORS.find((c) => c.id === id);

// Backing colors in gradient order.
export const BACKING_COLORS = ['red', 'orange', 'yellow', 'chartreuse', 'green', 'blue', 'purple', 'white', 'black'].map(lineColor);

export const LINE_TYPES = [
  { id: 'floating', name: 'Floating', family: 'cool', diameterFactor: 1, suggested: null },
  { id: 'intermediate', name: 'Intermediate', family: 'neutral', diameterFactor: 0.9, suggested: null },
  { id: 'sink3', name: 'Sinking · Type 3', family: 'hot', diameterFactor: 0.82, suggested: 'yellow' },
  { id: 'sink5', name: 'Sinking · Type 5', family: 'hot', diameterFactor: 0.82, suggested: 'orange' },
  { id: 'sink7', name: 'Sinking · Type 7', family: 'hot', diameterFactor: 0.82, suggested: 'red' },
  // Sinking head on a floating running line.
  { id: 'sinktip', name: 'Sink tip', family: 'hot', diameterFactor: 0.82, runningDiameterFactor: 1, suggested: null },
];

// Diameters in inches. `design` picks the frame drawing in src/assets/reels; `colors` lists the
// finishes a reel is sold in (generic reels offer GENERIC_REEL_COLORS). A reel can leave out `arbor` and give its rated capacity instead,
// e.g. rated: { weight: 5, yards: 100, pounds: 20 } for "WF5F + 100 yd of 20 lb";
// the arbor is then solved so that load exactly fills the spool (see reelArbor).
export const REELS = [
  { id: 'g34', design: 'generic', name: 'Generic 3–4 wt', rim: 3.2, spool: 2.98, arbor: 1.65, width: 0.68 },
  { id: 'g56', design: 'generic', name: 'Generic 5–6 wt', rim: 3.6, spool: 3.36, arbor: 1.95, width: 0.78 },
  { id: 'g78', design: 'generic', name: 'Generic 7–8 wt', rim: 4.0, spool: 3.74, arbor: 2.2, width: 0.95 },
  { id: 'g910', design: 'generic', name: 'Generic 9–10 wt', rim: 4.4, spool: 4.12, arbor: 2.4, width: 1.1 },
  // Rim, width and rated capacity (max line + backing) from Lamson's spec table. Spool is estimated as rim − 0.24″.
  { id: 'lamson-liquid-s-3', maker: 'Lamson', design: 'liquid-s', name: 'Lamson Liquid S 3+', colors: LIQUID_S_COLORS, rim: 3.35, spool: 3.11, width: 1.0, rated: { weight: 4, yards: 100, pounds: 20 } },
  { id: 'lamson-liquid-s-5', maker: 'Lamson', design: 'liquid-s', name: 'Lamson Liquid S 5+', colors: LIQUID_S_COLORS, rim: 3.65, spool: 3.41, width: 1.0, rated: { weight: 6, yards: 100, pounds: 20 } },
  { id: 'lamson-liquid-s-7', maker: 'Lamson', design: 'liquid-s', name: 'Lamson Liquid S 7+', colors: LIQUID_S_COLORS, rim: 3.9, spool: 3.66, width: 1.15, rated: { weight: 8, yards: 200, pounds: 20 } },
  { id: 'lamson-liquid-s-9', maker: 'Lamson', design: 'liquid-s', name: 'Lamson Liquid S 9+', colors: LIQUID_S_COLORS, rim: 4.45, spool: 4.21, width: 1.25, rated: { weight: 10, yards: 250, pounds: 30 } },
  // Hydros 2026: rim from Orvis. Trident measured the III (spool 3.62″, arbor 2.43″, width 0.9″);
  // II and IV widths are scaled from it and their capacities borrowed from the previous Hydros, so both are estimates.
  { id: 'orvis-hydros-2026-2', maker: 'Orvis', design: 'hydros', name: 'Orvis Hydros II (2026)', colors: HYDROS_COLORS, rim: 3.4, spool: 3.16, width: 0.85, rated: { weight: 4, yards: 125, pounds: 20 } },
  { id: 'orvis-hydros-2026-3', maker: 'Orvis', design: 'hydros', name: 'Orvis Hydros III (2026)', colors: HYDROS_COLORS, rim: 3.88, spool: 3.62, arbor: 2.43, width: 0.9 },
  { id: 'orvis-hydros-2026-4', maker: 'Orvis', design: 'hydros', name: 'Orvis Hydros IV (2026)', colors: HYDROS_COLORS, rim: 4.25, spool: 4.01, width: 1.0, rated: { weight: 8, yards: 200, pounds: 20 } },
  // Previous Hydros (2020–25) and Clearwater Cast: diameter and rated capacity (20 lb backing) from Orvis
  // spec tables via retailers. Orvis doesn't publish spool width; widths are estimates.
  { id: 'orvis-hydros-2', maker: 'Orvis', design: 'hydros', name: 'Orvis Hydros II (2020–25)', colors: HYDROS_COLORS, rim: 3.4, spool: 3.16, width: 0.9, rated: { weight: 4, yards: 125, pounds: 20 } },
  { id: 'orvis-hydros-3', maker: 'Orvis', design: 'hydros', name: 'Orvis Hydros III (2020–25)', colors: HYDROS_COLORS, rim: 3.7, spool: 3.46, width: 1.0, rated: { weight: 6, yards: 125, pounds: 20 } },
  { id: 'orvis-hydros-4', maker: 'Orvis', design: 'hydros', name: 'Orvis Hydros IV (2020–25)', colors: HYDROS_COLORS, rim: 4.0, spool: 3.76, width: 1.1, rated: { weight: 8, yards: 200, pounds: 20 } },
  { id: 'orvis-clearwater-2', maker: 'Orvis', design: 'clearwater', name: 'Orvis Clearwater II', colors: CLEARWATER_COLORS, rim: 3.4, spool: 3.16, width: 1.05, rated: { weight: 4, yards: 125, pounds: 20 } },
  { id: 'orvis-clearwater-3', maker: 'Orvis', design: 'clearwater', name: 'Orvis Clearwater III', colors: CLEARWATER_COLORS, rim: 3.7, spool: 3.46, width: 1.15, rated: { weight: 6, yards: 125, pounds: 20 } },
  { id: 'orvis-clearwater-4', maker: 'Orvis', design: 'clearwater', name: 'Orvis Clearwater IV', colors: CLEARWATER_COLORS, rim: 4.0, spool: 3.76, width: 1.3, rated: { weight: 8, yards: 200, pounds: 20 } },
  // Diameter and rated capacity from retailer listings (one lists the 4/5 at 125 yd). Redington doesn't
  // publish spool width; widths are estimates.
  { id: 'redington-behemoth-45', maker: 'Redington', design: 'behemoth', name: 'Redington Behemoth 4/5', colors: BEHEMOTH_COLORS, rim: 3.4, spool: 3.16, width: 0.95, rated: { weight: 4, yards: 125, pounds: 20 } },
  { id: 'redington-behemoth-56', maker: 'Redington', design: 'behemoth', name: 'Redington Behemoth 5/6', colors: BEHEMOTH_COLORS, rim: 3.6, spool: 3.36, width: 1.0, rated: { weight: 5, yards: 125, pounds: 20 } },
  { id: 'redington-behemoth-78', maker: 'Redington', design: 'behemoth', name: 'Redington Behemoth 7/8', colors: BEHEMOTH_COLORS, rim: 4.0, spool: 3.76, width: 1.1, rated: { weight: 7, yards: 200, pounds: 20 } },
  { id: 'redington-behemoth-910', maker: 'Redington', design: 'behemoth', name: 'Redington Behemoth 9/10', colors: BEHEMOTH_COLORS, rim: 4.4, spool: 4.16, width: 1.2, rated: { weight: 9, yards: 200, pounds: 30 } },
  { id: 'redington-behemoth-1112', maker: 'Redington', design: 'behemoth', name: 'Redington Behemoth 11/12', colors: BEHEMOTH_COLORS, rim: 4.7, spool: 4.46, width: 1.3, rated: { weight: 11, yards: 250, pounds: 30 } },
  // Rim and rated capacity from retailer listings. Listed widths disagree (0.9–1.5″); these are the
  // inner spool widths from one EU retailer.
  { id: 'redington-run-34', maker: 'Redington', design: 'run', name: 'Redington Run 3/4', colors: RUN_COLORS, rim: 3.2, spool: 2.96, width: 0.87, rated: { weight: 3, yards: 75, pounds: 20 } },
  { id: 'redington-run-56', maker: 'Redington', design: 'run', name: 'Redington Run 5/6', colors: RUN_COLORS, rim: 3.6, spool: 3.36, width: 0.91, rated: { weight: 5, yards: 100, pounds: 20 } },
  { id: 'redington-run-78', maker: 'Redington', design: 'run', name: 'Redington Run 7/8', colors: RUN_COLORS, rim: 4.0, spool: 3.76, width: 0.94, rated: { weight: 7, yards: 200, pounds: 20 } },
];

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

// The first size at a weight, otherwise the one nearest it (ties go lighter).
export const nearestSize = (sizes, weight) =>
  sizes.reduce((best, s) => {
    const d = Math.abs(s.line.weight - weight), bestD = Math.abs(best.line.weight - weight);
    return d < bestD || (d === bestD && s.line.weight < best.line.weight) ? s : best;
  });

// The preset and a copy of its line for an id picked from the Preset menu (a product or a generic
// preset) or the Weight menu (a size), or null if nothing has that id. A product lands on its size
// at the line's current weight, or the nearest; a maker line keeps its colorway when the new size
// comes in it.
export function switchLine(id, line, fromPresetId) {
  const sizes = productSizes(id);
  const preset = sizes.length ? nearestSize(sizes, line.weight) : findById(LINE_PRESETS, id);
  if (!preset) return null;
  const keep = lineColorway(findById(LINE_PRESETS, fromPresetId), line);
  const colorway = preset.colorways?.find((cw) => cw.id === keep?.id);
  return { presetId: preset.id, line: structuredClone({ ...preset.line, zones: colorway?.zones ?? preset.line.zones }) };
}

// Preset menu entries: one per maker product (named without a size) and one per generic preset.
// Discontinued products say so and go last, so they come after the current ones once grouped by maker.
export function lineMenu(presets) {
  const seen = new Set();
  const entries = [];
  for (const p of presets) {
    if (!p.product) entries.push(p);
    else if (!seen.has(p.product)) {
      seen.add(p.product);
      entries.push({ ...p, id: p.product, name: p.discontinued ? `${p.productName} (discontinued)` : p.productName });
    }
  }
  return [...entries.filter((e) => !e.discontinued), ...entries.filter((e) => e.discontinued)];
}

// The Preset menu entry showing for a preset id: its product, or the preset itself.
export const menuId = (presetId) => findById(LINE_PRESETS, presetId)?.product ?? presetId;

// Swatches for a line's zones: the base palette plus any maker colors the line already uses.
export const lineSwatches = (line) => [...LINE_COLORS, ...MAKER_LINE_COLORS.filter((c) => line.zones.some((z) => z.color === c.id))];

export const reelColors = (reel) => (reel?.colors ?? GENERIC_REEL_COLORS).map((id) => findById(REEL_COLORS, id));

// The reel switched to another model, keeping its color when the new model comes in it.
export function withReelModel(reel, model) {
  const ids = reelColors(findById(REELS, model)).map((c) => c.id);
  return { ...reel, model, color: ids.includes(reel.color) ? reel.color : ids[0] };
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
