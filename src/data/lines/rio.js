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
  { id: 'rio-ivory', name: 'Ivory', hex: '#e9e5d3' },
  { id: 'rio-light-gray', name: 'Light Gray', hex: '#cfccc4' },
  { id: 'rio-electric-green', name: 'Electric Green', hex: '#b4e01c' },
  { id: 'rio-mint', name: 'Mint', hex: '#d2e6ab' },
  { id: 'rio-green', name: 'Green', hex: '#5bcf5e' },
  { id: 'rio-dark-green', name: 'Green', hex: '#5a5d38' },
  { id: 'rio-sage', name: 'Green', hex: '#6c776b' },
  { id: 'rio-blaze-orange', name: 'Blaze Orange', hex: '#fb5a2b' },
  { id: 'rio-orange', name: 'Orange', hex: '#f26b2c' },
  { id: 'rio-trans-orange', name: 'Trans Orange', hex: '#f1b79c' },
  { id: 'rio-salmon', name: 'Salmon', hex: '#e0a3ab' },
  { id: 'rio-red', name: 'Red', hex: '#df3944' },
  { id: 'rio-peach', name: 'Peach', hex: '#f5cb92' },
  { id: 'rio-tan', name: 'Tan', hex: '#c99c75' },
  { id: 'rio-khaki', name: 'Khaki', hex: '#d3c98f' },
  { id: 'rio-camo', name: 'Camo', hex: '#6f6a45' },
  { id: 'rio-olive', name: 'Olive', hex: '#8e8d55' },
  { id: 'rio-kelp', name: 'Kelp', hex: '#66692f' },
  { id: 'rio-beige', name: 'Beige', hex: '#cbc5b2' },
  { id: 'rio-dark-sand', name: 'Dark Sand', hex: '#c4bb92' },
  { id: 'rio-light-sand', name: 'Light Sand', hex: '#e6dbae' },
  { id: 'rio-pale-yellow', name: 'Pale Yellow', hex: '#efe58f' },
  { id: 'rio-lemon-green', name: 'Lemon Green', hex: '#c2d67a' },
  { id: 'rio-lumalux-green', name: 'Lumalux Green', hex: '#cfe4c6' },
  { id: 'rio-glacial', name: 'Glacial', hex: '#9fd9c2' },
  { id: 'rio-aqua', name: 'Aqua', hex: '#3fc4b5' },
  { id: 'rio-teal', name: 'Teal', hex: '#5fb2a5' },
  { id: 'rio-sky-blue', name: 'Sky Blue', hex: '#bcd5ea' },
  { id: 'rio-pale-blue', name: 'Blue', hex: '#a9c7d0' },
  { id: 'rio-blue', name: 'Blue', hex: '#4fa9dc' },
  { id: 'rio-deep-blue', name: 'Blue', hex: '#1f80bd' },
  { id: 'rio-white', name: 'White', hex: '#eef0f2' },
];

// Old preset ids that are now sizes with another id (old → new).
export const LEGACY_IDS = { 'rio-technical-euro-nymph': 'rio-technical-euro-nymph-2-5' };

const half = (ft) => Math.round(ft * 2) / 2;
const sum = (ft) => ft.reduce((a, b) => a + b, 0);

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

// The rest of the RIO lines come from the same two sources: head and total length per size from
// RIO's spec table, and the split of the head from the example size on RIO's taper diagram. A taper
// is that diagram's [front, body, back] in feet and the weight it was drawn for (none when it is
// borrowed from another line). A colorway lists [length, color] tip first at the diagram's head
// length; the last color runs to the end of the line. Each size scales both to its own head, to
// the nearest half foot, and is marked estimated unless it is the diagram's example.
const colorway = (id, name, ...pairs) => ({ id, name, pairs });

const scaleZones = (pairs, at) => {
  let end = 0;
  let prev = 0;
  return zones(
    ...pairs.map(([length, color]) => {
      if (length === 0) return [0, color];
      end += length;
      const to = at(end);
      const out = [to - prev, color];
      prev = to;
      return out;
    }),
  );
};

