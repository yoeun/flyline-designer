import { makerProduct, zones } from './product.js';

// Sampled from Airflo's swatches and taper diagrams.
export const COLORS = [
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
];

// Splits from Airflo's own taper diagrams unless noted.
export const PRODUCTS = [
  makerProduct({
    id: 'airflo-ridge-universal-taper',
    maker: 'Airflo',
    name: 'Airflo Superflo Ridge 2.0 Universal Taper',
    sizes: [
      {
        id: 'wf5f',
        label: 'WF5F',
        type: 'floating',
        weight: 5,
        taper: [8, 19, 12, 51],
        colorways: [
          { id: 'moss-chartreuse', name: 'Moss/Chartreuse', zones: zones([39, 'airflo-moss'], [0, 'airflo-ut-chartreuse']) },
          { id: 'chartreuse-white', name: 'Chartreuse/White', zones: zones([39, 'airflo-ut-chartreuse'], [0, 'airflo-white']) },
        ],
      },
    ],
  }),
  // Head and total from Airflo's spec table; taper split estimated. Color sections scaled from the
  // WF5 diagram: sinking black tip, intermediate belly, then the running line color. Each sink
  // rate has its own colorway.
  makerProduct({
    id: 'airflo-streamer-max-short',
    maker: 'Airflo',
    name: 'Airflo Streamer Max Short',
    sizes: [
      { rate: 3, name: 'Black/Green/Chartreuse', belly: 'airflo-green', running: 'airflo-chartreuse' },
      { rate: 5, name: 'Black/Red/Orange', belly: 'airflo-red', running: 'airflo-orange' },
      { rate: 7, name: 'Black/Blue/Chartreuse', belly: 'airflo-blue', running: 'airflo-green-chartreuse' },
    ].map(({ rate, name, belly, running }) => ({
      id: `wf8-s${rate}`,
      label: `WF8 Sink ${rate}`,
      type: 'sinktip',
      weight: 8,
      taper: [4, 16, 7, 73],
      estimated: true,
      colorways: [{ id: 'standard', name, zones: zones([17.5, 'airflo-black'], [5.5, belly], [0, running]) }],
    })),
  }),
  // Sold as #6/7 in Di3, Di5 and Di7 (3, 5 and 7 ips), all black with orange hang markers.
  makerProduct({
    id: 'airflo-sixth-sense',
    maker: 'Airflo',
    name: 'Airflo Sixth Sense 2',
    sizes: [3, 5, 7].map((rate) => ({
      id: `wf7-di${rate}`,
      label: `WF7 Di${rate}`,
      type: `sink${rate}`,
      weight: 7,
      taper: [20, 16, 10, 59],
      colorways: [{ id: 'black', name: 'Black', zones: zones([0, 'airflo-sinking-black']) }],
    })),
  }),
  // 1.5 ips, clear on a clear mono core.
  makerProduct({
    id: 'airflo-stillwater-intermediate',
    maker: 'Airflo',
    name: 'Airflo Stillwater Intermediate',
    sizes: [
      {
        id: 'wf6',
        label: 'WF6 Clear',
        type: 'intermediate',
        weight: 6,
        taper: [20, 16, 10, 59],
        colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'airflo-clear']) }],
      },
    ],
  }),
];
