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
  { id: 'rio-aqua-blue', name: 'Aqua Blue', hex: '#8cc4ea' },
  { id: 'rio-sand', name: 'Sand', hex: '#e6d79e' },
  { id: 'rio-sea-grass', name: 'Sea Grass', hex: '#9c9e6e' },
  { id: 'rio-trans-gray', name: 'Trans Gray', hex: '#8c8d8a' },
  { id: 'rio-trans-salmon', name: 'Trans Salmon', hex: '#d99a8c' },
  { id: 'rio-trans-blue', name: 'Trans Blue', hex: '#7ba7b9' },
  { id: 'rio-trans-tan', name: 'Trans Tan', hex: '#b3a978' },
  { id: 'rio-trans-green', name: 'Trans Green', hex: '#90c5b8' },
  { id: 'rio-seafoam', name: 'Seafoam', hex: '#9fe3c4' },
  { id: 'rio-peach-sand', name: 'Sand', hex: '#efcf9f' },
  { id: 'rio-gray-moss', name: 'Gray Moss', hex: '#8e9a74' },
  { id: 'rio-brown-moss', name: 'Brown Moss', hex: '#a39a76' },
  { id: 'rio-chartreuse', name: 'Chartreuse', hex: '#d6ee4c' },
  { id: 'rio-silver-gray', name: 'Silver Gray', hex: '#a7a9a8' },
  { id: 'rio-light-orange', name: 'Light Orange', hex: '#f6a03c' },
  { id: 'rio-purple', name: 'Purple', hex: '#bd55c4' },
  { id: 'rio-pale-green', name: 'Pale Green', hex: '#b4e68c' },
  { id: 'rio-light-seagrass', name: 'Light Seagrass', hex: '#c8c070' },
  { id: 'rio-sage-green', name: 'Sage Green', hex: '#b4bc94' },
  { id: 'rio-golden-yellow', name: 'Golden Yellow', hex: '#f9c62a' },
  { id: 'rio-bronze', name: 'Bronze', hex: '#d27f26' },
  { id: 'rio-golden-tan', name: 'Golden Tan', hex: '#c8b27a' },
  { id: 'rio-glacial-green', name: 'Glacial Green', hex: '#86d9a0' },
  { id: 'rio-ice-blue', name: 'Ice Blue', hex: '#b3c2e2' },
  { id: 'rio-predator-deep-beige', name: 'Beige', hex: '#ab946e' },
  { id: 'rio-musky-outbound-tannin', name: 'Tannin', hex: '#ba9468' },
  { id: 'rio-cleansweep-light-aqua', name: 'Light Aqua', hex: '#2a97af' },
  { id: 'rio-cleansweep-dark-aqua', name: 'Dark Aqua', hex: '#155561' },
  { id: 'rio-blitz-sand', name: 'Sand', hex: '#e5ce68' },
  { id: 'rio-sub-surface-hover-gray', name: 'Gray', hex: '#a29e96' },
  { id: 'rio-sub-surface-hover-olive', name: 'Olive', hex: '#aa9c1d' },
  { id: 'rio-midge-tip-hover-gray', name: 'Gray', hex: '#9b978a' },
  // The Leviathan's 600 and 750 gr bodies; far stronger than the Elite Flats Pro's Trans Orange.
  { id: 'rio-leviathan-trans-yellow', name: 'Trans Yellow', hex: '#c4c92e' },
  { id: 'rio-leviathan-trans-orange', name: 'Trans Orange', hex: '#e65945' },
  // Sampled from the OutBound Short Shooting Head's medium-sink coil photo, a dark chocolate brown.
  { id: 'rio-outbound-short-shooting-head-brown', name: 'Brown', hex: '#371f18' },
  // Sampled from the FIPS Euro Nymph and Euro Nymph Shorty taper diagrams (their orange is RIO Orange).
  { id: 'rio-fips-euro-nymph-sage', name: 'Sage', hex: '#c5d99d' },
  { id: 'rio-fips-euro-nymph-olive', name: 'Olive', hex: '#769341' },
  { id: 'rio-mainstream-brown', name: 'Brown', hex: '#4b4030' },
  { id: 'rio-mainstream-saltwater-blue', name: 'Blue', hex: '#93b2c8' },
  { id: 'rio-mainstream-bass-yellow', name: 'Yellow', hex: '#ddcc54' },
  { id: 'rio-outbound-custom-trans-blue', name: 'Trans Blue', hex: '#7f9fae' },
  { id: 'rio-outbound-custom-trans-green', name: 'Trans Green', hex: '#88ada6' },
  { id: 'rio-coastal-crabber-sand', name: 'Sand', hex: '#dba86e' },
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
  'F/S3/S5/S7': 'Float/3 ips/5 ips/7 ips',
  'I/S5': 'I/S5',
  'Int/4/2': '1.5 ips/4 ips/2 ips',
  'Int/6/4': '1.5 ips/6 ips/4 ips',
  'F/H': 'Float/1.0 ips',
  'F/S3': 'Float/3 ips',
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

// A sinking head on an intermediate running line, e.g. "WF11 I/S5".
const intTip = (densities, taper, ...colorways) => ({ ...tip(densities, taper, ...colorways), type: 'sinkhead-int' });

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

// A double taper is all head: RIO's table gives a head as long as the line, so it draws with no
// running line. The front taper, body and back taper are the diagram's, scaled to each size's length.
const doubleTaper = (taper, ...colorways) => ({ sink: 'Floating', id: (w) => `dt${w}f`, label: (w) => `DT${w}F`, type: 'floating', taper, colorways });

// Premier Technical Trout DT. RIO's DT5F diagram: front taper 9, body 36 plus 36, back taper 9 over
// 90 ft. Sky Blue from the tip to the middle of the body, then Peach.
const technicalTroutDt = rio({
  id: 'rio-premier-technical-trout-dt',
  name: 'RIO Premier Technical Trout DT',
  sizes: LINEUP['rio-premier-technical-trout-dt'].sizes,
  densities: [doubleTaper({ split: [9, 72, 9], example: 5 }, colorway('sky-blue-peach', 'Sky Blue/Peach', [45, 'rio-sky-blue'], [0, 'rio-peach']))],
});