const sized = ({ taper: { split, example }, colorways }, { id, label, type, weight, head, total }) => {
  const at = (ft) => half((ft * head) / sum(split));
  const front = at(split[0]);
  const back = at(split[2]);
  return {
    id,
    label,
    type,
    weight,
    taper: [front, head - front - back, back, total - head],
    estimated: weight !== example,
    colorways: (typeof colorways === 'function' ? colorways(weight) : colorways).map(({ id: cwId, name, pairs }) => ({ id: cwId, name, zones: scaleZones(pairs, at) })),
  };
};

// A line sold in several densities: `sizes` is the spec table as [weight, head, total] rows, and
// each density says which weights it is made in (all of them by default). Sizes are listed by
// weight, densities in the order given. `keep` overrides fields of a size by its id.
const rio = ({ id, name, sizes, densities, keep = {} }) =>
  makerProduct({
    id,
    maker: 'RIO',
    name,
    sizes: densities
      .flatMap((d) =>
        sizes
          .filter(([weight]) => !d.weights || d.weights.includes(weight))
          .map(([weight, head, total]) => sized(d, { id: d.id(weight), label: d.label(weight), type: d.type, weight, head, total: d.total ?? total })),
      )
      .sort((a, b) => a.weight - b.weight)
      .map((size) => ({ ...size, ...keep[size.id] })),
  });

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const float = (taper, ...colorways) => ({ id: (w) => `wf${w}f`, label: (w) => `WF${w}F`, type: 'floating', taper, colorways });
const intermediate = (taper, ...colorways) => ({ id: (w) => `wf${w}i`, label: (w) => `WF${w}I`, type: 'intermediate', taper, colorways });
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
// A floating or intermediate line with a sinking or multi-density head, e.g. "WF8 F/H/I".
const tip = (densities, taper, ...colorways) => ({
  id: (w) => `wf${w}-${slug(densities)}`,
  label: (w) => `WF${w} ${densities}`,
  type: 'sinktip',
  taper,
  colorways,
});

// Premier OutBound Short. RIO's WF8F diagram: front 6'1", body 6'9" plus a 12'2" back body, back
// taper 4' plus 1'. Every size has a 30 ft head. Clear tips are 15 ft, from RIO's description.
// Int/3/5 and Int/5/7 look the same (a black head on Trans Green), so a saved setup with either
// comes back as Int/3/5.
const OUTBOUND = { split: [6, 19, 5], example: 8 };
const outboundShort = rio({
  id: 'rio-premier-outbound-short',
  name: 'RIO Premier OutBound Short',
  sizes: range(5, 12).map((w) => [w, 30, 100]),
  densities: [
    { ...float(OUTBOUND, colorway('moss-ivory', 'Moss/Ivory', [30, 'rio-moss'], [0, 'rio-ivory'])), weights: range(5, 10) },
    { ...tip('F/H/I', { split: OUTBOUND.split }, colorway('clear-moss-ivory', 'Clear/Moss/Ivory', [15, 'rio-clear'], [15, 'rio-moss'], [0, 'rio-ivory'])), weights: range(5, 10) },
    { ...intermediate({ split: OUTBOUND.split }, colorway('clear-gray-trans-green', 'Clear/Gray/Trans. Green', [15, 'rio-clear'], [15, 'rio-grey'], [0, 'rio-light-teal'])), weights: range(6, 12) },
    { ...tip('Int/3/5', { split: OUTBOUND.split }, colorway('black-trans-green', 'Black/Trans Green', [30, 'rio-black'], [0, 'rio-light-teal'])), weights: range(6, 10) },
    { ...tip('Int/5/7', { split: OUTBOUND.split }, colorway('black-trans-green', 'Black/Trans Green', [30, 'rio-black'], [0, 'rio-light-teal'])), weights: range(6, 10) },
    // Full 7 ips sinking line, 110 ft, black end to end.
    { id: (w) => `wf${w}s7`, label: (w) => `WF${w} Sink 7`, type: 'sink7', taper: { split: OUTBOUND.split }, colorways: [colorway('black', 'Black', [0, 'rio-black'])], weights: range(8, 12), total: 110 },
  ],
});

