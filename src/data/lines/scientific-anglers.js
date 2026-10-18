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
  { id: 'sa-pale-yellow', name: 'Pale Yellow', hex: '#f2eb5f' },
  { id: 'sa-sand', name: 'Sand', hex: '#f0c9a2' },
  { id: 'sa-horizon', name: 'Horizon', hex: '#bbccea' },
  { id: 'sa-titan-sage', name: 'Sage', hex: '#a3a468' },
  { id: 'sa-dark-olive', name: 'Dark Olive', hex: '#5f6738' },
  { id: 'sa-anadro-willow', name: 'Willow', hex: '#e3deb6' },
  { id: 'sa-anadro-optic-green', name: 'Optic Green', hex: '#59ba47' },
  { id: 'sa-orange', name: 'Orange', hex: '#d87c2f' },
  { id: 'sa-surf', name: 'Surf', hex: '#9cc7ea' },
  { id: 'sa-tropical-sand', name: 'Sand', hex: '#fde492' },
  { id: 'sa-tropical-horizon', name: 'Horizon', hex: '#b8e5fa' },
  { id: 'sa-clear', name: 'Clear', hex: '#e8e8ea' },
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
  // Rounded to a tenth so a head like 39.7 ft leaves no float noise in the body.
  return [f, Math.round((head - f - b) * 10) / 10, b];
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

// Grand Slam, Smooth and Textured share a diagram: front taper 2.5, front belly 18, rear taper 19.5.
// The diagram's head measures 40.5 ft against the 40 ft SA lists for every size; the split is scaled
// to 40.
const GRAND_SLAM = [2.5, 18, 19.5];

// Trout Expert and the Amplitude Smooth Trout it replaced share a diagram (WF5, 69 ft head):
// two front tapers (13 ft), two bellies (30.5) and a 25.5 ft rear taper.
const TROUT_EXPERT = [13, 30.5, 25.5];
const TROUT_EXPERT_LINEUP = LINEUP['sa-amplitude-smooth-trout-expert'];

// Smooth and Textured Anadro Indicator share a diagram: front taper 2.5, front belly and belly 31,
// rear taper 27.5. Its head measures 61 ft, the WF7's (WF5 and WF6 list 60). The tip color runs to the end
// of the front belly, about 7.5 ft.
const ANADRO = [2.5, 31, 27.5];
const anadro = (id, name, tip) =>
  makerProduct({
    id,
    maker: 'Scientific Anglers',
    name,
    sizes: floating(ANADRO, 7, LINEUP[id].sizes, (head) => {
      const front = half((7.5 * head) / 61);
      return [{ id: `moss-willow-${tip.id}`, name: `Moss/Willow/${tip.name}`, zones: zones([front, tip.color], [head - front, 'sa-anadro-willow'], [0, 'sa-moss']) }];
    }),
  });

// Amplitude Smooth Bonefish's diagram: two front tapers (7 ft), a front belly, a short rear taper
// into a thicker rear belly (28.5 ft together, drawn here as the body), then a 4.5 ft rear taper.
// Its 40 ft head is nearest the WF8's 39.7. The last 10 ft of the 100 ft line is a black sighter.
const BONEFISH = [7, 28.5, 4.5];

// Frequency Full Sink's densities: Sink 6 draws as Type 5.
const FULL_SINK_RATES = {
  sink3: { rate: 3, type: 'sink3', colorway: { id: 'dark-green', name: 'Dark Green', color: 'sa-dark-green' } },
  sink6: { rate: 6, type: 'sink5', colorway: { id: 'dark-gray', name: 'Dark Gray', color: 'sa-dark-gray' } },
};