// Premier LightLine Double Taper. RIO's DT5F diagram: front taper 5 plus an 8 ft body taper (the
// front, 13), body 27 plus 27, then the same 8 and 5 at the back over 80 ft. Moss from the tip to the
// middle of the body, then ivory. RIO also sells 000 and 00 wt, which would draw just like the 0 wt.
const lightLineDt = rio({
  id: 'rio-premier-lightline-double-taper',
  name: 'RIO Premier LightLine Double Taper',
  sizes: LINEUP['rio-premier-lightline-double-taper'].sizes.filter((size) => !['000wt', '00wt'].includes(size.label)),
  densities: [doubleTaper({ split: [13, 54, 13], example: 5 }, colorway('moss-ivory', 'Moss/Ivory', [40, 'rio-light-moss'], [0, 'rio-ivory']))],
});

// Elite Permit. RIO's WF9F diagram: front taper 6, body 9 plus a 20 ft main body, back taper 13 on
// 52 ft of running line. The tip color runs about 22.5 ft (partway down the main body, read off the
// diagram by eye), the middle color to the end of the head. RIO's photos show the Sand/Camo/Light
// Sand colorway laid out the same way.
const elitePermit = rio({
  id: 'rio-elite-permit',
  name: 'RIO Elite Permit',
  sizes: LINEUP['rio-elite-permit'].sizes,
  densities: [
    float(
      { split: [6, 29, 13], example: 9 },
      colorway('light-sand-orange-aqua-blue', 'Light Sand/Orange/Aqua Blue', [22.5, 'rio-light-sand'], [25.5, 'rio-orange'], [0, 'rio-aqua-blue']),
      colorway('sand-camo-light-sand', 'Sand/Camo/Light Sand', [22.5, 'rio-sand'], [25.5, 'rio-camo'], [0, 'rio-light-sand']),
    ),
  ],
});

// Elite Tarpon. RIO's WF10F diagram: front taper 6, body 8.5, back body 13.5, back taper 12 on 60 ft
// of running line. That head is 40 ft; RIO's table says 40.5 for WF10F, so every size, the WF10F too,
// is the diagram scaled to its table head and marked estimated. Sea Grass to about 18.5 ft (partway
// down the back body, read off the diagram by eye), orange to the end of the head, then sand.
const eliteTarpon = rio({
  id: 'rio-elite-tarpon',
  name: 'RIO Elite Tarpon',
  sizes: LINEUP['rio-elite-tarpon'].sizes,
  densities: [float({ split: [6, 22, 12] }, colorway('sea-grass-orange-sand', 'Sea Grass/Orange/Sand', [18.5, 'rio-sea-grass'], [21.5, 'rio-orange'], [0, 'rio-sand']))],
});

// Elite Leviathan. RIO's 500 gr diagram: a 26 ft black sinking tip (a 4 ft front taper and 22 ft),
// then 2 ft stepping up to a 3 ft body and a 3 ft back taper on 66 ft of running line. RIO's table
// gives only the 26 ft tip as the head, so every size overrides it with the diagram's 34 ft head.
// Sold by grain weight, each rated for two or more rod weights and drawn at the lowest (which the
// lineup leaves out, except the 750 gr's 15 wt). The body and running line are a translucent color
// that changes with the size.
const LEVIATHAN = { split: [4, 27, 3], example: 12 };
const LEVIATHAN_LINEUP = LINEUP['rio-elite-leviathan'];
const leviathan = makerProduct({
  id: 'rio-elite-leviathan',
  maker: 'RIO',
  name: 'RIO Elite Leviathan',
  sizes: [
    [250, 7, '7/8wt', '1.5/5.5', 'black-trans-gray', 'Black/Trans Gray', 'rio-trans-gray'],
    [300, 8, '8/9wt', '1.5/6.7', 'black-trans-salmon', 'Black/Trans Salmon', 'rio-trans-salmon'],
    [350, 9, '9/10wt', '1.5/7.2', 'black-trans-blue', 'Black/Trans Blue', 'rio-trans-blue'],
    [400, 10, '10/11wt', '1.5/7.7', 'black-trans-tan', 'Black/Trans Tan', 'rio-trans-tan'],
    [500, 12, '12/13wt', '1.5/8.5', 'black-trans-green', 'Black/Trans Green', 'rio-trans-green'],
    [600, 14, '14-16wt', '1.5/9.7', 'black-trans-yellow', 'Black/Trans Yellow', 'rio-leviathan-trans-yellow'],
    [750, 15, '15wt+', '1.5/10.0', 'black-trans-orange', 'Black/Trans Orange', 'rio-leviathan-trans-orange'],
  ].map(([grains, weight, rated, ips, id, name, body]) => {
    const size = lineupSize(LEVIATHAN_LINEUP, rated);
    return sized(
      { taper: LEVIATHAN, colorways: [colorway(id, name, [26, 'rio-black'], [0, body])] },
      { id: `${grains}gr`, label: `${grains}gr ${ips} ips`, type: 'sinktip' },
      overriding(size, size.weight === weight ? { head: 34 } : { weight, head: 34 }),
    );
  }),
});

// Billfish Shooting Head: a 31 ft head (RIO's table and description) with no running line. RIO's
// 550 gr diagram draws a 30 ft head: a 2'6" front taper and 27'6" level to the loop, with no back
// taper; it's scaled to 31 ft, with a token half-foot back taper so the head ends in one. RIO
// gives the 550 gr no rod weight; 550 gr is 15 wt on the AFFTA scale, so it's drawn as 15 wt.
// The 8–9 ips head is drawn as Type 7. Black, with the 4 ft orange section RIO's description puts
// at the back of the head.
const billfishHead = makerProduct({
  id: 'rio-billfish-shooting-head',
  maker: 'RIO',
  name: 'RIO Billfish Shooting Head',
  sizes: [
    sized(
      { taper: { split: [2.5, 27, 0.5] }, colorways: [colorway('black-orange', 'Black/Orange', [26, 'rio-black'], [0, 'rio-orange'])] },
      { id: '550gr', label: '550gr 8–9 ips', type: 'sink7' },
      overriding(lineupSize(LINEUP['rio-billfish-shooting-head'], '550gr'), { weight: 15 }),
    ),
  ],
});

// Premier Tarpon Clear Tip Floater. RIO's WF11F diagram: front taper 6, then 4 ft and an 18.5 ft
// body, back taper 12 on 59.5 ft of running line. Every size has a 40.5 ft head. A 10 ft clear tip
// (from RIO's description and the diagram), seafoam to the end of the head, then a sand running line.
const tarponClearTip = rio({
  id: 'rio-premier-tarpon-clear-tip-floater',
  name: 'RIO Premier Tarpon Clear Tip Floater',
  sizes: LINEUP['rio-premier-tarpon-clear-tip-floater'].sizes,
  densities: [float({ split: [6, 22.5, 12], example: 11 }, colorway('clear-seafoam-sand', 'Clear/Seafoam/Sand', [10, 'rio-clear'], [30.5, 'rio-seafoam'], [0, 'rio-peach-sand']))],
});

