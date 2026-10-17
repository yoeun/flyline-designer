import * as LINEUP from 'lineups:scientific-anglers';
import { lineupSize, makerProduct, overriding, zones } from './product.js';

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

// A line with the same head in every size: the diagram's [front, body, back] applies to all of
// them, and the running line makes up each size's total.
const sameHead = (split, size) => [...split, size.total - size.head];

// A lineup product's floating WF sizes: `ref` is the weight the diagram is drawn for;
// `colorways(head, [front, body, back], weight)` returns a size's colorways.
const floating = (split, ref, sizes, colorways) =>
  sizes.map((size) => {
    const { weight, head, total } = size;
    const taper = scaled(split, head);
    return {
      id: `wf${weight}f`,
      label: size.label,
      type: 'floating',
      weight,
      taper: [...taper, total - head],
      estimated: weight !== ref,
      lineup: size,
      colorways: colorways(head, taper, weight),
    };
  });

// Amplitude, Mastery and Frequency share tapers: MPX is the same line in each, only the coating
// and colors differ. WF5 diagram: front 6.5, bellies 25, rear 4.5 on a 36 ft head.
const MPX = [6.5, 25, 4.5];

// Trout Expert and the Amplitude Smooth Trout it replaced share a diagram (WF5, 69 ft head):
// two front tapers (13 ft), two bellies (30.5) and a 25.5 ft rear taper.
const TROUT_EXPERT = [13, 30.5, 25.5];
const TROUT_EXPERT_LINEUP = LINEUP['sa-amplitude-smooth-trout-expert'];

// Frequency Full Sink's densities: Sink 6 draws as Type 5.
const FULL_SINK_RATES = {
  sink3: { rate: 3, type: 'sink3', colorway: { id: 'dark-green', name: 'Dark Green', color: 'sa-dark-green' } },
  sink6: { rate: 6, type: 'sink5', colorway: { id: 'dark-gray', name: 'Dark Gray', color: 'sa-dark-gray' } },
};

