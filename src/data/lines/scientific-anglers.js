import { makerProduct, zones } from './product.js';

// Sampled from SA's swatches and taper diagrams.
export const COLORS = [
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
  { id: 'sa-glow', name: 'Glow', hex: '#e8f3d2' },
  { id: 'sa-moss', name: 'Moss', hex: '#979735' },
  { id: 'sa-willow', name: 'Willow', hex: '#e0ddce' },
  { id: 'sa-butter', name: 'Butter', hex: '#fad874' },
  { id: 'sa-sage', name: 'Sage', hex: '#a3a983' },
  { id: 'sa-leather', name: 'Leather', hex: '#b1702a' },
  { id: 'sa-amber', name: 'Amber', hex: '#fbe285' },
  { id: 'sa-olive', name: 'Olive', hex: '#4a7637' },
  { id: 'sa-black', name: 'Black', hex: '#1e1f21' },
  { id: 'sa-celestial-blue', name: 'Celestial Blue', hex: '#1aa6dd' },
  { id: 'sa-blue-heron', name: 'Blue Heron', hex: '#5c6770' },
];

// Old preset ids that are now sizes with another id (old → new). Mastery Competition Nymph is now
// sold as Mastery Euro Tactical Nymph Mono.
export const LEGACY_IDS = {
  'sa-mastery-competition-nymph': 'sa-mastery-euro-tactical-nymph-mono-level',
  'sa-mastery-competition-nymph-level': 'sa-mastery-euro-tactical-nymph-mono-level',
};

const half = (ft) => Math.round(ft * 2) / 2;

// Head and total length per size come from SA's spec tables. SA's diagrams have no numbers but are
// drawn to a scale; splits are measured off them to about ±0.5 ft, with the bellies as the body and
// the rear taper(s) as the back. A diagram is drawn for one size; other sizes scale its front and
// back taper to their own head, to the nearest half foot, and are marked estimated.
const scaled = ([front, body, back], head) => {
  const s = head / (front + body + back);
  const f = half(front * s);
  const b = half(back * s);
  return [f, head - f - b, b];
};

// A floating WF size: `sizes` are [weight, head, total]; `ref` is the weight the diagram is drawn for;
// `colorways(head, [front, body, back], weight)` returns that size's colorways.
const floating = (split, ref, sizes, colorways) =>
  sizes.map(([weight, head, total]) => {
    const taper = scaled(split, head);
    return {
      id: `wf${weight}f`,
      label: `WF${weight}F`,
      type: 'floating',
      weight,
      taper: [...taper, total - head],
      estimated: weight !== ref,
      colorways: colorways(head, taper, weight),
    };
  });

// Amplitude, Mastery and Frequency share tapers: MPX is the same line in each, only the coating
// and colors differ. WF5 diagram: front 6.5, bellies 25, rear 4.5 on a 36 ft head.
const MPX = [6.5, 25, 4.5];
const MPX_SIZES = [
  [3, 32, 90],
  [4, 34, 90],
  [5, 36, 90],
  [6, 38, 90],
  [7, 40, 90],
  [8, 42, 90],
];

// Trout Expert and the Amplitude Smooth Trout it replaced share a diagram (WF5, 69 ft head):
// two front tapers (13 ft), two bellies (30.5) and a 25.5 ft rear taper.
const TROUT_EXPERT = [13, 30.5, 25.5];
const TROUT_EXPERT_SIZES = [
  [2, 65, 90],
  [3, 65, 90],
  [4, 67, 90],
  [5, 69, 90],
  [6, 71, 90],
  [7, 73, 90],
];