// Premier Flats Clear Floater. RIO's WF10F diagram is the Elite Flats Pro split (front taper 6,
// front body 6, body 14, rear taper 24 on 50 ft of running line) and RIO says the Full Clear has
// the same taper. The Clear Tip is clear over the front taper, sand to about 38 ft (partway down the
// rear taper, read off the diagram by eye), then blue. The Full Clear is clear end to end in RIO's
// photo.
const flatsClear = rio({
  id: 'rio-premier-flats-clear-floater',
  name: 'RIO Premier Flats Clear Floater',
  sizes: LINEUP['rio-premier-flats-clear-floater'].sizes,
  densities: [
    float(
      FLATS,
      colorway('clear-sand-blue', 'Clear/Sand/Blue', [6, 'rio-clear'], [32, 'rio-peach-sand'], [0, 'rio-blue']),
      colorway('clear', 'Clear', [0, 'rio-clear']),
    ),
  ],
});

// Premier Bonefish Quickshooter. RIO's WF8F diagram: front taper 5, body 9 plus 14, back taper 7 on
// 65 ft of running line. That head is 35 ft; RIO's table says 35.5 for WF8F, so every size, the WF8F
// too, is the diagram scaled to its table head and marked estimated. Aqua Blue to about 31.5 ft
// (halfway down the back taper, read off the diagram by eye), then sand.
const bonefishQuickShooter = rio({
  id: 'rio-premier-bonefish-quickshooter',
  name: 'RIO Premier Bonefish Quickshooter',
  sizes: LINEUP['rio-premier-bonefish-quickshooter'].sizes,
  densities: [float({ split: [5, 23, 7] }, colorway('aqua-blue-sand', 'Aqua Blue/Sand', [31.5, 'rio-aqua-blue'], [0, 'rio-sand']))],
});

// Elite GT. RIO's WF12F diagram: front taper 3, body 10, a 3 ft body taper, 4 ft and a 10 ft back
// body, back taper 6 on 64 ft of running line. Every size has a 36 ft head. Blue to 20 ft (the end
// of the 4 ft section), orange to the end of the head, then a sea grass running line.
const eliteGt = rio({
  id: 'rio-elite-gt',
  name: 'RIO Elite GT',
  sizes: LINEUP['rio-elite-gt'].sizes,
  densities: [float({ split: [3, 27, 6], example: 12 }, colorway('blue-orange-sea-grass', 'Blue/Orange/Sea Grass', [20, 'rio-pale-blue'], [16, 'rio-orange'], [0, 'rio-sea-grass']))],
});

// Elite Salmon/Steelhead. RIO's WF8F diagram: front taper 6.5, body 24 plus 8, back taper 13.5 on
// 48 ft of running line. Every size has a 52 ft head. Moss to the end of the body (38.5 ft), then
// yellow from the back taper to the end of the line.
const salmonSteelhead = rio({
  id: 'rio-elite-salmon-steelhead',
  name: 'RIO Elite Salmon/Steelhead',
  sizes: LINEUP['rio-elite-salmon-steelhead'].sizes,
  densities: [float({ split: [6.5, 32, 13.5], example: 8 }, colorway('moss-yellow', 'Moss/Yellow', [38.5, 'rio-gray-moss'], [0, 'rio-pale-yellow']))],
});

// Premier Redfish. RIO's WF8F diagram: front taper 6, front body 9, body 15, back taper 5 plus 2 on
// 63 ft of running line. Aqua Blue to 35 ft (the end of the 5 ft taper; the last 2 ft are drawn in
// the running line's color), then sand.
const redfish = rio({
  id: 'rio-premier-redfish',
  name: 'RIO Premier Redfish',
  sizes: LINEUP['rio-premier-redfish'].sizes,
  densities: [float({ split: [6, 24, 7], example: 8 }, colorway('aqua-blue-sand', 'Aqua Blue/Sand', [35, 'rio-aqua-blue'], [0, 'rio-sand']))],
});

// Premier Redfish XP. RIO's WF8F diagram: front taper 3, front body 13, body 11, back taper 8, then a
// 12 ft handling section and 53 ft of running line. Every size has a 35 ft head. A gray head on an
// orange running line.
const redfishXp = rio({
  id: 'rio-premier-redfish-xp',
  name: 'RIO Premier Redfish XP',
  sizes: LINEUP['rio-premier-redfish-xp'].sizes,
  densities: [float({ split: [3, 24, 8], example: 8 }, colorway('gray-orange', 'Gray/Orange', [35, 'rio-silver-gray'], [0, 'rio-light-orange']))],
});

// Elite Smallmouth Bass. RIO's WF8F diagram: front taper 7, body 13 plus 11, back taper 7, then a
// 28 ft handling section and 34 ft of running line. The diagram's darker green runs to 20 ft and its
// lighter green to the end of the head; RIO's colors, tip first, are Moss/Chartreuse/Beige.
const smallmouthBass = rio({
  id: 'rio-elite-smallmouth-bass',
  name: 'RIO Elite Smallmouth Bass',
  sizes: LINEUP['rio-elite-smallmouth-bass'].sizes,
  densities: [
    float({ split: [7, 24, 7], example: 8 }, colorway('moss-chartreuse-beige', 'Moss/Chartreuse/Beige', [20, 'rio-brown-moss'], [18, 'rio-chartreuse'], [0, 'rio-beige'])),
  ],
});

// Premier Coastal Quickshooter XP. RIO's WF9I diagram: front taper 3, front body 13, body 13, back
// taper 3, then a 10 ft handling section. That head is 32 ft; RIO's table says 33 for WF9I, so every
// size is the diagram scaled to its table head and marked estimated. A clear head on a purple
// running line.
const coastalQuickShooterXp = rio({
  id: 'rio-premier-coastal-quickshooter-xp',
  name: 'RIO Premier Coastal Quickshooter XP',
  sizes: LINEUP['rio-premier-coastal-quickshooter-xp'].sizes,
  densities: [intermediate({ split: [3, 26, 3] }, colorway('clear-purple', 'Clear/Purple', [32, 'rio-clear'], [0, 'rio-purple']))],
});

