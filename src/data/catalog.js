// Palettes, reel models, line types and presets. Real products get added here by hand later.

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
];

const lineColor = (id) => LINE_COLORS.find((c) => c.id === id);

// Backing colors grouped by the line-type family they signal.
export const BACKING_FAMILIES = [
  { id: 'cool', name: 'Cool', use: 'Floating', colors: ['blue', 'purple'].map(lineColor) },
  { id: 'neutral', name: 'Neutral', use: 'Intermediate', colors: ['white', 'green', 'chartreuse', 'black'].map(lineColor) },
  { id: 'hot', name: 'Hot', use: 'Sinking 3 · 5 · 7 · sink tip', colors: ['yellow', 'orange', 'red'].map(lineColor) },
];

export const LINE_TYPES = [
  { id: 'floating', name: 'Floating', family: 'cool', diameterFactor: 1, suggested: null },
  { id: 'intermediate', name: 'Intermediate', family: 'neutral', diameterFactor: 0.9, suggested: null },
  { id: 'sink3', name: 'Sinking · Type 3', family: 'hot', diameterFactor: 0.82, suggested: 'yellow' },
  { id: 'sink5', name: 'Sinking · Type 5', family: 'hot', diameterFactor: 0.82, suggested: 'orange' },
  { id: 'sink7', name: 'Sinking · Type 7', family: 'hot', diameterFactor: 0.82, suggested: 'red' },
  // Sinking head on a floating running line.
  { id: 'sinktip', name: 'Sink tip', family: 'hot', diameterFactor: 0.82, runningDiameterFactor: 1, suggested: null },
];

// Diameters in inches. A reel can leave out `arbor` and give its rated capacity instead,
// e.g. rated: { weight: 5, yards: 100, pounds: 20 } for "WF5F + 100 yd of 20 lb";
// the arbor is then solved so that load exactly fills the spool (see reelArbor).
export const REELS = [
  { id: 'g34', name: 'Generic 3–4 wt', rim: 3.2, spool: 2.98, arbor: 1.65, width: 0.68 },
  { id: 'g56', name: 'Generic 5–6 wt', rim: 3.6, spool: 3.36, arbor: 1.95, width: 0.78 },
  { id: 'g78', name: 'Generic 7–8 wt', rim: 4.0, spool: 3.74, arbor: 2.2, width: 0.95 },
  { id: 'g910', name: 'Generic 9–10 wt', rim: 4.4, spool: 4.12, arbor: 2.4, width: 1.1 },
];

export const BACKING_DIAMETER = { 20: 0.021, 30: 0.025 };
export const BACKING_LENGTHS = [100, 150, 200, 250];

// Taper lengths in feet; zones run from the tip back, the last one takes the rest.
export const LINE_PRESETS = [
  {
    id: 'twotone-wf5f',
    name: 'Two-tone WF5F (example)',
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
    name: 'WF6 Intermediate (example)',
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
    name: 'WF8 Sinking Type 5 (example)',
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
  {
    id: 'single-wf5f',
    name: 'Single-color WF5F',
    line: {
      type: 'floating',
      weight: 5,
      taper: { front: 5, body: 30, back: 5, running: 50 },
      zones: [{ length: 0, color: 'yellow' }],
    },
  },
];

export const findById = (list, id) => list.find((x) => x.id === id);
export const hexOf = (id) => (lineColor(id) ?? LINE_COLORS[0]).hex;
export const nameOf = (id) => (lineColor(id) ?? { name: id }).name;

export const DEFAULT_SETUP = {
  name: 'Two-tone WF5F',
  reel: { model: 'g56', color: 'silver' },
  line: structuredClone(LINE_PRESETS[0].line),
  backing: { yards: 100, pounds: 20, color: 'blue' },
};
