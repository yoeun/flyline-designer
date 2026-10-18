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
  // Superflo Max Smooth Power Taper, Superflo Max Ridge 2.0 Tactical Taper and the Ultra Supple
  // tapers, sampled from their taper diagrams. Airflo names no color for the Tactical Taper (one
  // colorway, sold without a color option), so its two are named here from the diagram.
  { id: 'airflo-sunburst', name: 'Sunburst', hex: '#de8e52' },
  { id: 'airflo-purple', name: 'Purple', hex: '#bc82ac' },
  { id: 'airflo-camo-green', name: 'Camo', hex: '#968242' },
  { id: 'airflo-caddis', name: 'Caddis', hex: '#c5ae82' },
  { id: 'airflo-pt-chartreuse', name: 'Chartreuse', hex: '#89ad31' },
  { id: 'airflo-tactical-tan', name: 'Tan', hex: '#bc9b6e' },
  { id: 'airflo-tactical-olive', name: 'Olive', hex: '#a49e7f' },
  { id: 'airflo-pale-olive', name: 'Pale Olive', hex: '#829370' },
  { id: 'airflo-mint-green', name: 'Mint Green', hex: '#b7d5b9' },
  { id: 'airflo-pale-yellow', name: 'Pale Yellow', hex: '#dbce34' },
  { id: 'airflo-pale-blue', name: 'Pale Blue', hex: '#5b98b4' },
  { id: 'airflo-pale-tan', name: 'Pale Tan', hex: '#a78f77' },
  { id: 'airflo-pale-sunburst', name: 'Pale Sunburst', hex: '#e4aa19' },
  // Superflo Max Smooth Euro Nymph, Superflo Cold Salt Universal Intermediate, Ultra Supple
  // Indicator Taper and Super Trout, sampled from their taper diagrams.
  { id: 'airflo-hi-viz-orange', name: 'Hi-Viz Orange', hex: '#d4805c' },
  { id: 'airflo-euro-olive', name: 'Olive', hex: '#978c79' },
  { id: 'airflo-euro-clear', name: 'Clear', hex: '#c9c8cd' },
  { id: 'airflo-translucent-grey', name: 'Translucent Grey', hex: '#909090' },
  { id: 'airflo-pale-grey', name: 'Pale Grey', hex: '#b9b7b9' },
  { id: 'airflo-pale-orange', name: 'Pale Orange', hex: '#e19774' },
  { id: 'airflo-hot-coral', name: 'Hot Coral', hex: '#db574d' },
  { id: 'airflo-fire-orange', name: 'Fire Orange', hex: '#ca5645' },
  { id: 'airflo-st-olive', name: 'Olive', hex: '#988254' },
  { id: 'airflo-st-driftwood', name: 'Driftwood', hex: '#cbcadc' },
  // Superflo Max Ridge 2.0 Double' Double Taper, sampled from its taper diagram.
  { id: 'airflo-ddt-lichen-green', name: 'Lichen Green', hex: '#918649' },
  { id: 'airflo-ddt-tan', name: 'Tan', hex: '#a68365' },
];

const half = (ft) => Math.round(ft * 2) / 2;

// The front, body and back of a lineup size's published taper.
const split = ({ taper: { front, body, back } }) => [front, body, back];

// Airflo's diagrams give the split for one example size (named on the diagram); other sizes scale
// its front and back taper to their own head from Airflo's spec table, to the nearest half foot,
// and are marked estimated. The body is rounded to a tenth so a 70.7 ft head doesn't leave float noise.
const scaled = ([front, body, back], head) => {
  const s = head / (front + body + back);
  const f = half(front * s);
  const b = half(back * s);
  return [f, Math.round((head - f - b) * 10) / 10, b];
};

// A floating weight-forward line from its WF5 diagram's split: heads per size from Airflo's table
// (sizes without one are left out); the head color runs to the end of the rear taper and the haul
// zone behind it is drawn as running line. A colorway's `weights` are the sizes it's sold in.
const floating = (product, taper, colorways) =>
  product.sizes
    .filter((size) => size.head !== null)
    .map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: [...scaled(taper, size.head), size.total - size.head],
      estimated: !size.taper,
      lineup: size,
      colorways: colorways
        .filter(({ weights: [lo, hi] }) => size.weight >= lo && size.weight <= hi)
        .map(({ id, name, head: headColor, running }) => ({ id, name, zones: zones([size.head, headColor], [0, running]) })),
    }));