// Elite Sub-Surface CamoLux, 1.5–2 ips. RIO's WF6I diagram: front taper 4 plus 2, body 22, back
// taper 2 on 70 ft of running line. Every size has a 30 ft head. A camo head on a dark green running
// line, as RIO's photo shows it (the diagram draws a pale green running line).
const camoLux = rio({
  id: 'rio-elite-sub-surface-camolux',
  name: 'RIO Elite Sub-Surface CamoLux',
  sizes: LINEUP['rio-elite-sub-surface-camolux'].sizes,
  densities: [{ ...intermediate({ split: [6, 22, 2], example: 6 }, colorway('camo-dark-green', 'Camo/Dark Green', [30, 'rio-camo'], [0, 'rio-dark-green'])), sink: '1.5–2 ips' }],
});

// Ambassador Series Lake Chucker. RIO's #7 diagram: front taper 2, body 32, back taper 1, then a 2 ft
// load point and 63 ft of running line. Every size has a 35 ft head. A gray head, the orange load
// point, then a green running line.
const lakeChucker = rio({
  id: 'rio-ambassador-series-lake-chucker',
  name: 'RIO Ambassador Series Lake Chucker',
  sizes: LINEUP['rio-ambassador-series-lake-chucker'].sizes,
  densities: [float({ split: [2, 32, 1], example: 7 }, colorway('gray-orange-green', 'Gray/Orange/Green', [35, 'rio-light-gray'], [2, 'rio-orange'], [0, 'rio-green']))],
});

// Elite Stillwater Floater. RIO's WF6F diagram: front taper 2 plus 2, body 6 plus a 20 ft back body,
// back taper 20 on 40 ft of running line. That head is 50 ft; RIO's table says 49.5 for WF6F, so
// every size, the WF6F too, is the diagram scaled to its table head and marked estimated. Orange
// over the first 2 ft, green to about 38 ft (partway down the back taper, read off the diagram by
// eye), then yellow.
const stillwaterFloater = rio({
  id: 'rio-elite-stillwater-floater',
  name: 'RIO Elite Stillwater Floater',
  sizes: LINEUP['rio-elite-stillwater-floater'].sizes,
  densities: [float({ split: [4, 26, 20] }, colorway('orange-green-yellow', 'Orange/Green/Yellow', [2, 'rio-orange'], [36, 'rio-green'], [0, 'rio-pale-yellow']))],
});

// Premier Tarpon Quickshooter. RIO's WF12F diagram: front taper 7, body 5 plus 7, back body 10, back
// taper 1, then a 10 ft handling section and 60 ft of running line. Every size has a 30 ft head. A
// camo head; the handling section and running line are ivory.
const tarponQuickShooter = rio({
  id: 'rio-premier-tarpon-quickshooter',
  name: 'RIO Premier Tarpon Quickshooter',
  sizes: LINEUP['rio-premier-tarpon-quickshooter'].sizes,
  densities: [float({ split: [7, 22, 1], example: 12 }, colorway('camo-ivory', 'Camo/Ivory', [30, 'rio-camo'], [0, 'rio-ivory']))],
});

// Avid Trout Grand. RIO's WF6F diagram: front taper 7, body 7 plus 18, body taper 7 on 41 ft of
// running line. Pale green end to end.
const avidTroutGrand = rio({
  id: 'rio-avid-trout-grand',
  name: 'RIO Avid Trout Grand',
  sizes: LINEUP['rio-avid-trout-grand'].sizes,
  densities: [float({ split: [7, 25, 7], example: 6 }, colorway('pale-green', 'Pale Green', [0, 'rio-pale-green']))],
});

// Premier Midge Tip, a floating line with a 1.5 ips clear tip. RIO's WF6F/I diagram: front taper 3
// (the clear tip) plus 4, body 28, back taper 5 on 50 ft of running line. Clear over the first 3 ft,
// yellow to the end of the head, then a beige running line.
const midgeTip = rio({
  id: 'rio-premier-midge-tip',
  name: 'RIO Premier Midge Tip',
  sizes: LINEUP['rio-premier-midge-tip'].sizes,
  densities: [{ ...tip('F/I', { split: [7, 28, 5], example: 6 }, colorway('clear-yellow-beige', 'Clear/Yellow/Beige', [3, 'rio-clear'], [37, 'rio-yellow'], [0, 'rio-beige'])), sink: 'Float/1.5 ips' }],
});

// Premier Bonefish. RIO's WF8F diagram: front taper 6, body 32, back taper 12 on 50 ft of running
// line. That head is 50 ft; RIO's table says 49.5 for WF8F, so every size, the WF8F too, is the
// diagram scaled to its table head and marked estimated. Sand to the end of the body (38 ft), then
// blue from the back taper to the end of the line.
const premierBonefish = rio({
  id: 'rio-premier-bonefish',
  name: 'RIO Premier Bonefish',
  sizes: LINEUP['rio-premier-bonefish'].sizes,
  densities: [float({ split: [6, 32, 12] }, colorway('sand-blue', 'Sand/Blue', [38, 'rio-light-sand'], [0, 'rio-pale-blue']))],
});

// Avid 24ft Sink Tip. RIO's 200 gr (6/7 wt) diagram: a 24 ft black sinking tip (a 4 ft front taper
// and 20 ft), a 5 ft body and a 4 ft back taper, then an 8 ft handling section and 39 ft of running
// line. RIO's table gives only the 24 ft tip as the head, so every size overrides it with the
// diagram's 33 ft head. Sold for two rod weights and drawn at the lower (which the lineup leaves
// out). A black tip on a gold line.
const AVID_SINK_TIP = { split: [4, 25, 4], example: 6 };
const AVID_SINK_TIP_LINEUP = LINEUP['rio-avid-24ft-sink-tip'];
const avidSinkTip24 = makerProduct({
  id: 'rio-avid-24ft-sink-tip',
  maker: 'RIO',
  name: 'RIO Avid 24ft Sink Tip',
  sizes: [
    [5, 'F/S4'],
    [6, 'F/S5'],
    [7, 'F/S6'],
    [8, 'F/S7'],
    [9, 'F/S8'],
  ].map(([weight, densities]) =>
    sized(
      { taper: AVID_SINK_TIP, colorways: [colorway('black-gold', 'Black/Gold', [24, 'rio-black'], [0, 'rio-amber-gold'])] },
      { id: `${weight}-${weight + 1}wt-${slug(densities)}`, label: `${weight}/${weight + 1} wt ${densities}`, type: 'sinktip' },
      overriding(lineupSize(AVID_SINK_TIP_LINEUP, `${weight}/${weight + 1}wt`), { weight, head: 33 }),
    ),
  ),
});

