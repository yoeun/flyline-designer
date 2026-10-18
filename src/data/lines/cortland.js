import * as LINEUP from 'lineups:cortland';
import { makerProduct, overriding, publishedTaper, zones } from './product.js';

// Matched by eye to product photos and Cortland's taper charts.
export const COLORS = [
  { id: 'cortland-peach', name: 'Peach', hex: '#f7c89c' },
  { id: 'cortland-clear-camo', name: 'Clear Camo', hex: '#6e6a5c' },
  { id: 'cortland-dark-brown', name: 'Dark Brown', hex: '#37261e' },
  { id: 'cortland-black', name: 'Black', hex: '#222222' },
  { id: 'cortland-green', name: 'Green', hex: '#89a64c' },
  { id: 'cortland-mustard', name: 'Mustard', hex: '#f6c73b' },
  // Sampled from the swatch or line on each line's taper chart.
  { id: 'cortland-mint-green', name: 'Mint Green', hex: '#6cbe67' },
  { id: 'cortland-moss-green', name: 'Moss Green', hex: '#83944e' },
  { id: 'cortland-orange', name: 'Orange', hex: '#f27944' },
  { id: 'cortland-heron', name: 'Heron', hex: '#8db8c9' },
  { id: 'cortland-light-blue', name: 'Light Blue', hex: '#add7ed' },
];

// Cortland draws one taper chart per line with the head length on it but no size. Every size of a
// line has that head, so the lineup gives each size the chart's split.
const sizes = (product, { label = (size) => size.label, id = (w) => `wf${w}f`, lineup = (size) => size, ...rest }) =>
  product.sizes.map((size) => ({ ...rest, id: id(size.weight), label: label(size), weight: size.weight, taper: publishedTaper(size), lineup: lineup(size) }));

// A double taper has no head: Cortland charts it as taper, body and taper over the whole 90 ft, so the
// lineup leaves its head empty. The menu draws all of it as head, with no running line.
const doubleTaper = (size) => overriding(size, { head: size.total });

export const PRODUCTS = [
  makerProduct({
    id: 'cortland-444-peach',
    maker: 'Cortland',
    name: 'Cortland 444 Peach',
    sizes: sizes(LINEUP['cortland-444-peach'], {
      type: 'floating',
      colorways: [{ id: 'peach', name: 'Peach', zones: zones([0, 'cortland-peach']) }],
    }),
  }),
  // 8 ft tapers at both ends of a 74 ft body.
  makerProduct({
    id: 'cortland-444-peach-dt',
    maker: 'Cortland',
    name: 'Cortland 444 Peach Double Taper',
    sizes: sizes(LINEUP['cortland-444-peach-dt'], {
      id: (w) => `dt${w}f`,
      lineup: doubleTaper,
      type: 'floating',
      colorways: [{ id: 'peach', name: 'Peach', zones: zones([0, 'cortland-peach']) }],
    }),
  }),
  // Supple, slightly longer-headed sister of the 444 Peach.
  makerProduct({
    id: 'cortland-444-sylk',
    maker: 'Cortland',
    name: 'Cortland 444 Sylk',
    sizes: sizes(LINEUP['cortland-444-sylk'], {
      type: 'floating',
      colorways: [{ id: 'mustard', name: 'Mustard', zones: zones([0, 'cortland-mustard']) }],
    }),
  }),
  // Longer 12 ft tapers than the Peach double taper, for bamboo and glass rods.
  makerProduct({
    id: 'cortland-444-sylk-dt',
    maker: 'Cortland',
    name: 'Cortland 444 Sylk Double Taper',
    sizes: sizes(LINEUP['cortland-444-sylk-dt'], {
      id: (w) => `dt${w}f`,
      lineup: doubleTaper,
      type: 'floating',
      colorways: [{ id: 'mustard', name: 'Mustard', zones: zones([0, 'cortland-mustard']) }],
    }),
  }),
  // 105 ft long, with a 41 ft head for distance and long mends.
  makerProduct({
    id: 'cortland-444-sl',
    maker: 'Cortland',
    name: 'Cortland 444 SL',
    sizes: sizes(LINEUP['cortland-444-sl'], {
      type: 'floating',
      colorways: [{ id: 'mint-green', name: 'Mint Green', zones: zones([0, 'cortland-mint-green']) }],
    }),
  }),
  // Half a size heavy. Short front taper and a 25 ft back taper; sold as two listings, one per color.
  makerProduct({
    id: 'cortland-modern-trout',
    maker: 'Cortland',
    name: 'Cortland Modern Trout',
    sizes: sizes(LINEUP['cortland-modern-trout'], {
      type: 'floating',
      colorways: [
        { id: 'moss-green', name: 'Moss Green', zones: zones([0, 'cortland-moss-green']) },
        { id: 'orange', name: 'Orange', zones: zones([0, 'cortland-orange']) },
      ],
    }),
  }),
  // Half a size heavy, with a long front taper and 28 ft body. The photo calls it heron and light blue;
  // the taper chart draws the head in the darker blue and the running line in the light one.
  makerProduct({
    id: 'cortland-finesse-trout-ii',
    maker: 'Cortland',
    name: 'Cortland Finesse Trout II',
    sizes: sizes(LINEUP['cortland-trout-finesse-trout-ii'], {
      type: 'floating',
      colorways: [{ id: 'heron-light-blue', name: 'Heron/Light Blue', zones: zones([43, 'cortland-heron'], [0, 'cortland-light-blue']) }],
    }),
  }),
  // 1.5–2 ips. Short front taper and body, long back taper.
  makerProduct({
    id: 'cortland-444-clear-camo',
    maker: 'Cortland',
    name: 'Cortland 444 Clear Camo',
    sizes: sizes(LINEUP['cortland-444-clear-camo-intermediate'], {
      id: (w) => `wf${w}i`,
      type: 'intermediate',
      colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'cortland-clear-camo']) }],
    }),
  }),
  // Type 3 sinks 3–4 ips (dark brown), Type 6 6–7 ips (black, drawn as Type 7). Both share one chart.
  makerProduct({
    id: 'cortland-444-full-sink',
    maker: 'Cortland',
    name: 'Cortland 444 Full Sinking',
    sizes: [
      ...sizes(LINEUP['cortland-444-full-sinking-type-3'], {
        label: (size) => `${size.label} Type 3`,
        id: (w) => `wf${w}s3`,
        type: 'sink3',
        colorways: [{ id: 'dark-brown', name: 'Dark Brown', zones: zones([0, 'cortland-dark-brown']) }],
      }),
      ...sizes(LINEUP['cortland-444-full-sinking-type-6'], {
        label: (size) => `${size.label} Type 6`,
        id: (w) => `wf${w}s6`,
        type: 'sink7',
        colorways: [{ id: 'black', name: 'Black', zones: zones([0, 'cortland-black']) }],
      }),
    ],
  }),
  // Full size heavy. Type 6 (5–6 ips) 15 ft tip, then a floating body and a 10 ft step down to the
  // running line, drawn here as running line.
  makerProduct({
    id: 'cortland-streamer-sink-tip-15',
    maker: 'Cortland',
    name: 'Cortland Streamer Sink Tip 15',
    sizes: sizes(LINEUP['cortland-streamer-sink-tip-15'], {
      id: (w) => `wf${w}`,
      type: 'sinktip',
      colorways: [{ id: 'black-green', name: 'Black/Green', zones: zones([15, 'cortland-black'], [0, 'cortland-green']) }],
    }),
  }),
];
