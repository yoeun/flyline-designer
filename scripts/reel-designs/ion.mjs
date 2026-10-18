// Echo Ion.
// Drag side traced from Echo's straight-on shot of the 6/7 (the right half of its two-sided product photo) and
// Trident's close-ups: a thin rim; a pair of bars straight down from the foot, wide apart above the hub with a
// window between them and close together below it with a slot between them; a second pair across the reel, tilted
// a little (higher on the right), with a slot between them holding a frame screw near each end; one spoke out to the
// rim in each quadrant; and a thin ring around the boss of the big grey knurled drag knob, with a gap between them.
// The spool's face shows through the windows.
// Spool side drawn from Trident's bare-spool shots and Echo's three-quarter view, so it's approximate: a ring of
// twelve windows between radial bars, an inner ring, six windows around a raised hub under the black knurled spool
// release knob; the handle (black, with a polished steel screw in its end) at 9 o'clock and a black counterweight
// knob opposite. Window counts on the spool face, spoke angles on the frame and the boss gap are approximate.
import { P, circle, f, foot, knurl, rad, recessed, ring, screw, slots, spoke, strut, svg } from './lib.mjs';

// The wound line starts on the drum: Trident measured the 7/9's arbor at 1.98 in inside a 3.9 in rim.
export const arbor = 102;

const RIM_IN = 179; // inner edge of the frame's rim
const BOSS = 76; // the drag knob's boss
const TILT = -4; // degrees the cross bars lean, right side up

const FOOT = foot(128, -236, 16, 44);

// The spool's face as seen through the frame: its window ring and inner ring.
const SPOOL_FACE = (rIn) => ring(196, rIn) + slots({ n: 12, rIn: 116, rOut: 182, bar: 15, corner: 10 });

// A pair of parallel bars along angle `deg` from r0 to r1, `gap` apart, each w wide.
const pair = (deg, r0, r1, gap, w) => {
  const a = rad(deg), n = [-Math.sin(a), Math.cos(a)];
  return [-1, 1].map((s) => {
    const o = s * (gap + w) / 2;
    const at = (r) => [r * Math.cos(a) + n[0] * o, r * Math.sin(a) + n[1] * o];
    return strut(at(r0), at(r1), w);
  });
};

// The cross bars' slots hold a frame screw near each end.
const crossScrews = [0, 180].map((d) => P(140, rad(d + TILT)));

export const drag = svg({
  back: [SPOOL_FACE(104)],
  body: [
    ring(200, RIM_IN),
    FOOT,
    // Top pair: wide apart, merging into a block under the foot and closing over the hub, with a window between.
    ...pair(-90, BOSS - 6, 196, 40, 14),
    strut([0, -RIM_IN - 4], [0, -156], 70),
    strut([0, -86], [0, -BOSS + 4], 64),
    // Bottom pair: close together, a slot between them down to the rim.
    ...pair(90, BOSS - 6, 196, 8, 13),
    // Cross pair, tilted.
    ...pair(TILT, BOSS - 6, 194, 16, 12),
    ...pair(180 + TILT, BOSS - 6, 194, 16, 12),
    // One spoke per quadrant, from the inner ring to the rim.
    ...[-46, 44, 134, -134].map((d) => spoke(d, 90, 194, 18, 22)),
    // Thin ring around the boss, and the boss.
    ring(97, 88),
    circle(BOSS),
  ],
  details:
    `<circle r="${RIM_IN}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    crossScrews.map(([x, y]) => screw(x, y, 5.5)).join('') +
    // The drag knob: grey, finely knurled rim, flat face with a black center screw.
    `<circle r="${BOSS}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
    `<path d="${knurl(66, 1.2, 72)}" fill="#3e4145"/><path d="${knurl(66, 1.2, 72)}" fill="url(#sheen)"/>` +
    `<circle r="58" fill="#55595e"/><circle r="58" fill="url(#sheen)"/>` +
    `<circle r="10" fill="#1d1f21"/><path d="M-5 0L5 0M0 -5L0 5" stroke="#55595e" stroke-width="2" stroke-linecap="round"/>`,
});

// Spool side.
const handle = P(140, rad(172));
const weight = P(140, rad(-8));

export const spool = svg({
  foot: recessed(FOOT),
  handles: [[...handle, 20]],
  body: [
    circle(200) + slots({ n: 12, rIn: 120, rOut: 182, bar: 19, corner: 11, off: -8 }) + slots({ n: 6, rIn: 60, rOut: 100, bar: 17, corner: 9, off: -8 }),
  ],
  details:
    `<circle r="190" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    // Raised hub and the black knurled spool release knob.
    `<circle r="56" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="3"/>` +
    `<path d="${knurl(40, 1.2, 48)}" fill="#1f2123"/><circle r="33" fill="#2a2d30"/><circle r="40" fill="url(#sheen)"/>` +
    // Counterweight: a plain black knob.
    `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="17" fill="#1f2123"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="17" fill="url(#sheen)"/>` +
    // Handle: black, with a polished steel slotted screw in its end.
    `<circle cx="${f(handle[0])}" cy="${f(handle[1])}" r="20" fill="#1f2123"/><circle cx="${f(handle[0])}" cy="${f(handle[1])}" r="20" fill="url(#sheen)"/>` +
    `<circle cx="${f(handle[0])}" cy="${f(handle[1])}" r="10" fill="#c9ccc8"/><circle cx="${f(handle[0])}" cy="${f(handle[1])}" r="10" fill="url(#sheen)"/>` +
    `<path d="M${f(handle[0] - 6)} ${f(handle[1] + 3)}L${f(handle[0] + 6)} ${f(handle[1] - 3)}" stroke="#55595c" stroke-width="2" stroke-linecap="round"/>`,
});