// Avid Saltwater. RIO's WF8F diagram: front taper 6, front body 9, back body 14, back taper 7 on 44 ft
// of running line. That head is 36 ft; RIO's table says 37 for WF8F, so every size, the WF8F too, is
// the diagram scaled to its table head and marked estimated. Light Seagrass end to end.
const avidSaltwater = rio({
  id: 'rio-avid-saltwater',
  name: 'RIO Avid Saltwater',
  sizes: LINEUP['rio-avid-saltwater'].sizes,
  densities: [float({ split: [6, 23, 7] }, colorway('light-seagrass', 'Light Seagrass', [0, 'rio-light-seagrass']))],
});

// Avid Bass. RIO's WF8F diagram: front taper 5, body 10, back taper 18 on 47 ft of running line.
// Every size has a 33 ft head. Green end to end.
const avidBass = rio({
  id: 'rio-avid-bass',
  name: 'RIO Avid Bass',
  sizes: LINEUP['rio-avid-bass'].sizes,
  densities: [float({ split: [5, 10, 18], example: 8 }, colorway('green', 'Green', [0, 'rio-sage-green']))],
});

// Mainstream Striper. RIO's diagram is Premier Striper's split: front taper 3 plus a 13 ft body
// taper, body 11, back taper 3, then a 12 ft handling section and 38 ft of running line. It is
// labelled WF9F, but the line is sold only as an intermediate, so the WF9I is its example. Every
// size has a 30 ft head. Clear end to end in RIO's photo.
const mainstreamStriper = rio({
  id: 'rio-mainstream-striper',
  name: 'RIO Mainstream Striper',
  sizes: LINEUP['rio-mainstream-striper'].sizes,
  densities: [intermediate(STRIPER, colorway('clear', 'Clear', [0, 'rio-clear']))],
});

// Premier Dog Days Gold. RIO's WF5F diagram: front taper 6, body 14 plus 8, back taper 7 plus 12 on
// 43 ft of running line. Yellow to 20 ft, bronze to about 41 ft (halfway down the 12 ft taper, read
// off the diagram by eye), then tan.
const dogDaysGold = rio({
  id: 'rio-premier-dog-days-gold',
  name: 'RIO Premier Dog Days Gold',
  sizes: LINEUP['rio-premier-dog-days-gold'].sizes,
  densities: [
    float({ split: [6, 22, 19], example: 5 }, colorway('yellow-bronze-tan', 'Yellow/Bronze/Tan', [20, 'rio-golden-yellow'], [21, 'rio-bronze'], [0, 'rio-golden-tan'])),
  ],
});

// Premier Glacial Gold. RIO's WF5F diagram: front taper 5, body 15 plus 8, back taper 7 plus 12 on
// 43 ft of running line, 90 ft overall. RIO's table gives the other sizes' heads but no overall
// length, so only the WF5F is drawn. Frost White to 20 ft (the end of the 15 ft body), Glacial Green
// to about 41 ft (halfway down the 12 ft taper, read off the diagram by eye), then Ice Blue.
const glacialGold = rio({
  id: 'rio-premier-glacial-gold',
  name: 'RIO Premier Glacial Gold',
  sizes: LINEUP['rio-premier-glacial-gold'].sizes.filter((size) => size.total !== null),
  densities: [
    float(
      { split: [5, 23, 19], example: 5 },
      colorway('frost-white-glacial-green-ice-blue', 'Frost White/Glacial Green/Ice Blue', [20, 'rio-white'], [21, 'rio-glacial-green'], [0, 'rio-ice-blue']),
    ),
  ],
});

// Premier Midge Tip Long, a floating line with a 1.5 ips clear tip. RIO's WF6F/I diagram: front taper
// 3 plus 3 (the clear tip), body 2 plus 27, back taper 5 on 50 ft of running line. Clear over the
// first 6 ft, melon to the end of the head, then a beige running line.
const midgeTipLong = rio({
  id: 'rio-premier-midge-tip-long',
  name: 'RIO Premier Midge Tip Long',
  sizes: LINEUP['rio-premier-midge-tip-long'].sizes,
  densities: [{ ...tip('F/I', { split: [6, 29, 5], example: 6 }, colorway('clear-melon-beige', 'Clear/Melon/Beige', [6, 'rio-clear'], [34, 'rio-melon'], [0, 'rio-beige'])), sink: 'Float/1.5 ips' }],
});

// Avid Bonefish. RIO's WF8F diagram: front taper 7, body 24, a 6.5 ft body taper and a 12 ft handling
// section (together the back taper, 18.5) on 30.5 ft of running line. Blue end to end.
const avidBonefish = rio({
  id: 'rio-avid-bonefish',
  name: 'RIO Avid Bonefish',
  sizes: LINEUP['rio-avid-bonefish'].sizes,
  densities: [float({ split: [7, 24, 18.5], example: 8 }, colorway('blue', 'Blue', [0, 'rio-pale-blue']))],
});

// Avid Tarpon. RIO's WF11F diagram: front taper 6, body 22, then a 12 ft handling section (the back
// taper) on 40 ft of running line. Every size has a 40 ft head. Sand end to end.
const avidTarpon = rio({
  id: 'rio-avid-tarpon',
  name: 'RIO Avid Tarpon',
  sizes: LINEUP['rio-avid-tarpon'].sizes,
  densities: [float({ split: [6, 22, 12], example: 11 }, colorway('sand', 'Sand', [0, 'rio-sand']))],
});

// Ambassador Series Phil Rowley Lake: RIO's lake lines with an integrated tippet ring, one listing for
// several tapers. RIO says the floater is the Stillwater Floater and the 1.5–2 ips intermediate the
// AquaLux, and the listing shows both of their diagrams, so those sizes draw (and look) exactly like
// Elite Stillwater Floater and Premier AquaLux. Its Midge Tip and Midge Tip Hover rows each bundle
// the short and Long tapers (two different splits) in one size, so they're left out.
const philRowleyLake = rio({
  id: 'rio-ambassador-series-phil-rowley-lake',
  name: 'RIO Ambassador Series Phil Rowley Lake',
  sizes: LINEUP['rio-ambassador-series-phil-rowley-lake'].sizes,
  densities: [
    float({ split: [4, 26, 20] }, colorway('orange-green-yellow', 'Orange/Green/Yellow', [2, 'rio-orange'], [36, 'rio-green'], [0, 'rio-pale-yellow'])),
    { ...intermediate({ split: [6, 22, 2], example: 6 }, colorway('clear-translucent-green', 'Clear/Translucent Green', [30, 'rio-clear'], [0, 'rio-light-teal'])), sink: '1.5–2 ips' },
  ],
});

