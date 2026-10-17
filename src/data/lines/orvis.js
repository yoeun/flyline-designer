import * as LINEUP from 'lineups:orvis';
import { makerProduct, zones } from './product.js';

// Matched by eye to product photos.
export const COLORS = [
  { id: 'orvis-willow', name: 'Willow', hex: '#c8c8bd' },
  { id: 'orvis-olive', name: 'Olive', hex: '#8a8a5c' },
  { id: 'orvis-peach', name: 'Peach', hex: '#f8b797' },
  { id: 'orvis-light-olive', name: 'Light Olive', hex: '#9a9a72' },
  { id: 'orvis-hydros-peach', name: 'Peach', hex: '#fbcfae' },
];

// Splits from Orvis's per-size taper charts: the tip and every front taper section are the front,
// the belly the body, the rear taper the back. The front is whatever the stated head leaves after
// the body and back, which only matters where Orvis rounds a section. Orvis's segments often add up
// to a foot or two more than its stated total length, so the running line is the stated total less
// the head.
const wf = (product, colorways) =>
  product.sizes.map((size) => {
    const { body, back } = size.taper;
    return {
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: [size.head - body - back, body, back, size.total - size.head],
      lineup: size,
      colorways,
    };
  });

export const PRODUCTS = [
  // Compound front taper and a long head for mending. Orvis describes three color sections (an
  // 8 ft stealth tip, a change 30 ft from the tip, and the rear taper and running line); drawn as
  // a willow tip, olive to 30 ft and peach behind, from the product photos.
  makerProduct({
    id: 'orvis-pro-trout-smooth',
    maker: 'Orvis',
    name: 'Orvis PRO Trout Smooth',
    sizes: wf(LINEUP['orvis-pro-trout-line-smooth'], [
      { id: 'olive', name: 'Olive', zones: zones([8, 'orvis-willow'], [22, 'orvis-olive'], [0, 'orvis-peach']) },
    ]),
  }),
  // Two colors, changing 30 ft from the tip. Orvis lists the WF3 front as 4.9 ft; taking the front
  // from the head makes it 5, so the head matches the published 45.5 ft.
  makerProduct({
    id: 'orvis-hydros-trout',
    maker: 'Orvis',
    name: 'Orvis Hydros Trout',
    sizes: wf(LINEUP['orvis-hydros-trout'], [
      { id: 'light-olive-peach', name: 'Light Olive/Peach', zones: zones([30, 'orvis-light-olive'], [0, 'orvis-hydros-peach']) },
    ]),
  }),
];
