// Lamson Speedster S.
// The photos are three-quarter views; the straight-on spoke angles, the 16-slot ring and the handle radius are inferred.
import { P, circle, foot, knob, knurl, rad, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

// Drag side: a wide bar tapering from the foot to the hub, a slim one down to 6 o'clock and two spokes a side,
// leaving big open windows.
const SPEEDSTER_SPOKES = [-12, 42, 138, -168];
// Knurled drag ring around a three-armed spinner.
const speedsterKnob = () => {
  const arms = [0, 1, 2].map((k) => spoke(-60 + k * 120, 0, 40, 18, 12, 22)).join('');
  return `<path d="${knurl(52, 1.6, 48)}" fill="#2e3134"/><circle r="42" fill="#3d4044"/><path d="${arms}" fill="#5a5e62"/><circle r="42" fill="url(#sheen)"/><circle r="13" fill="#26282b"/><circle cx="-4" cy="4" r="2.4" fill="#6a6e72"/><circle cx="4" cy="-4" r="2.4" fill="#6a6e72"/>`;
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

// Spool side: a slotted outer ring and five straight spokes from the hub to the rim, plus a short sixth that
// ends at the handle in the wide gap at the upper left.
const holes = [0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${P(13, rad(k * 60)).map((v) => v.toFixed(1)).join('" cy="')}" r="3" fill="#2a2c2e"/>`).join('');
export const spool = svg({
  back: [foot(128, -244, 14, 34)],
  body: [
    ring(200, 128) + slots({ n: 16, rIn: 140, rOut: 186, bar: 14, corner: 7 }),
    ...[-72, -10, 49, 102, 163].map((a) => spoke(a, 26, 192, 22, 15)),
    spoke(-125, 26, 126, 24, 20),
    circle(32),
  ],
  details: `${knob(...P(130, rad(-125)), 17)}<circle r="22" fill="#000" fill-opacity=".18"/>${holes}<circle r="4" fill="#d6d8d6"/>`,
});
