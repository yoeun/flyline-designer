// Lamson Liquid S.
// Drag side: the frame is a rim, the foot, one thick vertical spoke from the foot past the drag to 6 o'clock and two
// Y arms branching off it up to the rim, round the knurled drag knob. Through it shows the spool's cage, which
// turns: its 24 windows, the same as the spool side's, without the handle (the wound line hides it). Spool side:
// that window ring set back behind the spool's rim and five swept spokes, with the handle partway along one.
import { ACCENT, P, chamfer, circle, foot, knob, knurl, rad, recessed, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 126;

// The spool's 24 windows, shared by both sides.
const RIM = { n: 24, rIn: 126, rOut: 180, bar: 12, corner: 7 };

// Liquid S spool side: five spokes swept back 40°; the handle sits partway along the one ending at -105°.
const LIQUID_SPOKES = [0, 1, 2, 3, 4].map((k) => -105 + k * 72);
const liquidHandle = (() => {
  const [x0, y0] = P(26, rad(-145)), [x1, y1] = P(188, rad(-105));
  return [x0 + (x1 - x0) * 0.62, y0 + (y1 - y0) * 0.62];
})();

// The drag side's middle spoke, one straight taper: wide under the foot, narrowing evenly to 6 o'clock. It's a
// separate piece laid over the rim, so its whole outline is chamfered, across the rim too.
const MIDDLE_SPOKE = roundPoly([[-52, -196], [52, -196], [22, 196], [-22, 196]], 8);

// The drag button takes the finish's accent: orange-red on Smoke, yellow on Day Break.
export const drag = svg({
  cage: [ring(190, 116) + slots(RIM)],
  body: [
    ring(200, 189),
    foot(128, -244, 14, 34),
    MIDDLE_SPOKE,
    // The Y arms branch off it above the drag and rise to the rim.
    strut([-30, -108], P(194, rad(-137)), 20, 15),
    strut([30, -108], P(194, rad(-43)), 20, 15),
  ],
  // A dark chamfer, a flat facet, all the way round the frame's outer edge, running across the foot's post where it
  // meets the frame, so the foot reads as a separate piece.
  details: `<path d="${ring(200, 196)}" fill="#000" fill-opacity=".2" fill-rule="evenodd"/>${chamfer('liquid-spoke', MIDDLE_SPOKE)}<path d="${knurl(60, 3.5, 20)}" fill="#3a3d41"/><path d="${knurl(60, 3.5, 20)}" fill="url(#sheen)"/><circle r="36" fill="#2f3235"/><circle r="18" ${ACCENT}/><circle cx="-4" cy="5" r="3" fill="#000" fill-opacity=".45"/><circle cx="4" cy="-5" r="3" fill="#000" fill-opacity=".45"/>`,
});

export const spool = svg({
  foot: recessed(foot(128, -244, 14, 34)),
  handles: [[...liquidHandle, 16]],
  // The spool's window ring, set back behind its rim and spokes.
  back: [ring(190, 116) + slots(RIM)],
  body: [ring(200, 184), ...LIQUID_SPOKES.map((a) => spoke(a, 26, 188, 20, 13, 40)), circle(38)],
  details: `${knob(...liquidHandle, 16)}<circle r="30" fill="#fff" fill-opacity=".1"/>`,
});
