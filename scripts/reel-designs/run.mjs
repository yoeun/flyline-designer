// Redington Run.
// Drag side: the frame is a rim, the foot, three wide spokes (two up to either side of the foot, one down) and a
// hub round the drag knob. Through it shows the spool's cage, which turns: its 32 windows, the same as the spool
// side's, without the handle pads (the wound line hides them).
import { P, circle, f, foot, knob, recessed, rect, ring, slots, spoke, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 118;

// The spool's 32 windows, shared by both sides.
const RIM = { n: 32, rIn: 118, rOut: 182, bar: 8, corner: 3 };

export const drag = svg({
  cage: [ring(188, 108) + slots(RIM)],
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
  foot: recessed(foot(150, -240, 14, 30)),
  handles: [[0, -150, 15], [0, 150, 15]],
  body: [
    ring(200, 108) + slots(RIM),
    rect(-21, -184, 42, 70, 6),
    rect(-21, 114, 42, 70, 6),
    ...Array.from({ length: 8 }, (_, k) => spoke(-67.5 + k * 45, 0, 112, 12, 9)),
    circle(30),
  ],
  details: `${knob(0, -150, 15)}${knob(0, 150, 15)}<circle r="21" fill="#000" fill-opacity=".14"/><circle r="21" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`,
});
