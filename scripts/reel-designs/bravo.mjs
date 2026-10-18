// Echo Bravo.
// Drag side traced from Echo's straight-on render and Trident Fly Fishing's near-straight-on photo: a thin rim and six
// thin straight spokes 60° apart (one pair horizontal) around the sealed drag's boss, with two short fingers reaching
// in from the rim between each pair, and at 12 and 6 a forked tab screwed to the rim instead. The drag knob is a dark
// knurled cylinder with a two-tone face (the logo is left out).
// Spool side drawn from Trident's three-quarter photos (no straight-on shot): a thin rim around a ring of twenty
// windows that narrow to a point at the drum, three spokes inside the drum to a black knurled release cap, the
// handle up and to the right and a counterweight down and to the left. The red drag stack (the finish's accent)
// shows through the drum's windows, and as a sliver round the boss on the drag side. Window shapes and count, the
// spool spokes' angles and the handle and counterweight positions are approximate.
import { ACCENT, P, circle, edge, f, foot, knob, knurl, rad, recessed, rect, ring, roundPoly, screw, spoke, svg } from './lib.mjs';

// The wound line starts on the drum, at the windows' points: 7/9 is about 2.32 in inside 4.25 in.
export const arbor = 109;

// Spool flange: n windows between bars `bar` wide from the rim down to rKink, each then narrowing to a point at rTip.
const flangeWindows = ({ n, rOut, rKink, rTip, bar, off = -90 }) =>
  Array.from({ length: n }, (_, k) => {
    const a0 = rad(off + (k * 360) / n), a1 = rad(off + ((k + 1) * 360) / n), mid = (a0 + a1) / 2;
    const A2 = edge(a0, bar / 2, rOut), B2 = edge(a1, -bar / 2, rOut);
    const A1 = edge(a0, bar / 2, rKink), B1 = edge(a1, -bar / 2, rKink);
    const aA = Math.atan2(A2[1], A2[0]);
    let aB = Math.atan2(B2[1], B2[0]);
    if (aB < aA) aB += 2 * Math.PI;
    const outer = Array.from({ length: 5 }, (_, i) => P(rOut, aA + ((aB - aA) * i) / 4));
    return roundPoly([...outer, B1, P(rTip, mid), A1], 6);
  }).join('');
const FLANGE = flangeWindows({ n: 20, rOut: 186, rKink: 146, rTip: 116, bar: 11 });

const FOOT = foot(112, -242, 14, 38);
const BOSS = 84;

// The sealed drag stack, red on the frame behind the spool.
const STACK = (r) => `<circle r="${r}" ${ACCENT}/><circle r="${r}" fill="#000" fill-opacity=".12"/>`;

// Drag side: two fingers in each side sector, and in the top and bottom sectors a fork of two parallel prongs
// joined by a block on the rim with a screw.
const FINGERS = [-40, -20, 20, 40, 140, 160, 200, 220].map((a) => spoke(a, 98, 190, 11, 12));
const fork = (sy) => [
  ...[-1, 1].map((sx) => (sy < 0 ? rect(sx * 20 - 6, -190, 12, 94, 4) : rect(sx * 20 - 6, 96, 12, 94, 4))),
  sy < 0 ? rect(-32, -190, 64, 24, 8) : rect(-32, 166, 64, 24, 8),
];

export const drag = svg({
  under: STACK(90),
  // The spool's flange behind the windows.
  back: [ring(196, 106) + FLANGE],
  body: [
    ring(200, 183),
    FOOT,
    ...[0, 60, 120, 180, 240, 300].map((a) => spoke(a, BOSS - 6, 190, 15, 13)),
    ...FINGERS,
    ...fork(-1),
    ...fork(1),
    circle(BOSS),
  ],
  details:
    `<circle r="183" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    screw(0, -178, 6) +
    screw(0, 178, 6) +
    // The drag knob: knurled sides, a face darker below a line across the middle.
    `<circle r="${BOSS}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    `<path d="${knurl(70, 1.8, 56)}" fill="#1f2123"/><path d="${knurl(70, 1.8, 56)}" fill="url(#sheen)"/>` +
    `<circle r="60" fill="#2a2d30"/><path d="M-60 0A60 60 0 0 0 60 0Z" fill="#000" fill-opacity=".25"/>` +
    `<circle r="60" fill="url(#sheen)"/><circle r="60" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`,
});

const handle = P(158, rad(-38));
const weight = P(160, rad(142));

export const spool = svg({
  // The red drag stack stays put on the frame while the spool turns over it; mostly hidden by the frame's dark boss
  // inside the drum, it shows as a thin ring round it.
  foot: recessed(FOOT) + STACK(104) + recessed(circle(92)) + `<circle r="92" fill="#000" fill-opacity=".35"/>`,
  handles: [[...handle, 18]],
  body: [
    circle(200) + FLANGE + circle(98),
    ...[-90, 30, 150].map((a) => spoke(a, 40, 102, 22, 18)),
    circle(54),
  ],
  details:
    `<circle r="188" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="98" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
    // The black knurled release cap.
    `<path d="${knurl(46, 1.5, 44)}" fill="#1f2123"/><circle r="38" fill="#2a2d30"/><circle r="46" fill="url(#sheen)"/>` +
    // Black counterweight and handle.
    `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="17" fill="#1f2123"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="13" fill="#34373b"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="17" fill="url(#sheen)"/>` +
    knob(...handle, 18),
});
