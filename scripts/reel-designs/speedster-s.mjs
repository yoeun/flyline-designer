// Lamson Speedster S.
// The photos are three-quarter views; the straight-on spoke angles, the 18-slot ring and the handle radius are inferred.
// Drag side: the frame is a rim, the foot, a wide bar tapering from the foot to the hub, a slim one down to 6 o'clock
// and two spokes a side, round the knurled drag knob. Through it shows the spool's cage, which turns: its 18
// windows, the same as the spool side's, without the handle (the wound line hides it). Spool side: that window ring,
// six spokes off a small hexagon at the hub, the handle on the upper-left one.
import { ACCENT, P, circle, foot, hexSpokes, knob, knurl, rad, recessed, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 140;

// The spool side's six spokes end at these angles, and its 18 windows start from the first; both sides share them.
const SPOKE_ENDS = [0, 1, 2, 3, 4, 5].map((k) => 55 - k * 60);
const RIM = { n: 18, rIn: 140, rOut: 186, bar: 14, corner: 7, off: SPOKE_ENDS[0] };

// Drag side: a wide bar tapering from the foot to the hub, a slim one down to 6 o'clock and two spokes a side,
// leaving big open windows. With the two bars they make six spokes 60° apart.
const SPEEDSTER_SPOKES = [-30, 30, 150, -150];
// Knurled drag ring around a three-armed spinner; the center button takes the finish's accent (orange on Ember).
const speedsterKnob = () => {
  const arms = [0, 1, 2].map((k) => spoke(-60 + k * 120, 0, 40, 18, 12, 22)).join('');
  return `<path d="${knurl(52, 1.6, 48)}" fill="#2e3134"/><circle r="42" fill="#3d4044"/><path d="${arms}" fill="#5a5e62"/><circle r="42" fill="url(#sheen)"/><circle r="15" ${ACCENT}/><circle r="15" fill="url(#sheen)"/><circle cx="-4" cy="4" r="2.6" fill="#000" fill-opacity=".45"/><circle cx="4" cy="-4" r="2.6" fill="#000" fill-opacity=".45"/>`;
};

export const drag = svg({
  cage: [ring(192, 128) + slots(RIM)],
  body: [
    ring(200, 188),
    foot(128, -244, 14, 34),
    roundPoly([[-58, -196], [58, -196], [30, -42], [-30, -42]], 8),
    strut([0, 40], [0, 196], 28, 22),
    ...SPEEDSTER_SPOKES.map((a) => spoke(a, 44, 194, 22, 16)),
  ],
  details: speedsterKnob(),
});

// Spool side, like the Liquid S, with the hub cap in the finish's accent: six spokes, each tangent to a small hexagon at the hub, sweeping out counter-clockwise
// to the cage, where each lands on a bar of the 18-window ring (every third). The handle is on the upper-left spoke.
const HEX = 38; // hexagon's inner radius: each spoke's line passes this far from the center
const SPOKE_LINES = hexSpokes({ hex: HEX, reach: 132, ends: SPOKE_ENDS, ccw: true, overshoot: 4 });
const handle = SPOKE_LINES[4].end;
const holes = [0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${P(13, rad(k * 60)).map((v) => v.toFixed(1)).join('" cy="')}" r="3" fill="#2a2c2e"/>`).join('');
export const spool = svg({
  foot: recessed(foot(128, -244, 14, 34)),
  handles: [[...handle, 17]],
  body: [
    ring(200, 128) + slots(RIM),
    ...SPOKE_LINES.map(({ corner, end }) => strut(corner, end, 22, 16)),
    roundPoly(SPOKE_LINES.map(({ corner }) => corner), 3),
    circle(30),
  ],
  details: `${knob(...handle, 17)}<circle r="24" ${ACCENT}/><circle r="24" fill="url(#sheen)"/><circle r="24" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>${holes}<circle r="4" fill="#d6d8d6"/>`,
});
