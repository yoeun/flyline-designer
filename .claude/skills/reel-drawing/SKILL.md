---
name: reel-drawing
description: Use when drawing or fixing a reel's frame SVG in scripts/reel-designs (drag or spool side), when the user shares photos of a reel, or says a reel drawing looks wrong. Covers splitting the fixed frame from the spool cage that spins, insets and grooves, and checking the drawing against photos.
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

## 3a. Spokes that run from the rim to the hub

Many reels (the Ventures Ascent is the worked example: `scripts/reel-designs/ascent.mjs`) have one set of spokes
running from the rim to the hub cap, with the face sunk inside the arbor. Photos make this look like a ported ring
plus a slotted hub disc. It isn't, and drawing it that way is wrong in every way the user will notice:

- **One opening per window, from near the rim to the cap.** Don't stop windows at the hub and add a separate
  slotted disc: that leaves a metal band under the backing, and inner and outer spoke counts drift apart. Below
  the backing the window shows the background (see-through), never black and never metal.
- **The spokes taper.** They're widest at the rim and narrow toward the cap (the Ascent's are 22, then 15 at the
  drop, then 11 at the cap). Use `taperedSlots({ n, rIn, rOut, barIn, barOut, corner, off })` from `lib.mjs`, with
  widths measured at a few radii. Straight `slots` bars look wrong here.
- **Spokes line up across the whole face.** Same count inside and out, one `off` for everything. For a window
  centered at 12 o'clock, `off = -90 - 360 / n / 2`.
- **Handle and counterweight fill a window's outer part.** The spoke there keeps a round hole in the hub, at the
  same angle as the handle. Drop that window with `pickPaths(d, (k) => !skip.includes(k))` and add the hole.
  Measure the handle's and the counterweight's radius off the photo (the Ascent's sit near the rim, at 156).
- **The sunk hub is shading, not a separate piece.** `sunkFace({ id, wall, floor, cut })` darkens the spokes
  down a steep wall from `wall` to `floor`, with a light lip on top, on the metal only (`cut` is every opening).
  Center the drop on where the backing begins, and make it pronounced: the user asked for "much bigger" when it
  was subtle.
- **`arbor` sits at the foot of the drop.** If the line starts outside where the windows begin, a light sliver
  shows under the backing: the "floor" the user doesn't want.

## 4. Printing and see-through

- The app draws the other side's frame mirrored behind the spool, so whatever a side draws shows through the other
  side's open middle. Keep a side's middle open: no solid discs for "the spool's inside" in `under`.
  Check see-through on a light background: on a dark stage a solid dark disc looks the same as an opening, so
  it's easy to miss.
- Printing sits on the far face and must not show through: `<text>` is hidden there automatically. Tag every
  other printed mark (dial dots, pointers and face lines, logo marks) with `data-print=""`, on the element or a `<g>` round it.

## 5. Grooves and insets

Most reels have them, and they're what makes a flat drawing read as machined metal:

- **Between parts:** a dark ring (`#1b1d1f` at about 70% opacity) where one piece sits inside another, like
  `frameRim`'s groove.
- **Recessed parts:** `back` (or `recessed()` for still parts) draws metal 20% darker. Use it for floors of
  pockets and anything set below the face.
- **Separate parts, one finish:** give the inset part a darker shade than the part around it, never the same flat
  color.

## 5a. SVG gradient gotchas

- A `radialGradient` with `gradientUnits="userSpaceOnUse"` needs `cx="0" cy="0"`. Without them it centers on 50%
  of the viewport, not the reel's center, and the shading lands off-center or not at all.
- Write gradient stop offsets with `.toFixed(3)`, not `f()`. `f()` rounds to one decimal, which collapses
  stops a few units apart.
- To shade metal only, give the shading path the openings as even-odd cut-outs. Make its gradient fade to 0
  before the path's edges, because even-odd turns the parts of the cut-outs outside the shaded band back on.

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
