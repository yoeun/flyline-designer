// Redington Zero.
// Drag side: no drag knob (click-pawl reel). The frame is a rim, the foot and one wide band from the foot straight
// down to 6 o'clock, flaring into a forked Y where it meets the rim at each end. Through the two big side windows
// shows the spool's cage, which turns: the same fingers and spokes as the spool side, hooking the other way as seen
// from behind, without the handle (the wound line hides it). Spool side: ~24 hooked fingers reach in from the rim; every third is a full spoke to the hub. Handle position is
// inferred from angled photos. The fingers reach down to about where the backing starts, which differs by size:
// this is the 4/5; zero-23.mjs is the 2/3.
import { P, circle, foot, knob, rad, recessed, ring, roundPoly, spoke, svg } from './lib.mjs';

// Fingers from the rim inward, hooking sideways at the tip (`hook` degrees; negative hooks the other way). One outline,
// mitred at the bend, so the cage's shading doesn't double up where two bars would overlap.
const finger = (deg, rOut, rIn, w, hook = 6) => {
  const [a, b, c] = [P(rOut, rad(deg)), P(rIn, rad(deg)), P(rIn - 12, rad(deg + hook))];
  const normal = (p, q) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [(p[1] - q[1]) / l, (q[0] - p[0]) / l]; };
  const n1 = normal(a, b), n2 = normal(b, c), k = 1 / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
  const at = (p, n, s) => [p[0] + (n[0] * s * w) / 2, p[1] + (n[1] * s * w) / 2];
  const m = [(n1[0] + n2[0]) * k, (n1[1] + n2[1]) * k];
  return [roundPoly([at(a, n1, 1), at(b, m, 1), at(c, n2, 1), at(c, n2, -1), at(b, m, -1), at(a, n1, -1)], 3)];
};
// 24 fingers 15° apart; every third is a full spoke, so the eight spokes sit 45° apart with two level.
const FINGERS = Array.from({ length: 24 }, (_, k) => k * 15);
// The handle sits on one of the full spokes, near the rim.
const HANDLE = -135;

// The spool's rim, fingers, spokes and hub, shared by both sides; the drag side sees it from behind, hooks mirrored.
const spoolCage = (fingerIn, hook) => [
  ring(200, 182),
  ...FINGERS.filter((_, k) => k % 3 !== 0).flatMap((a) => finger(a, 188, fingerIn, 14, hook)),
  ...FINGERS.filter((_, k) => k % 3 === 0).map((a) => spoke(a, 20, 190, 16, 14)),
  circle(30),
];

// Both sides, with the fingers' inner ends at radius `fingerIn`.
export const zeroSides = (fingerIn) => ({
  drag: svg({
    cage: spoolCage(fingerIn, -6),
    body: [
      ring(200, 182),
      foot(150, -244, 14, 30),
      roundPoly([[-92, -190], [-48, -96], [-48, 96], [-92, 190], [92, 190], [48, 96], [48, -96], [92, -190]], 10) +
        roundPoly([[-24, -184], [24, -184], [0, -114]], 8) +
        roundPoly([[-24, 184], [24, 184], [0, 114]], 8),
    ],
    details: '',
  }),
  spool: svg({
    foot: recessed(foot(150, -244, 14, 30)),
    handles: [[...P(150, rad(HANDLE)), 22]],
    body: [
      ...spoolCage(fingerIn, 6),
      circle(22, ...P(150, rad(HANDLE))),
    ],
    details: `<circle r="22" fill="#000" fill-opacity=".12"/><circle r="22" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` + knob(...P(150, rad(HANDLE)), 16),
  }),
});

// The wound line starts where the fingers end.
export const arbor = 121;
export const { drag, spool } = zeroSides(arbor);