// Elite Predator Deep: the whole head sinks, split evenly between Type 3, 5 and 7, on a floating
// running line, so it draws as a sink tip. RIO's listing shows only the Elite Predator diagrams, so
// it borrows the 3D split, as the Predator F/I/S3 does, and every size is estimated. A black head
// (RIO says all of it sinks) on a beige running line, as RIO's photo shows it.
const predatorDeep = rio({
  id: 'rio-elite-predator-deep',
  name: 'RIO Elite Predator Deep',
  sizes: LINEUP['rio-elite-predator-deep'].sizes,
  densities: [tip('F/S3/S5/S7', { split: PREDATOR_3D.split }, colorway('black-beige', 'Black/Beige', [34, 'rio-black'], [0, 'rio-predator-deep-beige']))],
});

// Elite Musky OutBound, a Type 5 sinking head on an intermediate running line. RIO's WF11I/S5
// diagram: front taper 6, body 4 plus 13, back taper 14 on 63 ft of running line. RIO's table gives
// a 27 ft head, which stops 4 ft into the back taper where the black sinking section ends, so both
// sizes override it with the diagram's 37 ft head. Black to 27 ft, then tannin, as RIO's photo shows
// it (the diagram draws a yellow running line). RIO pitches the 600 gr and T-27 sizes at two-handed
// casting and gives them no rod weight, so they're left out.
const muskyOutbound = rio({
  id: 'rio-elite-musky-outbound',
  name: 'RIO Elite Musky OutBound',
  sizes: LINEUP['rio-elite-musky-outbound'].sizes.filter((size) => size.weight !== null).map((size) => overriding(size, { head: 37 })),
  densities: [intTip('I/S5', { split: [6, 17, 14], example: 11 }, colorway('black-tannin', 'Black/Tannin', [27, 'rio-black'], [0, 'rio-musky-outbound-tannin']))],
});

// Premier CleanSweep: a 1.5 ips clear tip and a black sinking body on a slower running line. RIO's
// WF7 diagram (the 1.5/6/4 ips line): front taper 5 plus 2, body 21, back taper 7 on 70 ft of
// running line; RIO draws no 1.5/4/2 ips line, so it borrows the split. Every size has a 35 ft head.
// Clear over the first 7 ft, black to the end of the head, then light aqua (1.5/4/2) or dark aqua
// (1.5/6/4). The 2 ips running line is intermediate, so the 1.5/4/2 draws as a sinking head on an
// intermediate running line; the 4 ips running line sinks, so the 1.5/6/4 draws as the nearest type
// to its 6 ips head, Type 5 (as Fathom's 6 ips does).
const CLEANSWEEP = { split: [7, 21, 7], example: 7 };
const cleanSweep = rio({
  id: 'rio-premier-cleansweep',
  name: 'RIO Premier CleanSweep',
  sizes: LINEUP['rio-premier-cleansweep'].sizes,
  densities: [
    intTip('Int/4/2', { split: CLEANSWEEP.split }, colorway('clear-black-light-aqua', 'Clear/Black/Light Aqua', [7, 'rio-clear'], [28, 'rio-black'], [0, 'rio-cleansweep-light-aqua'])),
    { ...tip('Int/6/4', CLEANSWEEP, colorway('clear-black-dark-aqua', 'Clear/Black/Dark Aqua', [7, 'rio-clear'], [28, 'rio-black'], [0, 'rio-cleansweep-dark-aqua'])), type: 'sink5' },
  ],
});

// Ambassador Series Blitz, F/H/I. RIO's WF8F/H/I diagram: front taper 6, body 18, back taper 2, then
// a 12 ft handling section and 62 ft of running line. Every size has a 26 ft head. Clear over the
// front taper, seafoam to the end of the body, then sand.
const blitz = rio({
  id: 'rio-ambassador-series-blitz',
  name: 'RIO Ambassador Series Blitz',
  sizes: LINEUP['rio-ambassador-series-blitz'].sizes,
  densities: [
    { ...tip('F/H/I', { split: [6, 18, 2], example: 8 }, colorway('clear-seafoam-sand', 'Clear/Seafoam/Sand', [6, 'rio-clear'], [18, 'rio-seafoam'], [0, 'rio-blitz-sand'])), sink: 'F/H/I' },
  ],
});

// Elite Sub-Surface Hover, 1 ips. RIO's WF6 diagram has the CamoLux split: front taper 4 plus 2, body
// 22, back taper 2 on 70 ft of running line. Every size has a 30 ft head. A gray head on an olive
// running line, as RIO's photo shows it (the tip is coiled innermost, as in its Midge Tip photos);
// the diagram draws an olive head on an orange running line.
const subSurfaceHover = rio({
  id: 'rio-elite-sub-surface-hover',
  name: 'RIO Elite Sub-Surface Hover',
  sizes: LINEUP['rio-elite-sub-surface-hover'].sizes,
  densities: [
    {
      sink: '1.0 ips',
      id: (w) => `wf${w}h`,
      label: (w) => `WF${w}H`,
      type: 'hover',
      taper: { split: [6, 22, 2], example: 6 },
      colorways: [colorway('gray-olive', 'Gray/Olive', [30, 'rio-sub-surface-hover-gray'], [0, 'rio-sub-surface-hover-olive'])],
    },
  ],
});

// Premier Midge Tip Hover and Midge Tip Long Hover: floating lines with a 1 ips hover tip, so they
// draw as sink tips, like the Midge Tips. RIO's listings show the Midge Tip diagrams (drawn for the
// clear-tip lines, so every size is estimated): front taper 3 plus 4, body 28, back taper 5, and for
// the Long, front taper 3 plus 3, body 2 plus 27, back taper 5, each on 50 ft of running line. Gray
// over the tip (3 ft, and 6 ft on the Long), yellow or melon to the end of the head, then beige.
const midgeTipHover = rio({
  id: 'rio-premier-midge-tip-hover',
  name: 'RIO Premier Midge Tip Hover',
  sizes: LINEUP['rio-premier-midge-tip-hover'].sizes,
  densities: [tip('F/H', { split: [7, 28, 5] }, colorway('gray-yellow-beige', 'Gray/Yellow/Beige', [3, 'rio-midge-tip-hover-gray'], [37, 'rio-yellow'], [0, 'rio-beige']))],
});
const midgeTipLongHover = rio({
  id: 'rio-premier-midge-tip-long-hover',
  name: 'RIO Premier Midge Tip Long Hover',
  sizes: LINEUP['rio-premier-midge-tip-long-hover'].sizes,
  densities: [tip('F/H', { split: [6, 29, 5] }, colorway('gray-melon-beige', 'Gray/Melon/Beige', [6, 'rio-midge-tip-hover-gray'], [34, 'rio-melon'], [0, 'rio-beige']))],
});

