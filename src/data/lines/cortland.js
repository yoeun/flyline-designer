import { makerProduct, zones } from './product.js';

// Matched by eye to product photos.
export const COLORS = [
  { id: 'cortland-peach', name: 'Peach', hex: '#f7c89c' },
  { id: 'cortland-clear-camo', name: 'Clear Camo', hex: '#6e6a5c' },
  { id: 'cortland-dark-brown', name: 'Dark Brown', hex: '#37261e' },
  { id: 'cortland-black', name: 'Black', hex: '#222222' },
  { id: 'cortland-green', name: 'Green', hex: '#89a64c' },
];

// Cortland publishes few numbers; lengths here are from retailers.
export const PRODUCTS = [
  makerProduct({
    id: 'cortland-444-peach',
    maker: 'Cortland',
    name: 'Cortland 444 Peach',
    sizes: [
      {
        id: 'wf5f',
        label: 'WF5F',
        type: 'floating',
        weight: 5,
        taper: [8, 20, 4, 58],
        colorways: [{ id: 'peach', name: 'Peach', zones: zones([0, 'cortland-peach']) }],
      },
    ],
  }),
  // Retailers disagree on the head (41 or 32 ft); taper split estimated from Cortland's description
  // ("short front taper and body, extended back taper").
  makerProduct({
    id: 'cortland-444-clear-camo',
    maker: 'Cortland',
    name: 'Cortland 444 Clear Camo',
    sizes: [
      {
        id: 'wf7i',
        label: 'WF7I',
        type: 'intermediate',
        weight: 7,
        taper: [8, 20, 13, 49],
        estimated: true,
        colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'cortland-clear-camo']) }],
      },
    ],
  }),
  // 3–4 ips. Head and running line from Cortland's page; taper split assumed to match the 444 floating.
  makerProduct({
    id: 'cortland-444-full-sink',
    maker: 'Cortland',
    name: 'Cortland 444 Full Sinking',
    sizes: [
      {
        id: 'wf6s3',
        label: 'WF6 Type 3',
        type: 'sink3',
        weight: 6,
        taper: [8, 20, 4, 58],
        estimated: true,
        colorways: [{ id: 'dark-brown', name: 'Dark Brown', zones: zones([0, 'cortland-dark-brown']) }],
      },
    ],
  }),
  // Type 6 (5–6 ips) 15 ft tip. Tip and body lengths published; rear taper is the rest of the
  // 31 ft head (one retailer table lists 26 ft).
  makerProduct({
    id: 'cortland-streamer-sink-tip-15',
    maker: 'Cortland',
    name: 'Cortland Streamer Sink Tip 15',
    sizes: [
      {
        id: 'wf7',
        label: 'WF7',
        type: 'sinktip',
        weight: 7,
        taper: [15, 6, 10, 69],
        colorways: [{ id: 'black-green', name: 'Black/Green', zones: zones([15, 'cortland-black'], [0, 'cortland-green']) }],
      },
    ],
  }),
];
