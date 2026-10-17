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
// the belly the body, the rear taper the back. Orvis's segments often add up to a foot or two more
// than its stated total length, so the running line is the stated total less the head.
const wf = (sizes, colorways) =>
  sizes.map(([weight, front, body, back, total]) => ({
    id: `wf${weight}f`,
    label: `WF${weight}F`,
    type: 'floating',
    weight,
    taper: [front, body, back, total - front - body - back],
    colorways,
  }));

export const PRODUCTS = [
  // Compound front taper and a long head for mending. Orvis describes three color sections (an
  // 8 ft stealth tip, a change 30 ft from the tip, and the rear taper and running line); drawn as
  // a willow tip, olive to 30 ft and peach behind, from the product photos.
  makerProduct({
    id: 'orvis-pro-trout-smooth',
    maker: 'Orvis',
    name: 'Orvis PRO Trout Smooth',
    sizes: wf(
      [
        [3, 25.5, 15, 9.5, 90],
        [4, 26, 14, 10, 90],
        [5, 26.5, 14, 10, 90.5],
        [6, 27.5, 14.5, 10, 90],
        [7, 27.5, 14.5, 10.5, 90.5],
        [8, 29, 15, 10.5, 90.5],
      ],
      [{ id: 'olive', name: 'Olive', zones: zones([8, 'orvis-willow'], [22, 'orvis-olive'], [0, 'orvis-peach']) }],
    ),
  }),
  // Two colors, changing 30 ft from the tip. Orvis lists the WF3 front as 4.9 ft; it's rounded to
  // 5 here so the head matches the published 45.5 ft.
  makerProduct({
    id: 'orvis-hydros-trout',
    maker: 'Orvis',
    name: 'Orvis Hydros Trout',
    sizes: wf(
      [
        [3, 5, 30.5, 10, 90],
        [4, 5.5, 31, 10, 90],
        [5, 6, 31.5, 10, 90],
        [6, 6.5, 32, 10, 90],
        [7, 7, 32.5, 10, 90],
        [8, 7.5, 33, 10, 90],
      ],
      [{ id: 'light-olive-peach', name: 'Light Olive/Peach', zones: zones([30, 'orvis-light-olive'], [0, 'orvis-hydros-peach']) }],
    ),
  }),
];