// Elite Gold. RIO's WF5F diagram has the same split as Premier Gold; the colors change at 20 ft and
// 40.5 ft, partway down the back taper.
const eliteGold = rio({
  id: 'rio-elite-gold',
  name: 'RIO Elite Gold',
  sizes: [
    [4, 46, 90],
    [5, 47, 90],
    [6, 48, 90],
    [7, 49, 100],
    [8, 50, 100],
  ],
  densities: [float({ split: GOLD_SPLIT, example: 5 }, colorway('moss-gold-gray', 'Moss/Gold/Gray', [20, 'rio-moss'], [20.5, 'rio-yellow'], [0, 'rio-light-gray']))],
});

// Elite Flats Pro. RIO's WF10 diagrams (floating, F/I 15 ft, StealthTip F/I 6 ft and intermediate)
// share one split: front taper 6, front body 6 and body 14, back taper 24.
const FLATS = { split: [6, 20, 24], example: 10 };
const flatsPro = rio({
  id: 'rio-elite-flats-pro',
  name: 'RIO Elite Flats Pro',
  sizes: [
    [6, 48, 100],
    [7, 49, 100],
    [8, 49, 100],
    [9, 50, 100],
    [10, 50, 100],
    [11, 50, 100],
    [12, 50, 100],
  ],
  densities: [
    float(
      FLATS,
      colorway('aqua-orange-light-sand', 'Aqua/Orange/Light Sand', [20, 'rio-aqua'], [18, 'rio-orange'], [0, 'rio-light-sand']),
      colorway('gray-light-sand-kelp', 'Gray/Light Sand/Kelp', [20, 'rio-grey'], [18, 'rio-light-sand'], [0, 'rio-kelp']),
    ),
    tip('F/I 6 ft', FLATS, colorway('clear-aqua-orange-light-sand', 'Clear/Aqua/Orange/Light Sand', [6, 'rio-clear'], [14, 'rio-aqua'], [18, 'rio-orange'], [0, 'rio-light-sand'])),
    { ...tip('F/I 15 ft', FLATS, colorway('clear-aqua-orange-light-sand', 'Clear/Aqua/Orange/Light Sand', [15, 'rio-clear'], [4, 'rio-aqua'], [19, 'rio-orange'], [0, 'rio-light-sand'])), weights: range(7, 12) },
    { ...intermediate(FLATS, colorway('clear-trans-orange-trans-aqua', 'Clear/Trans Orange/Trans Aqua', [15, 'rio-clear'], [23, 'rio-trans-orange'], [0, 'rio-light-teal'])), weights: range(8, 12) },
  ],
});

