// Redington Run.
import { P, circle, f, foot, knob, rect, ring, slots, spoke, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 118;

export const drag = svg({
  back: [ring(188, 112) + slots({ n: 32, rIn: 120, rOut: 180, bar: 8, corner: 3 })],
  body: [ring(200, 186), foot(150, -240, 14, 30), spoke(-125, 0, 194, 44, 36), spoke(-55, 0, 194, 44, 36), spoke(90, 0, 194, 54, 46), circle(64)],
  details:
    `<circle r="54" fill="#000" fill-opacity=".22"/>` +
    Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * 2 * Math.PI;
      const [x0, y0] = P(42, a), [x1, y1] = P(52, a);
      return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#000" stroke-opacity=".3" stroke-width="3"/>`;
    }).join('') +
    `<circle r="24" fill="#1d1f22"/><circle r="18" fill="none" stroke="#d6d9d4" stroke-width="3"/>`,
});

export const spool = svg({
  back: [foot(150, -240, 14, 30)],
  body: [
    ring(200, 108) + slots({ n: 32, rIn: 118, rOut: 182, bar: 8, corner: 3 }),
    rect(-21, -184, 42, 70, 6),
    rect(-21, 114, 42, 70, 6),
    ...Array.from({ length: 8 }, (_, k) => spoke(-67.5 + k * 45, 0, 112, 12, 9)),
    circle(30),
  ],
  details: `${knob(0, -150, 15)}${knob(0, 150, 15)}<circle r="21" fill="#000" fill-opacity=".14"/><circle r="21" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`,
});