// Universal Taper, shared by Ridge 2.0, Superflo Max Ridge 2.0 and its Ultra Supple version. The
// split is the WF5 diagram's front taper, belly and rear belly, and rear taper.
const MAX_RIDGE_UNIVERSAL = LINEUP['airflo-smr-universal'];
const UNIVERSAL = split(lineupSize(MAX_RIDGE_UNIVERSAL, 'WF5F'));
const universal = (product, colorways) => floating(product, UNIVERSAL, colorways);

// Ultra Supple Universal Taper: the same taper and table as the Superflo Max Ridge 2.0 Universal in
// a cold-weather coating; its own WF5 diagram gives the same split.
const ULTRA_SUPPLE_UNIVERSAL = LINEUP['airflo-smr-ultra-supple-universal'];

// Tactical Taper, shared by Superflo Max Ridge 2.0 and its Ultra Supple Tailwater version: the WF5
// diagrams' front taper, belly and rear taper (20/16/10 ft), then a 10 ft haul zone.
const TACTICAL = LINEUP['airflo-smr-tactical'];
const TAILWATER = LINEUP['airflo-smr-ultra-supple-tailwater'];

// Superflo Max Smooth Power Taper. The split is the WF5 diagram's front taper; belly, belly taper
// and rear belly (5 + 11.5 + 3 ft); and rear taper, then a 12 ft haul zone.
const SMOOTH_POWER = LINEUP['airflo-sms-power'];

// Power Taper colorways, shared by Superflo Max Smooth and Superflo Max Ridge 2.0: Airflo's Ridge 2.0
// diagrams show the Smooth ones' split and colors, and the two tables match, so the Ridge 2.0 sizes
// draw exactly like the Smooth ones.
const POWER_COLORWAYS = [
  { id: 'sunburst-purple', name: 'Sunburst/Purple', weights: [3, 9], head: 'airflo-sunburst', running: 'airflo-purple' },
  { id: 'camo-caddis', name: 'Camo/Caddis', weights: [4, 8], head: 'airflo-camo-green', running: 'airflo-caddis' },
  { id: 'chartreuse-white', name: 'Chartreuse/White', weights: [5, 8], head: 'airflo-pt-chartreuse', running: 'airflo-white' },
];
const RIDGE_POWER = LINEUP['airflo-smr-power'];

// Universal Taper colorways, shared by Superflo Max Ridge 2.0 and Superflo Max Smooth: Airflo's
// Smooth page shows the Ridge 2.0 diagrams, and the two tables match, so the Smooth sizes draw
// exactly like the Ridge 2.0 ones.
const MAX_UNIVERSAL_COLORWAYS = [
  { id: 'moss-chartreuse', name: 'Moss/Chartreuse', weights: [3, 8], head: 'airflo-max-moss', running: 'airflo-max-chartreuse' },
  { id: 'chartreuse-white', name: 'Chartreuse/White', weights: [5, 8], head: 'airflo-max-head-chartreuse', running: 'airflo-white' },
  { id: 'lichen-driftwood', name: 'Lichen/Driftwood', weights: [3, 6], head: 'airflo-max-lichen', running: 'airflo-max-driftwood' },
];

// Superflo Max Ridge 2.0 Double' Double Taper, a reversible double taper sold 80 ft long in every
// size. The DT5 diagram's front taper, belly and rear taper (8/66/6 ft) apply to all of them; a
// double taper is all head, so the lineup leaves its head empty and the menu draws all of it as
// head. Lichen Green (the 8 ft taper's Ultra Supple end) blends into Tan (the 6 ft taper's
// standard end) from about 38 to 55 ft on the diagram, so the color changes at 46 ft.
const DOUBLE_DOUBLE = LINEUP['airflo-smr-double-double-taper'];
const DOUBLE_DOUBLE_SPLIT = split(lineupSize(DOUBLE_DOUBLE, 'DT5F'));

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

