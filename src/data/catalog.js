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

// Colors as makers name them, offered only on lines that use them (see lineSwatches). SA and
// Airflo hexes are sampled from the makers' swatches and taper diagrams; RIO and Cortland are
// matched by eye to product photos. Clear sections get a pale blue-grey that reads as clear.
export const MAKER_LINE_COLORS = [
  { id: 'rio-moss', name: 'Moss', hex: '#6e6b3c' },
  { id: 'rio-gold', name: 'Gold', hex: '#d8b54a' },
  { id: 'rio-melon', name: 'Melon', hex: '#f3a47a' },
  { id: 'rio-gray-dun', name: 'Gray Dun', hex: '#a8a39a' },
  { id: 'rio-yellow', name: 'Yellow', hex: '#e9df3f' },
  { id: 'rio-pink', name: 'Pink', hex: '#f4a3be' },
  { id: 'rio-clear', name: 'Clear', hex: '#d3dee3' },
  { id: 'rio-light-teal', name: 'Light Teal', hex: '#8fc9be' },
  { id: 'rio-black', name: 'Black', hex: '#1e1e20' },
  { id: 'rio-maroon', name: 'Maroon', hex: '#6e2233' },
  { id: 'rio-grey', name: 'Grey', hex: '#7a7d80' },
  { id: 'sa-buckskin', name: 'Buckskin', hex: '#fad773' },
  { id: 'sa-mist-green', name: 'Mist Green', hex: '#abd691' },
  { id: 'sa-optic-green', name: 'Optic Green', hex: '#90c865' },
  { id: 'sa-creamsicle', name: 'Creamsicle', hex: '#ffe500' },
  { id: 'sa-satin-orange', name: 'Satin Orange', hex: '#f15522' },
  { id: 'sa-camo', name: 'Camo', hex: '#7f6d2d' },
  { id: 'sa-bamboo', name: 'Bamboo', hex: '#c3ab2f' },
  { id: 'sa-bass-camo', name: 'Camo', hex: '#73905a' },
  { id: 'sa-shad-blue', name: 'Shad Blue', hex: '#a3bdb2' },
  { id: 'sa-frog-green', name: 'Frog Green', hex: '#6a813b' },
  { id: 'sa-clear-camo', name: 'Clear Camo', hex: '#8a7b5e' },
  { id: 'sa-dark-green', name: 'Dark Green', hex: '#014935' },
  { id: 'sa-dark-gray', name: 'Dark Gray', hex: '#5f6062' },
  { id: 'sa-optic-yellow', name: 'Optic Yellow', hex: '#faf041' },
  { id: 'sa-pale-green', name: 'Pale Green', hex: '#d9e8a3' },
  { id: 'sa-titan-blue', name: 'Blue', hex: '#a2c6e6' },
  { id: 'sa-sonar-dark-green', name: 'Dark Green', hex: '#68843a' },
  { id: 'sa-ivory', name: 'Ivory', hex: '#d8d9db' },
  { id: 'sa-charcoal', name: 'Charcoal', hex: '#5f6062' },
  { id: 'sa-sonar-moss', name: 'Moss', hex: '#b2be36' },
  { id: 'airflo-black', name: 'Black', hex: '#2c2830' },
  { id: 'airflo-blue', name: 'Blue', hex: '#597fac' },
  { id: 'airflo-green-chartreuse', name: 'Chartreuse', hex: '#6ca635' },
  { id: 'airflo-red', name: 'Red', hex: '#cb5934' },
  { id: 'airflo-orange', name: 'Orange', hex: '#dd8625' },
  { id: 'airflo-green', name: 'Green', hex: '#68a049' },
  { id: 'airflo-chartreuse', name: 'Chartreuse', hex: '#c3c621' },
  { id: 'airflo-moss', name: 'Moss', hex: '#887857' },
  { id: 'airflo-ut-chartreuse', name: 'Chartreuse', hex: '#99b551' },
  { id: 'airflo-white', name: 'White', hex: '#f0f0f0' },
  { id: 'airflo-sinking-black', name: 'Black', hex: '#121518' },
  { id: 'airflo-clear', name: 'Clear', hex: '#dde3e8' },
  { id: 'cortland-peach', name: 'Peach', hex: '#f7c89c' },
  { id: 'cortland-clear-camo', name: 'Clear Camo', hex: '#6e6a5c' },
  { id: 'cortland-dark-brown', name: 'Dark Brown', hex: '#37261e' },
  { id: 'cortland-black', name: 'Black', hex: '#222222' },
  { id: 'cortland-green', name: 'Green', hex: '#89a64c' },
];

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