// Mainstream Trout Sink: four lines on one listing. RIO's diagrams for them are on its old site
// (rioproducts.com, archived): the full sinkers' WF6S3 (front taper 4.5, body 32.5, back taper 3 on
// 40 ft of running line, drawn for both rates), the sink tip's WF6 F/S3 (front taper 4 plus 8, body 20,
// back taper 4 on 44 ft) and the WF5F diagram drawn for the Trout WF floating and intermediate lines
// (front taper 7, body 7 plus 18, back taper 6 on 42 ft). The 3–4 ips line is brown and the 6–7 ips
// black end to end; the sink tip is a brown 12 ft tip (the diagram's front taper and the next 8 ft)
// on a lemon green line; the intermediate is clear. The old diagram calls the full sinkers Type 3 and
// Type 6, which RIO now lists as 3–4 and 6–7 ips; 3–4 ips draws as Type 3 and 6–7 ips as Type 7.
const MAINSTREAM_SINK = { split: [4.5, 32.5, 3], example: 6 };
const mainstreamFullSink = (sink, type, id, name, color) => ({
  sink,
  id: (w) => `wf${w}s${slug(sink.replace(' ips', ''))}`,
  label: (w) => `WF${w} Sink ${sink.replace(' ips', '')}`,
  type,
  taper: sink === '3–4 ips' ? MAINSTREAM_SINK : { split: MAINSTREAM_SINK.split },
  colorways: [colorway(id, name, [0, color])],
});
const mainstreamTroutSink = rio({
  id: 'rio-mainstream-trout-sink',
  name: 'RIO Mainstream Trout Sink',
  sizes: LINEUP['rio-mainstream-trout-sink'].sizes,
  densities: [
    { ...intermediate({ split: [7, 25, 6], example: 5 }, colorway('clear', 'Clear', [0, 'rio-clear'])), sink: '1.5–2 ips' },
    tip('F/S3', { split: [4, 28, 4], example: 6 }, colorway('brown-lemon-green', 'Brown/Lemon Green', [12, 'rio-mainstream-brown'], [0, 'rio-lemon-green'])),
    mainstreamFullSink('3–4 ips', 'sink3', 'brown', 'Brown', 'rio-mainstream-brown'),
    mainstreamFullSink('6–7 ips', 'sink7', 'black', 'Black', 'rio-black'),
  ],
});

// Mainstream Saltwater. RIO's WF10F diagram (archived from rioproducts.com): front taper 5, body 9
// plus 18, back taper 4 on 44 ft of running line. Blue end to end.
const mainstreamSaltwater = rio({
  id: 'rio-mainstream-saltwater',
  name: 'RIO Mainstream Saltwater',
  sizes: LINEUP['rio-mainstream-saltwater'].sizes,
  densities: [float({ split: [5, 27, 4], example: 10 }, colorway('blue', 'Blue', [0, 'rio-mainstream-saltwater-blue']))],
});

// Mainstream Bass. RIO's WF9F diagram (archived from rioproducts.com): front taper 5, body 9 plus 17,
// back taper 4 on 45 ft of running line. Yellow end to end.
const mainstreamBass = rio({
  id: 'rio-mainstream-bass',
  name: 'RIO Mainstream Bass',
  sizes: LINEUP['rio-mainstream-bass'].sizes,
  densities: [float({ split: [5, 26, 4], example: 9 }, colorway('yellow', 'Yellow', [0, 'rio-mainstream-bass-yellow']))],
});

// Mainstream Trout DT. RIO's DT5F diagram (archived from rioproducts.com): a 7 ft taper at each end of
// a 66 ft body over 80 ft. RIO's table gives no head, so every size overrides it with the line's
// length and draws as a double taper. Lemon green end to end.
const mainstreamTroutDt = rio({
  id: 'rio-mainstream-trout-dt',
  name: 'RIO Mainstream Trout DT',
  sizes: LINEUP['rio-mainstream-trout-dt'].sizes.map((size) => overriding(size, { head: size.total })),
  densities: [doubleTaper({ split: [7, 66, 7], example: 5 }, colorway('lemon-green', 'Lemon Green', [0, 'rio-lemon-green']))],
});

// Premier OutBound Custom, a level sinking head on an intermediate running line, made to be cut to
// length. RIO's T-11 diagram (the 8–10 wt, whose 385 gr head is 35 ft of T-11): no front taper, a
// 35 ft body and a 2 ft back taper on 63 ft of running line. RIO's table gives only the 35 ft body as
// the head, so both sizes override it with the diagram's 37 ft. Sold for three rod weights and drawn
// at the lowest (which the lineup leaves out). A black head; the back taper and running line are the
// translucent color of the size, as the diagram and RIO's photos show it.
const OUTBOUND_CUSTOM = { split: [0, 35, 2], example: 8 };
const OUTBOUND_CUSTOM_LINEUP = LINEUP['rio-premier-outbound-custom'];
const outboundCustom = makerProduct({
  id: 'rio-premier-outbound-custom',
  maker: 'RIO',
  name: 'RIO Premier OutBound Custom',
  sizes: [
    [8, 10, 8, 'black-trans-blue', 'Black/Trans Blue', 'rio-outbound-custom-trans-blue'],
    [10, 12, 9, 'black-trans-green', 'Black/Trans Green', 'rio-outbound-custom-trans-green'],
  ].map(([weight, top, ips, id, name, running]) =>
    sized(
      { taper: OUTBOUND_CUSTOM, colorways: [colorway(id, name, [35, 'rio-black'], [0, running])] },
      { id: `${weight}-${top}wt-i-s${ips}`, label: `${weight}–${top} wt I/S${ips}`, type: 'sinkhead-int' },
      overriding(lineupSize(OUTBOUND_CUSTOM_LINEUP, `${weight}-${top}wt`), { weight, head: 37 }),
    ),
  ),
});

