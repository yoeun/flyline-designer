// Lamson Speedster S.
// The photos are three-quarter views; the straight-on spoke angles, the 16-slot ring and the handle radius are inferred.
import { P, circle, foot, knob, knurl, rad, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

// Drag side: a wide bar tapering from the foot to the hub, a slim one down to 6 o'clock and two spokes a side,
// leaving big open windows. With the two bars they make six spokes 60° apart, each on a bar of the ring behind.
const SPEEDSTER_SPOKES = [-30, 30, 150, -150];
// Knurled drag ring around a three-armed spinner, with the Liquid S's orange center button.
const speedsterKnob = () => {
  const arms = [0, 1, 2].map((k) => spoke(-60 + k * 120, 0, 40, 18, 12, 22)).join('');
  return `<path d="${knurl(52, 1.6, 48)}" fill="#2e3134"/><circle r="42" fill="#3d4044"/><path d="${arms}" fill="#5a5e62"/><circle r="42" fill="url(#sheen)"/><circle r="15" fill="#e2581f"/><circle cx="-4" cy="4" r="2.6" fill="#7a2a0c"/><circle cx="4" cy="-4" r="2.6" fill="#7a2a0c"/>`;
};

const SLOT_RING = ring(190, 128) + slots({ n: 18, rIn: 140, rOut: 182, bar: 13, corner: 7 });
export const drag = svg({
  back: [SLOT_RING],
  body: [
    ring(200, 188),
    foot(128, -244, 14, 34),
    roundPoly([[-58, -196], [58, -196], [30, -42], [-30, -42]], 8),
    strut([0, 40], [0, 196], 28, 22),
    ...SPEEDSTER_SPOKES.map((a) => spoke(a, 44, 194, 22, 16)),
  ],
  details: speedsterKnob(),
});

// Spool side, like the Liquid S: six spokes, each tangent to a small hexagon at the hub, sweeping out counter-clockwise
// to the cage, where each lands on a bar of the 18-window ring (every third). The handle is on the upper-left spoke.
const HEX = 38; // hexagon's inner radius: each spoke's line passes this far from the center
const CAGE = 132; // where the spokes meet the window ring
const REACH = Math.sqrt(CAGE * CAGE - HEX * HEX);
const SWEEP = (Math.atan2(REACH, HEX) * 180) / Math.PI; // outer end, degrees clockwise of the tangent point
const SPOKE_ENDS = [0, 1, 2, 3, 4, 5].map((k) => -75 + k * 60);
// Drawn clockwise, then mirrored top to bottom and turned one cage bar (20°) counter-clockwise.
const TURN = rad(-20);
const flip = ([x, y]) => [x * Math.cos(TURN) + y * Math.sin(TURN), x * Math.sin(TURN) - y * Math.cos(TURN)];
// A spoke: from its hexagon corner (behind the tangent point) into the cage ring.
const spokeLine = (end) => {
  const t = rad(end - SWEEP), [tx, ty] = P(HEX, t), d = [-Math.sin(t), Math.cos(t)];
  const at = (u) => [tx + d[0] * u, ty + d[1] * u];
  return { from: flip(at(-HEX * Math.tan(rad(30)))), cage: flip(at(REACH + 4)) };
};
const SPOKE_LINES = SPOKE_ENDS.map(spokeLine);
const handle = SPOKE_LINES[4].cage;
const holes = [0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${P(13, rad(k * 60)).map((v) => v.toFixed(1)).join('" cy="')}" r="3" fill="#2a2c2e"/>`).join('');
export const spool = svg({
  back: [foot(128, -244, 14, 34)],
  body: [
    ring(200, 128) + slots({ n: 18, rIn: 140, rOut: 186, bar: 14, corner: 7, off: -SPOKE_ENDS[0] }),
    ...SPOKE_LINES.map(({ from, cage }) => strut(from, cage, 22, 16)),
    roundPoly(SPOKE_LINES.map(({ from }) => from), 3),
    circle(30),
  ],
  details: `${knob(...handle, 17)}<circle r="20" fill="#000" fill-opacity=".18"/>${holes}<circle r="4" fill="#d6d8d6"/>`,
});