// The Sonar Titan head, shared by the Full Intermediate and 3D: 33.5 ft in every size.
const TITAN = [5.5, 24.5, 3.5];
const TITAN_3D = LINEUP['sa-sonar-titan-3d-triple-density'];
const SINK_25_COLD = LINEUP['sa-sonar-sink-25-cold'];
const EURO_MONO = lineupSize(LINEUP['sa-mastery-competition-nymph'], 'Level 0-5wt (.022")');

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
      LINEUP['sa-amplitude-smooth-infinity'].sizes,
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
    sizes: floating(MPX, 5, LINEUP['sa-amplitude-smooth-mpx'].sizes, (head, [front]) => [
      { id: 'optic-moss-buckskin', name: 'Optic Green/Moss/Buckskin', zones: zones([front, 'sa-buckskin'], [head - front, 'sa-moss'], [0, 'sa-optic-green']) },
    ]),
  }),
  // The Amplitude Smooth MPX taper in Mastery: a one-color head on a contrasting running line.
  makerProduct({
    id: 'sa-mastery-mpx',
    maker: 'Scientific Anglers',
    name: 'SA Mastery MPX',
    sizes: floating(MPX, 5, LINEUP['sa-mastery-mpx'].sizes, (head) => [
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
      LINEUP['sa-amplitude-smooth-trout-gp'].sizes,
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
    sizes: floating(TROUT_EXPERT, 5, TROUT_EXPERT_LINEUP.sizes, (head, [front, body]) => {
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
      LINEUP['sa-amplitude-smooth-creek-trout'].sizes,
      (head) => {
        const tip = half((6 * head) / 24);
        return [{ id: 'moss-leather-willow', name: 'Moss/Leather/Willow', zones: zones([tip, 'sa-willow'], [head - tip, 'sa-leather'], [0, 'sa-sonar-moss']) }];
      },
    ),
  }),
  // Replaced by Trout GP and Trout Expert. SA's old diagram is the Trout Expert taper (69 ft head at
  // WF5; one retailer lists 68). Only that WF5 head is known, so every size borrows Trout Expert's
  // head and total length, and the sizes other than WF5 are marked estimated. Blue heron front
  // tapers, bamboo bellies, celestial blue rear.
  makerProduct({
    id: 'sa-amplitude-smooth-trout',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Trout',
    discontinued: true,
    sizes: floating(
      TROUT_EXPERT,
      5,
      LINEUP['sa-amplitude-smooth-trout'].sizes.map((size) => {
        const { head, total } = lineupSize(TROUT_EXPERT_LINEUP, size.label);
        return overriding(size, { head, total });
      }),
      (head, [front, body]) => [
        { id: 'celestial-bamboo-heron', name: 'Celestial Blue/Bamboo/Blue Heron', zones: zones([front, 'sa-blue-heron'], [body, 'sa-bamboo'], [0, 'sa-celestial-blue']) },
      ],
    ),
  }),
  // Two sizes heavy. Every size has a 43 ft head; the diagram's split applies to all of them.
  makerProduct({
    id: 'sa-amplitude-bass-bug',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Bass Bug',
    sizes: LINEUP['sa-amplitude-bass-bug'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead([5, 28, 10], size),
      lineup: size,
      colorways: [{ id: 'camo-shad-frog', name: 'Camo/Shad Blue/Frog Green', zones: zones([12.5, 'sa-bass-camo'], [30.5, 'sa-shad-blue'], [0, 'sa-frog-green']) }],
    })),
  }),
  // 2 ips, two sizes heavy. Long three-part front taper; one color over the whole line. Every size
  // has the same 45 ft head.
  makerProduct({
    id: 'sa-sonar-stillwater-clear-camo',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Stillwater Clear Camo',
    sizes: LINEUP['sa-sonar-stillwater-clear-camo-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: sameHead([22.5, 13, 9.5], size),
      lineup: size,
      colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'sa-clear-camo']) }],
    })),
  }),
  // Sink 3 is 2.5–4 ips, Sink 6 5–6 ips. The diagram is drawn for a 40 ft head; the WF6 split
  // (36 ft head) is scaled from it, and the other heads keep its 4 ft front and 2 ft back taper.
  makerProduct({
    id: 'sa-frequency-full-sink',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Full Sink',
    sizes: LINEUP['sa-frequency-full-sink'].sizes.map((size) => {
      const { weight, head } = size;
      const { rate, type, colorway } = FULL_SINK_RATES[size.density];
      return {
        id: `wf${weight}s${rate}`,
        label: size.label,
        type,
        weight,
        taper: [4, head - 6, 2, size.total - head],
        estimated: true,
        lineup: size,
        colorways: [{ id: colorway.id, name: colorway.name, zones: zones([0, colorway.color]) }],
      };
    }),
  }),
  // 10 ft Sink 3 tip plus a 1 ft transition, then a floating belly. Same 45 ft head in every size.
  makerProduct({
    id: 'sa-frequency-sink-tip',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Sink Tip',
    sizes: LINEUP['sa-frequency-sink-tip'].sizes.map((size) => ({
      id: `wf${size.weight}`,
      label: size.label,
      type: 'sinktip',
      weight: size.weight,
      taper: sameHead([11, 30, 4], size),
      lineup: size,
      colorways: [{ id: 'green-optic-yellow', name: 'Green/Optic Yellow', zones: zones([10, 'sa-dark-green'], [0, 'sa-optic-yellow']) }],
    })),
  }),
  // 1.25 ips. Same 33.5 ft head in every size.
  makerProduct({
    id: 'sa-sonar-titan-intermediate',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Full Intermediate',
    sizes: LINEUP['sa-sonar-titan-full-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: sameHead(TITAN, size),
      lineup: size,
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
    sizes: [...new Set(TITAN_3D.sizes.map((size) => size.weight))].flatMap((weight) =>
      [
        { id: 'i23', densities: 'I/2/3', name: 'Pale Green/Blue/Dark Green', colors: ['sa-sonar-dark-green', 'sa-titan-blue', 'sa-pale-green'] },
        { id: 'i35', densities: 'I/3/5', name: 'Pale Green/Olive/Charcoal', colors: ['sa-charcoal', 'sa-olive', 'sa-pale-green'] },
        { id: '357', densities: '3/5/7', name: 'Olive/Charcoal/Black', colors: ['sa-black', 'sa-charcoal', 'sa-olive'] },
      ]
        .map((set) => ({ ...set, size: TITAN_3D.sizes.find((size) => size.label === `WF${weight}S Sink ${set.densities}`) }))
        .filter(({ size }) => size)
        .map(({ id, name, colors: [head, handling, running], size }) => ({
          id: `wf${weight}-${id}`,
          label: size.label,
          type: 'sinktip',
          weight,
          taper: sameHead(TITAN, size),
          lineup: size,
          colorways: [{ id, name, zones: zones([33.5, head], [20.5, handling], [0, running]) }],
        })),
    ),
  }),
  // Grain-rated: the rod weight for each is our estimate (the lineup has none). Every size has a
  // 25 ft sinking head, then a floating handling line; the split inside the head is estimated. Sink 6
  // is about 6 ips.
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
      ].map(({ rate, name, head, running }) => {
        const size = lineupSize(SINK_25_COLD, `${grains}gr F/S${rate}`);
        return {
          id: `${grains}-s${rate}`,
          label: `${grains} gr Sink ${rate}`,
          type: 'sinktip',
          weight,
          taper: sameHead([2, 22, 1], size),
          estimated: true,
          lineup: overriding(size, { weight }),
          colorways: [{ id: 'standard', name, zones: zones([25, head], [0, running]) }],
        };
      }),
    ),
  }),
  // Level euro line (0.022″) on a mono core, drawn like RIO's (see rio.js): a token 1.5 ft head on
  // SA's 80 ft total. One size for 0–5 wt rods, drawn as a 3 wt. Formerly Mastery Competition Nymph.
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
        taper: [0.5, 0.5, 0.5, EURO_MONO.total - 1.5],
        lineup: overriding(EURO_MONO, { weight: 3, head: 1.5 }),
        colorways: [{ id: 'bamboo', name: 'Bamboo', zones: zones([0, 'sa-bamboo']) }],
      },
    ],
  }),
];
