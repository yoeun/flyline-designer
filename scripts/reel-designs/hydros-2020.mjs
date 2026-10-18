// Orvis Hydros (2020–25): the 2026 Hydros's frame and spool, without the thin inner bars on the drag side, and with
// three pairs of straight spokes on the spool side, each pair as wide as the hub. As on the 2026 reel, the drag
// side's frame is the rim, foot, two bars and knob, and the window ring behind it is the spool's cage.
import { dragKnob, rad, strut, svg } from './lib.mjs';
import { HUB, HYDROS_CAGE, HYDROS_FOOT, HYDROS_FRAME, hydrosSpool } from './hydros.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 116;

export const drag = svg({ under: HYDROS_FOOT, cage: HYDROS_CAGE, body: HYDROS_FRAME, details: dragKnob(64) });

const W = 14;
const PAIRS = [-90, 30, 150].flatMap((deg) => {
  const a = rad(deg), u = [Math.cos(a), Math.sin(a)], n = [-u[1], u[0]];
  return [-1, 1].map((side) => {
    const off = side * (HUB - W / 2), at = (t) => [n[0] * off + u[0] * t, n[1] * off + u[1] * t];
    return strut(at(0), at(Math.sqrt(108 * 108 - off * off)), W, W);
  });
});

export const spool = hydrosSpool(PAIRS);