// Elite Predator and Elite Warmwater Predator share RIO's WF8 diagrams: floating front 3+13, body
// 4+11, back 3; the 3D (F/H/I) and F/S5/S7 heads taper over the front 10 ft and carry a 21 ft body.
// RIO draws no F/I/S3, so it borrows the 3D split. Heads are yellow from 20 ft to the end of the head.
const PREDATOR_FLOAT = { split: [16, 15, 3], example: 8 };
const PREDATOR_3D = { split: [10, 21, 3], example: 8 };
const PREDATOR_SIZES = [
  [5, 36, 100],
  [6, 36, 100],
  [7, 34, 100],
  [8, 34, 100],
  [9, 34, 100],
  [10, 32, 100],
  [11, 32, 100],
];
const elitePredator = rio({
  id: 'rio-elite-predator',
  name: 'RIO Elite Predator',
  sizes: PREDATOR_SIZES,
  densities: [
    float(PREDATOR_FLOAT, colorway('olive-yellow-beige', 'Olive/Yellow/Beige', [20, 'rio-olive'], [14, 'rio-pale-yellow'], [0, 'rio-beige'])),
    tip('F/H/I', PREDATOR_3D, colorway('gray-camo-yellow-beige', 'Gray/Camo/Yellow/Beige', [10, 'rio-light-gray'], [10, 'rio-camo'], [14, 'rio-pale-yellow'], [0, 'rio-beige'])),
    tip('F/I/S3', { split: PREDATOR_3D.split }, colorway('black-gray-yellow-beige', 'Black/Gray/Yellow/Beige', [10, 'rio-black'], [10, 'rio-grey'], [14, 'rio-pale-yellow'], [0, 'rio-beige'])),
    { ...tip('F/S5/S7', { split: PREDATOR_3D.split }, colorway('black-yellow-beige', 'Black/Yellow/Beige', [20, 'rio-black'], [14, 'rio-pale-yellow'], [0, 'rio-beige'])), weights: range(6, 11) },
  ],
});
const warmwaterPredator = rio({
  id: 'rio-elite-warmwater-predator',
  name: 'RIO Elite Warmwater Predator',
  sizes: PREDATOR_SIZES.filter(([w]) => w >= 6 && w <= 10),
  densities: [
    float(PREDATOR_FLOAT, colorway('sand-yellow-blue', 'Sand/Yellow/Blue', [20, 'rio-light-sand'], [14, 'rio-pale-yellow'], [0, 'rio-pale-blue'])),
    tip('F/H/I', PREDATOR_3D, colorway('clear-sand-yellow-blue', 'Clear/Sand/Yellow/Blue', [10, 'rio-clear'], [10, 'rio-light-sand'], [14, 'rio-pale-yellow'], [0, 'rio-pale-blue'])),
    tip('F/I/S3', { split: PREDATOR_3D.split }, colorway('black-gray-yellow-blue', 'Black/Gray/Yellow/Blue', [10, 'rio-black'], [10, 'rio-grey'], [14, 'rio-pale-yellow'], [0, 'rio-pale-blue'])),
    tip('F/S5/S7', PREDATOR_3D, colorway('black-yellow-blue', 'Black/Yellow/Blue', [20, 'rio-black'], [14, 'rio-pale-yellow'], [0, 'rio-pale-blue'])),
  ],
});

// Elite Tropical OutBound Short. RIO's WF8F diagram: front 6, body 7 plus a 12 ft back body, back
// taper 4 plus 1. RIO gives no clear tip lengths; they follow Premier OutBound Short's 15 ft.
const TROPICAL = { split: [6, 19, 5], example: 8 };
const tropicalOutbound = rio({
  id: 'rio-elite-tropical-outbound-short',
  name: 'RIO Elite Tropical OutBound Short',
  sizes: range(8, 12).map((w) => [w, 30, 100]),
  densities: [
    float(TROPICAL, colorway('dark-sand-blue', 'Dark Sand/Blue', [30, 'rio-dark-sand'], [0, 'rio-blue'])),
    tip('F/H/I', { split: TROPICAL.split }, colorway('clear-dark-sand-blue', 'Clear/Dark Sand/Blue', [15, 'rio-clear'], [15, 'rio-dark-sand'], [0, 'rio-blue'])),
    intermediate({ split: TROPICAL.split }, colorway('clear-gray-trans-blue', 'Clear/Gray/Trans Blue', [15, 'rio-clear'], [15, 'rio-grey'], [0, 'rio-blue'])),
    tip('Int/5/7', { split: TROPICAL.split }, colorway('black-trans-blue', 'Black/Trans Blue', [30, 'rio-black'], [0, 'rio-blue'])),
  ],
});

// Premier StreamerTip. RIO's WF7F/I diagram: 10 ft clear tip (front 6, body 8), 12 ft back body,
// back taper 4 (it also draws a 1 ft step that would make the head 31 ft; RIO's table says 30).
const STREAMER_TIP = { split: [6, 20, 4], example: 7 };
const streamerTip = rio({
  id: 'rio-premier-streamertip',
  name: 'RIO Premier StreamerTip',
  sizes: range(5, 8).map((w) => [w, 30, 100]),
  densities: [
    tip('F/I', STREAMER_TIP, colorway('clear-yellow-pale-green', 'Clear/Yellow/Pale Green', [10, 'rio-clear'], [20, 'rio-yellow'], [0, 'rio-mint'])),
    tip('F/S6', { split: STREAMER_TIP.split }, colorway('black-yellow-pale-green', 'Black/Yellow/Pale Green', [10, 'rio-black'], [20, 'rio-yellow'], [0, 'rio-mint'])),
  ],
});

