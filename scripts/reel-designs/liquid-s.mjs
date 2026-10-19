// Lamson Liquid S.
// Drag side: the frame is a rim, the foot, one thick vertical spoke from the foot past the drag to 6 o'clock and two
// Y arms branching off it up to the rim, round the knurled drag knob. Through it shows the spool's cage, which
// turns: its 24 windows, the same as the spool side's, without the handle (the wound line hides it). Spool side:
// that window ring set back behind the spool's rim and five swept spokes, with the handle partway along one.
import { ACCENT, P, chamfer, circle, foot, knob, knurl, rad, recessed, ring, slots, spoke, strut, sunkFace, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 126;

// The spool's 24 windows, shared by both sides.
const RIM = { n: 24, rIn: 126, rOut: 171, bar: 12, corner: 7 };

// Liquid S spool side: five spokes swept back 40°; the handle sits partway along the one ending at -105°.
const LIQUID_SPOKES = [0, 1, 2, 3, 4].map((k) => -105 + k * 72);
const liquidHandle = (() => {
  const [x0, y0] = P(26, rad(-145)), [x1, y1] = P(188, rad(-105));
  return [x0 + (x1 - x0) * 0.62, y0 + (y1 - y0) * 0.62];
})();

// The spool's window ring curves down to its floor below the windows: a gradient drop from the windows' inner edge
// (126) to the ring's inner edge (116), on the ring only. A mask keeps it off the body (frame or spool spokes) that
// crosses over it. `side` keeps the ids apart.
const curvedFloor = (side) =>
  `<mask id="liquid-${side}-floor"><rect x="-215" y="-250" width="430" height="470" fill="#fff"/><use href="#body" fill="#000"/></mask>` +
  `<g mask="url(#liquid-${side}-floor)">${sunkFace({ id: `liquid-${side}`, wall: RIM.rIn, floor: 116, cut: slots(RIM) + circle(116) })}</g>`;

// The drag side's middle spoke, one straight taper: 104 wide under the foot, narrowing evenly to 44 at 6 o'clock,
// its ends following the rim's outer edge. It's a separate piece laid over the rim, so its whole outline is
// chamfered, across the rim too.
const MIDDLE_SPOKE = (() => {
  // Where the side through (x0, -196) and (x1, 196) meets the rim's outer edge, top (-1) or bottom (1).
  const meet = (x0, x1, end) => {
    const k = (x1 - x0) / 392, c = x0 + 196 * k; // x = c + k * y
    const y = (end * Math.sqrt(200 ** 2 * (1 + k * k) - c * c) - c * k) / (1 + k * k);
    return [c + k * y, y];
  };
  const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const tl = meet(-52, -22, -1), tr = meet(52, 22, -1), br = meet(52, 22, 1), bl = meet(-52, -22, 1);
  return `M${pt(tl)}A200 200 0 0 1 ${pt(tr)}L${pt(br)}A200 200 0 0 1 ${pt(bl)}Z`;
})();

// The drag button takes the finish's accent: orange-red on Smoke, yellow on Day Break.
export const drag = svg({
  cage: [ring(190, 116) + slots(RIM)],
  body: [
    ring(200, 181),
    foot(128, -244, 14, 34),
    MIDDLE_SPOKE,
    // The Y arms leave it a little below halfway between the drag knob and the rim (at about y -98) and rise
    // steeply to the rim.
    strut([-30, -81], P(194, rad(-122)), 20, 15),
    strut([30, -81], P(194, rad(-58)), 20, 15),
  ],
  // The middle spoke's chamfer, then a dark chamfer, a flat facet, all the way round the frame's outer edge. That
  // runs across the foot's post where it meets the frame, so the foot reads as a separate piece, and across the
  // spoke's ends, where the spoke's own chamfer stops short of it, so the ends are shaded like the rim.
  details:
    curvedFloor('drag') +
    `<clipPath id="liquid-spoke-clip"><circle r="196"/></clipPath><g clip-path="url(#liquid-spoke-clip)">${chamfer('liquid-spoke', MIDDLE_SPOKE)}</g>` +
    `<path d="${ring(200, 196)}" fill="#000" fill-opacity=".2" fill-rule="evenodd"/><path d="${knurl(60, 3.5, 20)}" fill="#3a3d41"/><path d="${knurl(60, 3.5, 20)}" fill="url(#sheen)"/><circle r="36" fill="#2f3235"/><circle r="18" ${ACCENT}/><circle cx="-4" cy="5" r="3" fill="#000" fill-opacity=".45"/><circle cx="4" cy="-5" r="3" fill="#000" fill-opacity=".45"/>`,
});

export const spool = svg({
  foot: recessed(foot(128, -244, 14, 34)),
  handles: [[...liquidHandle, 16]],
  // The spool's window ring, set back behind its rim and spokes.
  back: [ring(190, 116) + slots(RIM)],
  body: [ring(200, 184), ...LIQUID_SPOKES.map((a) => spoke(a, 26, 188, 20, 13, 40)), circle(38)],
  details: `${curvedFloor('spool')}${knob(...liquidHandle, 16)}<circle r="30" fill="#fff" fill-opacity=".1"/>`,
});
