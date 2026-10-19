// Redington Run.
// Drawn from Redington's straight-on photos of both sides, empty, with a photo of the drag side with line on.
// Drag side: the frame is a rim, the foot, three spokes that widen toward the rim (two up, 80° apart either side
// of the foot, and a wider one down) and a black drag knob with a knurled edge and the logo cap. Through it shows
// the spool's back flange, which turns: 20 windows, plus the spool's eight primary spokes.
// Spool side: the frame's rim, then the spool's face flange with 20 windows and handle pads at 12 and 6 o'clock,
// a steep drop at the flange's inner edge, and eight evenly spaced primary spokes to the logo cap: four run on
// from face bars at the rim, down the drop (per the user, like the Ventures Ascent's).
// The two flanges' bars alternate: per the user, the light bars are the face flange's and the dark bars seen
// halfway across each window are the back flange's. So the drag side's window ring is offset half a window from
// the spool side's, and each side shows the other's bars through its windows (the app draws the far side behind).
// Measured by sampling the photos round the center (rim = 200).
import { P, circle, f, foot, knob, pickPaths, recessed, ring, spoke, sunkFace, svg, frameRim, taperedSlots } from './lib.mjs';

// The wound line starts just inside the windows' inner edge, on the dark drop below them.
export const arbor = 126;

// 20 windows from 127 to 177, 18° apart, between bars about 9 wide at the inner edge and 12 at the outer.
const N = 20, STEP = 360 / N;
const RIM = { n: N, rIn: 127, rOut: 177, barIn: 9, barOut: 12, corner: 3 };
// Face flange: a window centered at 12 o'clock. Back flange: a bar there, half a window round.
const FACE_OFF = -90 - STEP / 2, BACK_OFF = -90;
// The spool's eight primary spokes, evenly spaced (per the user), 45° apart from 27° clockwise of 12 o'clock.
// Every other one lands on a face bar and runs on into it; the rest end at the flange's inner edge, midway across
// a window. The drag side draws them mirrored, as the app shows it behind the spool side.
const SPOKES = Array.from({ length: 8 }, (_, k) => -63 + 45 * k);
const onFaceBar = (a) => (((a - FACE_OFF) % STEP) + STEP) % STEP === 0;
const innerSpokes = (angles) => angles.map((a) => spoke(a, 30, onFaceBar(a) ? 129 : 118, 11, 9));

const FOOT = foot(150, -240, 14, 30);

export const drag = svg({
  cage: [ring(185, 113) + taperedSlots({ ...RIM, off: BACK_OFF }), ...innerSpokes(SPOKES.map((a) => 180 - a))],
  body: [ring(200, 179), FOOT, spoke(-130, 50, 194, 30, 42), spoke(-50, 50, 194, 30, 42), spoke(90, 50, 194, 54, 58), circle(64)],
  details:
    `<circle r="62" fill="#222426"/><circle r="62" fill="url(#sheen)"/>` +
    Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * 2 * Math.PI;
      const [x0, y0] = P(52, a), [x1, y1] = P(59, a);
      return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#000" stroke-opacity=".55" stroke-width="2"/>`;
    }).join('') +
    `<circle r="24" fill="#1d1f22"/><circle r="20" fill="none" stroke="#d6d9d4" stroke-width="2.5"/>`,
});

// Spool side: handle pads fill the windows at 12 and 6 o'clock.
const PADS = [0, N / 2];
const faceWindows = pickPaths(taperedSlots({ ...RIM, off: FACE_OFF }), (k) => !PADS.includes(k));

export const spool = svg({
  foot: recessed(FOOT) + frameRim(),
  handles: [[0, -157, 14], [0, 157, 14]],
  body: [ring(185, 113) + faceWindows, ...innerSpokes(SPOKES), circle(34)],
  details:
    sunkFace({ id: 'run', wall: 127, floor: 113, cut: faceWindows + circle(113) }) +
    `${knob(0, -157, 14)}${knob(0, 157, 14)}` +
    `<circle r="34" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/><circle r="27" fill="#000" fill-opacity=".1"/>`,
});
