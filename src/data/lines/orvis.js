import * as LINEUP from 'lineups:orvis';
import { makerProduct, zones } from './product.js';

// Matched by eye to product photos.
export const COLORS = [
  { id: 'orvis-willow', name: 'Willow', hex: '#c8c8bd' },
  { id: 'orvis-olive', name: 'Olive', hex: '#8a8a5c' },
  { id: 'orvis-peach', name: 'Peach', hex: '#f8b797' },
  { id: 'orvis-light-olive', name: 'Light Olive', hex: '#9a9a72' },
  { id: 'orvis-hydros-peach', name: 'Peach', hex: '#fbcfae' },
  { id: 'orvis-moss', name: 'Moss', hex: '#9fb064' },
  { id: 'orvis-clearwater-moss', name: 'Moss', hex: '#a8b83c' },
  { id: 'orvis-dark-olive', name: 'Dark Olive', hex: '#6b6849' },
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
  // The PRO Trout taper with a textured coating, in the same three colors (the box reads
  // Willow/Olive/Peach and the photos match the Smooth line's).
  makerProduct({
    id: 'orvis-pro-trout-textured',
    maker: 'Orvis',
    name: 'Orvis PRO Trout Textured',
    sizes: wf(LINEUP['orvis-pro-trout-line-textured'], [
      { id: 'olive', name: 'Olive', zones: zones([8, 'orvis-willow'], [22, 'orvis-olive'], [0, 'orvis-peach']) },
    ]),
  }),
  // Half a size heavy, with a long belly. Orvis's chart labels the 10.5 ft section behind the belly
  // "Running", but it's the rear taper: with it the head comes to the stated length. Three colors at
  // the PRO marks (an 8 ft tip, a change 30 ft from the tip, the rear taper and running line); the
  // box reads Willow/Olive/Moss, and the moss is the chartreuse in the photos.
  makerProduct({
    id: 'orvis-pro-power-taper-textured',
    maker: 'Orvis',
    name: 'Orvis PRO Power Taper Textured',
    sizes: wf(LINEUP['orvis-pro-power-taper-line-textured'], [
      { id: 'olive', name: 'Olive', zones: zones([8, 'orvis-willow'], [22, 'orvis-olive'], [0, 'orvis-moss']) },
    ]),
  }),
  // Half a size heavy, one color. Orvis's chart has a 0.5 ft tip and 5.5 ft front taper, a foot more
  // than its 40 ft head allows; its taper diagram draws the front as 5 ft, which is what the head gives.
  makerProduct({
    id: 'orvis-clearwater',
    maker: 'Orvis',
    name: 'Orvis Clearwater',
    sizes: wf(LINEUP['orvis-clearwater-fly-line'], [{ id: 'moss', name: 'Moss', zones: zones([0, 'orvis-clearwater-moss']) }]),
  }),
  // A short head for light rods. Dark olive to 30 ft from the tip and willow behind, per Orvis's
  // description. Orvis lists the WF1 and WF4 fronts as 7.2 and 8.7 ft; taking the front from the
  // head makes them 7.5 and 9, so the heads match the published 31.5 and 36 ft (Orvis's taper
  // diagram also draws the WF4 front as 9 ft).
  makerProduct({
    id: 'orvis-hydros-superfine',
    maker: 'Orvis',
    name: 'Orvis Hydros Superfine',
    sizes: wf(LINEUP['orvis-hydros-superfine'], [
      { id: 'dark-olive-willow', name: 'Dark Olive/Willow', zones: zones([30, 'orvis-dark-olive'], [0, 'orvis-willow']) },
    ]),
  }),
];