// Ambassador Series Coastal Crabber, a 5 ips body and 7 ips front taper on an intermediate running
// line. RIO's WF10I/S5/S7 diagram: front taper 12, body 20, then 78 ft of running line; its 32 ft head
// is those two, and it gives no length for the thickening at the front of the running line, so there
// is no back taper and that stretch is drawn as running line. A black head on a sand running line,
// as RIO's photo shows it (the diagram draws the body gray and the running line yellow).
const coastalCrabber = rio({
  id: 'rio-ambassador-series-coastal-crabber',
  name: 'RIO Ambassador Series Coastal Crabber',
  sizes: LINEUP['rio-ambassador-series-coastal-crabber'].sizes,
  densities: [intTip('Int/5/7', { split: [12, 20, 0], example: 10 }, colorway('black-sand', 'Black/Sand', [32, 'rio-black'], [0, 'rio-coastal-crabber-sand']))],
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
  technicalTroutDt,
  lightLineDt,
  elitePermit,
  eliteTarpon,
  leviathan,
  billfishHead,
  tarponClearTip,
  flatsClear,
  bonefishQuickShooter,
  eliteGt,
  salmonSteelhead,
  redfish,
  redfishXp,
  smallmouthBass,
  coastalQuickShooterXp,
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
  camoLux,
  lakeChucker,
  stillwaterFloater,
  tarponQuickShooter,
  avidTroutGrand,
  midgeTip,
  premierBonefish,
  avidSinkTip24,
  avidSaltwater,
  avidBass,
  mainstreamStriper,
  dogDaysGold,
  glacialGold,
  midgeTipLong,
  avidBonefish,
  avidTarpon,
  philRowleyLake,
  predatorDeep,
  muskyOutbound,
  cleanSweep,
  blitz,
  subSurfaceHover,
  midgeTipHover,
  midgeTipLongHover,
  // OutBound Short Shooting Head: RIO's 30 ft head with no running line, so every size is head = total.
  // RIO publishes no taper diagram for it; the split is the Premier OutBound Short's (also a 30 ft
  // head), so every size is estimated. Medium Sink (3–4 ips) is drawn as Type 3, the slower type, as
  // elsewhere; Fast Sink (6–7 ips) as Type 7, like the Premier OutBound Short's 7 ips. Colors from
  // RIO's coil photos.
  rio({
    id: 'rio-outbound-short-shooting-head',
    name: 'RIO OutBound Short Shooting Head',
    sizes: LINEUP['rio-outbound-short-shooting-head'].sizes,
    densities: [
      { sink: 'Floating', id: (w) => `sh${w}f`, label: (w) => `SH${w}F`, type: 'floating', taper: { split: OUTBOUND.split }, colorways: [colorway('moss', 'Moss', [0, 'rio-moss'])] },
      { sink: '1.5–2 ips', id: (w) => `sh${w}i`, label: (w) => `SH${w}I`, type: 'intermediate', taper: { split: OUTBOUND.split }, colorways: [colorway('clear', 'Clear', [0, 'rio-clear'])] },
      { sink: '3–4 ips', id: (w) => `sh${w}-medium-sink`, label: (w) => `SH${w} Medium Sink`, type: 'sink3', taper: { split: OUTBOUND.split }, colorways: [colorway('brown', 'Brown', [0, 'rio-outbound-short-shooting-head-brown'])] },
      { sink: '6–7 ips', id: (w) => `sh${w}-fast-sink`, label: (w) => `SH${w} Fast Sink`, type: 'sink7', taper: { split: OUTBOUND.split }, colorways: [colorway('black', 'Black', [0, 'rio-black'])] },
    ],
  }),
  // FIPS Euro Nymph: one 80 ft size for 2–5 wt rods, drawn like the Technical Euro Nymph (a token
  // 1.5 ft head on a 3 wt). RIO's diagram has a 6 ft orange tip at each end, 15 ft sage tapers and a
  // 49 ft olive body, but those add up to 91 ft against the 80 ft overall (and head) length it states;
  // the colors are scaled to 80 ft, to the nearest half foot.
  makerProduct({
    id: 'rio-fips-euro-nymph',
    maker: 'RIO',
    name: 'RIO FIPS Euro Nymph',
    sizes: [lineupSize(LINEUP['rio-fips-euro-nymph'], '2-5 wt')].map((size) => ({
      id: '2-5',
      label: '2–5 wt',
      type: 'floating',
      weight: 3,
      taper: [0.5, 0.5, 0.5, size.total - 1.5],
      lineup: overriding(size, { weight: 3, head: 1.5 }),
      colorways: [
        {
          id: 'orange-sage-olive',
          name: 'Orange/Sage/Olive',
          zones: zones([5.5, 'rio-orange'], [13, 'rio-fips-euro-nymph-sage'], [43, 'rio-fips-euro-nymph-olive'], [13, 'rio-fips-euro-nymph-sage'], [0, 'rio-orange']),
        },
      ],
    })),
  }),
  // Euro Nymph Shorty: a 20 ft euro section for 2–5 wt rods, drawn like the FIPS Euro Nymph. RIO's
  // diagram: a 7'6" orange taper, a 5 ft sage body and a 7'6" olive taper.
  makerProduct({
    id: 'rio-euro-nymph-shorty',
    maker: 'RIO',
    name: 'RIO Euro Nymph Shorty',
    sizes: [lineupSize(LINEUP['rio-euro-nymph-shorty'], '2-5wt')].map((size) => ({
      id: '2-5',
      label: '2–5 wt',
      type: 'floating',
      weight: 3,
      taper: [0.5, 0.5, 0.5, size.total - 1.5],
      lineup: overriding(size, { weight: 3, head: 1.5 }),
      colorways: [{ id: 'orange-sage-olive', name: 'Orange/Sage/Olive', zones: zones([7.5, 'rio-orange'], [5, 'rio-fips-euro-nymph-sage'], [0, 'rio-fips-euro-nymph-olive']) }],
    })),
  }),
  // Premier Technical Euro Nymph Shorty: the Technical Euro Nymph's short version. RIO's table has no
  // length, but its diagram gives 34 ft overall: 20 ft of yellow line and a 14 ft integrated leader,
  // drawn pink as on the Technical Euro Nymph.
  makerProduct({
    id: 'rio-premier-technical-euro-nymph-shorty',
    maker: 'RIO',
    name: 'RIO Premier Technical Euro Nymph Shorty',
    sizes: [
      {
        id: '2-5',
        label: '2–5 wt',
        type: 'floating',
        weight: 3,
        taper: [0.5, 0.5, 0.5, 32.5],
        lineup: overriding(lineupSize(LINEUP['rio-premier-technical-euro-nymph-shorty'], '2-5wt'), { weight: 3, head: 1.5, total: 34 }),
        colorways: [{ id: 'pink-yellow', name: 'Pink/Yellow', zones: zones([14, 'rio-pink'], [0, 'rio-yellow']) }],
      },
    ],
  }),
  mainstreamTroutSink,
  mainstreamSaltwater,
  mainstreamBass,
  mainstreamTroutDt,
  outboundCustom,
  coastalCrabber,
];
