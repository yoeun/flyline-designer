import * as LINEUP from 'lineups:royal-wulff';
import { makerProduct, overriding, publishedTaper, zones } from './product.js';

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
  { id: 'rw-aqua', name: 'Aqua', hex: '#2fa88a' },
  { id: 'rw-mist-green', name: 'Mist Green', hex: '#a6e6cb' },
  // Nearly black in the Midstream Full Sink 3 photo, with a faint green cast.
  { id: 'rw-dark-green', name: 'Dark Green', hex: '#1f2b26' },
  // The Midstream Bermuda Blue page has no photo; matched to the Tropic Blue in Royal Wulff's
  // Bermuda Triangle Taper Floating photo, a pale powder blue.
  { id: 'rw-tropic-blue', name: 'Tropic Blue', hex: '#b6c9e2' },
  { id: 'rw-sea-wulff-gray', name: 'Gray', hex: '#4b4d50' },
  // The Striper Fast Sink's head looks charcoal rather than black in its photo.
  { id: 'rw-striper-black', name: 'Black', hex: '#3b3b39' },
  { id: 'rw-striper-blue', name: 'Blue', hex: '#1f4fae' },
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
  // The Triangle Taper Classic's taper as a clear monocore 1.5 ips intermediate: the whole head is
  // one front taper, with the taper and running line lengths from Royal Wulff's table.
  makerProduct({
    id: 'royal-wulff-triangle-taper-classic-intermediate-mono-clear',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Triangle Taper Classic Intermediate Mono Clear',
    sizes: LINEUP['royal-wulff-triangle-taper-classic-intermediate-mono-clear'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'rw-clear']) }],
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
  // The Bamboo Special as a double taper: front taper, belly and rear taper from Royal Wulff's table
  // over the whole 90 ft. A double taper has no head, so the lineup leaves it empty and the menu
  // draws all of it as head, with no running line. Royal Wulff names no color for it; its photos
  // show one golden brown, the Bamboo Special's Brown.
  makerProduct({
    id: 'royal-wulff-bamboo-special-double-taper',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Bamboo Special Double Taper',
    sizes: LINEUP['royal-wulff-bamboo-special-double-taper'].sizes.map((size) => ({
      id: `dt${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: overriding(size, { head: size.total }),
      colorways: [{ id: 'brown', name: 'Brown', zones: zones([0, 'rw-brown']) }],
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
  // The Midstream TT Floating's taper as an aqua 1.5 ips intermediate: Royal Wulff's table gives the
  // taper and running line lengths, and the whole head is one front taper.
  makerProduct({
    id: 'royal-wulff-midstream-tt-intermediate',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Midstream TT Intermediate',
    sizes: LINEUP['royal-wulff-midstream-tt-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'aqua', name: 'Aqua', zones: zones([0, 'rw-aqua']) }],
    })),
  }),
  // The same taper as a 3 ips full sinker in dark green: taper and running line lengths from Royal
  // Wulff's table, with the whole head one front taper.
  makerProduct({
    id: 'royal-wulff-midstream-tt-full-sink-3',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Midstream TT Full Sink 3',
    sizes: LINEUP['royal-wulff-midstream-tt-full-sink-3'].sizes.map((size) => ({
      id: `wf${size.weight}s`,
      label: size.label,
      type: 'sink3',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'dark-green', name: 'Dark Green', zones: zones([0, 'rw-dark-green']) }],
    })),
  }),
  // The Midstream Bermuda Blue is the floating Bermuda line in one color, Tropic Blue: a 30 ft front
  // taper and 2 ft rear taper from Royal Wulff's table, then a handling line that counts as running
  // line. Being one color, it has none of the two-tone Bermuda lines' doubt over the head's color.
  makerProduct({
    id: 'royal-wulff-midstream-bermuda-blue-floating',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Midstream Bermuda Blue Floating',
    sizes: LINEUP['royal-wulff-midstream-bermuda-blue-floating'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'tropic-blue', name: 'Tropic Blue', zones: zones([0, 'rw-tropic-blue']) }],
    })),
  }),
  // The Triangle Taper Short: a 27 ft front taper and 2 ft rear taper (23 ft and 4 ft on the 2 and 3
  // weights), then a handling line and the running line. Taper lengths from Royal Wulff's table; the
  // handling line counts as running line. All willow.
  makerProduct({
    id: 'royal-wulff-triangle-taper-short',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Triangle Taper Short',
    sizes: LINEUP['royal-wulff-triangle-taper-short'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'willow', name: 'Willow', zones: zones([0, 'rw-willow']) }],
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
  // taper from Royal Wulff's table, then a handling line that counts as running line. The two-tone
  // floating Bermuda lines aren't here: sources disagree on whether their head is the sand or the blue.
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
  // The Sea Wulff Monoclear's taper as an aqua 1.75 ips intermediate: Royal Wulff's table gives a 30
  // ft taper with no rear taper, so the whole head is front taper; the handling section counts as
  // running line.
  makerProduct({
    id: 'royal-wulff-sea-wulff-triangle-taper-intermediate',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Sea Wulff Triangle Taper Intermediate',
    sizes: LINEUP['royal-wulff-sea-wulff-triangle-taper-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'aqua', name: 'Aqua', zones: zones([0, 'rw-aqua']) }],
    })),
  }),
  // The floating Sea Wulff, in mist green, with the same 30 ft taper and handling section from Royal
  // Wulff's table.
  makerProduct({
    id: 'royal-wulff-sea-wulff-triangle-taper-float',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Sea Wulff Triangle Taper Float',
    sizes: LINEUP['royal-wulff-sea-wulff-triangle-taper-float'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'mist-green', name: 'Mist Green', zones: zones([0, 'rw-mist-green']) }],
    })),
  }),
  // The Sea Wulff taper as a 4 ips full sinker in gray. Royal Wulff's table gives a 30 ft taper with
  // no rear taper, so the whole head is front taper; the handling section counts as running line.
  // 4 ips is drawn as Type 3, whose range other makers give as 3–4 ips (Cortland's Type 3, SA's Sink
  // 3); Type 5 starts at 5. Royal Wulff's table runs to 12 wt, but it sells only the 7 to 9.
  makerProduct({
    id: 'royal-wulff-sea-wulff-triangle-taper-full-sink-4',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Sea Wulff Triangle Taper Full Sink 4',
    sizes: LINEUP['royal-wulff-sea-wulff-triangle-taper-full-sink-4'].sizes.map((size) => ({
      id: `wf${size.weight}s`,
      label: size.label,
      type: 'sink3',
      weight: size.weight,
      taper: publishedTaper(size),
      lineup: size,
      colorways: [{ id: 'gray', name: 'Gray', zones: zones([0, 'rw-sea-wulff-gray']) }],
    })),
  }),
  // A 6 ips sinking head on a 1.5 ips intermediate running line. Royal Wulff gives only a 30 ft taper
  // and a 100 ft length, with no table; as on the other Sea Wulff lines the 30 ft taper is the whole
  // head, so it's all front taper and the rest running line. The page lists the colors, Black/Blue,
  // in the same order as the densities, head then running line, and the photo shows the blue at the
  // thin end, so the head is black and the running line blue.
  makerProduct({
    id: 'royal-wulff-sea-wulff-triangle-taper-striper-fast-sink',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Sea Wulff Triangle Taper Striper Fast Sink',
    sizes: LINEUP['royal-wulff-sea-wulff-triangle-taper-striper-fast-sink'].sizes.map((size) => ({
      id: `wf${size.weight}s6`,
      label: size.label,
      type: 'sinkhead-int',
      weight: size.weight,
      taper: [size.head, 0, 0, size.total - size.head],
      lineup: size,
      colorways: [{ id: 'black-blue', name: 'Black/Blue', zones: zones([size.head, 'rw-striper-black'], [0, 'rw-striper-blue']) }],
    })),
  }),
];