// Premier 24ft Sink Tip. RIO's 150 gr (WF5) diagram: 24 ft black sinking tip, 6 ft body, 4 ft back
// taper on 66 ft of running line; the tip's own taper is about 3.5 ft as drawn. RIO's table lists
// only the 24 ft tip, so the other sizes keep the 34 ft head. Each sink rate has its own running
// line color.
const SINK_TIP = { split: [3.5, 26.5, 4], example: 5 };
const sinkTip24 = makerProduct({
  id: 'rio-premier-24ft-sink-tip',
  maker: 'RIO',
  name: 'RIO Premier 24ft Sink Tip',
  sizes: [
    [5, 'F/S4', 'black-blue', 'Black/Blue', 'rio-deep-blue'],
    [6, 'F/S5', 'black-yellow', 'Black/Yellow', 'rio-yellow'],
    [7, 'F/S6', 'black-orange', 'Black/Orange', 'rio-orange'],
    [8, 'F/S7', 'black-white', 'Black/White', 'rio-white'],
    [9, 'F/S8', 'black-green', 'Black/Green', 'rio-mint'],
    [10, 'F/S8', 'black-teal', 'Black/Teal', 'rio-teal'],
  ].map(([weight, densities, id, name, running]) =>
    sized(
      { taper: SINK_TIP, colorways: [colorway(id, name, [24, 'rio-black'], [0, running])] },
      { id: `wf${weight}-${slug(densities)}`, label: `WF${weight} ${densities}`, type: 'sinktip', weight, head: 34, total: 100 },
    ),
  ),
});

// Elite Gold XP and Premier Gold XP. RIO's WF5F diagram: front 5.5, body 21.5, back 15. Elite is
// moss to 19 ft then Electric Green to the end of the head; Premier is a moss head on an Electric
// Green running line.
const GOLD_XP = { split: [5.5, 21.5, 15], example: 5 };
const GOLD_XP_HEADS = [
  [3, 40],
  [4, 41],
  [5, 42],
  [6, 43],
  [7, 44],
  [8, 45],
];
const eliteGoldXp = rio({
  id: 'rio-elite-gold-xp',
  name: 'RIO Elite Gold XP',
  sizes: GOLD_XP_HEADS.map(([w, head]) => [w, head, w === 3 ? 80 : w >= 7 ? 100 : 90]),
  densities: [float(GOLD_XP, colorway('moss-electric-green-gray', 'Moss/Electric Green/Gray', [19, 'rio-moss'], [23, 'rio-electric-green'], [0, 'rio-light-gray']))],
});
const premierGoldXp = rio({
  id: 'rio-premier-gold-xp',
  name: 'RIO Premier Gold XP',
  sizes: GOLD_XP_HEADS.map(([w, head]) => [w, head, w === 3 ? 80 : 90]),
  densities: [float(GOLD_XP, colorway('moss-electric-green', 'Moss/Electric Green', [42, 'rio-moss'], [0, 'rio-electric-green']))],
});

// Elite Bonefish. RIO's WF8F diagram: front 6.5, body 31, back 12 on 50.5 ft of running line. The
// front color runs to 20 ft and the body color to the back taper.
const eliteBonefish = rio({
  id: 'rio-elite-bonefish',
  name: 'RIO Elite Bonefish',
  sizes: [
    [6, 46.5, 90],
    [7, 48.5, 100],
    [8, 49.5, 100],
    [9, 49.5, 100],
  ],
  densities: [
    float(
      { split: [6.5, 31, 12], example: 8 },
      colorway('light-sand-orange-blue', 'Light Sand/Orange/Blue', [20, 'rio-light-sand'], [17.5, 'rio-orange'], [0, 'rio-pale-blue']),
      colorway('yellow-black-aqua', 'Yellow/Black/Aqua', [20, 'rio-yellow'], [17.5, 'rio-black'], [0, 'rio-aqua']),
    ),
  ],
});

