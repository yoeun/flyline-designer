// Sage Arbor XL.
// Drag side from Far Bank's photo: about 22 windows (drawn as 20 so the spokes land on bars), five thin
// spokes (two up, one each side, one down) and a black numbered dial ring around a ribbed knob in the reel
// color. The spool side is only shown angled: its three thin spokes, the knurled spool-release cap, the
// handle at about 1 o'clock and the small knob opposite are inferred straight-on.
import { P, circle, knurl, pad, rad, ring, slots, spoke, svg } from './lib.mjs';
import { dial, frameScrew, logo, rimHandle, sageFoot } from './spectrum.mjs';

const RIM = { n: 20, rIn: 122, rOut: 184, bar: 13, corner: 8, off: -90 };

export const drag = svg({
  body: [
    ring(200, 110) + slots(RIM),
    sageFoot(),
    pad(150, -90, 32, 60),
    ...[-126, -54, 162, 18, 90].map((a) => spoke(a, 60, 190, 18, 14, 6)),
    circle(80),
  ],
  details: frameScrew(0, -150, 8) + dial(78, 58, { ribs: 18, badge: 16, dots: 20 }),
});

export const spool = svg({
  back: [sageFoot()],
  body: [
    ring(200, 112) + slots({ ...RIM, rIn: 124 }),
    pad(162, -72, 30, 44),
    pad(162, 108, 26, 40),
    ...[-84, 36, 156].map((a) => spoke(a, 44, 116, 20, 13, 20)),
    circle(56),
  ],
  details:
    `<circle r="44" fill="#000" fill-opacity=".18"/><path d="${knurl(34, 1.6, 30)}" fill="#33363b"/><path d="${knurl(34, 1.6, 30)}" fill="url(#sheen)"/><circle r="22" fill="#26282b"/>` +
    logo(0, 0, 22) +
    rimHandle(162, -72, 18) +
    `<circle cx="${P(162, rad(108))[0].toFixed(1)}" cy="${P(162, rad(108))[1].toFixed(1)}" r="12" fill="#2b2e31"/>`,
});
