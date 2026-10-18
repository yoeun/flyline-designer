// Echo Shadow Click.
// A click-and-pawl reel (discontinued), so the frame side has no drag knob. Drawn from a near-straight-on spool-side
// photo and a three-quarter drag-side photo (Echo's two-up product shot) plus Trident's review photos of both sides.
// Spool side: a rim whose inner edge is cut into twelve broad tabs reaching in to the drum, with big open windows
// between them; one bar crosses the face, from the handle at 12 o'clock down through bat-wing flares to the hub
// (the black Echo logo cap), then splits into two legs to the rim either side of 6 o'clock as the counterbalance.
// Drag side: the frame is just a wide grooved post from the foot down to the hub, the black click cap, and two legs
// arching down to the bottom of the rim (the adjustable lower leg). Through it shows the spool's cage, which turns:
// its tabbed back flange (the outer rim here is the spool's), its bar and hub, without the handle (the wound line
// hides it). The drag side is drawn from angled photos, so the post's taper, the legs' spread and the tab size are
// approximate; the Echo logo is a simplified mark.
import { P, arcPts, circle, f, foot, knurl, rad, recessed, roundPoly, svg } from './lib.mjs';
import { arm } from './sage.mjs';

// The wound line starts on the drum at the tips of the tabs: Trident measures the 4/5's arbor at 2.17 in inside a
// 3.4 in rim, 200 × 2.17 / 3.4 ≈ 128.
export const arbor = 128;

const RIM_IN = 166; // the rim's inner edge, between the tabs
const TIP = 130; // the tabs' tips, just outside the drum
const TAB = 40; // tab width

// The rim's inner edge, going round: twelve tabs reaching in to TIP, the first at 12 o'clock.
const tabbedEdge = (() => {
  const pts = [];
  for (let k = 0; k < 12; k++) {
    const a = rad(-90 + k * 30);
    const at = (r, s) => rad(-90 + k * 30) + (s * TAB) / 2 / r;
    pts.push(P(RIM_IN, at(RIM_IN, -1)), P(TIP, at(TIP, -1)), P(TIP, at(TIP, 1)), P(RIM_IN, at(RIM_IN, 1)));
    // Along the rim to the next tab.
    const next = a + rad(30) - TAB / 2 / RIM_IN;
    pts.push(...arcPts(RIM_IN, at(RIM_IN, 1), next, 6).slice(1, -1));
  }
  return roundPoly(pts, 9);
})();
const FLANGE = circle(200) + tabbedEdge;
const HUB = 50;

// The spool's bar: up to the handle with a pair of bat-wing flares part way, and two legs down from the hub to the
// rim either side of 6 o'clock. `turn` rotates it (degrees), `flip` mirrors it, for the back flange seen from behind.
const spoolBar = (turn = 0, flip = 1) => {
  const t = rad(turn);
  const o = ([x, y]) => [Math.cos(t) * x * flip - Math.sin(t) * y, Math.sin(t) * x * flip + Math.cos(t) * y];
  const poly = (pts, r) => roundPoly(pts.map(o), r);
  return [
    // Hub to handle, leaning a touch left on the way up.
    poly([[-18, -20], [-24, -70], [-20, -120], [-16, -196], [16, -196], [18, -120], [20, -70], [18, -20]], 8),
    // The flares: points out and down either side, like wings.
    poly([[0, -134], [44, -98], [36, -92], [18, -76], [-18, -76], [-36, -92], [-44, -98]], 5),
    ...[-1, 1].map((s) => {
      const [p0, c, p1] = [[s * 10, 20], [s * 30, 110], [s * 46, 192]].map(o);
      return arm(p0, c, p1, 26, 22);
    }),
  ];
};

// The frame: a wide post from the foot to the hub, the hub boss, and the counterbalance legs down to the rim.
const POST = roundPoly([[-58, -200], [58, -200], [40, -112], [48, -94], [28, -50], [-28, -50], [-46, -96], [-40, -112]], 8);
const LEGS = [-1, 1].map((s) => arm([s * 16, 30], [s * 40, 120], [s * 52, 194], 30, 24));
const FOOT = foot(140, -246, 14, 40);

// The black click cap with fine radial ribs.
const clickCap = (r) =>
  `<path d="${knurl(r, 1.5, 40)}" fill="#1f2123"/><circle r="${r - 10}" fill="#26282b"/><circle r="${r - 10}" fill="url(#sheen)"/>` +
  [0, 1, 2, 3, 4]
    .map((k) => {
      const [a, b] = [P(10, rad(-90 + k * 72)), P(r - 12, rad(-90 + k * 72))];
      return `<path d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}" stroke="#3b3f43" stroke-width="2.5" stroke-linecap="round"/>`;
    })
    .join('') +
  `<circle r="9" fill="#1b1d1f"/>`;

export const drag = svg({
  // Seen from behind, so mirrored.
  cage: [FLANGE, ...spoolBar(100, -1), circle(HUB)],
  body: [POST, ...LEGS, circle(58), FOOT],
  details:
    // The grooves down the post.
    [-14, 14].map((x) => `<path d="M${x} -196L${x * 0.8} -110" stroke="#000" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>`).join('') +
    `<circle r="58" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    clickCap(46),
});

// Echo's running-man mark, simplified, in white at (0, 0), s high.
const echoMark = (s) => {
  const k = s / 40, pt = (x, y) => `${f(x * k)} ${f(y * k)}`;
  return (
    `<path d="M${pt(-6, 16)}L${pt(0, 0)}L${pt(10, -16)}M${pt(0, 0)}L${pt(12, 18)}M${pt(-14, -2)}L${pt(2, -6)}L${pt(16, -12)}" ` +
    `stroke="#f2f2ee" stroke-width="${f(4 * k)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
    `<circle cx="${f(14 * k)}" cy="${f(-20 * k)}" r="${f(3.5 * k)}" fill="#f2f2ee"/>`
  );
};
const handle = P(160, rad(-90));

export const spool = svg({
  foot: recessed(FOOT),
  handles: [[...handle, 20]],
  // The frame's post and legs behind the spool.
  back: [POST, ...LEGS],
  body: [FLANGE, ...spoolBar(), circle(HUB), circle(27, ...handle)],
  details:
    `<circle r="190" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="${HUB}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    `<circle r="38" fill="#1f2123"/><circle r="38" fill="url(#sheen)"/>` +
    echoMark(36) +
    // The handle: a dark knob with a silver screw head.
    `<circle cx="${f(handle[0])}" cy="${f(handle[1])}" r="20" fill="#2b2e31"/>` +
    `<circle cx="${f(handle[0])}" cy="${f(handle[1])}" r="14" fill="#8d9092"/><circle cx="${f(handle[0])}" cy="${f(handle[1])}" r="14" fill="url(#sheen)"/>` +
    `<path d="M${f(handle[0] - 7)} ${f(handle[1] + 7)}L${f(handle[0] + 7)} ${f(handle[1] - 7)}" stroke="#4a4e52" stroke-width="3" stroke-linecap="round"/>`,
});
