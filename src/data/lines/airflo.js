import { makerProduct, zones } from './product.js';

// Sampled from Airflo's swatches and taper diagrams. Superflo Max Ridge 2.0 has its own entries
// (sampled from its diagrams) because its tapers match Ridge 2.0's exactly: shared colors would make
// a saved line from one look like the other.
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
  { id: 'airflo-lichen', name: 'Lichen', hex: '#8d7e56' },
  { id: 'airflo-driftwood', name: 'Driftwood', hex: '#c5c8d8' },
  { id: 'airflo-camo', name: 'Camouflage', hex: '#7e714b' },
  { id: 'airflo-max-moss', name: 'Moss', hex: '#927f5c' },
  { id: 'airflo-max-chartreuse', name: 'Chartreuse', hex: '#b2cd78' },
  { id: 'airflo-max-head-chartreuse', name: 'Chartreuse', hex: '#829d42' },
  { id: 'airflo-max-lichen', name: 'Lichen', hex: '#95815c' },
  { id: 'airflo-max-driftwood', name: 'Driftwood', hex: '#d6d9e7' },
];

const half = (ft) => Math.round(ft * 2) / 2;

// Airflo's diagrams give the split for one example size (named on the diagram); other sizes scale
// its front and back taper to their own head from Airflo's spec table, to the nearest half foot,
// and are marked estimated.
const scaled = ([front, body, back], head) => {
  const s = head / (front + body + back);
  const f = half(front * s);
  const b = half(back * s);
  return [f, head - f - b, b];
};

// Universal Taper, shared by Ridge 2.0 and Superflo Max Ridge 2.0. WF5 diagram: front 8, belly and
// rear belly 19, rear taper 12 (39 ft head), then a 12 ft haul zone drawn here as running line.
// Heads per size from Airflo's table; the head color runs to the end of the rear taper.
const UNIVERSAL = [8, 19, 12];
const universal = (sizes, colorways) =>
  sizes.map(([weight, head, total]) => ({
    id: `wf${weight}f`,
    label: `WF${weight}F`,
    type: 'floating',
    weight,
    taper: [...scaled(UNIVERSAL, head), total - head],
    estimated: weight !== 5,
    colorways: colorways
      .filter(({ weights: [lo, hi] }) => weight >= lo && weight <= hi)
      .map(({ id, name, head: headColor, running }) => ({ id, name, zones: zones([head, headColor], [0, running]) })),
  }));