// The Sonar Titan head, shared by the Full Intermediate and 3D: 33.5 ft in every size.
const TITAN = [5.5, 24.5, 3.5];
const TITAN_3D = LINEUP['sa-sonar-titan-3d-triple-density'];
// The Tropical/Jungle Clear Tip's own diagram: front taper 5.5, two bellies to 34, a 1 ft rear taper.
// The diagram's head measures 34.75 ft against the 33.5 ft SA lists for every size; the split is
// scaled to 33.5.
const TITAN_TROPICAL = [5.5, 27, 1];
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
  // The Smooth Infinity taper with SA's textures. Its own WF5 diagram (49 ft head): front 6.5,
  // belly 24, two rear tapers 18.5; the other sizes scale it. The camo tip runs about 10.5 ft on that
  // diagram.
  makerProduct({
    id: 'sa-amplitude-textured-infinity',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Infinity',
    sizes: floating(
      [6.5, 24, 18.5],
      5,
      LINEUP['sa-amplitude-textured-infinity'].sizes,
      (head, [front]) => {
        const camo = half((10.5 * head) / 49);
        return [
          { id: 'optic', name: 'Optic', zones: zones([front, 'sa-buckskin'], [head - front, 'sa-mist-green'], [0, 'sa-optic-green']) },
          { id: 'camo', name: 'Camo', zones: zones([camo, 'sa-camo'], [head - camo, 'sa-buckskin'], [0, 'sa-bamboo']) },
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
  // The Amplitude Smooth MPX taper and colors with SA's textures; its own WF5 diagram measures the
  // same split.
  makerProduct({
    id: 'sa-amplitude-textured-mpx',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured MPX',
    sizes: floating(MPX, 5, LINEUP['sa-amplitude-textured-mpx'].sizes, (head, [front]) => [
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
  // One and a half sizes heavy, for indicator nymphing. Orange tip, willow head, moss running line.
  anadro('sa-amplitude-smooth-anadro-indicator', 'SA Amplitude Smooth Anadro Indicator', { id: 'orange', name: 'Orange', color: 'sa-orange' }),
  // The Smooth Anadro Indicator taper with SA's textures; an optic green tip.
  anadro('sa-amplitude-anadro', 'SA Amplitude Textured Anadro Indicator', { id: 'optic', name: 'Optic Green', color: 'sa-anadro-optic-green' }),
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
  // Two sizes heavy, for big flies. SA's diagram: front taper 5, two bellies 28, rear taper 10, the
  // 43 ft head SA lists for every size (the Bass Bug's split). Dark olive front taper, moss head, sage
  // running line.
  makerProduct({
    id: 'sa-amplitude-smooth-titan-long',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Titan Long',
    sizes: LINEUP['sa-amplitude-smooth-titan-long'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead([5, 28, 10], size),
      lineup: size,
      colorways: [{ id: 'sage-moss-dark-olive', name: 'Sage/Moss/Dark Olive', zones: zones([5, 'sa-dark-olive'], [38, 'sa-sonar-moss'], [0, 'sa-titan-sage']) }],
    })),
  }),
  // Three-quarter size heavy saltwater line. Same 40 ft head in every size. Horizon front taper, sand
  // head, pale yellow running line.
  makerProduct({
    id: 'sa-amplitude-smooth-grand-slam',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Grand Slam',
    sizes: LINEUP['sa-amplitude-smooth-grand-slam'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(GRAND_SLAM, size),
      lineup: size,
      colorways: [{ id: 'pale-yellow-sand-horizon', name: 'Pale Yellow/Sand/Horizon', zones: zones([2.5, 'sa-horizon'], [37.5, 'sa-sand'], [0, 'sa-pale-yellow']) }],
    })),
  }),
  // The Smooth Grand Slam taper and colors with SA's textures, in WF7–12.
  makerProduct({
    id: 'sa-amplitude-grand-slam',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Grand Slam',
    sizes: LINEUP['sa-amplitude-grand-slam'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(GRAND_SLAM, size),
      lineup: size,
      colorways: [{ id: 'pale-yellow-sand-horizon', name: 'Pale Yellow/Sand/Horizon', zones: zones([2.5, 'sa-horizon'], [37.5, 'sa-sand'], [0, 'sa-pale-yellow']) }],
    })),
  }),
  // True to weight. Ivory head, surf running line, black sighter.
  makerProduct({
    id: 'sa-amplitude-smooth-bonefish',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Bonefish',
    sizes: floating(BONEFISH, 8, LINEUP['sa-amplitude-smooth-bonefish'].sizes, (head) => [
      { id: 'black-surf-ivory', name: 'Black/Surf/Ivory', zones: zones([head, 'sa-ivory'], [90 - head, 'sa-surf'], [0, 'sa-black']) },
    ]),
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
  // A floating Titan with a 15 ft clear intermediate tip (1.25 ips), drawn as a sink tip like RIO's
  // clear tips. Clear tip, horizon to the end of the head, sand running line.
  makerProduct({
    id: 'sa-sonar-titan-tropical-clear-tip',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Tropical/Jungle Clear Tip',
    sizes: LINEUP['sa-sonar-titan-tropical-clear-tip'].sizes.map((size) => ({
      id: `wf${size.weight}-f-i`,
      label: size.label,
      type: 'sinktip',
      weight: size.weight,
      taper: sameHead(TITAN_TROPICAL, size),
      lineup: size,
      colorways: [{ id: 'sand-horizon-clear', name: 'Sand/Horizon/Clear', zones: zones([15, 'sa-clear'], [18.5, 'sa-tropical-horizon'], [0, 'sa-tropical-sand']) }],
    })),
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
