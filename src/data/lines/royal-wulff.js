import * as LINEUP from 'lineups:royal-wulff';
import { makerProduct, publishedTaper, zones } from './product.js';

// Matched by eye to product photos.
export const COLORS = [
  { id: 'rw-ivory', name: 'Ivory', hex: '#ece9d8' },
  { id: 'rw-yellow', name: 'Yellow', hex: '#dbe86a' },
  { id: 'rw-olive', name: 'Olive', hex: '#5d5a28' },
  { id: 'rw-orange', name: 'Orange', hex: '#f99842' },
  { id: 'rw-willow', name: 'Willow', hex: '#a3ac2e' },
  // Royal Wulff calls it Brown, but the Bamboo Special photo shows a golden, mustard brown.
  { id: 'rw-brown', name: 'Brown', hex: '#d4a12a' },
  // The clear monocore intermediates have a faint blue-green tint in the photos.
  { id: 'rw-clear', name: 'Clear', hex: '#c2d6d4' },
];

export const PRODUCTS = [
  // Lee Wulff's Triangle Taper: the whole head is one continuous front taper, thickening from the
  // tip to the back of the head, so there is no body or rear taper. Taper and running line lengths
  // from Royal Wulff's table. The two-tone line has an ivory head on a yellow running line.
  makerProduct({
    id: 'royal-wulff-triangle-taper-classic',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Triangle Taper Classic Float',
    sizes: LINEUP['royal-wulff-triangle-taper-classic-float'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [
        { id: 'two-tone', name: 'Two Tone (Ivory/Yellow)', zones: zones([size.head, 'rw-ivory'], [0, 'rw-yellow']) },
        { id: 'ivory', name: 'Ivory', zones: zones([0, 'rw-ivory']) },
        { id: 'olive', name: 'Olive', zones: zones([0, 'rw-olive']) },
        { id: 'orange', name: 'Orange', zones: zones([0, 'rw-orange']) },
      ],
    })),
  }),
  // Joan Wulff's Signature: the Triangle Taper's long front taper with a short rear taper behind
  // it, then a handling line and the running line. Front and rear taper lengths from Royal Wulff's
  // table; the handling line counts as running line. The maker says the bicolor line changes color
  // behind the head, so the ivory runs the head's length and orange the rest.
  makerProduct({
    id: 'royal-wulff-triangle-taper-signature',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Triangle Taper Signature',
    sizes: LINEUP['royal-wulff-triangle-taper-signature'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'ivory-orange', name: 'Ivory/Orange', zones: zones([size.head, 'rw-ivory'], [0, 'rw-orange']) }],
    })),
  }),
  // The Signature Plus is the Signature taper in half sizes heavy, with a longer rear taper. Taper
  // lengths from Royal Wulff's table, as for the Signature; ivory head, willow behind it.
  makerProduct({
    id: 'royal-wulff-triangle-taper-signature-plus',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Triangle Taper Signature Plus',
    sizes: LINEUP['royal-wulff-triangle-taper-signature-plus'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'ivory-willow', name: 'Ivory/Willow', zones: zones([size.head, 'rw-ivory'], [0, 'rw-willow']) }],
    })),
  }),
  // A long-belly weight forward for bamboo rods: short front taper, long belly, short rear taper on
  // a 100 ft line. Front taper, belly and rear taper from Royal Wulff's table. The maker says only
  // "2-tone" and Brown/Ivory; brown on the head and ivory behind it follows the name's order, as
  // the Triangle Taper's two-tone names its head color first.
  makerProduct({
    id: 'royal-wulff-bamboo-special-weight-forward',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Bamboo Special',
    sizes: LINEUP['royal-wulff-bamboo-special-weight-forward'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'brown-ivory', name: 'Brown/Ivory', zones: zones([size.head, 'rw-brown'], [0, 'rw-ivory']) }],
    })),
  }),
  // The Long Belly Classic is the Bamboo Special's taper in one color: front taper, belly and rear
  // taper from Royal Wulff's table, on a 100 ft line, all ivory.
  makerProduct({
    id: 'royal-wulff-long-belly-classic',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Long Belly Classic',
    sizes: LINEUP['royal-wulff-long-belly-classic'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'ivory', name: 'Ivory', zones: zones([0, 'rw-ivory']) }],
    })),
  }),
  // Midstream is Royal Wulff's budget series. Its TT Floating has the Triangle Taper Classic's taper
  // and lengths (Royal Wulff's table matches the Classic's size for size) with a front loop only, in
  // ivory, so each size draws like the Classic Float in Ivory.
  makerProduct({
    id: 'royal-wulff-midstream-tt-floating',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Midstream TT Floating',
    sizes: LINEUP['royal-wulff-midstream-tt-floating'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'ivory', name: 'Ivory', zones: zones([0, 'rw-ivory']) }],
    })),
  }),
  // The Triangle Taper Short for bass bugs: a 27 ft front taper and 2 ft rear taper, then a handling
  // section and the running line. Taper lengths from Royal Wulff's table; the handling section counts
  // as running line. Sold in solid Ivory or Olive.
  makerProduct({
    id: 'royal-wulff-triangle-taper-short-bass',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Triangle Taper Short Bass',
    sizes: LINEUP['royal-wulff-triangle-taper-short-bass'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [
        { id: 'ivory', name: 'Ivory', zones: zones([0, 'rw-ivory']) },
        { id: 'olive', name: 'Olive', zones: zones([0, 'rw-olive']) },
      ],
    })),
  }),
  // The Triangle Taper Short in yellow for indicator nymphing. Front and rear taper from Royal
  // Wulff's table (the 3 weight's front taper is shorter and its rear taper longer); the handling
  // line counts as running line.
  makerProduct({
    id: 'royal-wulff-triangle-taper-short-nymph',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Triangle Taper Short Nymph',
    sizes: LINEUP['royal-wulff-triangle-taper-short-nymph'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'yellow', name: 'Yellow', zones: zones([0, 'rw-yellow']) }],
    })),
  }),
  // The warm-water Bermuda line as a clear 1.75 ips intermediate: a 30 ft front taper and 2 ft rear
  // taper from Royal Wulff's table, then a handling line that counts as running line. The floating
  // Bermuda lines aren't here: sources disagree on whether their head is the sand or the blue.
  makerProduct({
    id: 'royal-wulff-bermuda-triangle-taper-intermediate',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Bermuda Triangle Taper Intermediate',
    sizes: LINEUP['royal-wulff-bermuda-triangle-taper-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'rw-clear']) }],
    })),
  }),
  // The cold-water Sea Wulff as a clear 1.75 ips intermediate. Royal Wulff's table gives a 30 ft
  // taper with no rear taper, so the whole head is front taper, as on the Triangle Taper Classic;
  // the handling section counts as running line.
  makerProduct({
    id: 'royal-wulff-sea-wulff-triangle-taper-intermediate-monoclear',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Sea Wulff Triangle Taper Intermediate Monoclear',
    sizes: LINEUP['royal-wulff-sea-wulff-triangle-taper-intermediate-monoclear'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'rw-clear']) }],
    })),
  }),
];