// Premier Striper. RIO's WF9F and WF9I diagram: front 3+13, body 11, back 3, then a 12 ft handling
// section on the running line. The sinking lines are sold by grain weight (rated for two rod
// weights; listed at the lower) with a 35 ft black head on an intermediate running line; RIO draws
// no diagram for them, so they scale the floating split.
const STRIPER = { split: [16, 11, 3], example: 9 };
const striperSink = (grains, weight, ips, id, name, running) =>
  sized(
    { taper: { split: STRIPER.split }, colorways: [colorway(id, name, [30, 'rio-black'], [0, running])] },
    { id: `${grains}gr`, label: `${grains}gr Int/${ips}`, type: 'sinktip', weight, head: 35, total: 100 },
  );
const premierStriper = makerProduct({
  id: 'rio-premier-striper',
  maker: 'RIO',
  name: 'RIO Premier Striper',
  sizes: [
    ...[8, 9, 10].flatMap((weight) => [
      sized({ taper: STRIPER, colorways: [colorway('blue-yellow', 'Blue/Yellow', [30, 'rio-blue'], [0, 'rio-pale-yellow'])] }, { id: `wf${weight}f`, label: `WF${weight}F`, type: 'floating', weight, head: 30, total: 100 }),
      sized({ taper: STRIPER, colorways: [colorway('clear-lumalux-green', 'Clear/Lumalux Green', [30, 'rio-clear'], [0, 'rio-lumalux-green'])] }, { id: `wf${weight}i`, label: `WF${weight}I`, type: 'intermediate', weight, head: 30, total: 100 }),
    ]),
    striperSink(250, 7, '6.5', 'black-gray', 'Black/Gray', 'rio-grey'),
    striperSink(300, 8, '7.2', 'black-salmon', 'Black/Salmon', 'rio-salmon'),
    striperSink(350, 9, '8.2', 'black-blue', 'Black/Blue', 'rio-blue'),
    striperSink(400, 10, '8.5', 'black-yellow', 'Black/Yellow', 'rio-pale-yellow'),
    striperSink(450, 11, '9.0', 'black-tan', 'Black/Tan', 'rio-tan'),
  ].sort((a, b) => a.weight - b.weight),
});

// Premier Creek. RIO's WF3F diagram: front 6, body 5+5, back 14, then an 8 ft handling section.
const premierCreek = rio({
  id: 'rio-premier-creek',
  name: 'RIO Premier Creek',
  sizes: [
    [0, 30, 65],
    [1, 30, 65],
    [2, 30, 65],
    [3, 30, 75],
    [4, 30, 75],
    [5, 30, 80],
  ],
  densities: [float({ split: [6, 10, 14], example: 3 }, colorway('green-yellow', 'Green/Yellow', [30, 'rio-dark-green'], [0, 'rio-lemon-green']))],
});

// Elite and Premier Technical Trout. RIO's WF5F diagrams: front 10, body 10+7, back 13+12. Elite is
// Sky Blue to 20 ft and Peach to 46 ft on a gray running line; Premier is Sky Blue to 46 ft.
const TECH_TROUT = { split: [10, 17, 25], example: 5 };
const TECH_TROUT_HEADS = [
  [3, 45, 80],
  [4, 49, 90],
  [5, 52, 90],
  [6, 54, 90],
];
const eliteTechnicalTrout = rio({
  id: 'rio-elite-technical-trout',
  name: 'RIO Elite Technical Trout',
  sizes: TECH_TROUT_HEADS,
  densities: [float(TECH_TROUT, colorway('sky-blue-peach-gray', 'Sky Blue/Peach/Gray', [20, 'rio-sky-blue'], [26, 'rio-peach'], [0, 'rio-light-gray']))],
});
const premierTechnicalTrout = rio({
  id: 'rio-premier-technical-trout-wf',
  name: 'RIO Premier Technical Trout WF',
  sizes: TECH_TROUT_HEADS,
  densities: [float(TECH_TROUT, colorway('sky-blue-peach', 'Sky Blue/Peach', [46, 'rio-sky-blue'], [0, 'rio-peach']))],
});

