import * as LINEUP from 'lineups:rio';
import { lineupSize, makerProduct, overriding, zones } from './product.js';

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
  { id: 'rio-sand-tan', name: 'Tan', hex: '#cbc1a6' },
  { id: 'rio-lt-green', name: 'Lt Green', hex: '#cde58f' },
  { id: 'rio-amber-gold', name: 'Gold', hex: '#dea222' },
  { id: 'rio-light-moss', name: 'Moss', hex: '#bcc08a' },
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
const goldSize = (size) => {
  const { weight, head, total } = size;
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
    lineup: size,
    colorways,
  };
};

// The rest of the RIO lines come from the same two sources: weight, head and total length per size
// from RIO's spec table (the lineup), and the split of the head from the example size on RIO's
// taper diagram. A taper is that diagram's [front, body, back] in feet and the weight it was drawn
// for (none when it is borrowed from another line). A colorway lists [length, color] tip first at
// the diagram's head length; the last color runs to the end of the line. Each size scales both to
// its own head, to the nearest half foot, and is marked estimated unless it is the diagram's example.
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

// A menu size `{ id, label, type }` drawn from a lineup size.
const sized = ({ taper: { split, example }, colorways }, { id, label, type }, size) => {
  const { weight, head, total } = size;
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
    lineup: size,
    colorways: (typeof colorways === 'function' ? colorways(weight) : colorways).map(({ id: cwId, name, pairs }) => ({ id: cwId, name, zones: scaleZones(pairs, at) })),
  };
};

// A line sold in several densities: `sizes` are its lineup sizes, and each density draws the ones
// RIO lists with its `sink` (the lineup's density label). Sizes are listed by weight, densities in
// the order given.
const rio = ({ id, name, sizes, densities }) =>
  makerProduct({
    id,
    maker: 'RIO',
    name,
    sizes: densities
      .flatMap((d) => sizes.filter((size) => size.densityLabel === d.sink).map((size) => sized(d, { id: d.id(size.weight), label: d.label(size.weight), type: d.type }, size)))
      .sort((a, b) => a.weight - b.weight),
  });

const float = (taper, ...colorways) => ({ sink: 'Floating', id: (w) => `wf${w}f`, label: (w) => `WF${w}F`, type: 'floating', taper, colorways });
const intermediate = (taper, ...colorways) => ({ sink: 'Intermediate', id: (w) => `wf${w}i`, label: (w) => `WF${w}I`, type: 'intermediate', taper, colorways });
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
// RIO's sink rates (as the lineup labels them) for the densities named in our size labels.
const TIP_SINKS = {
  'F/H/I': 'Float/1 ips/2 ips',
  'F/I/S3': 'Float/2 ips/3 ips',
  'F/S5/S7': 'Float/5 ips/7 ips',
  'Int/3/5': 'Intermediate/3 ips/5 ips',
  'Int/5/7': 'Intermediate/5 ips/7 ips',
  'F/I 6 ft': 'Float/6 ft intermediate tip',
  'F/I 15 ft': 'Float/15 ft intermediate tip',
  'F/I': 'Float/2 ips',
  'F/S6': 'Float/6 ips',
};
// A floating or intermediate line with a sinking or multi-density head, e.g. "WF8 F/H/I".
const tip = (densities, taper, ...colorways) => ({
  sink: TIP_SINKS[densities],
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
  sizes: LINEUP['rio-premier-outbound-short'].sizes,
  densities: [
    float(OUTBOUND, colorway('moss-ivory', 'Moss/Ivory', [30, 'rio-moss'], [0, 'rio-ivory'])),
    tip('F/H/I', { split: OUTBOUND.split }, colorway('clear-moss-ivory', 'Clear/Moss/Ivory', [15, 'rio-clear'], [15, 'rio-moss'], [0, 'rio-ivory'])),
    intermediate({ split: OUTBOUND.split }, colorway('clear-gray-trans-green', 'Clear/Gray/Trans. Green', [15, 'rio-clear'], [15, 'rio-grey'], [0, 'rio-light-teal'])),
    tip('Int/3/5', { split: OUTBOUND.split }, colorway('black-trans-green', 'Black/Trans Green', [30, 'rio-black'], [0, 'rio-light-teal'])),
    tip('Int/5/7', { split: OUTBOUND.split }, colorway('black-trans-green', 'Black/Trans Green', [30, 'rio-black'], [0, 'rio-light-teal'])),
    // Full 7 ips sinking line, 110 ft, black end to end.
    { sink: '7 ips', id: (w) => `wf${w}s7`, label: (w) => `WF${w} Sink 7`, type: 'sink7', taper: { split: OUTBOUND.split }, colorways: [colorway('black', 'Black', [0, 'rio-black'])] },
  ],
});

