import { makerProduct, zones } from './product.js';

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
    sizes: [2, 3, 4, 5, 6, 7, 8, 9].map((weight) => {
      const head = weight <= 5 ? 36 : 40;
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: [head, 0, 0, 90 - head],
        colorways: [
          { id: 'two-tone', name: 'Two Tone (Ivory/Yellow)', zones: zones([head, 'rw-ivory'], [0, 'rw-yellow']) },
          { id: 'ivory', name: 'Ivory', zones: zones([0, 'rw-ivory']) },
          { id: 'olive', name: 'Olive', zones: zones([0, 'rw-olive']) },
          { id: 'orange', name: 'Orange', zones: zones([0, 'rw-orange']) },
        ],
      };
    }),
  }),
];
