// Lamson Guru S.
// The photos are three-quarter views; the straight-on spoke angles, the slot counts and the handle radius are inferred.
import { P, circle, foot, knob, rad, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

// Drag side: a wide bar tapering from the foot to the hub, a narrow one down to 6 o'clock, and three spokes a side,
// all 45° apart. Each runs on through the window ring behind, two windows to a gap.
const GURU_SPOKES = [-45, 0, 45, 135, 180, -135];
// Cast drag cap: five swept lobes around a black center.
const guruKnob = () => {
  const lobes = [0, 1, 2, 3, 4]
    .map((k) => {
      const a = -90 + k * 72;
      const [x0, y0] = P(18, rad(a)), [xc, yc] = P(44, rad(a + 14)), [x1, y1] = P(58, rad(a + 34));
      return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)}Q${xc.toFixed(1)} ${yc.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}" stroke="#6c6f72" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    })
    .join('');
  return `<circle r="64" fill="#3f4245"/><circle r="61" fill="#9a9da0"/>${lobes}<circle r="61" fill="url(#sheen)"/><circle r="17" fill="#1d1f21"/><circle cx="-5" cy="5" r="2.6" fill="#55595c"/><circle cx="5" cy="-5" r="2.6" fill="#55595c"/>`;
};

export const drag = svg({
  back: [ring(190, 116) + slots({ n: 16, rIn: 128, rOut: 180, bar: 13, corner: 7 })],
  body: [
    ring(200, 186),
    foot(128, -244, 14, 34),
    roundPoly([[-62, -196], [62, -196], [34, -52], [-34, -52]], 8),
    strut([0, 40], [0, 196], 38, 34),
    ...GURU_SPOKES.map((a) => spoke(a, 50, 192, 28, 22)),
  ],
  details: guruKnob(),
});

// Spool side: a rim of 20 square slots round an inner band, and six thin spokes from the cap to the band;
// the handle sits where the upper-left one meets the band.
export const spool = svg({
  back: [foot(128, -244, 14, 34)],
  body: [
    ring(200, 124) + slots({ n: 20, rIn: 138, rOut: 186, bar: 14, corner: 6 }),
    ...[-90, -30, 30, 90, 150, 210].map((a) => spoke(a, 30, 130, 22, 15)),
    circle(44),
  ],
  details: `${knob(...P(134, rad(-150)), 17)}<circle r="36" fill="#fff" fill-opacity=".1"/>`,
});
