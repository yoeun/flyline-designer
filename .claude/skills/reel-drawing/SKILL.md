---
name: reel-drawing
description: Use when drawing or fixing a reel's frame SVG in scripts/reel-designs (drag or spool side), when the user shares photos of a reel, or says a reel drawing looks wrong. Covers splitting the fixed frame from the spool cage that spins, alternating flange bars, tapering spokes, floating backing (no visible floor), gradient drops, rounded corners where pieces meet, chamfered (beveled) edges, insets and grooves, and checking the drawing against photos.
---

# Drawing a reel

A reel is two pieces: the **frame** (foot, rim, spokes, hub, drag dial), which stays still, and the **spool**,
which turns inside it. Photos make them look like one solid casting. Draw them as two pieces on both sides, so
they read as separate and the spool spins on its own.

Designs live in `scripts/reel-designs/<design>.mjs` and are built with `svg()` and the shapes in `lib.mjs`
(maker-shared shapes in files like `sage.mjs`). `npm run reels` writes `src/assets/reels/<design>-{drag,spool}.svg`.
Commit the regenerated SVGs with the script.

## 1. Get photos and find the two pieces

- Get straight-on photos of both sides. Fetch the product page's images yourself (WebFetch for the image URLs, then
  `curl` into the scratchpad; try the gallery's sibling file names, e.g. `_a.jpg`, `_b.jpg`), and only ask the user
  when that fails.
- Crop each photo to the reel with `sips -c H W --cropOffset Y X` and measure: the center, the rim radius in
  pixels, then each feature in rim = 200 units. Measure angles with `atan2` from the center (screen y points down,
  so 90° is 6 o'clock).
- Sort every part into the frame or the spool:
  - **Drag side:** the frame is usually only the rim, a few spokes, the hub and the dial. Window bars, inner rings
    and many-spoked cages behind them are the spool showing through: a drag side with a lot of spokes is the spool
    cage behind a few frame spokes.
  - **Spool side:** the outer rim is the frame's, and the whole spool sits inset inside it.
  - Handle and knob pads seen through the drag side's windows (dark dots on grey pads) are the back of the spool.
    Leave them out: the wound line hides them.
- **Count and measure by sampling pixels, not by eye.** Walk a circle round the center at a few radii (Python with
  PIL, run with `-I`) and record runs of line color (blue/green/yellow) or dark see-through pixels. The run count is
  the window count, run lengths give each bar's width at that radius, and comparing radii shows the taper. Check
  symmetry too: spokes at both 3 and 9 o'clock mean an even count. If the user's count disagrees with the samples,
  say so and show the numbers.
- **Look at what's below the backing in each window.** Either you see a floor (the spool's arbor, as metal under
  the line) or you see straight through to the background. Some reels show no floor: the backing ends right on
  background (floating backing). Many others do show a floor. Decide which for each reel before drawing, because it
  sets the window shape and `arbor` (see 3b).
- **Look at how the spokes change from the rim inward.** Most taper and converge toward the center, often with a
  drop partway in where the face sinks. Measure each spoke's width at three or more radii (see 3a).
- When the user corrects the frame/spool split or a measurement, trust that over the photo.

## 2. Draw the drag side

```js
export const drag = svg({
  under: '…',                       // still, behind everything: e.g. the spool's dark disc round the hub
  cage: [ring(182, 118) + slots(RIM)], // the spool seen through the frame: recessed and darker, turns clockwise
  body: [ring(200, 178), sageFoot(), ...SPOKES.map((a) => spoke(a, 60, 190, 26, 22)), circle(90)], // the frame
  details: DIAL,                    // fixed colors on top (dial, logos, screws)
});
```

- `cage` paths go into a `[data-cage="cw"]` group. `spinCage` turns it clockwise, the mirror of the spool side.
  It's shaded as one layer by `--reel-cage` and `--reel-cage-opacity`: 25% darker than the frame, or lighter on a dark finish (ReelPreview picks it), so
  the two read as separate pieces. Check both a light and a dark `--color` in the preview.
