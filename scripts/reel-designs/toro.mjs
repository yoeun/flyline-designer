// Maxcatch Toro.
// Spool side drawn from Maxcatch's three-quarter shot of the green 5/6; drag side from the black reels on a rod
// (a slight angle) and a near-frontal 7/8 beside its reel bag, with the frame's layout read off the exploded render
// of the bare frame from inside.
// Drag side: the frame is a thin rim on three slotted spokes, a Y with one up to the foot and two out to about 4 and
// 8 o'clock, around a big black knurled drag knob. Through it, and through the spokes' slots, shows the spool's
// cage, which turns: the spool side's band of fourteen windows and solid ring, and the web of five curved spokes
// inside it (seen from behind, so swept the other way). The handle and counterweight would show through too, but
// the wound line hides them. Spool side: the band of fourteen windows between straight bars, then a solid ring, and
// inside it an open web of five curved spokes out from a ring around the red hub, with the red knurled spool cap
// (the finish's accent) in the middle, a silver counterweight at about 3 o'clock and the black handle at 9. Foot
// and handle are black whatever the finish. Window counts and sizes, spoke angles and sweep are read off angled
// photos, so approximate, and the line guard hooking out under the frame is left out.
import { ACCENT, P, circle, f, foot, knob, knurl, rad, ring, roundPoly, slots, strut, svg } from './lib.mjs';

// The wound line starts at the drum: the 5/6 is 55 mm inside a 90 mm rim.
export const arbor = 122;

// The frame's spokes, by angle (degrees, y down), width and where the slot down each one's middle runs.
const FRAME_SPOKES = [
  { deg: -90, w: 44, slot: [96, 170] },
  { deg: 30, w: 38, slot: [100, 168] },
  { deg: 150, w: 38, slot: [100, 168] },
];

const FOOT = foot(126, -244, 14, 30);
const BLACK_FOOT = `<path d="${FOOT}" fill="#1f2123"/><path d="${FOOT}" fill="url(#sheen)"/>`;

// The spool face: fourteen windows from 136 out to the rim's inner edge, then a solid ring down to 124.
const WINDOWS = slots({ n: 14, rIn: 136, rOut: 186, bar: 14, corner: 6, off: -90 });
const FACE = circle(200) + WINDOWS + circle(124);
const CAGE = ring(192, 124) + WINDOWS;

// The web inside the ring: five spokes leaving the hub ring swept clockwise, then straightening out to meet the
// face's inner edge square on.
const curvedSpoke = (a0, a1, r0, r1, w) => {
  const mid = Array.from({ length: 11 }, (_, i) => P(r0 + ((r1 - r0) * i) / 10, rad(a0 + (a1 - a0) * (1 - ((10 - i) / 10) ** 2))));
  const side = (s) =>
    mid.map((p, i) => {
      const q = mid[Math.min(i + 1, 10)], o = mid[Math.max(i - 1, 0)];
      const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy);
      return [p[0] - (dy / l) * (w / 2) * s, p[1] + (dx / l) * (w / 2) * s];
    });
  return roundPoly([...side(1), ...side(-1).reverse()], 4);
};
// `mirror` flips them for the view from behind, through the frame.
const web = (mirror = false) =>
  [-110, -38, 34, 106, 178].map((a) => (mirror ? curvedSpoke(180 - a, 152 - a, 70, 128, 22) : curvedSpoke(a, a + 28, 70, 128, 22)));
const HUB_RING = ring(76, 62);

export const drag = svg({
  under: BLACK_FOOT,
  // The spool's back face behind the frame: its windows and web, as on the spool side.
  cage: [CAGE, ...web(true), HUB_RING],
  body: [
    ring(200, 186),
    // Each spoke with its slot cut through (evenodd), so the spool shows in it.
    ...FRAME_SPOKES.map(({ deg, w, slot: [s0, s1] }) => strut(P(60, rad(deg)), P(192, rad(deg)), w) + strut(P(s0, rad(deg)), P(s1, rad(deg)), 13)),
    circle(86),
  ],
  details:
    `<circle r="186" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    // Two screws holding the pillars, at the top spoke's sides.
    [P(176, rad(-104)), P(176, rad(-76))].map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="4" fill="#000" fill-opacity=".35"/>`).join('') +
    // White index ticks on the boss, then the black knob: knurled rim, flat face, a white triangle at 12.
    Array.from({ length: 24 }, (_, k) => {
      const a = rad(-90 + k * 15), [x0, y0] = P(80, a), [x1, y1] = P(85, a);
      return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#fff" stroke-opacity=".45" stroke-width="1.6"/>`;
    }).join('') +
    `<circle r="78" fill="#000" fill-opacity=".3"/>` +
    `<path d="${knurl(74, 1.5, 48)}" fill="#1c1e20"/><path d="${knurl(74, 1.5, 48)}" fill="url(#sheen)"/>` +
    `<circle r="64" fill="#222427"/><circle r="64" fill="url(#sheen)"/>` +
    `<path d="M0 -50L6 -40L-6 -40Z" fill="#e6e6e2"/>`,
});

const handle = P(160, rad(180));
const weight = P(142, rad(18));

export const spool = svg({
  foot: BLACK_FOOT,
  handles: [[...handle, 16]],
  body: [FACE, ...web(), HUB_RING],
  details:
    `<circle r="188" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="124" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>` +
    // The red hub behind the cap, then the red knurled spool cap.
    `<circle r="62" ${ACCENT}/><circle r="62" fill="#000" fill-opacity=".22"/>` +
    `<circle r="44" fill="#000" fill-opacity=".3"/>` +
    `<path d="${knurl(40, 1.2, 40)}" ${ACCENT}/><path d="${knurl(40, 1.2, 40)}" fill="url(#sheen)"/>` +
    `<circle r="32" fill="#fff" fill-opacity=".1"/>` +
    // Silver counterweight and the black handle.
    `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="17" fill="#8d9092"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="14" fill="#d3d5d3"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="14" fill="url(#sheen)"/>` +
    knob(...handle, 16),
});
