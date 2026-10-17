import * as LINEUP from 'lineups:royal-wulff';
import { makerProduct, publishedTaper, zones } from './product.js';

// Matched by eye to product photos.
export const COLORS = [
  { id: 'rw-ivory', name: 'Ivory', hex: '#ece9d8' },
  { id: 'rw-yellow', name: 'Yellow', hex: '#dbe86a' },
  { id: 'rw-olive', name: 'Olive', hex: '#5d5a28' },
  { id: 'rw-orange', name: 'Orange', hex: '#f99842' },
];

export const PRODUCTS = [
  // Lee Wulff's Triangle Taper: the whole head is one continuous front taper, thickening from the
  // tip to the back of the head, so there is no body or rear taper. Taper and running line lengths
  // from Royal Wulff's table. The two-tone line has an ivory head on a yellow running line.
  makerProduct({
    id: 'royal-wulff-triangle-taper-classic',
    maker: 'Royal Wulff',
    name: 'Royal Wulff Triangle Taper Classic',
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
];