- The cage must match the spool side: same window count, radii and bar width (share one `RIM` object), with no
  handle or knob pads.
- **Check whether the spool's two flanges' bars line up or alternate.** On some reels (the Redington Run,
  `scripts/reel-designs/run.mjs`) the back flange's bars sit halfway between the face flange's. In an empty photo
  you see a thinner, darker bar midway across each window: that's the far flange's bar, not a divider in the
  window. Then offset the drag side's cage half a window (`off` differs by `360 / n / 2`). Don't draw the far
  bars yourself: the app draws each side's far side behind it, so they show through on their own.
- **Frame spokes usually sit on a cage bar.** Check the photo, and when they do, take their angles from the cage's
  bar angles rather than from measurements.
- Spokes that look evenly spaced usually are: build them from one angle list (e.g. 72° apart for five) rather than
  measured angles.

## 3. Draw the spool side, inset in the frame's rim

A spool side needs at least three shades, outside in:

1. **Outer:** the frame's rim, the lightest, still.
2. **Cage:** the spool's window ring, set into the rim and darker (`back`).
3. **Inner:** the hub and its spokes, either raised from the cage (`body`, which casts a shadow onto the cage) or
   sunk below it (`back` plus a darker `under`). Check the photo for which.

```js
export const spool = svg({
  foot: recessed(sageFoot()) + frameRim(), // 1. still: the foot and the frame's rim, with a groove inside it
  handles: [[...P(156, rad(-90)), 20]],
  under: '…',                               // the spool's inside, behind the spokes
  back: [ring(185, 116) + slots(RIM), pad(156, -90, 46, 50)], // 2. the cage, recessed: turns
  body: [...[-90, 30, 150].map((a) => spoke(a, 34, 118, 30, 24)), circle(32)], // 3. raised hub: turns
  details: logo(0, 0, 24) + rimHandle(156, -90, 20),
});
```

- `frameRim(inner = 189, gap = 185)` (in `lib.mjs`) draws the frame's rim from 200 in to `inner`, a shade lighter
  than the spool's face, plus a dark groove from `inner` in to `gap`. Start the spool's own rim at `gap`.
- End raised spokes where they meet the cage ring (its inner radius, plus about 2), so no square ends sit on top of
  it.
- Everything in `body`, `under`, `back` and `details` turns with the spool. Keep only round, unlit or truly fixed
  parts in `foot`.

Sections 3a and 3b are independent: a reel can have tapering spokes with a drop and a visible floor, floating
backing with straight spokes, both, or neither. Check each against the photo on its own. The Ventures Ascent
(`scripts/reel-designs/ascent.mjs`) happens to have both, so don't take it as a sign that they go together.

## 3a. Tapering, converging spokes with a drop

