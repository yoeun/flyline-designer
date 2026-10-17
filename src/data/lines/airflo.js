import * as LINEUP from 'lineups:airflo';
import { lineupSize, makerProduct, overriding, zones } from './product.js';

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

// The front, body and back of a lineup size's published taper.
const split = ({ taper: { front, body, back } }) => [front, body, back];

// Airflo's diagrams give the split for one example size (named on the diagram); other sizes scale
// its front and back taper to their own head from Airflo's spec table, to the nearest half foot,
// and are marked estimated.
const scaled = ([front, body, back], head) => {
  const s = head / (front + body + back);
  const f = half(front * s);
  const b = half(back * s);
  return [f, head - f - b, b];
};

// Universal Taper, shared by Ridge 2.0 and Superflo Max Ridge 2.0. The split is the WF5 diagram's
// front taper, belly and rear belly, and rear taper; the 12 ft haul zone behind it is drawn as
// running line. Heads per size from Airflo's table (sizes without one are left out); the head color
// runs to the end of the rear taper.
const MAX_RIDGE_UNIVERSAL = LINEUP['airflo-smr-universal'];
const UNIVERSAL = split(lineupSize(MAX_RIDGE_UNIVERSAL, 'WF5F'));
const universal = (product, colorways) =>
  product.sizes
    .filter((size) => size.head !== null)
    .map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: [...scaled(UNIVERSAL, size.head), size.total - size.head],
      estimated: !size.taper,
      lineup: size,
      colorways: colorways
        .filter(({ weights: [lo, hi] }) => size.weight >= lo && size.weight <= hi)
        .map(({ id, name, head: headColor, running }) => ({ id, name, zones: zones([size.head, headColor], [0, running]) })),
    }));

const STREAMER_MAX_COLORWAYS = {
  3: { name: 'Black/Green/Chartreuse', bellyColor: 'airflo-green', running: 'airflo-chartreuse' },
  5: { name: 'Black/Red/Orange', bellyColor: 'airflo-red', running: 'airflo-orange' },
  7: { name: 'Black/Blue/Chartreuse', bellyColor: 'airflo-blue', running: 'airflo-green-chartreuse' },
};

// Sixth Sense 2 Sinking and Delta Taper Clear Intermediate have a 46 ft head in every size, so the
// diagram's split applies to all of them.
const SIXTH_SENSE = LINEUP['airflo-sixth-sense-2-sinking'];
const SIXTH_SENSE_SPLIT = split(lineupSize(SIXTH_SENSE, 'WF6/7S Di3'));
const DELTA = LINEUP['airflo-delta-taper-clear-intermediate'];
const DELTA_SPLIT = split(lineupSize(DELTA, 'WF5I Fast Intermediate'));

export const PRODUCTS = [
  makerProduct({
    id: 'airflo-superflo-max-ridge-universal',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Universal Taper',
    sizes: universal(
      MAX_RIDGE_UNIVERSAL,
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
      LINEUP['airflo-superflo-ridge-universal'],
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
    sizes: LINEUP['airflo-smr-streamer-max-short'].sizes.map((size) => {
      const { weight, head } = size;
      const rate = Number(size.density.replace('sink', ''));
      const s = head / 27;
      const front = half(4 * s);
      const back = half(7 * s);
      const tip = half(17.5 * s);
      const belly = half(5.5 * s);
      const { name, bellyColor, running } = STREAMER_MAX_COLORWAYS[rate];
      return {
        id: `wf${weight}-s${rate}`,
        label: `WF${weight} Sink ${rate}`,
        type: 'sinktip',
        weight,
        taper: [front, head - front - back, back, size.total - head],
        estimated: true,
        lineup: size,
        colorways: [{ id: 'standard', name, zones: zones([tip, 'airflo-black'], [belly, bellyColor], [0, running]) }],
      };
    }),
  }),
  // Di3, Di5 and Di7 sink at 3, 5 and 7 ips; all black with orange hang markers. Sold in split
  // ratings (#5/6 … #8/9) and drawn at the heavier weight (the lineup lists the lower), since every
  // size runs heavy for its lower number. Split from the #6/7 diagram. Di8 is also sold but would
  // draw the same as Di7, so it's left out.
  makerProduct({
    id: 'airflo-sixth-sense',
    maker: 'Airflo',
    name: 'Airflo Sixth Sense 2 Sinking',
    sizes: SIXTH_SENSE.sizes
      .filter((size) => size.density !== 'sink8')
      .map((size) => {
        const rate = Number(size.density.replace('sink', ''));
        const weight = size.weight + 1;
        return {
          id: `wf${weight}-di${rate}`,
          label: `WF${weight - 1}/${weight} Di${rate}`,
          type: size.density,
          weight,
          taper: [...SIXTH_SENSE_SPLIT, size.total - size.head],
          lineup: overriding(size, { weight }),
          colorways: [{ id: 'black', name: 'Black', zones: zones([0, 'airflo-sinking-black']) }],
        };
      }),
  }),
  // 1.5 ips on a clear mono core; sold in the UK as Delta Taper Clear Intermediate. Split from the
  // WF5 diagram. Clear or camo over the whole line.
  makerProduct({
    id: 'airflo-stillwater-intermediate',
    maker: 'Airflo',
    name: 'Airflo Stillwater Intermediate',
    sizes: DELTA.sizes.map((size) => ({
      id: `wf${size.weight}`,
      label: `WF${size.weight}I`,
      type: 'intermediate',
      weight: size.weight,
      taper: [...DELTA_SPLIT, size.total - size.head],
      lineup: size,
      colorways: [
        { id: 'clear', name: 'Clear', zones: zones([0, 'airflo-clear']) },
        { id: 'camo', name: 'Camouflage', zones: zones([0, 'airflo-camo']) },
      ],
    })),
  }),
];
