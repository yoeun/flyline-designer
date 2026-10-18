// Ross Evolution R.
// Drag side: the frame is a rim, the foot (in the finish's trim), wide posts at 3 and 9 o'clock, and a spider in the
// finish's accent (gold on Matte Olive, silver on Matte Blue, else the frame color): a ring, six straight spokes and
// a flat cap with the RR monogram. Through it shows the spool's cage, which turns: its twelve windows, the same as
// the spool side's, without the handle and counterweight (the wound line hides them), and inside them the spool's
// slotted back, between the spider's spokes. Spool side: the same window band, with six spokes running from the hub right out to the rim; black handle
// at 9 o'clock, round counterweight at 3. Both from Ross's straight-on product photos.
import { ACCENT, P, TRIM, circle, f, foot, knob, recessed, ring, slots, spoke, svg } from './lib.mjs';

// The wound line starts at the inner edge of the outer window band; the inner slots look into the arbor.
export const arbor = 152;

// The spool's twelve windows, shared by both sides.
const BAND = { n: 12, rIn: 152, rOut: 188, bar: 12, corner: 8, off: -90 };
const SPOKES = [0, 60, 120, 180, 240, 300];
const EVO_FOOT = foot(136, -244, 14, 30);
// The RR monogram sized to just touch a circle of radius r (proportions fitted on the Animas knob, r 64).
const RR = (r, stroke, opacity = 1) => {
  const k = r / 64;
  return `<text x="${f(-17 * k)}" y="${f(33 * k)}" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="${f(96 * k)}" letter-spacing="${f(-31 * k)}" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${f(Math.max(1.2, 2.6 * k))}">RR</text>`;
};

// The spider: ring, spokes and cap, drawn over the frame in the accent with its own shading.
const SPIDER = [ring(152, 138), ...SPOKES.map((a) => spoke(a, 40, 146, 16, 14)), circle(48)];
// Each part its own path, so the ring's hole stays open.
const spiderLayer = (attrs) => SPIDER.map((d) => `<path d="${d}" fill-rule="evenodd" ${attrs}/>`).join('');
const footArt = `<path d="${EVO_FOOT}" ${TRIM}/><path d="${EVO_FOOT}" fill="url(#sheen)"/>`;

export const drag = svg({
  under: footArt,
  cage: [ring(194, 122) + slots(BAND) + slots({ n: 18, rIn: 128, rOut: 144, bar: 10, corner: 4 })],
  body: [ring(200, 188), spoke(0, 150, 196, 26), spoke(180, 150, 196, 26)],
  details:
    spiderLayer('fill="#000" fill-opacity=".28" transform="translate(2 4)"') +
    spiderLayer(ACCENT) +
    spiderLayer('fill="url(#sheen)"') +
    `<circle r="48" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="3"/>` +
    `<circle r="40" fill="#000" fill-opacity=".06"/>` +
    RR(46, '#000', 0.35),
});

const handleAt = P(162, Math.PI);
const weightAt = P(160, 0);

export const spool = svg({
  foot: recessed(EVO_FOOT),
  handles: [[...handleAt, 24]],
  body: [
    ring(200, 144) + slots(BAND),
    ...SPOKES.map((a) => spoke(a, 30, 194, 14, 12)),
    circle(40),
  ],
  details:
    // The center cap matches the drag side's spider.
    `<circle r="30" fill="#000" fill-opacity=".25"/><circle r="27" ${ACCENT}/><circle r="27" fill="url(#sheen)"/>` +
    RR(25, '#000', 0.35) +
    `<circle cx="${f(weightAt[0])}" cy="${f(weightAt[1])}" r="17" fill="#000" fill-opacity=".18"/><circle cx="${f(weightAt[0])}" cy="${f(weightAt[1])}" r="14" fill="#7c8084"/><circle cx="${f(weightAt[0])}" cy="${f(weightAt[1])}" r="14" fill="url(#sheen)"/>` +
    knob(...handleAt, 24),
});