export const PRODUCTS = [
  // Half-size heavy. Head and total per size from SA's table; the WF6 split was measured off the
  // diagram before SA published per-size heads, and the other sizes scale it. Orange is made in
  // WF4–6, Glow (a glow-in-the-dark tip) in WF5–8.
  makerProduct({
    id: 'sa-amplitude-smooth-infinity',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Infinity',
    sizes: floating(
      [6.5, 24, 19.5],
      6,
      [
        [3, 47, 90],
        [4, 48, 90],
        [5, 49, 90],
        [6, 50, 90],
        [7, 51, 90],
        [8, 52, 90],
      ],
      (head, [front], weight) => {
        const camo = half((10 * head) / 50);
        return [
          { id: 'optic', name: 'Optic', zones: zones([front, 'sa-buckskin'], [head - front, 'sa-mist-green'], [0, 'sa-optic-green']) },
          ...(weight >= 4 && weight <= 6 ? [{ id: 'orange', name: 'Orange', zones: zones([front, 'sa-creamsicle'], [head - front, 'sa-satin-orange'], [0, 'sa-optic-green']) }] : []),
          { id: 'camo', name: 'Camo', zones: zones([camo, 'sa-camo'], [head - camo, 'sa-buckskin'], [0, 'sa-bamboo']) },
          ...(weight >= 5 ? [{ id: 'glow', name: 'Glow', zones: zones([front, 'sa-glow'], [head - front, 'sa-mist-green'], [0, 'sa-optic-green']) }] : []),
        ];
      },
    ),
  }),
  // Half-size heavy all-rounder. Buckskin tip, moss head, optic green running line.
  makerProduct({
    id: 'sa-amplitude-smooth-mpx',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth MPX',
    sizes: floating(MPX, 5, MPX_SIZES, (head, [front]) => [
      { id: 'optic-moss-buckskin', name: 'Optic Green/Moss/Buckskin', zones: zones([front, 'sa-buckskin'], [head - front, 'sa-moss'], [0, 'sa-optic-green']) },
    ]),
  }),
  // The Amplitude Smooth MPX taper in Mastery: a one-color head on a contrasting running line.
  makerProduct({
    id: 'sa-mastery-mpx',
    maker: 'Scientific Anglers',
    name: 'SA Mastery MPX',
    sizes: floating(MPX, 5, MPX_SIZES, (head) => [
      { id: 'amber-willow', name: 'Amber/Willow', zones: zones([head, 'sa-willow'], [0, 'sa-amber']) },
      { id: 'buckskin-optic', name: 'Buckskin/Optic Green', zones: zones([head, 'sa-optic-green'], [0, 'sa-buckskin']) },
    ]),
  }),
  // Quarter-size heavy general trout line. WF5 diagram: front 6, belly 22, two rear tapers 22.5
  // (50.5 ft head). Willow tip, sage head, butter running line.
  makerProduct({
    id: 'sa-amplitude-smooth-trout-gp',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Trout GP',
    sizes: floating(
      [6, 22, 22.5],
      5,
      [
        [3, 49.5, 90],
        [4, 49.5, 90],
        [5, 50.5, 90],
        [6, 51, 90],
        [7, 52, 90],
        [8, 53, 90],
      ],
      (head, [front]) => [
        { id: 'butter-sage-willow', name: 'Butter/Sage/Willow', zones: zones([front, 'sa-willow'], [head - front, 'sa-sage'], [0, 'sa-butter']) },
      ],
    ),
  }),
  // True-to-weight dry-fly line with a long front taper. Buckskin tip, sage green to the end of the
  // bellies, leather rear taper and running line.
  makerProduct({
    id: 'sa-amplitude-smooth-trout-expert',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Trout Expert',
    sizes: floating(TROUT_EXPERT, 5, TROUT_EXPERT_SIZES, (head, [front, body]) => {
      const tip = half((6.5 * head) / 69);
      return [
        { id: 'leather-sage-buckskin', name: 'Leather/Sage Green/Buckskin', zones: zones([tip, 'sa-buckskin'], [front + body - tip, 'sa-sage'], [0, 'sa-leather']) },
      ];
    }),
  }),
  // One size heavy, short head for small streams. WF5 diagram: front 11.5, belly 9.5, rear 3
  // (24 ft head), then a 6 ft handling section drawn here as running line. Willow tip, leather head,
  // moss handling and running line.
  makerProduct({
    id: 'sa-amplitude-smooth-creek-trout',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Creek Trout',
    sizes: floating(
      [11.5, 9.5, 3],
      5,
      [
        [2, 21.5, 90],
        [3, 22, 90],
        [4, 23, 90],
        [5, 24, 90],
        [6, 25, 90],
      ],
      (head) => {
        const tip = half((6 * head) / 24);
        return [{ id: 'moss-leather-willow', name: 'Moss/Leather/Willow', zones: zones([tip, 'sa-willow'], [head - tip, 'sa-leather'], [0, 'sa-sonar-moss']) }];
      },
    ),
  }),
  // Replaced by Trout GP and Trout Expert. SA's old diagram is the Trout Expert taper (69 ft head at
  // WF5; one retailer lists 68). Only WF5's head is known, so the other sizes borrow Trout Expert's
  // heads and are marked estimated. Blue heron front tapers, bamboo bellies, celestial blue rear.
  makerProduct({
    id: 'sa-amplitude-smooth-trout',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Trout',
    discontinued: true,
    sizes: floating(TROUT_EXPERT, 5, TROUT_EXPERT_SIZES, (head, [front, body]) => [
      { id: 'celestial-bamboo-heron', name: 'Celestial Blue/Bamboo/Blue Heron', zones: zones([front, 'sa-blue-heron'], [body, 'sa-bamboo'], [0, 'sa-celestial-blue']) },
    ]),
  }),
  // Two sizes heavy. Every size has a 43 ft head; the diagram's split applies to all of them.
  makerProduct({
    id: 'sa-amplitude-bass-bug',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Bass Bug',
    sizes: [6, 7, 8].map((weight) => ({
      id: `wf${weight}f`,
      label: `WF${weight}F`,
      type: 'floating',
      weight,
      taper: [5, 28, 10, 47],
      colorways: [{ id: 'camo-shad-frog', name: 'Camo/Shad Blue/Frog Green', zones: zones([12.5, 'sa-bass-camo'], [30.5, 'sa-shad-blue'], [0, 'sa-frog-green']) }],
    })),
  }),
  // 2 ips, two sizes heavy. Long three-part front taper; one color over the whole line. Every size
  // has the same 45 ft head.
  makerProduct({
    id: 'sa-sonar-stillwater-clear-camo',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Stillwater Clear Camo',
    sizes: [5, 6, 7, 8].map((weight) => ({
      id: `wf${weight}i`,
      label: `WF${weight}I`,
      type: 'intermediate',
      weight,
      taper: [22.5, 13, 9.5, 55],
      colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'sa-clear-camo']) }],
    })),
  }),
  // Sink 3 is 2.5–4 ips, Sink 6 5–6 ips. The diagram is drawn for a 40 ft head; the WF6 split
  // (36 ft head) is scaled from it, and the other heads keep its 4 ft front and 2 ft back taper.
  makerProduct({
    id: 'sa-frequency-full-sink',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Full Sink',
    sizes: [
      [5, 34],
      [6, 36],
      [7, 36],
      [8, 38],
    ].flatMap(([weight, head]) =>
      [
        { rate: 3, type: 'sink3', colorway: { id: 'dark-green', name: 'Dark Green', color: 'sa-dark-green' } },
        { rate: 6, type: 'sink5', colorway: { id: 'dark-gray', name: 'Dark Gray', color: 'sa-dark-gray' } },
      ].map(({ rate, type, colorway: { id, name, color } }) => ({
        id: `wf${weight}s${rate}`,
        label: `WF${weight}S Sink ${rate}`,
        type,
        weight,
        taper: [4, head - 6, 2, 85 - head],
        estimated: true,
        colorways: [{ id, name, zones: zones([0, color]) }],
      })),
    ),
  }),
  // 10 ft Sink 3 tip plus a 1 ft transition, then a floating belly. Same 45 ft head in every size.
  makerProduct({
    id: 'sa-frequency-sink-tip',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Sink Tip',
    sizes: [5, 6, 7, 8].map((weight) => ({
      id: `wf${weight}`,
      label: `WF${weight}F/S3`,
      type: 'sinktip',
      weight,
      taper: [11, 30, 4, 40],
      colorways: [{ id: 'green-optic-yellow', name: 'Green/Optic Yellow', zones: zones([10, 'sa-dark-green'], [0, 'sa-optic-yellow']) }],
    })),
  }),
  // 1.25 ips. Same 33.5 ft head in every size.
  makerProduct({
    id: 'sa-sonar-titan-intermediate',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Full Intermediate',
    sizes: [6, 7, 8, 9, 10, 11, 12].map((weight) => ({
      id: `wf${weight}i`,
      label: `WF${weight}I`,
      type: 'intermediate',
      weight,
      taper: [5.5, 24.5, 3.5, 71.5],
      colorways: [{ id: 'pale-green-blue', name: 'Pale Green/Blue', zones: zones([33.5, 'sa-pale-green'], [0, 'sa-titan-blue']) }],
    })),
  }),
  // Two sizes heavy, three densities: head, about 20 ft of handling line, then running line, each
  // sinking slower than the one in front. Same Titan head as the Full Intermediate (33.5 ft in every
  // size); each density set has its own colors, head first.
  makerProduct({
    id: 'sa-sonar-titan-3d',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan 3D Triple Density',
    sizes: [6, 7, 8, 9, 10, 11, 12].flatMap((weight) =>
      [
        { id: 'i23', densities: 'I/2/3', weights: [6, 10], name: 'Pale Green/Blue/Dark Green', colors: ['sa-sonar-dark-green', 'sa-titan-blue', 'sa-pale-green'] },
        { id: 'i35', densities: 'I/3/5', weights: [6, 10], name: 'Pale Green/Olive/Charcoal', colors: ['sa-charcoal', 'sa-olive', 'sa-pale-green'] },
        { id: '357', densities: '3/5/7', weights: [8, 12], name: 'Olive/Charcoal/Black', colors: ['sa-black', 'sa-charcoal', 'sa-olive'] },
      ]
        .filter(({ weights: [lo, hi] }) => weight >= lo && weight <= hi)
        .map(({ id, densities, name, colors: [head, handling, running] }) => ({
          id: `wf${weight}-${id}`,
          label: `WF${weight}S Sink ${densities}`,
          type: 'sinktip',
          weight,
          taper: [5.5, 24.5, 3.5, 71.5],
          colorways: [{ id, name, zones: zones([33.5, head], [20.5, handling], [0, running]) }],
        })),
    ),
  }),
  // Grain-rated: the rod weight for each is our estimate. Every size has a 25 ft sinking head, then
  // a floating handling line; the split inside the head is estimated. Sink 6 is about 6 ips.
  makerProduct({
    id: 'sa-sonar-sink-25-cold',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Sink 25 Cold',
    sizes: [
      [150, 5],
      [200, 7],
      [250, 8],
      [300, 9],
      [350, 10],
    ].flatMap(([grains, weight]) =>
      [
        { rate: 3, name: 'Dark Green/Ivory', head: 'sa-sonar-dark-green', running: 'sa-ivory' },
        { rate: 6, name: 'Charcoal/Moss', head: 'sa-charcoal', running: 'sa-sonar-moss' },
      ].map(({ rate, name, head, running }) => ({
        id: `${grains}-s${rate}`,
        label: `${grains} gr Sink ${rate}`,
        type: 'sinktip',
        weight,
        taper: [2, 22, 1, 80],
        estimated: true,
        colorways: [{ id: 'standard', name, zones: zones([25, head], [0, running]) }],
      })),
    ),
  }),
  // Level euro line (0.022″) on a mono core, drawn like RIO's (see rio.js). One size for 0–5 wt
  // rods. Formerly Mastery Competition Nymph.
  makerProduct({
    id: 'sa-mastery-euro-tactical-nymph-mono',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Euro Tactical Nymph Mono',
    sizes: [
      {
        id: 'level',
        label: 'Level 0–5 wt',
        type: 'floating',
        weight: 3,
        taper: [0.5, 0.5, 0.5, 78.5],
        colorways: [{ id: 'bamboo', name: 'Bamboo', zones: zones([0, 'sa-bamboo']) }],
      },
    ],
  }),
];
