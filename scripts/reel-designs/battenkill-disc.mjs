// Orvis Battenkill Disc.
// A classic ported disc: both sides are solid plates drilled with rings of round holes. The drag side has three
// staggered rings around a large flat drag knob, with the holes left out where the logo sits at 3 o'clock; the
// spool has two rings of holes, a raised hub drilled with small holes, a counterweight plate at 12 and the
// handle at 6. The foot is dark whatever the finish.
import { P, circle, foot, knob, rad, roundPoly, arcPts, screw, svg } from './lib.mjs';

// The wound line starts at the inner edge of the innermost holes.
export const arbor = 100;

// Holes of radius `hr` on a ring of radius r, n positions from `off` degrees, skipping any `skip(deg)` says to.
const holes = (n, r, hr, off = -90, skip = () => false) =>
  Array.from({ length: n }, (_, k) => off + (k * 360) / n)
    .filter((deg) => !skip(((deg % 360) + 540) % 360 - 180))
    .map((deg) => circle(hr, ...P(r, rad(deg))))
    .join('');

const DARK_FOOT = `<path d="${foot(150, -238, 14, 40)}" fill="#3a3d41"/><path d="${foot(150, -238, 14, 40)}" fill="url(#sheen)"/>`;
const near = (deg, at, by) => Math.abs(deg - at) < by;

export const drag = svg({
  under: DARK_FOOT,
  body: [
    circle(200) +
      holes(24, 163, 17, -90, (d) => near(d, 0, 8)) +
      holes(24, 136, 12.5, -82.5, (d) => near(d, 0, 10)) +
      holes(24, 110, 10, -90, (d) => near(d, 0, 8)),
  ],
  details:
    `<circle r="200" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="3"/>` +
    // The drag knob: a broad flat dark disc with a notch at 12 and a screw in the middle.
    `<circle r="84" fill="#000" fill-opacity=".25"/><circle r="80" fill="#4a4d52"/><circle r="80" fill="url(#sheen)"/>` +
    `<circle r="72" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>` +
    `<path d="M-10 -80L-10 -64L12 -64L12 -80Z" fill="#5c6065"/><path d="M-10 -64L12 -64" stroke="#000" stroke-opacity=".3" stroke-width="2"/>` +
    screw(0, 0, 10),
});

const pad = roundPoly([...arcPts(180, rad(-106), rad(-74), 8), ...arcPts(134, rad(-77), rad(-103), 8)], 6);

export const spool = svg({
  under: DARK_FOOT,
  body: [
    circle(200) +
      holes(20, 152, 20.5, -81, (d) => near(d, -90, 10) || near(d, 90, 10)) +
      holes(20, 118, 15, -90, (d) => near(d, 90, 4)),
  ],
  details:
    `<circle r="188" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<path d="${pad}" fill="#8e908c"/><path d="${pad}" fill="url(#sheen)"/>` +
    // The raised hub, drilled with a ring of small holes that look through to the dark arbor.
    `<circle r="98" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="3"/><circle r="96" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>` +
    `<path d="${holes(20, 76, 6.5)}" fill="#1f2022"/>` +
    `<circle r="50" fill="#000" fill-opacity=".2"/><circle r="47" fill="#34373b"/><circle r="47" fill="url(#sheen)"/>` +
    screw(0, -32, 6) +
    screw(0, 32, 6) +
    knob(0, 150, 18),
});