// Elite Gold. RIO's WF5F diagram has the same split as Premier Gold; the colors change at 20 ft and
// 40.5 ft, partway down the back taper.
const eliteGold = rio({
  id: 'rio-elite-gold',
  name: 'RIO Elite Gold',
  sizes: LINEUP['rio-elite-gold'].sizes,
  densities: [float({ split: GOLD_SPLIT, example: 5 }, colorway('moss-gold-gray', 'Moss/Gold/Gray', [20, 'rio-moss'], [20.5, 'rio-yellow'], [0, 'rio-light-gray']))],
});

// Elite Flats Pro. RIO's WF10 diagrams (floating, F/I 15 ft, StealthTip F/I 6 ft and intermediate)
// share one split: front taper 6, front body 6 and body 14, back taper 24.
const FLATS = { split: [6, 20, 24], example: 10 };
const flatsPro = rio({
  id: 'rio-elite-flats-pro',
  name: 'RIO Elite Flats Pro',
  sizes: LINEUP['rio-elite-flats-pro'].sizes,
  densities: [
    float(
      FLATS,
      colorway('aqua-orange-light-sand', 'Aqua/Orange/Light Sand', [20, 'rio-aqua'], [18, 'rio-orange'], [0, 'rio-light-sand']),
      colorway('gray-light-sand-kelp', 'Gray/Light Sand/Kelp', [20, 'rio-grey'], [18, 'rio-light-sand'], [0, 'rio-kelp']),
    ),
    tip('F/I 6 ft', FLATS, colorway('clear-aqua-orange-light-sand', 'Clear/Aqua/Orange/Light Sand', [6, 'rio-clear'], [14, 'rio-aqua'], [18, 'rio-orange'], [0, 'rio-light-sand'])),
    tip('F/I 15 ft', FLATS, colorway('clear-aqua-orange-light-sand', 'Clear/Aqua/Orange/Light Sand', [15, 'rio-clear'], [4, 'rio-aqua'], [19, 'rio-orange'], [0, 'rio-light-sand'])),
    intermediate(FLATS, colorway('clear-trans-orange-trans-aqua', 'Clear/Trans Orange/Trans Aqua', [15, 'rio-clear'], [23, 'rio-trans-orange'], [0, 'rio-light-teal'])),
  ],
});

