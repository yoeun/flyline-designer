// Redington Behemoth.
import { P, arcPts, circle, f, foot, knob, knurl, rad, recessed, ring, roundPoly, spoke, svg } from './lib.mjs';

// Behemoth drag dial: body-colored, knurled edge, radial ribs on the face.
const behemothDial = (() => {
  const ribs = Array.from({ length: 24 }, (_, i) => {
    const t = (i / 24) * 2 * Math.PI, [x0, y0] = P(16, t), [x1, y1] = P(46, t);
    return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`;
  }).join('');
  return `<path d="${knurl(56, 1.5, 60)}" fill="currentColor"/><path d="${knurl(56, 1.5, 60)}" fill="#000" fill-opacity=".3"/><circle r="50" fill="currentColor"/><circle r="50" fill="url(#sheen)"/>${ribs}<circle r="14" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`;
})();

export const drag = svg({
  // The upper half plate sits below the rims, shaded like a shallow dish.
  under: (() => {
    const plate = roundPoly([...arcPts(170, rad(4), rad(-184), 40)], 6);
    return (
      '<radialGradient id="dish" gradientUnits="userSpaceOnUse" r="170"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></radialGradient>' +
      '<linearGradient id="plate-sheen" gradientUnits="userSpaceOnUse" x1="-215" y1="-250" x2="215" y2="220"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>' +
      `<path d="${plate}" fill="currentColor"/><path d="${plate}" fill="url(#plate-sheen)"/><path d="${plate}" fill="url(#dish)"/>`
    );
  })(),
  // Recessed band between the outer lip and the inner rim, all the way around.
  back: [ring(187, 175)],
  body: [
    ring(200, 186),
    ring(176, 166),
    foot(118, -244, 14, 30),
    // The lower half is open between eight spokes.
    circle(80),
    ...Array.from({ length: 8 }, (_, k) => spoke(14 + (k * 152) / 7, 70, 170, 14, 24)),
  ],
  // Soft shadows inside the lip and around the raised hub boss.
  details:
    `<path d="${ring(186, 176)}" fill="#000" fill-opacity=".14" fill-rule="evenodd"/>` +
    '<circle r="185" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="3"/>' +
    '<circle r="82" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="4"/>' +
    '<circle r="78" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>' +
    behemothDial,
});

export const spool = svg({
  foot: recessed(foot(118, -244, 14, 30)),
  handles: [[...P(150, rad(-67.5)), 22]],
  body: [ring(200, 184), ...Array.from({ length: 16 }, (_, k) => spoke(-90 + k * 22.5, 40, 190, 10, 22)), circle(46)],
  details:
    Array.from({ length: 16 }, (_, i) => {
      const t = rad(-90 + i * 22.5 + 11.25), [x0, y0] = P(24, t), [x1, y1] = P(43, t);
      return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`;
    }).join('') +
    `<circle cx="${f(P(150, rad(-67.5))[0])}" cy="${f(P(150, rad(-67.5))[1])}" r="22" fill="currentColor"/>` +
    knob(...P(150, rad(-67.5)), 16),
});
