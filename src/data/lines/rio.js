import { makerProduct, zones } from './product.js';

// Matched by eye to product photos. Clear sections get a pale blue-grey that reads as clear.
export const COLORS = [
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
];

// Old preset ids that are now sizes with another id (old → new).
export const LEGACY_IDS = { 'rio-technical-euro-nymph': 'rio-technical-euro-nymph-2-5' };

const half = (ft) => Math.round(ft * 2) / 2;

// Premier Gold. Head and total length per size from RIO's spec table. RIO's WF5F diagram gives the
// split (front 5.5, body 22.5, back 19, running 43); other sizes scale it to their head, to the
// nearest half foot, and are marked estimated. The color change is at the end of the head;
// Melon/Gray Dun is only made in WF4–6.
const GOLD_SPLIT = [5.5, 22.5, 19];
const goldSize = (weight, head, total) => {
  const scale = head / GOLD_SPLIT.reduce((a, b) => a + b);
  const front = half(GOLD_SPLIT[0] * scale);
  const back = half(GOLD_SPLIT[2] * scale);
  const colorways = [{ id: 'moss-gold', name: 'Moss/Gold', zones: zones([head, 'rio-moss'], [0, 'rio-gold']) }];
  if (weight >= 4 && weight <= 6) colorways.push({ id: 'melon-gray-dun', name: 'Melon/Gray Dun', zones: zones([head, 'rio-melon'], [0, 'rio-gray-dun']) });
  return {
    id: `wf${weight}f`,
    label: `WF${weight}F`,
    type: 'floating',
    weight,
    taper: [front, head - front - back, back, total - head],
    estimated: weight !== 5,
    colorways,
  };
};

export const PRODUCTS = [
  makerProduct({
    id: 'rio-premier-gold',
    maker: 'RIO',
    name: 'RIO Premier Gold',
    sizes: [
      [2, 44, 80],
      [3, 45, 80],
      [4, 46, 90],
      [5, 47, 90],
      [6, 48, 90],
      [7, 49, 90],
      [8, 50, 90],
      [9, 50, 90],
    ].map(([weight, head, total]) => goldSize(weight, head, total)),
  }),
  // 1.5–2 ips. Taper from a retailer's copy of RIO's diagram. The whole head is clear.
  makerProduct({
    id: 'rio-premier-aqualux',
    maker: 'RIO',
    name: 'RIO Premier Aqualux II',
    sizes: [
      {
        id: 'wf8i',
        label: 'WF8I',
        type: 'intermediate',
        weight: 8,
        taper: [4, 22, 4, 70],
        colorways: [{ id: 'clear-light-teal', name: 'Clear/Light Teal', zones: zones([30, 'rio-clear'], [0, 'rio-light-teal']) }],
      },
    ],
  }),
  // 35 ft head from one retailer; taper split estimated. Black head on a running line colored by
  // sink rate.
  makerProduct({
    id: 'rio-premier-fathom',
    maker: 'RIO',
    name: 'RIO Premier Fathom',
    sizes: [
      { rate: 5, colorway: { id: 'black-maroon', name: 'Black/Maroon', running: 'rio-maroon' } },
      { rate: 7, colorway: { id: 'black-grey', name: 'Black/Grey', running: 'rio-grey' } },
    ].map(({ rate, colorway: { id, name, running } }) => ({
      id: `wf8s${rate}`,
      label: `WF8 Sink ${rate}`,
      type: `sink${rate}`,
      weight: 8,
      taper: [6, 22, 7, 70],
      estimated: true,
      colorways: [{ id, name, zones: zones([35, 'rio-black'], [0, running]) }],
    })),
  }),
  // Euro nymph lines are level (about 0.022″), much thinner than a WF head of any weight, so they're
  // drawn as running line behind a token taper. RIO sells one size for 2–5 wt rods; it comes with a
  // 14 ft pink mono leader.
  makerProduct({
    id: 'rio-technical-euro-nymph',
    maker: 'RIO',
    name: 'RIO Premier Technical Euro Nymph',
    sizes: [
      {
        id: '2-5',
        label: '2–5 wt',
        type: 'floating',
        weight: 3,
        taper: [0.5, 0.5, 0.5, 92.5],
        colorways: [{ id: 'pink-yellow', name: 'Pink/Yellow', zones: zones([14, 'rio-pink'], [0, 'rio-yellow']) }],
      },
    ],
  }),
];
