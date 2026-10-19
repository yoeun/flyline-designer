// Orvis Mirage. Traced from straight-on photos.
// Drag side: the frame is a rim, six spokes fanning from the right rim, and the knob's boss and drag ring. Through it
// shows the spool's cage, which turns: its sixteen slanted windows, the same as the spool side's (mirrored, as seen
// from behind), without the counterweight plate (the wound line hides it). Spool side: the same window ring round
// six hexagon spokes. Foot, drag ring and handle take the finish's accent: teal on Silver Dragonfly, navy on Blackout.
import { ACCENT, P, arcPts, circle, foot, hexSpokes, rad, ring, roundPoly, slots, strut, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 134;

// The spool's sixteen slanted windows, shared by both sides.
const RIM = { n: 16, rIn: 134, rOut: 184, bar: 11, corner: 6, slant: 76 };

const accentFoot = `<path d="${foot(118, -240, 16, 56)}" ${ACCENT}/><path d="${foot(118, -240, 16, 56)}" fill="url(#sheen)"/>`;

// The Mirage cap: three rounded lobes, seen as grooves on the drag knob and the spool cap.
const lobes = (r) =>
  [0, 1, 2]
    .map((k) => {
      const a = rad(-90 + k * 120);
      const [x0, y0] = P(r * 0.15, a), [x1, y1] = P(r * 0.95, a + 0.35);
      return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)}Q${(x1 * 0.6).toFixed(1)} ${(y1 * 0.4 + y0 * 0.6).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>`;
    })
    .join('');

// Drag side: six spokes fanning from one point on the right rim rather than from the center. Spoke 1 runs to the
// foot; spoke 2 just touches the top of the knob's boss (about 25° up) and runs on to the left rim; spoke 3 runs from
// where spoke 2 touches the boss to a point on the left rim opposite the origin, where it meets its mirror image.
// Spokes 4–6 mirror them top to bottom.
const ORIGIN = [188, 0];
const BOSS = 74;
// Where a line from p along d meets radius r, going forward.
const toRim = (p, d, r = 190) => {
  const b = p[0] * d[0] + p[1] * d[1], c = p[0] * p[0] + p[1] * p[1] - r * r;
  const t = -b + Math.sqrt(b * b - c);
  return [p[0] + d[0] * t, p[1] + d[1] * t];
};
const TANGENT = Math.asin(BOSS / Math.hypot(...ORIGIN));
const fan = (sy) => {
  const d = [-Math.cos(TANGENT), sy * Math.sin(TANGENT)];
  const touch = [ORIGIN[0] + d[0] * Math.sqrt(ORIGIN[0] ** 2 - BOSS ** 2), d[1] * Math.sqrt(ORIGIN[0] ** 2 - BOSS ** 2)];
  return [
    strut(ORIGIN, [0, sy * 186], 24, 20),
    strut(ORIGIN, toRim(ORIGIN, d), 24, 20),
    strut(touch, [-ORIGIN[0], 0], 22, 20),
  ];
};

export const drag = svg({
  under: accentFoot,
  cage: [ring(190, 125) + slots({ ...RIM, slant: -RIM.slant })],
  body: [ring(200, 180), ...fan(-1), ...fan(1), circle(BOSS)],
  details:
    `<circle r="60" ${ACCENT}/><circle r="60" fill="url(#sheen)"/>` +
    `<circle r="44" fill="currentColor"/><circle r="44" fill="#000" fill-opacity=".08"/>${lobes(44)}`,
});

// Spool side: six spokes tangent to a hexagon at the hub, sweeping counter-clockwise like the other reels.
const SPOOL_SPOKES = hexSpokes({ hex: 40, reach: 128, ends: [0, 1, 2, 3, 4, 5].map((k) => -70 + k * 60), ccw: true, overshoot: 4 });

export const spool = svg({
  foot: accentFoot,
  handles: [[...P(162, rad(96)), 16]],
  body: [
    ring(200, 125) + slots(RIM),
    // The counterweight plate across the top of the slots.
    roundPoly([...arcPts(188, rad(-120), rad(-64), 10), ...arcPts(152, rad(-64), rad(-120), 10)], 8),
    ...SPOOL_SPOKES.map(({ corner, end }) => strut(corner, end, 16, 12)),
    roundPoly(SPOOL_SPOKES.map(({ corner }) => corner), 3),
    circle(44),
  ],
  details:
    `<circle r="40" ${ACCENT}/><circle r="30" fill="currentColor"/><circle r="30" fill="#000" fill-opacity=".06"/>${lobes(30)}` +
    `<circle cx="${P(162, rad(96))[0].toFixed(1)}" cy="${P(162, rad(96))[1].toFixed(1)}" r="16" ${ACCENT}/><circle cx="${P(162, rad(96))[0].toFixed(1)}" cy="${P(162, rad(96))[1].toFixed(1)}" r="10" fill="#2b2e31"/>`,
});