Most reels' spokes taper: widest at the rim, converging toward the center. Many also drop partway in, where the
face sinks toward the hub. This is about the spokes' shape and shading only. It says nothing about what shows
below the backing (that's 3b).

- **Draw the taper.** Use `taperedSlots({ n, rIn, rOut, barIn, barOut, corner, off })` from `lib.mjs` for the
  windows between tapering spokes, or `spoke(deg, r0, r1, w0, w1)` for separate spokes. Take the widths from your
  samples at several radii (the Ascent's are 22 at the rim, 15 at the drop, 11 at the cap). Straight bars of one
  width look wrong whenever the photo's spokes narrow.
- **One spoke is one shape from the rim to where it ends.** If spokes run through a drop to the hub, don't split
  them into an outer ring plus a separate hub with its own spokes: the inner and outer counts and angles drift
  apart, and the taper breaks at the seam. Keep one count and one `off` for the whole face. For a window centered at 12 o'clock,
  `off = -90 - 360 / n / 2`.
- **Shade the drop as a gradient on the spokes.** The drop is where the spokes bend down. Shade it with a
  gradient running across the spokes, darkest at the wall's foot and fading to nothing at its top, with a faint
  light lip there. Don't draw it as a separate piece or a flat darker ring. `sunkFace({ id, wall, floor, cut })`
  does this for a circular drop, on the metal only (`cut` is every opening). Make it pronounced: when the Ascent's
  was subtle, the user asked for "much bigger". Center it where the photo's drop is, measured like any other
  radius.
- **Handle and counterweight fill a window's outer part.** The spoke under them keeps a round hole in the hub, at
  the same angle as the handle. Drop that window with `pickPaths(d, (k) => !skip.includes(k))` and add the hole.
  Measure the handle's and the counterweight's radius off the photo (the Ascent's sit near the rim, at 156).

## 3b. Floating backing: no visible floor

Also called no visible floor: the backing ends right on the background, so it looks like it's floating in the
window. This is about what shows below the backing only, whatever the spokes look like (that's 3a). When the
photo shows no metal below the backing, the windows open straight through the reel.

**Floating backing is never a default, and never a sweep.** Make a reel floating only when its own photo clearly
shows background right below the backing, or the user says so for that reel. Without that, keep the floor the
drawing has. When fixing several reels, decide each one separately: one reel being floating says nothing about the
next, even from the same maker. If the photo is unclear (small, angled, or the line hides the arbor), ask the user
rather than guessing. Say which reels you're making floating and why.

For a floating reel:

- **Run each window's opening down past where the line starts**, to the cap or to the inner end of the spokes,
  with nothing behind it. Below the backing the window shows the app's background: never black, never metal.
- **Put no disc or floor in `under` or `back`** behind the windows. On a dark stage a dark disc looks like an
  opening, so check on a light background (section 4).
- **Set `arbor` at or just inside where the photo's backing ends.** If the line starts outside that point, a
  light sliver shows under the backing: the "floor" the user doesn't want. Don't stop the opening at a ring of
  metal there either: no band of face between the backing and the background.
- When a floor *is* visible, it's the spool's arbor: a recessed band under the line, shaded as a gradient (section
  5), not the frame showing through.

## 4. Printing and see-through

- The app draws the other side's frame mirrored behind the spool, so whatever a side draws shows through the other
  side's open middle. Keep a side's middle open: no solid discs for "the spool's inside" in `under`.
  Check see-through on a light background: on a dark stage a solid dark disc looks the same as an opening, so
  it's easy to miss.
- Printing sits on the far face and must not show through: `<text>` is hidden there automatically. Tag every
  other printed mark (dial dots, pointers and face lines, logo marks) with `data-print=""`, on the element or a `<g>` round it.

## 5. Drops, grooves and insets

Most reels have them, and they're what makes a flat drawing read as machined metal.

- **Prefer gradients for depth.** A drop, a sunk face, a chamfer or a deep pocket reads as a slope in the photo:
  dark at the bottom, fading up to the face. Draw it as a gradient across that slope, not as a flat band of a
  darker shade or a hard line. Flat bands look like painted stripes. Use solid shades only for things that really
  are flat: a pocket's floor or a part set evenly below the face.
  - **Circular drops** (a sunk hub, an arbor wall, a recessed ring): a `radialGradient` centered on the reel.
    `sunkFace` is the ready-made one; copy its stops for a ring that steps down and back up.
  - **Raised parts** (a hub boss, a lip): reverse it, light at the top edge and darker down the outside.
  - **Straight edges** (a spoke's side, a window's wall): a `linearGradient` across the edge.
  - Strength: the deep drops on these reels run from about 0 to 0.7 black over 15 to 20 units (rim = 200). Under
    0.4 tends to read as no drop at all at the app's size.
  - Shade metal only: cut the openings out of the shading path (section 5a).
- **Between parts:** a dark ring (`#1b1d1f` at about 70% opacity) where one piece sits inside another, like
  `frameRim`'s groove. A thin groove can stay a solid line. Anything wider than a few units is a drop: use a
  gradient.
- **Recessed parts:** `back` (or `recessed()` for still parts) draws metal 20% darker. Use it for floors of
  pockets and anything set below the face, then add a gradient at the wall where the face meets the floor.
- **Separate parts, one finish:** give the inset part a darker shade than the part around it, never the same flat
  color.

### Rounded corners and chamfered edges

Most reels need both, wherever pieces meet. A cast or machined frame has no sharp inside corners, and its edges
are chamfered. Drawn without them, a frame looks like flat pieces stacked on top of each other.

- **Round every corner where a spoke meets a rim, a hub or a collar.** Don't build a frame from overlapping
  `ring`s, `spoke`s and `circle`s: that leaves sharp inside corners. Cut it as one solid piece instead:
  `circle(200) + spokeWindows({ spokes, rIn, rOut, fillet })` from `lib.mjs`. The windows run between the spokes,
  the outer ring's inner edge and the hub, with every corner rounded by `fillet` (the Run's drag frame uses 12).
  `spokes` take `spoke()`'s geometry, `{ a, r0, r1, w0, w1 }`, so tapering spokes keep their taper. For spool
  windows, `taperedSlots`' and `slots`' `corner` does the same job: give it a real radius, not 2 or 3, when the
  photo's corners are visibly round.
- **Chamfer the edges with `bevel(id, { width, depth })`** in `details` (before anything drawn on top of the
  frame, like a knob). It lights each edge facing the top left and shades each edge facing the bottom right, by
  the way the edge faces, not where it sits on the reel. It works on the body's whole silhouette, so seams between
  overlapping pieces don't get edges. The Run uses the defaults (width 4, depth 7). When the user asked for "deeper",
  depth and a slightly wider chamfer did it. Don't fake a bevel with a stroke or a band shaded by position: a
  stroke outlines every overlapping piece, and a band lit by position gets inner edges backwards and washes out
  narrow rims.

## 5a. SVG gradient gotchas

- A `radialGradient` with `gradientUnits="userSpaceOnUse"` needs `cx="0" cy="0"`. Without them it centers on 50%
  of the viewport, not the reel's center, and the shading lands off-center or not at all.
- Write gradient stop offsets with `.toFixed(3)`, not `f()`. `f()` rounds to one decimal, which collapses
  stops a few units apart.
- To shade metal only, give the shading path the openings as even-odd cut-outs. Make its gradient fade to 0
  before the path's edges, because even-odd turns the parts of the cut-outs outside the shaded band back on.
- A gradient's first and last stops carry on past the ends (pad), so a radial gradient whose first stop isn't 0
  shades everything inside it, including an open, see-through center. Cut the open middle out of the path too
  (e.g. `cut: windows + circle(innerEdge)` for `sunkFace`).
- A `<mask>` reads luminance, not alpha. A filter result built from `SourceAlpha` is black, so as a mask it lets
  nothing through. Build mask content from a white fill (`SourceGraphic` of a `fill="#fff"` shape).

## 6. Check it

- `npm run reels`, then
  `node scripts/preview-reel-design.mjs <design> --color '#hex' [--accent '#hex'] --out <scratchpad>/x.png <photo crops…>`,
  and read the PNG next to the photos.
- For a close fit, overlay the drawing at half opacity on the photo, scaled so the rims match, in a page that
  headless Chrome screenshots.
  - The script defaults to macOS Chrome. In a Linux cloud session, set `CHROME` to a wrapper that runs
    `/opt/pw-browsers/chromium-*/chrome-linux/chrome --no-sandbox "$@"`.
  - The side-by-side PNG is small. For details like a drop, a sliver under the backing, or see-through slots, also
    screenshot the app at `deviceScaleFactor: 3` and crop: `?page=reels&model=<model-id>&side=spool` (Playwright is
    installed globally: import it from `$(npm root -g)/playwright/index.mjs`).
- `npx vitest run` (every design's spool side must keep its handles inside the turning cage).
- Run the app (`?page=reels`, with `&demo=1` for a seeded rack) and spin the spool from both sides.
- Note in the design's header comment where the drawing comes from and which parts are the frame and which the
  spool.
