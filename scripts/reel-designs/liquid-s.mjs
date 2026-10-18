// Lamson Liquid S.
import { ACCENT, P, circle, foot, knob, knurl, rad, recessed, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 126;

// Liquid S spool side: five spokes swept back 40°; the handle sits partway along the one ending at -105°.
const LIQUID_SPOKES = [0, 1, 2, 3, 4].map((k) => -105 + k * 72);
const liquidHandle = (() => {
  const [x0, y0] = P(26, rad(-145)), [x1, y1] = P(188, rad(-105));
  return [x0 + (x1 - x0) * 0.62, y0 + (y1 - y0) * 0.62];
})();

// The drag button takes the finish's accent: orange-red on Smoke, yellow on Day Break.
export const drag = svg({
  back: [ring(190, 116) + slots({ n: 24, rIn: 126, rOut: 180, bar: 12, corner: 7 })],
  body: [
    ring(200, 189),
    foot(128, -244, 14, 34),
    // One thick vertical spoke: wide under the foot, narrowing past the drag to a strip at 6 o'clock.
    roundPoly([[-52, -196], [52, -196], [36, -40], [22, 40], [22, 196], [-22, 196], [-22, 40], [-36, -40]], 8),
    // The Y arms branch off it above the drag and rise to the rim.
    strut([-30, -108], P(194, rad(-137)), 20, 15),
    strut([30, -108], P(194, rad(-43)), 20, 15),
  ],
  details: `<path d="${knurl(60, 3.5, 20)}" fill="#3a3d41"/><path d="${knurl(60, 3.5, 20)}" fill="url(#sheen)"/><circle r="36" fill="#2f3235"/><circle r="18" ${ACCENT}/><circle cx="-4" cy="5" r="3" fill="#000" fill-opacity=".45"/><circle cx="4" cy="-5" r="3" fill="#000" fill-opacity=".45"/>`,
});

export const spool = svg({
  // The frame's slotted ring shows behind the spool, as on the drag side.
  foot: recessed(foot(128, -244, 14, 34)),
  handles: [[...liquidHandle, 16]],
  back: [ring(190, 116) + slots({ n: 24, rIn: 126, rOut: 180, bar: 12, corner: 7 })],
  body: [ring(200, 184), ...LIQUID_SPOKES.map((a) => spoke(a, 26, 188, 20, 13, 40)), circle(38)],
  details: `${knob(...liquidHandle, 16)}<circle r="30" fill="#fff" fill-opacity=".1"/>`,
});
