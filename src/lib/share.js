import { BACKING_COLORS, BACKING_DIAMETER, BACKING_LENGTHS, DEFAULT_SETUP, LINE_PRESETS, REELS, findById, lineColorway, reelColors } from '../data/catalog.js';

// The whole design lives in the URL query so a reload or a shared link restores it. Catalog picks
// are readable params; a line that matches no preset travels as base64url JSON in `l`.
const SIDE_IDS = ['drag', 'spool'];
const MODE_IDS = ['reel', 'see-through', 'line-only'];

const toBase64Url = (value) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (text) => {
  try {
    const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
  } catch {
    return null;
  }
};

export function encodeSetup(setup) {
  const { id, ...rest } = setup;
  return toBase64Url(rest);
}

// Old share links put the whole setup in the hash; they still load.
export function decodeSetup(text) {
  const setup = fromBase64Url(text);
  if (!setup?.reel || !setup?.line?.zones?.length || !setup?.backing) return null;
  return setup;
}

const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function stateToQuery({ setup, presetId, side, mode }) {
  const q = new URLSearchParams();
  q.set('reel', setup.reel.model);
  q.set('color', setup.reel.color);
  if (side !== 'drag') q.set('side', side);
  if (mode !== 'reel') q.set('view', mode);

  const preset = presetId === 'custom' ? null : findById(LINE_PRESETS, presetId);
  const colorway = lineColorway(preset, setup.line);
  const presetLine = preset && { ...preset.line, zones: colorway?.zones ?? preset.line.zones };
  if (presetLine && sameJson(presetLine, setup.line)) {
    q.set('line', preset.id);
    if (colorway && colorway !== preset.colorways[0]) q.set('colorway', colorway.id);
  } else {
    q.set('l', toBase64Url(setup.line));
  }
  if (!preset || setup.name !== preset.name) q.set('name', setup.name);

  q.set('backing', setup.backing.color);
  q.set('yards', setup.backing.yards);
  q.set('lb', setup.backing.pounds);
  return q.toString();
}

const validLine = (line) =>
  line && typeof line.type === 'string' && Number.isFinite(line.weight) && line.taper && Array.isArray(line.zones) && line.zones.length > 0;

// Whatever is missing or unknown in the URL falls back to the defaults.
export function queryToState(search, hash = '') {
  const base = { setup: structuredClone(DEFAULT_SETUP), presetId: LINE_PRESETS[0].id, side: 'drag', mode: 'reel' };
  const q = new URLSearchParams(search);
  if (!q.has('reel') && !q.has('line') && !q.has('l')) {
    const legacy = decodeSetup(hash.replace(/^#/, ''));
    return legacy ? { ...base, setup: legacy, presetId: 'custom' } : base;
  }

  const { setup } = base;
  const reel = findById(REELS, q.get('reel'));
  if (reel) {
    const colors = reelColors(reel).map((c) => c.id);
    setup.reel = { model: reel.id, color: colors.includes(q.get('color')) ? q.get('color') : colors[0] };
  }

  let presetId = base.presetId;
  const custom = q.has('l') ? fromBase64Url(q.get('l')) : null;
  const preset = findById(LINE_PRESETS, q.get('line'));
  if (validLine(custom)) {
    setup.line = custom;
    presetId = 'custom';
  } else if (preset) {
    const colorway = preset.colorways?.find((cw) => cw.id === q.get('colorway'));
    setup.line = { ...structuredClone(preset.line), zones: structuredClone(colorway?.zones ?? preset.line.zones) };
    setup.name = preset.name;
    presetId = preset.id;
  }
  if (q.get('name')) setup.name = q.get('name');

  const yards = Number(q.get('yards')), pounds = Number(q.get('lb'));
  setup.backing = {
    yards: BACKING_LENGTHS.includes(yards) ? yards : setup.backing.yards,
    pounds: pounds in BACKING_DIAMETER ? pounds : setup.backing.pounds,
    color: BACKING_COLORS.some((c) => c.id === q.get('backing')) ? q.get('backing') : setup.backing.color,
  };

  return {
    setup,
    presetId,
    side: SIDE_IDS.includes(q.get('side')) ? q.get('side') : 'drag',
    mode: MODE_IDS.includes(q.get('view')) ? q.get('view') : 'reel',
  };
}