// Elite Predator and Elite Warmwater Predator share RIO's WF8 diagrams: floating front 3+13, body
// 4+11, back 3; the 3D (F/H/I) and F/S5/S7 heads taper over the front 10 ft and carry a 21 ft body.
// RIO draws no F/I/S3, so it borrows the 3D split. Heads are yellow from 20 ft to the end of the head.
const PREDATOR_FLOAT = { split: [16, 15, 3], example: 8 };
const PREDATOR_3D = { split: [10, 21, 3], example: 8 };
const elitePredator = rio({
  id: 'rio-elite-predator',
  name: 'RIO Elite Predator',
  sizes: LINEUP['rio-elite-predator'].sizes,
  densities: [
    float(PREDATOR_FLOAT, colorway('olive-yellow-beige', 'Olive/Yellow/Beige', [20, 'rio-olive'], [14, 'rio-pale-yellow'], [0, 'rio-beige'])),
    tip('F/H/I', PREDATOR_3D, colorway('gray-camo-yellow-beige', 'Gray/Camo/Yellow/Beige', [10, 'rio-light-gray'], [10, 'rio-camo'], [14, 'rio-pale-yellow'], [0, 'rio-beige'])),
    tip('F/I/S3', { split: PREDATOR_3D.split }, colorway('black-gray-yellow-beige', 'Black/Gray/Yellow/Beige', [10, 'rio-black'], [10, 'rio-grey'], [14, 'rio-pale-yellow'], [0, 'rio-beige'])),
    tip('F/S5/S7', { split: PREDATOR_3D.split }, colorway('black-yellow-beige', 'Black/Yellow/Beige', [20, 'rio-black'], [14, 'rio-pale-yellow'], [0, 'rio-beige'])),
  ],
});
const warmwaterPredator = rio({
  id: 'rio-elite-warmwater-predator',
  name: 'RIO Elite Warmwater Predator',
  sizes: LINEUP['rio-elite-warmwater-predator'].sizes,
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
  sizes: LINEUP['rio-elite-tropical-outbound-short'].sizes,
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
  sizes: LINEUP['rio-premier-streamertip'].sizes,
  densities: [
    tip('F/I', STREAMER_TIP, colorway('clear-yellow-pale-green', 'Clear/Yellow/Pale Green', [10, 'rio-clear'], [20, 'rio-yellow'], [0, 'rio-mint'])),
    tip('F/S6', { split: STREAMER_TIP.split }, colorway('black-yellow-pale-green', 'Black/Yellow/Pale Green', [10, 'rio-black'], [20, 'rio-yellow'], [0, 'rio-mint'])),
  ],
});

// Premier 24ft Sink Tip. RIO's 150 gr (WF5) diagram: 24 ft black sinking tip, 6 ft body, 4 ft back
// taper on 66 ft of running line; the tip's own taper is about 3.5 ft as drawn. RIO's table gives
// only the 24 ft tip as the head, so every size overrides it with the diagram's 34 ft head. Each
// sink rate has its own running line color.
const SINK_TIP = { split: [3.5, 26.5, 4], example: 5 };
const SINK_TIP_LINEUP = LINEUP['rio-premier-24ft-sink-tip'];
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
      { id: `wf${weight}-${slug(densities)}`, label: `WF${weight} ${densities}`, type: 'sinktip' },
      overriding(lineupSize(SINK_TIP_LINEUP, `${weight}wt`), { head: 34 }),
    ),
  ),
});

// Elite Gold XP and Premier Gold XP. RIO's WF5F diagram: front 5.5, body 21.5, back 15. Elite is
// moss to 19 ft then Electric Green to the end of the head; Premier is a moss head on an Electric
// Green running line.
const GOLD_XP = { split: [5.5, 21.5, 15], example: 5 };
const eliteGoldXp = rio({
  id: 'rio-elite-gold-xp',
  name: 'RIO Elite Gold XP',
  sizes: LINEUP['rio-elite-gold-xp'].sizes,
  densities: [float(GOLD_XP, colorway('moss-electric-green-gray', 'Moss/Electric Green/Gray', [19, 'rio-moss'], [23, 'rio-electric-green'], [0, 'rio-light-gray']))],
});
const premierGoldXp = rio({
  id: 'rio-premier-gold-xp',
  name: 'RIO Premier Gold XP',
  sizes: LINEUP['rio-premier-gold-xp'].sizes,
  densities: [float(GOLD_XP, colorway('moss-electric-green', 'Moss/Electric Green', [42, 'rio-moss'], [0, 'rio-electric-green']))],
});