// Superflo Cold Salt Universal Intermediate has a 43 ft head in every size, so the WF8 diagram's
// front taper, belly to rear belly (6.5 + 3 + 10 ft) and rear taper apply to all of them; a 12 ft
// haul zone follows.
const COLD_SALT_INT = LINEUP['airflo-superflo-cold-salt-universal-int'];
const COLD_SALT_INT_SPLIT = split(lineupSize(COLD_SALT_INT, 'WF8I'));

// Ultra Supple Indicator Taper: the WF5 diagram's front taper, belly and rear taper (7/25/19.5 ft),
// the table's 51.5 ft head in every size.
const INDICATOR = LINEUP['airflo-smr-ultra-supple-indicator'];

// Super Trout: the WF5 diagram's front taper; belly and rear belly (14 + 15 ft); and rear taper. The
// diagram's 71 ft head is the table's 70.7 ft rounded, so every size, the WF5 too, takes the
// table's head.
const SUPER_TROUT = LINEUP['airflo-smr-super-trout'];

// Superflo Max Smooth Euro Nymph, a level 0.55 mm line sold in one size with no rated weight. Drawn
// like RIO's and SA's euro lines (see rio.js), whose 0.022″ is the same diameter: a token 1.5 ft
// head on Airflo's 82 ft total, as a 3 wt. Airflo's diagram shows 82.5 ft.
const EURO_OLIVE = lineupSize(LINEUP['airflo-sms-euro-nymph-olive'], '0.55 mm level');
const EURO_CLEAR = lineupSize(LINEUP['airflo-sms-euro-nymph-clear'], '0.55 mm level');
const euro = (size, colorway) => [
  {
    id: 'level',
    label: 'Level 0.55 mm',
    type: 'floating',
    weight: 3,
    taper: [0.5, 0.5, 0.5, size.total - 1.5],
    lineup: overriding(size, { weight: 3, head: 1.5 }),
    colorways: [colorway],
  },
];

