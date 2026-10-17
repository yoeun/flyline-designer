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
];

// Old preset ids that are now sizes with another id (old → new).
export const LEGACY_IDS = { 'sa-mastery-competition-nymph': 'sa-mastery-competition-nymph-level' };

// SA's diagrams have no numbers; splits are measured off them to about ±0.5 ft.
export const PRODUCTS = [
  // The diagram shows the Orange and Camo colorways; Optic is assumed to share the Orange split.
  makerProduct({
    id: 'sa-amplitude-smooth-infinity',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Infinity',
    sizes: [
      {
        id: 'wf6f',
        label: 'WF6F',
        type: 'floating',
        weight: 6,
        taper: [6.5, 24, 19.5, 40],
        colorways: [
          { id: 'optic', name: 'Optic', zones: zones([6.5, 'sa-buckskin'], [43.5, 'sa-mist-green'], [0, 'sa-optic-green']) },
          { id: 'orange', name: 'Orange', zones: zones([6.5, 'sa-creamsicle'], [43.5, 'sa-satin-orange'], [0, 'sa-optic-green']) },
          { id: 'camo', name: 'Camo', zones: zones([10, 'sa-camo'], [40, 'sa-buckskin'], [0, 'sa-bamboo']) },
        ],
      },
    ],
  }),
  makerProduct({
    id: 'sa-amplitude-bass-bug',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Bass Bug',
    sizes: [
      {
        id: 'wf8f',
        label: 'WF8F',
        type: 'floating',
        weight: 8,
        taper: [5, 28, 10, 47],
        colorways: [{ id: 'camo-shad-frog', name: 'Camo/Shad Blue/Frog Green', zones: zones([12.5, 'sa-bass-camo'], [30.5, 'sa-shad-blue'], [0, 'sa-frog-green']) }],
      },
    ],
  }),
  // 2 ips. Long three-part front taper; one color over the whole line.
  makerProduct({
    id: 'sa-sonar-stillwater-clear-camo',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Stillwater Clear Camo',
    sizes: [
      {
        id: 'wf6i',
        label: 'WF6I',
        type: 'intermediate',
        weight: 6,
        taper: [22.5, 13, 9.5, 55],
        colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'sa-clear-camo']) }],
      },
    ],
  }),
  // Type III is 2.5–4 ips, Type VI 5–6 ips. The diagram is drawn for a 40 ft head; the 36 ft WF6
  // split is scaled from it.
  makerProduct({
    id: 'sa-frequency-full-sink',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Full Sink',
    sizes: [
      { id: 'wf6s3', label: 'WF6 Type III', type: 'sink3', colorway: { id: 'dark-green', name: 'Dark Green', color: 'sa-dark-green' } },
      { id: 'wf6s6', label: 'WF6 Type VI', type: 'sink5', colorway: { id: 'dark-gray', name: 'Dark Gray', color: 'sa-dark-gray' } },
    ].map(({ colorway: { id, name, color }, ...size }) => ({
      ...size,
      weight: 6,
      taper: [4, 30, 2, 49],
      estimated: true,
      colorways: [{ id, name, zones: zones([0, color]) }],
    })),
  }),
  // 10 ft Type III tip plus a 1 ft transition, then a floating belly.
  makerProduct({
    id: 'sa-frequency-sink-tip',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Sink Tip',
    sizes: [
      {
        id: 'wf6',
        label: 'WF6 Type III',
        type: 'sinktip',
        weight: 6,
        taper: [11, 30, 4, 40],
        colorways: [{ id: 'green-optic-yellow', name: 'Green/Optic Yellow', zones: zones([10, 'sa-dark-green'], [0, 'sa-optic-yellow']) }],
      },
    ],
  }),
  // 1.25 ips.
  makerProduct({
    id: 'sa-sonar-titan-intermediate',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Full Intermediate',
    sizes: [
      {
        id: 'wf8i',
        label: 'WF8I',
        type: 'intermediate',
        weight: 8,
        taper: [5.5, 24.5, 3.5, 71.5],
        colorways: [{ id: 'pale-green-blue', name: 'Pale Green/Blue', zones: zones([33.5, 'sa-pale-green'], [0, 'sa-titan-blue']) }],
      },
    ],
  }),
  // Grain-rated; 250 gr suits an 8 wt (estimate). Every size has a 25 ft sinking head, then a
  // floating handling line; the split inside the head is estimated. Sink 6 is about 6 ips.
  makerProduct({
    id: 'sa-sonar-sink-25-cold',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Sink 25 Cold',
    sizes: [
      { rate: 3, name: 'Dark Green/Ivory', head: 'sa-sonar-dark-green', running: 'sa-ivory' },
      { rate: 6, name: 'Charcoal/Moss', head: 'sa-charcoal', running: 'sa-sonar-moss' },
    ].map(({ rate, name, head, running }) => ({
      id: `250-s${rate}`,
      label: `250 gr Sink ${rate}`,
      type: 'sinktip',
      weight: 8,
      taper: [2, 22, 1, 80],
      estimated: true,
      colorways: [{ id: 'standard', name, zones: zones([25, head], [0, running]) }],
    })),
  }),
  // Level euro line, drawn like RIO's (see rio.js).
  makerProduct({
    id: 'sa-mastery-competition-nymph',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Competition Nymph',
    sizes: [
      {
        id: 'level',
        label: 'Level',
        type: 'floating',
        weight: 3,
        taper: [0.5, 0.5, 0.5, 78.5],
        colorways: [{ id: 'bamboo', name: 'Bamboo', zones: zones([0, 'sa-bamboo']) }],
      },
    ],
  }),
];