export const PRODUCTS = [
  makerProduct({
    id: 'airflo-superflo-max-ridge-universal',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Universal Taper',
    sizes: universal(
      [
        [3, 37, 82],
        [4, 38, 90],
        [5, 39, 90],
        [6, 39, 90],
        [7, 40, 90],
        [8, 40, 90],
      ],
      [
        { id: 'moss-chartreuse', name: 'Moss/Chartreuse', weights: [3, 8], head: 'airflo-max-moss', running: 'airflo-max-chartreuse' },
        { id: 'chartreuse-white', name: 'Chartreuse/White', weights: [5, 8], head: 'airflo-max-head-chartreuse', running: 'airflo-white' },
        { id: 'lichen-driftwood', name: 'Lichen/Driftwood', weights: [3, 6], head: 'airflo-max-lichen', running: 'airflo-max-driftwood' },
      ],
    ),
  }),
  // Replaced by Superflo Max Ridge 2.0, same taper.
  makerProduct({
    id: 'airflo-ridge-universal-taper',
    maker: 'Airflo',
    name: 'Airflo Superflo Ridge 2.0 Universal Taper',
    discontinued: true,
    sizes: universal(
      [
        [3, 37, 82],
        [4, 38, 90],
        [5, 39, 90],
        [6, 39, 90],
        [7, 40, 90],
        [8, 40, 90],
        [9, 40, 90],
      ],
      [
        { id: 'moss-chartreuse', name: 'Moss/Chartreuse', weights: [3, 9], head: 'airflo-moss', running: 'airflo-ut-chartreuse' },
        { id: 'chartreuse-white', name: 'Chartreuse/White', weights: [5, 8], head: 'airflo-ut-chartreuse', running: 'airflo-white' },
        { id: 'lichen-driftwood', name: 'Lichen/Driftwood', weights: [3, 6], head: 'airflo-lichen', running: 'airflo-driftwood' },
      ],
    ),
  }),
  // Head and total from Airflo's spec table; taper split estimated (the WF5 diagram's 26 ft head
  // disagrees with the table's 22 ft). Color sections scaled from that diagram: sinking black tip,
  // intermediate belly, then the running line color. Each sink rate has its own colorway.
  makerProduct({
    id: 'airflo-streamer-max-short',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Streamer Max Short',
    sizes: [
      [5, 22],
      [6, 24],
      [7, 24],
      [8, 27],
      [9, 27],
    ].flatMap(([weight, head]) => {
      const s = head / 27;
      const front = half(4 * s);
      const back = half(7 * s);
      const tip = half(17.5 * s);
      const belly = half(5.5 * s);
      return [
        { rate: 3, name: 'Black/Green/Chartreuse', bellyColor: 'airflo-green', running: 'airflo-chartreuse' },
        { rate: 5, name: 'Black/Red/Orange', bellyColor: 'airflo-red', running: 'airflo-orange' },
        { rate: 7, name: 'Black/Blue/Chartreuse', bellyColor: 'airflo-blue', running: 'airflo-green-chartreuse' },
      ].map(({ rate, name, bellyColor, running }) => ({
        id: `wf${weight}-s${rate}`,
        label: `WF${weight} Sink ${rate}`,
        type: 'sinktip',
        weight,
        taper: [front, head - front - back, back, 100 - head],
        estimated: true,
        colorways: [{ id: 'standard', name, zones: zones([tip, 'airflo-black'], [belly, bellyColor], [0, running]) }],
      }));
    }),
  }),
  // Di3, Di5 and Di7 sink at 3, 5 and 7 ips; all black with orange hang markers. Sold in split
  // ratings (#5/6 … #8/9) and drawn at the heavier weight, since every size runs heavy for its lower
  // number. Same 46 ft head in every size; split from the #6/7 diagram. Di8 is also sold but would
  // draw the same as Di7, so it's left out.
  makerProduct({
    id: 'airflo-sixth-sense',
    maker: 'Airflo',
    name: 'Airflo Sixth Sense 2 Sinking',
    sizes: [
      [6, [3, 5]],
      [7, [3, 5, 7]],
      [8, [3, 5, 7]],
      [9, [3, 5, 7]],
    ].flatMap(([weight, rates]) =>
      rates.map((rate) => ({
        id: `wf${weight}-di${rate}`,
        label: `WF${weight - 1}/${weight} Di${rate}`,
        type: `sink${rate}`,
        weight,
        taper: [20, 16, 10, 59],
        colorways: [{ id: 'black', name: 'Black', zones: zones([0, 'airflo-sinking-black']) }],
      })),
    ),
  }),
  // 1.5 ips on a clear mono core; sold in the UK as Delta Taper Clear Intermediate. Same 46 ft head
  // in every size; split from the WF5 diagram. Clear or camo over the whole line.
  makerProduct({
    id: 'airflo-stillwater-intermediate',
    maker: 'Airflo',
    name: 'Airflo Stillwater Intermediate',
    sizes: [5, 6, 7, 8].map((weight) => ({
      id: `wf${weight}`,
      label: `WF${weight}I`,
      type: 'intermediate',
      weight,
      taper: [20, 16, 10, 59],
      colorways: [
        { id: 'clear', name: 'Clear', zones: zones([0, 'airflo-clear']) },
        { id: 'camo', name: 'Camouflage', zones: zones([0, 'airflo-camo']) },
      ],
    })),
  }),
];
