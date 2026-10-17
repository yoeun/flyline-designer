import * as LINEUP from 'lineups:cortland';
import { makerProduct, publishedTaper, zones } from './product.js';

// Matched by eye to product photos and Cortland's taper charts.
export const COLORS = [
  { id: 'cortland-peach', name: 'Peach', hex: '#f7c89c' },
  { id: 'cortland-clear-camo', name: 'Clear Camo', hex: '#6e6a5c' },
  { id: 'cortland-dark-brown', name: 'Dark Brown', hex: '#37261e' },
  { id: 'cortland-black', name: 'Black', hex: '#222222' },
  { id: 'cortland-green', name: 'Green', hex: '#89a64c' },
  { id: 'cortland-mustard', name: 'Mustard', hex: '#f6c73b' },
];

// Cortland draws one taper chart per line with the head length on it but no size. Every size of a
// line has that head, so the lineup gives each size the chart's split.
const sizes = (product, { label = (size) => size.label, id = (w) => `wf${w}f`, ...rest }) =>
  product.sizes.map((size) => ({ ...rest, id: id(size.weight), label: label(size), weight: size.weight, taper: publishedTaper(size), lineup: size }));

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