export const PRODUCTS = [
  makerProduct({
    id: 'airflo-superflo-max-ridge-universal',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Universal Taper',
    sizes: universal(MAX_RIDGE_UNIVERSAL, MAX_UNIVERSAL_COLORWAYS),
  }),
  makerProduct({
    id: 'airflo-superflo-max-smooth-universal',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Smooth Universal Taper',
    sizes: universal(LINEUP['airflo-sms-universal'], MAX_UNIVERSAL_COLORWAYS),
  }),
  makerProduct({
    id: 'airflo-superflo-max-ridge-ultra-supple-universal',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Ultra Supple Universal Taper',
    sizes: floating(ULTRA_SUPPLE_UNIVERSAL, split(lineupSize(ULTRA_SUPPLE_UNIVERSAL, 'WF5F')), [
      { id: 'pale-olive-mint-green', name: 'Pale Olive/Mint Green', weights: [3, 8], head: 'airflo-pale-olive', running: 'airflo-mint-green' },
      { id: 'pale-yellow-white', name: 'Pale Yellow/White', weights: [3, 8], head: 'airflo-pale-yellow', running: 'airflo-white' },
    ]),
  }),
  makerProduct({
    id: 'airflo-superflo-max-ridge-tactical',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Tactical Taper',
    sizes: floating(TACTICAL, split(lineupSize(TACTICAL, 'WF5F')), [
      { id: 'tan-olive', name: 'Tan/Olive', weights: [2, 7], head: 'airflo-tactical-tan', running: 'airflo-tactical-olive' },
    ]),
  }),
  makerProduct({
    id: 'airflo-superflo-max-ridge-ultra-supple-tailwater',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Ultra Supple Tailwater Taper',
    sizes: floating(TAILWATER, split(lineupSize(TAILWATER, 'WF5F')), [
      { id: 'pale-blue-white', name: 'Pale Blue/White', weights: [2, 6], head: 'airflo-pale-blue', running: 'airflo-white' },
      { id: 'pale-tan-pale-sunburst', name: 'Pale Tan/Pale Sunburst', weights: [3, 5], head: 'airflo-pale-tan', running: 'airflo-pale-sunburst' },
    ]),
  }),
  makerProduct({
    id: 'airflo-superflo-max-smooth-power',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Smooth Power Taper',
    sizes: floating(SMOOTH_POWER, split(lineupSize(SMOOTH_POWER, 'WF5F')), POWER_COLORWAYS),
  }),
  makerProduct({
    id: 'airflo-superflo-max-ridge-power',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Power Taper',
    sizes: floating(RIDGE_POWER, split(lineupSize(RIDGE_POWER, 'WF5F')), POWER_COLORWAYS),
  }),
  makerProduct({
    id: 'airflo-superflo-max-ridge-double-double-taper',
    maker: 'Airflo',
    name: "Airflo Superflo Max Ridge 2.0 Double' Double Taper",
    sizes: DOUBLE_DOUBLE.sizes.map((size) => ({
      id: `dt${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: [...DOUBLE_DOUBLE_SPLIT, 0],
      estimated: !size.taper,
      lineup: overriding(size, { head: size.total }),
      colorways: [{ id: 'lichen-green-tan', name: 'Lichen Green/Tan', zones: zones([46, 'airflo-ddt-lichen-green'], [0, 'airflo-ddt-tan']) }],
    })),
  }),
  makerProduct({
    id: 'airflo-superflo-max-ridge-ultra-supple-indicator',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Ultra Supple Indicator Taper',
    sizes: floating(INDICATOR, split(lineupSize(INDICATOR, 'WF5F')), [
      { id: 'pale-grey-pale-orange', name: 'Pale Grey/Pale Orange', weights: [4, 8], head: 'airflo-pale-grey', running: 'airflo-pale-orange' },
      { id: 'hot-coral-white', name: 'Hot Coral/White', weights: [5, 8], head: 'airflo-hot-coral', running: 'airflo-white' },
    ]),
  }),
  // Fire Orange is one color over the whole line.
  makerProduct({
    id: 'airflo-superflo-max-ridge-super-trout',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Ridge 2.0 Super Trout',
    sizes: floating(SUPER_TROUT, split(lineupSize(SUPER_TROUT, 'WF5F')), [
      { id: 'olive-driftwood', name: 'Olive/Driftwood', weights: [4, 7], head: 'airflo-st-olive', running: 'airflo-st-driftwood' },
      { id: 'fire-orange', name: 'Fire Orange', weights: [5, 7], head: 'airflo-fire-orange', running: 'airflo-fire-orange' },
    ]),
  }),
  // The orange tip is 4 ft, per Airflo's diagram; the line can be reversed to fish the olive end.
  makerProduct({
    id: 'airflo-superflo-max-smooth-euro-nymph-olive',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Smooth Euro Nymph Olive',
    sizes: euro(EURO_OLIVE, { id: 'olive', name: 'Olive', zones: zones([4, 'airflo-hi-viz-orange'], [0, 'airflo-euro-olive']) }),
  }),
  // The same line on a 12 lb clear mono core.
  makerProduct({
    id: 'airflo-superflo-max-smooth-euro-nymph-clear',
    maker: 'Airflo',
    name: 'Airflo Superflo Max Smooth Euro Nymph Clear Mono Core',
    sizes: euro(EURO_CLEAR, { id: 'clear', name: 'Clear', zones: zones([0, 'airflo-euro-clear']) }),
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
  // 1.5 ips on a clear mono core; also sold as Stillwater Intermediate, but named here as the line
  // guide lists it so its card links to it. Split from the WF5 diagram. Clear or camo over the whole line.
  makerProduct({
    id: 'airflo-stillwater-intermediate',
    maker: 'Airflo',
    name: 'Airflo Delta Taper Clear Intermediate',
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
  // Translucent Grey over the whole line; Airflo gives no sink rate.
  makerProduct({
    id: 'airflo-superflo-cold-salt-universal-intermediate',
    maker: 'Airflo',
    name: 'Airflo Superflo Cold Salt Universal Intermediate',
    sizes: COLD_SALT_INT.sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: [...COLD_SALT_INT_SPLIT, size.total - size.head],
      lineup: size,
      colorways: [{ id: 'translucent-grey', name: 'Translucent Grey', zones: zones([0, 'airflo-translucent-grey']) }],
    })),
  }),
];
