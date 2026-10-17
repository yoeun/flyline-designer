// Shapes the Sage designs share: foot, curved arm, logo, frame screw, dial and rim handle. Not a design itself (it
// exports no sides).
import { P, circle, f, foot, knob, pad, rad, ring, roundPoly } from './lib.mjs';

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
export const dial = (rRing, rKnob, { ribs = 14, ring: ringFill = '#1e2022', badge = 18, badgeFill = '#1b1d1f', dots = 20, dotFill = '#e6e6e2', face = '' } = {}) =>
  `<path d="${ring(rRing, rKnob)}" fill="${ringFill}" fill-rule="evenodd"/>` +
  Array.from({ length: dots }, (_, i) => {
    const [x, y] = P((rRing + rKnob) / 2, rad(-90 + (i * 360) / dots));
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${i ? 1.6 : 2.4}" fill="${dotFill}"/>`;
  }).join('') +
  (ribs
    ? `<path d="${Array.from({ length: ribs }, (_, i) => {
        const a = rad((i * 360) / ribs), [x0, y0] = P(badge + 8, a), [x1, y1] = P(rKnob - 7, a);
        return `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
      }).join('')}" stroke="#000" stroke-opacity=".22" stroke-width="2.5"/><circle r="${rKnob - 7}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="2.5"/>`
    : '') +
  face +
  `<circle r="${badge + 3}" fill="#c9ccc8"/><circle r="${badge}" fill="${badgeFill}"/>${logo(0, 0, badge * 1.2)}`;

// A rim handle: a dark knob on a pad over a window.
export const rimHandle = (r, deg, size = 18) => knob(...P(r, rad(deg)), size);
