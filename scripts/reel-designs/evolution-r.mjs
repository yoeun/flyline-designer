// Ross Evolution R.
// Drag side: an outer band of twelve windows (wider posts at 3 and 9 o'clock), an inner ring, and six straight
// spokes holding a flat body-colored drag cap with the RR monogram; the spool's slotted back shows between them.
// Spool side: the same window band, with six spokes running from the hub right out to the rim; black handle
// at 9 o'clock, round counterweight at 3. Both from Ross's straight-on product photos.
import { P, circle, f, foot, knob, ring, slots, spoke, svg } from './lib.mjs';

const BAND = { n: 12, rIn: 152, rOut: 188, bar: 12, corner: 8, off: -90 };
const SPOKES = [0, 60, 120, 180, 240, 300];
const EVO_FOOT = foot(136, -244, 14, 30);
const RR = (stroke, opacity = 1) =>
  `<text x="0" y="12" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="38" letter-spacing="-10" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="1.8">RR</text>`;

export const drag = svg({
  back: [ring(148, 122) + slots({ n: 18, rIn: 128, rOut: 144, bar: 10, corner: 4 })],
  body: [
    ring(200, 146) + slots({ ...BAND, rIn: 160 }),
    EVO_FOOT,
    spoke(0, 140, 196, 26),
    spoke(180, 140, 196, 26),
    ...SPOKES.map((a) => spoke(a, 40, 150, 16, 14)),
    circle(48),
  ],
  details:
    `<circle r="48" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="3"/>` +
    `<circle r="40" fill="#000" fill-opacity=".06"/>` +
    RR('#000', 0.35),
});

const handleAt = P(162, Math.PI);
const weightAt = P(160, 0);

export const spool = svg({
  back: [EVO_FOOT],
  body: [
    ring(200, 144) + slots(BAND),
    ...SPOKES.map((a) => spoke(a, 30, 194, 14, 12)),
    circle(40),
  ],
  details:
    `<circle r="30" fill="#000" fill-opacity=".25"/><circle r="27" fill="#6f7377"/><circle r="27" fill="url(#sheen)"/>` +
    RR('#d8dbd6') +
    `<circle cx="${f(weightAt[0])}" cy="${f(weightAt[1])}" r="17" fill="#000" fill-opacity=".18"/><circle cx="${f(weightAt[0])}" cy="${f(weightAt[1])}" r="14" fill="#7c8084"/><circle cx="${f(weightAt[0])}" cy="${f(weightAt[1])}" r="14" fill="url(#sheen)"/>` +
    knob(...handleAt, 24),
});