// Elite Bonefish. RIO's WF8F diagram: front 6.5, body 31, back 12 on 50.5 ft of running line. The
// front color runs to 20 ft and the body color to the back taper.
const eliteBonefish = rio({
  id: 'rio-elite-bonefish',
  name: 'RIO Elite Bonefish',
  sizes: LINEUP['rio-elite-bonefish'].sizes,
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
// weights; drawn at the lower, which the lineup leaves out) with a 35 ft black head on an
// intermediate running line; RIO draws no diagram for them, so they scale the floating split.
const STRIPER = { split: [16, 11, 3], example: 9 };
const STRIPER_LINEUP = LINEUP['rio-premier-striper'];
const striperSink = (grains, weight, ips, id, name, running) =>
  sized(
    { taper: { split: STRIPER.split }, colorways: [colorway(id, name, [30, 'rio-black'], [0, running])] },
    { id: `${grains}gr`, label: `${grains}gr Int/${ips}`, type: 'sinktip' },
    overriding(lineupSize(STRIPER_LINEUP, `${grains}gr | ${weight}/${weight + 1} Wt`), { weight }),
  );
const striperSizes = (sink) => STRIPER_LINEUP.sizes.filter((size) => size.densityLabel === sink);
const premierStriper = makerProduct({
  id: 'rio-premier-striper',
  maker: 'RIO',
  name: 'RIO Premier Striper',
  sizes: [
    ...striperSizes('Floating').map((size) =>
      sized({ taper: STRIPER, colorways: [colorway('blue-yellow', 'Blue/Yellow', [30, 'rio-blue'], [0, 'rio-pale-yellow'])] }, { id: `wf${size.weight}f`, label: `WF${size.weight}F`, type: 'floating' }, size),
    ),
    ...striperSizes('Intermediate').map((size) =>
      sized({ taper: STRIPER, colorways: [colorway('clear-lumalux-green', 'Clear/Lumalux Green', [30, 'rio-clear'], [0, 'rio-lumalux-green'])] }, { id: `wf${size.weight}i`, label: `WF${size.weight}I`, type: 'intermediate' }, size),
    ),
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
  sizes: LINEUP['rio-premier-creek'].sizes,
  densities: [float({ split: [6, 10, 14], example: 3 }, colorway('green-yellow', 'Green/Yellow', [30, 'rio-dark-green'], [0, 'rio-lemon-green']))],
});

// Elite and Premier Technical Trout. RIO's WF5F diagrams: front 10, body 10+7, back 13+12. Elite is
// Sky Blue to 20 ft and Peach to 46 ft on a gray running line; Premier is Sky Blue to 46 ft.
const TECH_TROUT = { split: [10, 17, 25], example: 5 };
const eliteTechnicalTrout = rio({
  id: 'rio-elite-technical-trout',
  name: 'RIO Elite Technical Trout',
  sizes: LINEUP['rio-elite-technical-trout'].sizes,
  densities: [float(TECH_TROUT, colorway('sky-blue-peach-gray', 'Sky Blue/Peach/Gray', [20, 'rio-sky-blue'], [26, 'rio-peach'], [0, 'rio-light-gray']))],
});
const premierTechnicalTrout = rio({
  id: 'rio-premier-technical-trout-wf',
  name: 'RIO Premier Technical Trout WF',
  sizes: LINEUP['rio-premier-technical-trout-wf'].sizes,
  densities: [float(TECH_TROUT, colorway('sky-blue-peach', 'Sky Blue/Peach', [46, 'rio-sky-blue'], [0, 'rio-peach']))],
});

// Elite Xtreme Indicator. RIO's WF6F diagram: front 3+2+4, body 24, back 15+1 on 51 ft of running
// line. RIO's table gives a 33 ft head for every size, which is the front and body without the
// back taper, so every size overrides it with the diagram's 49 ft head. Totals follow the table (it
// says 90 ft for WF6F; the diagram says 100). A 3 ft orange tip, moss to 33 ft.
const xtremeIndicator = rio({
  id: 'rio-elite-xtreme-indicator',
  name: 'RIO Elite Xtreme Indicator',
  sizes: LINEUP['rio-elite-xtreme-indicator'].sizes.map((size) => overriding(size, { head: 49 })),
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
  sizes: LINEUP['rio-elite-single-handed-spey'].sizes,
  densities: [
    float({ split: SPEY.split }, colorway('peach-camo', 'Peach/Camo', [33, 'rio-peach'], [0, 'rio-camo'])),
    tip('F/H/I', SPEY, colorway('gray-glacial-peach-camo', 'Gray/Glacial/Peach/Camo', [10, 'rio-light-gray'], [10, 'rio-glacial'], [13, 'rio-peach'], [0, 'rio-camo'])),
  ],
});

// Elite Indicator. RIO's WF6F diagram: front 6, body 17+13, back 16. White to 19 ft, red to 42.5 ft.
const eliteIndicator = rio({
  id: 'rio-elite-indicator',
  name: 'RIO Elite Indicator',
  sizes: LINEUP['rio-elite-indicator'].sizes,
  densities: [float({ split: [6, 30, 16], example: 6 }, colorway('white-red-gray', 'White/Red/Gray', [19, 'rio-white'], [23.5, 'rio-red'], [0, 'rio-light-gray']))],
});

// Mainstream Trout WF. RIO publishes no diagram, so the split borrows Gold XP's proportions. One color.
const mainstreamTrout = rio({
  id: 'rio-mainstream-trout-wf',
  name: 'RIO Mainstream Trout WF',
  sizes: LINEUP['rio-mainstream-trout-wf'].sizes,
  densities: [float({ split: GOLD_XP.split }, colorway('lemon-green', 'Lemon Green', [0, 'rio-lemon-green']))],
});

// Elite Gold Max and Premier Gold Max. RIO's WF5F diagram: front 4, body 28.5, back 4.5 on 53 ft of
// running line. Elite is Mint to 18.5 ft then Green to the end of the head; its Camo colorway
// (camo head, khaki running line) is made in WF4–8 only. Premier is a Mint head.
const GOLD_MAX = { split: [4, 28.5, 4.5], example: 5 };
const eliteGoldMax = rio({
  id: 'rio-elite-gold-max',
  name: 'RIO Elite Gold Max',
  sizes: LINEUP['rio-elite-gold-max'].sizes,
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
  sizes: LINEUP['rio-premier-gold-max'].sizes,
  densities: [float(GOLD_MAX, colorway('mint-blaze-orange', 'Mint/Blaze Orange', [37, 'rio-mint'], [0, 'rio-blaze-orange']))],
});

// Premier Fathom. RIO's WF7S6 diagram: front 4+2, body 21, back 8 on 70 ft of running line; every
// size has a 35 ft head on a 105 ft line. A black head on a running line colored by sink rate.
// 6 ips sits between Type 5 and Type 7; RIO calls it Fast Sink, as it does 5 ips elsewhere,
// so it draws as Type 5.
const FATHOM = { split: [6, 21, 8], example: 7 };
const fathomRate = (rate, type, id, name, running) => ({
  sink: `${rate} ips`,
  id: (w) => `wf${w}s${rate}`,
  label: (w) => `WF${w} Sink ${rate}`,
  type,
  taper: rate === 6 ? FATHOM : { split: FATHOM.split },
  colorways: [colorway(id, name, [35, 'rio-black'], [0, running])],
});
const fathom = rio({
  id: 'rio-premier-fathom',
  name: 'RIO Premier Fathom',
  sizes: LINEUP['rio-premier-fathom'].sizes,
  densities: [
    fathomRate(3, 'sink3', 'black-blue', 'Black/Blue', 'rio-deep-blue'),
    fathomRate(5, 'sink5', 'black-maroon', 'Black/Maroon', 'rio-maroon'),
    fathomRate(6, 'sink5', 'black-green', 'Black/Green', 'rio-sage'),
    fathomRate(7, 'sink7', 'black-grey', 'Black/Grey', 'rio-grey'),
  ],
});

// Premier AquaLux, 1.5–2 ips. RIO's WF6I diagram: front 4+2, body 22, back 2 on 70 ft of running
// line. The whole head is clear.
const aquaLux = rio({
  id: 'rio-premier-aqualux',
  name: 'RIO Premier AquaLux',
  sizes: LINEUP['rio-premier-aqualux'].sizes,
  densities: [{ ...intermediate({ split: [6, 22, 2], example: 6 }, colorway('clear-light-teal', 'Clear/Light Teal', [30, 'rio-clear'], [0, 'rio-light-teal'])), sink: '1.5–2 ips' }],
});

// Premier Bank Robber. RIO's WF5F diagram: front taper 15, front body 6 plus 4, back body 10, back
// taper 10 on 45 ft of running line. Tan to 25 ft (the end of the front body), light green to the
// end of the head, then a tan running line.
const bankRobber = rio({
  id: 'rio-premier-bank-robber',
  name: 'RIO Premier Bank Robber',
  sizes: LINEUP['rio-premier-bank-robber'].sizes,
  densities: [float({ split: [15, 20, 10], example: 5 }, colorway('tan-lt-green-tan', 'Tan/Lt Green/Tan', [25, 'rio-sand-tan'], [20, 'rio-lt-green'], [0, 'rio-sand-tan']))],
});

// Avid Trout Gold. RIO's WF5F diagram: front taper 5, body 24, then 6 ft tapering into a 12 ft body
// taper (together the back taper, 18) on 33 ft of running line. Gold end to end.
const avidTroutGold = rio({
  id: 'rio-avid-trout-gold',
  name: 'RIO Avid Trout Gold',
  sizes: LINEUP['rio-avid-trout-gold'].sizes,
  densities: [float({ split: [5, 24, 18], example: 5 }, colorway('gold', 'Gold', [0, 'rio-amber-gold']))],
});

// Premier LightLine. RIO's WF5F diagram: front taper 5 plus an 8 ft body taper (the front, 13),
// body 23 plus 2, back taper 5 on 37 ft of running line. That head is 43 ft; RIO's table says 42 for
// WF5F, so every size, the WF5F too, is the diagram scaled to its table head and marked estimated.
// Moss to 36 ft, then ivory from the last 2 ft of the body to the end of the line.
const lightLine = rio({
  id: 'rio-premier-lightline',
  name: 'RIO Premier LightLine',
  sizes: LINEUP['rio-premier-lightline'].sizes,
  densities: [float({ split: [13, 25, 5] }, colorway('moss-ivory', 'Moss/Ivory', [36, 'rio-light-moss'], [0, 'rio-ivory']))],
});

export const PRODUCTS = [
  makerProduct({
    id: 'rio-premier-gold',
    maker: 'RIO',
    name: 'RIO Premier Gold',
    sizes: LINEUP['rio-premier-gold'].sizes.map(goldSize),
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
  bankRobber,
  avidTroutGold,
  lightLine,
  // Euro nymph lines are level (about 0.022″), much thinner than a WF head of any weight, so they're
  // drawn as running line behind a token taper. RIO sells one size for 2–5 wt rods, drawn as a 3 wt;
  // it comes with a 14 ft pink mono leader. RIO's table has no lengths for it, so all three numbers
  // are ours.
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
        lineup: overriding(lineupSize(LINEUP['rio-premier-technical-euro-nymph'], '2-5wt'), { weight: 3, head: 1.5, total: 94 }),
        colorways: [{ id: 'pink-yellow', name: 'Pink/Yellow', zones: zones([14, 'rio-pink'], [0, 'rio-yellow']) }],
      },
    ],
  }),
];
