// Redington Zero.
// Drag side: no drag knob (click-pawl reel); one wide band runs from the foot straight down to 6 o'clock, flaring into
// a forked Y where it meets the rim at each end. The spool's hooked fingers show through the two big side windows.
// Spool side: ~24 hooked fingers reach in from the rim; every fourth is a full spoke to the hub. Handle position is
// inferred from angled photos.
import { P, bars, circle, foot, knob, rad, ring, roundPoly, spoke, svg } from './lib.mjs';

// Fingers from the rim inward, hooking sideways at the tip.
const finger = (deg, rOut, rIn, w) => bars([P(rOut, rad(deg)), P(rIn, rad(deg)), P(rIn - 12, rad(deg + 6))], w);
const FINGERS = Array.from({ length: 24 }, (_, k) => -90 + 7.5 + k * 15);
// The fingers reach down to about where the backing starts (the arbor, ~103–116 across the sizes).
const FINGER_IN = 106;

export const drag = svg({
  back: [ring(186, 176), ...FINGERS.flatMap((a) => finger(a, 180, FINGER_IN, 13)), circle(30)],
  body: [
    ring(200, 182),
    foot(150, -244, 14, 30),
    roundPoly([[-92, -190], [-48, -96], [-48, 96], [-92, 190], [92, 190], [48, 96], [48, -96], [92, -190]], 10) +
      roundPoly([[-24, -184], [24, -184], [0, -114]], 8) +
      roundPoly([[-24, 184], [24, 184], [0, 114]], 8),
  ],
  details: '',
});

// The handle sits on one of the full spokes, near the rim.
const HANDLE = -142.5;
export const spool = svg({
  back: [foot(150, -244, 14, 30)],
  body: [
    ring(200, 182),
    ...FINGERS.filter((_, k) => k % 4 !== 0).flatMap((a) => finger(a, 188, FINGER_IN, 14)),
    ...FINGERS.filter((_, k) => k % 4 === 0).map((a) => spoke(a, 20, 190, 16, 14)),
    circle(30),
    circle(22, ...P(150, rad(HANDLE))),
  ],
  details: `<circle r="22" fill="#000" fill-opacity=".12"/><circle r="22" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` + knob(...P(150, rad(HANDLE)), 16),
});