// Zones from [length, color] pairs, tip first; the last runs to the end of the line.
const zones = (...pairs) => pairs.map(([length, color]) => ({ length, color }));

// A real line comes in fixed maker colorways; its zones start as the first one.
const makerLine = ({ id, maker, name, type, weight, taper: [front, body, back, running], colorways }) => ({
  id,
  maker,
  name,
  colorways,
  line: { type, weight, taper: { front, body, back, running }, zones: colorways[0].zones },
});

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
  // Real lines. Head and total length from maker specs unless noted; taper splits are read off the
  // maker's taper diagram where one exists and estimated otherwise. Zones follow each colorway tip
  // to running line. Haul zones count as running line.

  // RIO. Taper from RIO's Gold taper as listed for Elite Gold; the color change is at the end of the head.
  makerLine({
    id: 'rio-premier-gold-wf5f',
    maker: 'RIO',
    name: 'RIO Premier Gold WF5F',
    type: 'floating',
    weight: 5,
    taper: [5.5, 22.5, 19, 43],
    colorways: [
      { id: 'moss-gold', name: 'Moss/Gold', zones: zones([47, 'rio-moss'], [0, 'rio-gold']) },
      { id: 'melon-gray-dun', name: 'Melon/Gray Dun', zones: zones([47, 'rio-melon'], [0, 'rio-gray-dun']) },
    ],
  }),
  // Taper split estimated; Melon/Gray Dun is only made in WF4–6.
  makerLine({
    id: 'rio-premier-gold-wf8f',
    maker: 'RIO',
    name: 'RIO Premier Gold WF8F',
    type: 'floating',
    weight: 8,
    taper: [6, 24, 20, 40],
    colorways: [{ id: 'moss-gold', name: 'Moss/Gold', zones: zones([50, 'rio-moss'], [0, 'rio-gold']) }],
  }),
  // 1.5–2 ips. Taper from a retailer's copy of RIO's diagram. The whole head is clear.
  makerLine({
    id: 'rio-premier-aqualux-wf8i',
    maker: 'RIO',
    name: 'RIO Premier Aqualux II WF8I',
    type: 'intermediate',
    weight: 8,
    taper: [4, 22, 4, 70],
    colorways: [{ id: 'clear-light-teal', name: 'Clear/Light Teal', zones: zones([30, 'rio-clear'], [0, 'rio-light-teal']) }],
  }),
  // 35 ft head from one retailer; taper split estimated. Black head on a running line colored by
  // sink rate.
  makerLine({
    id: 'rio-premier-fathom-wf8s5',
    maker: 'RIO',
    name: 'RIO Premier Fathom WF8 Sink 5',
    type: 'sink5',
    weight: 8,
    taper: [6, 22, 7, 70],
    colorways: [{ id: 'black-maroon', name: 'Black/Maroon', zones: zones([35, 'rio-black'], [0, 'rio-maroon']) }],
  }),
  makerLine({
    id: 'rio-premier-fathom-wf8s7',
    maker: 'RIO',
    name: 'RIO Premier Fathom WF8 Sink 7',
    type: 'sink7',
    weight: 8,
    taper: [6, 22, 7, 70],
    colorways: [{ id: 'black-grey', name: 'Black/Grey', zones: zones([35, 'rio-black'], [0, 'rio-grey']) }],
  }),
  // Euro nymph lines are level (about 0.022″), much thinner than a WF head of any weight, so they're
  // drawn as running line behind a token taper. RIO's comes with a 14 ft pink mono leader.
  makerLine({
    id: 'rio-technical-euro-nymph',
    maker: 'RIO',
    name: 'RIO Premier Technical Euro Nymph',
    type: 'floating',
    weight: 3,
    taper: [0.5, 0.5, 0.5, 92.5],
    colorways: [{ id: 'pink-yellow', name: 'Pink/Yellow', zones: zones([14, 'rio-pink'], [0, 'rio-yellow']) }],
  }),

  // Scientific Anglers. SA's diagrams have no numbers; splits are measured off them to about ±0.5 ft.
  // The diagram shows the Orange and Camo colorways; Optic is assumed to share the Orange split.
  makerLine({
    id: 'sa-amplitude-smooth-infinity-wf6f',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Infinity WF6F',
    type: 'floating',
    weight: 6,
    taper: [6.5, 24, 19.5, 40],
    colorways: [
      { id: 'optic', name: 'Optic', zones: zones([6.5, 'sa-buckskin'], [43.5, 'sa-mist-green'], [0, 'sa-optic-green']) },
      { id: 'orange', name: 'Orange', zones: zones([6.5, 'sa-creamsicle'], [43.5, 'sa-satin-orange'], [0, 'sa-optic-green']) },
      { id: 'camo', name: 'Camo', zones: zones([10, 'sa-camo'], [40, 'sa-buckskin'], [0, 'sa-bamboo']) },
    ],
  }),
  makerLine({
    id: 'sa-amplitude-bass-bug-wf8f',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Bass Bug WF8F',
    type: 'floating',
    weight: 8,
    taper: [5, 28, 10, 47],
    colorways: [{ id: 'camo-shad-frog', name: 'Camo/Shad Blue/Frog Green', zones: zones([12.5, 'sa-bass-camo'], [30.5, 'sa-shad-blue'], [0, 'sa-frog-green']) }],
  }),
  // 2 ips. Long three-part front taper; one color over the whole line.
  makerLine({
    id: 'sa-sonar-stillwater-clear-camo-wf6i',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Stillwater Clear Camo WF6I',
    type: 'intermediate',
    weight: 6,
    taper: [22.5, 13, 9.5, 55],
    colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'sa-clear-camo']) }],
  }),
  // 2.5–4 ips. The diagram is drawn for a 40 ft head; the 36 ft WF6 split is scaled from it.
  makerLine({
    id: 'sa-frequency-full-sink-wf6s3',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Full Sink WF6 Type III',
    type: 'sink3',
    weight: 6,
    taper: [4, 30, 2, 49],
    colorways: [{ id: 'dark-green', name: 'Dark Green', zones: zones([0, 'sa-dark-green']) }],
  }),
  // 5–6 ips. Same lengths as the Type III.
  makerLine({
    id: 'sa-frequency-full-sink-wf6s6',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Full Sink WF6 Type VI',
    type: 'sink5',
    weight: 6,
    taper: [4, 30, 2, 49],
    colorways: [{ id: 'dark-gray', name: 'Dark Gray', zones: zones([0, 'sa-dark-gray']) }],
  }),
  // 10 ft Type III tip plus a 1 ft transition, then a floating belly.
  makerLine({
    id: 'sa-frequency-sink-tip-wf6',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Sink Tip WF6 Type III',
    type: 'sinktip',
    weight: 6,
    taper: [11, 30, 4, 40],
    colorways: [{ id: 'green-optic-yellow', name: 'Green/Optic Yellow', zones: zones([10, 'sa-dark-green'], [0, 'sa-optic-yellow']) }],
  }),
  // 1.25 ips.
  makerLine({
    id: 'sa-sonar-titan-intermediate-wf8i',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Full Intermediate WF8I',
    type: 'intermediate',
    weight: 8,
    taper: [5.5, 24.5, 3.5, 71.5],
    colorways: [{ id: 'pale-green-blue', name: 'Pale Green/Blue', zones: zones([33.5, 'sa-pale-green'], [0, 'sa-titan-blue']) }],
  }),
  // Grain-rated; 250 gr suits an 8 wt (estimate). Every size has a 25 ft sinking head, then a
  // floating handling line; the split inside the head is estimated. Sink 6 is about 6 ips.
  ...[
    { rate: 3, name: 'Dark Green/Ivory', head: 'sa-sonar-dark-green', running: 'sa-ivory' },
    { rate: 6, name: 'Charcoal/Moss', head: 'sa-charcoal', running: 'sa-sonar-moss' },
  ].map(({ rate, name, head, running }) =>
    makerLine({
      id: `sa-sonar-sink-25-cold-250-s${rate}`,
      maker: 'Scientific Anglers',
      name: `SA Sonar Sink 25 Cold 250 gr Sink ${rate}`,
      type: 'sinktip',
      weight: 8,
      taper: [2, 22, 1, 80],
      colorways: [{ id: 'standard', name, zones: zones([25, head], [0, running]) }],
    }),
  ),
  // Level euro line; see the RIO one above.
  makerLine({
    id: 'sa-mastery-competition-nymph',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Competition Nymph',
    type: 'floating',
    weight: 3,
    taper: [0.5, 0.5, 0.5, 78.5],
    colorways: [{ id: 'bamboo', name: 'Bamboo', zones: zones([0, 'sa-bamboo']) }],
  }),

  // Airflo. Splits from Airflo's own taper diagrams.
  makerLine({
    id: 'airflo-ridge-universal-taper-wf5f',
    maker: 'Airflo',
    name: 'Airflo Superflo Ridge 2.0 Universal Taper WF5F',
    type: 'floating',
    weight: 5,
    taper: [8, 19, 12, 51],
    colorways: [
      { id: 'moss-chartreuse', name: 'Moss/Chartreuse', zones: zones([39, 'airflo-moss'], [0, 'airflo-ut-chartreuse']) },
      { id: 'chartreuse-white', name: 'Chartreuse/White', zones: zones([39, 'airflo-ut-chartreuse'], [0, 'airflo-white']) },
    ],
  }),
  // Head and total from Airflo's spec table; taper split estimated. Color sections scaled from the
  // WF5 diagram: sinking black tip, intermediate belly, then the running line color. Each sink
  // rate has its own colorway.
  ...[
    { rate: 3, name: 'Black/Green/Chartreuse', belly: 'airflo-green', running: 'airflo-chartreuse' },
    { rate: 5, name: 'Black/Red/Orange', belly: 'airflo-red', running: 'airflo-orange' },
    { rate: 7, name: 'Black/Blue/Chartreuse', belly: 'airflo-blue', running: 'airflo-green-chartreuse' },
  ].map(({ rate, name, belly, running }) =>
    makerLine({
      id: `airflo-streamer-max-short-wf8-s${rate}`,
      maker: 'Airflo',
      name: `Airflo Streamer Max Short WF8 Sink ${rate}`,
      type: 'sinktip',
      weight: 8,
      taper: [4, 16, 7, 73],
      colorways: [{ id: 'standard', name, zones: zones([17.5, 'airflo-black'], [5.5, belly], [0, running]) }],
    }),
  ),
  // Sold as #6/7 in Di3, Di5 and Di7 (3, 5 and 7 ips), all black with orange hang markers.
  ...[3, 5, 7].map((rate) =>
    makerLine({
      id: `airflo-sixth-sense-wf7-di${rate}`,
      maker: 'Airflo',
      name: `Airflo Sixth Sense 2 WF7 Di${rate}`,
      type: `sink${rate}`,
      weight: 7,
      taper: [20, 16, 10, 59],
      colorways: [{ id: 'black', name: 'Black', zones: zones([0, 'airflo-sinking-black']) }],
    }),
  ),
  // 1.5 ips, clear on a clear mono core.
  makerLine({
    id: 'airflo-stillwater-intermediate-wf6',
    maker: 'Airflo',
    name: 'Airflo Stillwater Intermediate WF6 Clear',
    type: 'intermediate',
    weight: 6,
    taper: [20, 16, 10, 59],
    colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'airflo-clear']) }],
  }),

  // Cortland publishes few numbers; lengths here are from retailers.
  makerLine({
    id: 'cortland-444-peach-wf5f',
    maker: 'Cortland',
    name: 'Cortland 444 Peach WF5F',
    type: 'floating',
    weight: 5,
    taper: [8, 20, 4, 58],
    colorways: [{ id: 'peach', name: 'Peach', zones: zones([0, 'cortland-peach']) }],
  }),
  // Retailers disagree on the head (41 or 32 ft); taper split estimated from Cortland's description
  // ("short front taper and body, extended back taper").
  makerLine({
    id: 'cortland-444-clear-camo-wf7i',
    maker: 'Cortland',
    name: 'Cortland 444 Clear Camo WF7I',
    type: 'intermediate',
    weight: 7,
    taper: [8, 20, 13, 49],
    colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'cortland-clear-camo']) }],
  }),
  // 3–4 ips. Head and running line from Cortland's page; taper split assumed to match the 444 floating.
  makerLine({
    id: 'cortland-444-full-sink-wf6s3',
    maker: 'Cortland',
    name: 'Cortland 444 Full Sinking WF6 Type 3',
    type: 'sink3',
    weight: 6,
    taper: [8, 20, 4, 58],
    colorways: [{ id: 'dark-brown', name: 'Dark Brown', zones: zones([0, 'cortland-dark-brown']) }],
  }),
  // Type 6 (5–6 ips) 15 ft tip. Tip and body lengths published; rear taper is the rest of the
  // 31 ft head (one retailer table lists 26 ft).
  makerLine({
    id: 'cortland-streamer-sink-tip-15-wf7',
    maker: 'Cortland',
    name: 'Cortland Streamer Sink Tip 15 WF7',
    type: 'sinktip',
    weight: 7,
    taper: [15, 6, 10, 69],
    colorways: [{ id: 'black-green', name: 'Black/Green', zones: zones([15, 'cortland-black'], [0, 'cortland-green']) }],
  }),

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
