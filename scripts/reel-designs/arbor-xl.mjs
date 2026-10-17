// Sage Arbor XL.
// Drag side, much like the Spectrum C: the spool's window cage (about 22 windows, drawn as 20) in a darker shade
// behind five straight frame spokes (two up, one each side, one down) and a black numbered dial ring around a ribbed knob in the reel
// color. Spool side: three straight spokes 120° apart around the knurled spool-release cap, the handle in line
// with the top one and a small knob opposite at 6 o'clock.
import { P, circle, knurl, pad, rad, ring, slots, spoke, svg } from './lib.mjs';
import { dial, frameScrew, logo, rimHandle, sageFoot } from './spectrum.mjs';

const RIM = { n: 20, rIn: 122, rOut: 184, bar: 13, corner: 8, off: -90 };

// Like the Spectrum C: five straight frame spokes over the spool's window cage, which is drawn in a much darker
// shade so the two read as separate pieces; the rim lip is the frame's.
const SPOOL_CAGE = ring(186, 110) + slots(RIM);
export const drag = svg({
  under: `<path d="${SPOOL_CAGE}" fill="currentColor" fill-rule="evenodd"/><path d="${SPOOL_CAGE}" fill="#000" fill-opacity=".45" fill-rule="evenodd"/>`,
  body: [
    ring(200, 186),
    sageFoot(),
    pad(150, -90, 32, 60),
    ...[-130, -50, 170, 10, 90].map((a) => spoke(a, 60, 190, 24, 20)),
    circle(80),
  ],
  details: frameScrew(0, -150, 8) + dial(78, 58, { ribs: 18, badge: 16, badgeFill: 'currentColor', dots: 20 }),
});

export const spool = svg({
  back: [sageFoot()],
  body: [
    ring(200, 112) + slots({ ...RIM, rIn: 124 }),
    pad(162, -90, 30, 44),
    pad(162, 90, 26, 40),
    ...[-90, 30, 150].map((a) => spoke(a, 44, 116, 20, 16)),
    circle(56),
  ],
  details:
    `<circle r="44" fill="#000" fill-opacity=".18"/><path d="${knurl(34, 1.6, 30)}" fill="#33363b"/><path d="${knurl(34, 1.6, 30)}" fill="url(#sheen)"/><circle r="22" fill="#26282b"/>` +
    logo(0, 0, 22) +
    rimHandle(162, -90, 18) +
    `<circle cx="${P(162, rad(90))[0].toFixed(1)}" cy="${P(162, rad(90))[1].toFixed(1)}" r="12" fill="#2b2e31"/>`,
});