// Elite Xtreme Indicator. RIO's WF6F diagram: front 3+2+4, body 24, back 15+1 on 51 ft of running
// line. RIO's table gives a 33 ft head for every size, which is the front and body without the
// back taper, so every size has the diagram's 49 ft head. Totals follow the table (it says 90 ft
// for WF6F; the diagram says 100). A 3 ft orange tip, moss to 33 ft.
const xtremeIndicator = rio({
  id: 'rio-elite-xtreme-indicator',
  name: 'RIO Elite Xtreme Indicator',
  sizes: [
    [5, 49, 90],
    [6, 49, 90],
    [7, 49, 100],
    [8, 49, 100],
    [9, 49, 100],
  ],
  densities: [float({ split: [9, 24, 16], example: 6 }, colorway('orange-moss-yellow', 'Orange/Moss/Yellow', [3, 'rio-orange'], [30, 'rio-moss'], [0, 'rio-pale-yellow']))],
});

// Elite Single-Handed Spey. RIO's WF5F/H/I diagram: front 18, body 5+3+4, back 3, then an 8 ft
// handling section; RIO's table gives every size a 33 ft head. The floating diagram draws a 4 ft
// back taper (34 ft head), so the floating sizes use the F/H/I split and are all estimated. The
// F/H/I has 10 ft of intermediate (gray) at the tip, then 10 ft of hover (glacial).
const SPEY = { split: [18, 12, 3], example: 5 };
const singleHandSpey = rio({
  id: 'rio-elite-single-handed-spey',
  name: 'RIO Elite Single-Handed Spey',
  sizes: range(3, 8).map((w) => [w, 33, w === 3 ? 80 : 90]),
  densities: [
    float({ split: SPEY.split }, colorway('peach-camo', 'Peach/Camo', [33, 'rio-peach'], [0, 'rio-camo'])),
    tip('F/H/I', SPEY, colorway('gray-glacial-peach-camo', 'Gray/Glacial/Peach/Camo', [10, 'rio-light-gray'], [10, 'rio-glacial'], [13, 'rio-peach'], [0, 'rio-camo'])),
  ],
});

// Elite Indicator. RIO's WF6F diagram: front 6, body 17+13, back 16. White to 19 ft, red to 42.5 ft.
const eliteIndicator = rio({
  id: 'rio-elite-indicator',
  name: 'RIO Elite Indicator',
  sizes: [
    [4, 48, 90],
    [5, 50, 90],
    [6, 52, 90],
    [7, 54, 100],
    [8, 56, 100],
  ],
  densities: [float({ split: [6, 30, 16], example: 6 }, colorway('white-red-gray', 'White/Red/Gray', [19, 'rio-white'], [23.5, 'rio-red'], [0, 'rio-light-gray']))],
});

// Mainstream Trout WF. RIO publishes no diagram, so the split borrows Gold XP's proportions. One color.
const mainstreamTrout = rio({
  id: 'rio-mainstream-trout-wf',
  name: 'RIO Mainstream Trout WF',
  sizes: range(3, 8).map((w) => [w, 33 + w, 80]),
  densities: [float({ split: GOLD_XP.split }, colorway('lemon-green', 'Lemon Green', [0, 'rio-lemon-green']))],
});

