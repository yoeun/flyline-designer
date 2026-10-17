// Sage Spectrum C.
// Drag side from Far Bank's photo: 18 deep windows, five wide straight spokes (two up, one each side, one
// down) and a flat numbered dial with a logo badge. The dial is black on grey reels and grey on black ones;
// it is drawn dark here. The spool side is only shown angled: its three swept spokes, the handle at about
// 1 o'clock and the small knob opposite are inferred straight-on.
import { P, circle, pad, rad, ring, slots, spoke, svg } from './lib.mjs';
import { frameScrew, logo, rimHandle, sageFoot } from './spectrum.mjs';

const RIM = { n: 18, rIn: 110, rOut: 178, bar: 18, corner: 9, off: -90 };

// A flat dark dial with tick dots round its edge and a ringed logo badge.
const DIAL =
  `<circle r="80" fill="#2c2e31"/><circle r="80" fill="url(#sheen)"/><circle r="64" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>` +
  Array.from({ length: 24 }, (_, i) => {
    const [x, y] = P(73, rad(-90 + i * 15));
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 2 ? 1.3 : 2}" fill="#d8d8d4" fill-opacity=".8"/>`;
  }).join('') +
  `<circle r="22" fill="#c9ccc8"/><circle r="19" fill="#1b1d1f"/>${logo(0, 0, 22)}`;

// The window ring behind the five spokes is the spool's, drawn in a much darker shade; the rim lip is the frame's.
const SPOOL_CAGE = ring(186, 98) + slots(RIM);
export const drag = svg({
  under: `<path d="${SPOOL_CAGE}" fill="currentColor" fill-rule="evenodd"/><path d="${SPOOL_CAGE}" fill="#000" fill-opacity=".45" fill-rule="evenodd"/>`,
  body: [
    ring(200, 186),
    sageFoot(),
    pad(160, -90, 36, 56),
    ...[-130, -50, 170, 10, 90].map((a) => spoke(a, 60, 190, 30, 24)),
    circle(84),
  ],
  details: frameScrew(0, -164, 9) + DIAL,
});

export const spool = svg({
  back: [sageFoot()],
  body: [
    ring(200, 102) + slots({ ...RIM, rIn: 114 }),
    pad(158, -72, 34, 50),
    pad(158, 108, 30, 44),
    ...[-84, 36, 156].map((a) => spoke(a, 34, 106, 28, 18, 24)),
    circle(40),
  ],
  details:
    logo(0, 0, 26) +
    rimHandle(158, -72, 18) +
    `<circle cx="${P(158, rad(108))[0].toFixed(1)}" cy="${P(158, rad(108))[1].toFixed(1)}" r="12" fill="#2b2e31"/>`,
});
