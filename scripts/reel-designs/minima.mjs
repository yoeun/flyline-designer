// Maxcatch Minima.
// Drag side traced from Maxcatch's straight-on spec drawing of the 0Three (the left reel of its "Inside DIA /
// Outside DIA" graphic) and checked against the three-quarter frame-side product shot. The frame is just the foot
// and one broad bar straight down from it past the bottom of the rim, tapering a little, with a window just under
// the foot, a round logo boss over the hub, a pair of long slots either side of a center rib below it and a screw
// near its foot end; there's no rim and no drag knob (a clicker inside). Everything round is the spool's cage,
// which turns: its back flange, the same as the spool side's, a rim, a ring of fourteen windows and the inner ring
// that bounds the super large arbor, with the U-shaped drum open inside. The handle would show through too, but
// the wound line hides it.
// Spool side from the three-quarter spool-side shot: the same flange, open inside the inner ring except for one bar
// across the reel holding the logo hub and, at its right end, the black handle, with the frame bar behind. The
// spool shot is at an angle, so its window count, the bar's width and the handle's radius are approximate, as are
// the frame bar's windows and taper.
import { P, circle, f, foot, knob, rad, recessed, ring, roundPoly, screw, slots, strut, svg } from './lib.mjs';

// The wound line starts on the drum, the flange's inner ring: 50 mm inside an 81 mm rim on the 0Three
// (56 inside 89 on the 2Five), so 200 × 50/81 ≈ 123 to 126.
export const arbor = 124;

const RIM_IN = 182; // inner edge of the spool's rim
const RING_OUT = 136; // outer edge of the flange's inner ring

// The spool flange: rim, a ring of fourteen windows and the inner ring, open inside it.
const FLANGE = (off) => ring(200, arbor) + slots({ n: 14, rIn: RING_OUT, rOut: RIM_IN, bar: 13, corner: 9, off });

const FOOT = foot(150, -244, 14, 50);
// The frame: one bar from the foot down past the rim, 100 wide under the foot and 74 at the bottom.
const BAR = roundPoly([[-50, -190], [50, -190], [37, 214], [-37, 214]], 14);
// Its cut-outs: a window under the foot, then two long slots tapering down either side of a center rib below the
// logo boss.
const BAR_HOLES =
  roundPoly([[-34, -176], [34, -176], [33, -128], [-33, -128]], 8) +
  roundPoly([[-34, 56], [-8, 56], [-8, 150], [-29, 150]], 6) +
  roundPoly([[8, 56], [34, 56], [29, 150], [8, 150]], 6);

export const drag = svg({
  // The spool's back flange, a window centered at 9 and 3.
  cage: [FLANGE(-90)],
  body: [BAR + BAR_HOLES, FOOT],
  details:
    `<circle r="${RIM_IN}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    // The bar's bottom end: a cross piece and a screw.
    `<path d="M-31 172L31 172" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    screw(0, 190, 7) +
    // The round logo boss with its silver ring.
    `<circle r="46" fill="#000" fill-opacity=".22"/><circle r="42" fill="#c9ccc8"/><circle r="38" fill="currentColor"/>` +
    `<circle r="38" fill="#000" fill-opacity=".12"/><circle r="38" fill="url(#sheen)"/>` +
    `<path d="M-16 8L-11 -12L0 2L11 -12L16 8" fill="none" stroke="#c9ccc8" stroke-width="4" stroke-linejoin="round"/>`,
});

// Spool side: a bar straight across the open drum holding the hub, with the handle at its right end.
const handle = P(100, rad(0));

export const spool = svg({
  foot: recessed(FOOT, BAR + BAR_HOLES),
  handles: [[...handle, 18]],
  body: [FLANGE(0), strut([-130, 0], [130, 0], 30), circle(30)],
  details:
    `<circle r="190" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="${arbor}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>` +
    // The logo hub, a little proud of the bar.
    `<circle r="30" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
    `<path d="M-11 -9Q-6 10 0 -2Q6 10 11 -9" fill="none" stroke="#c9ccc8" stroke-width="3.5" stroke-linecap="round"/>` +
    // The handle's silver post collar under the black knob.
    `<circle cx="${f(handle[0])}" cy="${f(handle[1])}" r="22" fill="#8d9092"/>` +
    knob(...handle, 18),
});