// Elite Gold Max and Premier Gold Max. RIO's WF5F diagram: front 4, body 28.5, back 4.5 on 53 ft of
// running line. Elite is Mint to 18.5 ft then Green to the end of the head; its Camo colorway
// (camo head, khaki running line) is made in WF4–8 only. Premier is a Mint head.
const GOLD_MAX = { split: [4, 28.5, 4.5], example: 5 };
const GOLD_MAX_HEADS = range(4, 9).map((w) => [w, 32 + w]);
const eliteGoldMax = rio({
  id: 'rio-elite-gold-max',
  name: 'RIO Elite Gold Max',
  sizes: GOLD_MAX_HEADS.map(([w, head]) => [w, head, w >= 7 ? 100 : 90]),
  densities: [
    {
      ...float(GOLD_MAX),
      colorways: (w) => [
        colorway('mint-green-blaze-orange', 'Mint/Green/Blaze Orange', [18.5, 'rio-mint'], [18.5, 'rio-green'], [0, 'rio-blaze-orange']),
        ...(w <= 8 ? [colorway('camo', 'Camo', [37, 'rio-camo'], [0, 'rio-khaki'])] : []),
      ],
    },
  ],
});
const premierGoldMax = rio({
  id: 'rio-premier-gold-max',
  name: 'RIO Premier Gold Max',
  sizes: GOLD_MAX_HEADS.map(([w, head]) => [w, head, 90]),
  densities: [float(GOLD_MAX, colorway('mint-blaze-orange', 'Mint/Blaze Orange', [37, 'rio-mint'], [0, 'rio-blaze-orange']))],
});

// Premier Fathom. RIO's WF7S6 diagram: front 4+2, body 21, back 8 on 70 ft of running line; every
// size has a 35 ft head on a 105 ft line. A black head on a running line colored by sink rate. The
// WF8 Sink 5 and Sink 7 keep the split they had before this diagram (6/22/7) so saved setups still
// match. 6 ips sits between Type 5 and Type 7; RIO calls it Fast Sink, as it does 5 ips elsewhere,
// so it draws as Type 5.
const FATHOM = { split: [6, 21, 8], example: 7 };
const fathomRate = (rate, type, id, name, running) => ({
  id: (w) => `wf${w}s${rate}`,
  label: (w) => `WF${w} Sink ${rate}`,
  type,
  taper: rate === 6 ? FATHOM : { split: FATHOM.split },
  colorways: [colorway(id, name, [35, 'rio-black'], [0, running])],
});
const fathom = rio({
  id: 'rio-premier-fathom',
  name: 'RIO Premier Fathom',
  sizes: range(5, 8).map((w) => [w, 35, 105]),
  densities: [
    fathomRate(3, 'sink3', 'black-blue', 'Black/Blue', 'rio-deep-blue'),
    fathomRate(5, 'sink5', 'black-maroon', 'Black/Maroon', 'rio-maroon'),
    fathomRate(6, 'sink5', 'black-green', 'Black/Green', 'rio-sage'),
    { ...fathomRate(7, 'sink7', 'black-grey', 'Black/Grey', 'rio-grey'), weights: range(6, 8) },
  ],
  keep: { wf8s5: { taper: [6, 22, 7, 70] }, wf8s7: { taper: [6, 22, 7, 70] } },
});

// Premier AquaLux, 1.5–2 ips. RIO's WF6I diagram: front 4+2, body 22, back 2 on 70 ft of running
// line. The WF8I keeps the split it had before (4/22/4, from a retailer's copy of an older diagram)
// so saved setups still match. The whole head is clear.
const aquaLux = rio({
  id: 'rio-premier-aqualux',
  name: 'RIO Premier AquaLux',
  sizes: [
    [4, 30, 90],
    [5, 30, 90],
    [6, 30, 100],
    [7, 30, 100],
    [8, 30, 100],
  ],
  densities: [intermediate({ split: [6, 22, 2], example: 6 }, colorway('clear-light-teal', 'Clear/Light Teal', [30, 'rio-clear'], [0, 'rio-light-teal']))],
  keep: { wf8i: { taper: [4, 22, 4, 70], estimated: false } },
});

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
  outboundShort,
  eliteGold,
  flatsPro,
  elitePredator,
  tropicalOutbound,
  streamerTip,
  sinkTip24,
  eliteGoldXp,
  eliteBonefish,
  premierStriper,
  premierCreek,
  eliteTechnicalTrout,
  xtremeIndicator,
  fathom,
  warmwaterPredator,
  premierGoldXp,
  singleHandSpey,
  eliteIndicator,
  mainstreamTrout,
  eliteGoldMax,
  premierGoldMax,
  premierTechnicalTrout,
  aquaLux,
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
