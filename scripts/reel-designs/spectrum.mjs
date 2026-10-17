// Sage Spectrum (original, 2017).
// Drag side from Ed's Fly Shop's straight-on photos: 20 windows, five spokes (two up, one each side, one
// down) meeting the window ring where a bar would be, and a big numbered dial whose knob takes the finish.
// Spool side: three swept spokes, handle at 12 o'clock and a small dark knob at 6 o'clock.
// Also exports the Sage helpers (curved arm, dial, logo, frame screw) the other Sage designs share.
import { P, circle, f, foot, knob, pad, rad, ring, roundPoly, slots, spoke, svg } from './lib.mjs';

// The Sage foot: a long flat plate on a wide post.
export const sageFoot = () => foot(138, -244, 16, 46);

// A tapered band along a quadratic curve from p0 (w0 wide) through control c to p1 (w1 wide).
export function arm(p0, c, p1, w0, w1 = w0, steps = 14) {
  const left = [], right = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    const p = [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
    const d = [2 * u * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]), 2 * u * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1])];
    const len = Math.hypot(d[0], d[1]), w = (w0 + (w1 - w0) * t) / 2;
    left.push([p[0] - (d[1] / len) * w, p[1] + (d[0] / len) * w]);
    right.push([p[0] + (d[1] / len) * w, p[1] - (d[0] / len) * w]);
  }
  return roundPoly([...left, ...right.reverse()], 3);
}

// The Sage leaf logo in white, centered at (cx, cy), s wide.
export const logo = (cx, cy, s) => {
  const k = s / 20, pt = (x, y) => `${f(cx + x * k)} ${f(cy + y * k)}`;
  return `<path d="M${pt(-9, 9)}L${pt(1, -10)}L${pt(-1, 1)}L${pt(9, -7)}L${pt(2, 4)}L${pt(-1, 3)}Z" fill="#f2f2ee"/>`;
};

// A dark recessed cross-head screw on the frame.
export const frameScrew = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#26282b"/><path d="M${f(cx - r * 0.55)} ${f(cy)}H${f(cx + r * 0.55)}M${f(cx)} ${f(cy - r * 0.55)}V${f(cy + r * 0.55)}" stroke="#4a4e52" stroke-width="2"/>`;

// A black numbered dial ring from rKnob to rRing with tick dots, around a ribbed knob in the reel color
// (drawn in the body) and a black logo badge.
export const dial = (rRing, rKnob, { ribs = 14, ring: ringFill = '#1e2022', badge = 18, badgeFill = '#1b1d1f', dots = 20 } = {}) =>
  `<path d="${ring(rRing, rKnob)}" fill="${ringFill}" fill-rule="evenodd"/>` +
  Array.from({ length: dots }, (_, i) => {
    const [x, y] = P((rRing + rKnob) / 2, rad(-90 + (i * 360) / dots));
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${i ? 1.6 : 2.4}" fill="#e6e6e2"/>`;
  }).join('') +
  (ribs
    ? `<path d="${Array.from({ length: ribs }, (_, i) => {
        const a = rad((i * 360) / ribs), [x0, y0] = P(badge + 8, a), [x1, y1] = P(rKnob - 7, a);
        return `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
      }).join('')}" stroke="#000" stroke-opacity=".22" stroke-width="2.5"/><circle r="${rKnob - 7}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="2.5"/>`
    : '') +
  `<circle r="${badge + 3}" fill="#c9ccc8"/><circle r="${badge}" fill="${badgeFill}"/>${logo(0, 0, badge * 1.2)}`;

// A rim handle: a dark knob on a pad over a window.
export const rimHandle = (r, deg, size = 18) => knob(...P(r, rad(deg)), size);

const RIM = { n: 20, rIn: 146, rOut: 186, bar: 18, corner: 10, off: -90 };

// The window ring behind the five spokes is the spool's, so it's drawn in a much darker shade; the rim lip is the frame's.
const SPOOL_CAGE = ring(188, 134) + slots(RIM);
export const drag = svg({
  under: `<path d="${SPOOL_CAGE}" fill="currentColor" fill-rule="evenodd"/><path d="${SPOOL_CAGE}" fill="#000" fill-opacity=".45" fill-rule="evenodd"/>`,
  body: [
    ring(200, 188),
    sageFoot(),
    pad(166, -90, 34, 44),
    ...[-126, -54, 162, 18, 90].map((a) => spoke(a, 60, 190, 24, 18)),
    circle(90),
  ],
  details: frameScrew(0, -168, 9) + dial(88, 64),
});

export const spool = svg({
  back: [sageFoot()],
  body: [
    ring(200, 134) + slots(RIM),
    pad(170, -90, 30, 42),
    pad(170, 90, 30, 42),
    ...[-80, 40, 150].map((a) => spoke(a, 40, 140, 26, 16, 22)),
    circle(62),
  ],
  details:
    `<path d="${ring(44, 30)}" fill="#1e2022" fill-rule="evenodd"/>` +
    logo(0, 0, 26) +
    rimHandle(170, -90, 18) +
    `<circle cy="170" r="13" fill="#2b2e31"/><circle cy="170" r="9" fill="#3a3e42"/>`,
});

