# Flyline Designer: v1 spec

## Purpose

Help an angler choose **backing color** (and fly line color, where a line comes in several) by previewing how a reel, its backing and its fly line look together.

Secondary goal: support a personal **color-coding system** in which backing color alone tells you a reel's line type at a glance, and show how often colors in that system clash or look alike.

The setup should also simply look good. The preview is judged by eye at full size.

## Color system

Backing color is the only signal. Line types map to color families:

| Line type | Family | Suggested shades |
|---|---|---|
| Floating | Cool | blue, purple |
| Intermediate | Neutral | white, green, chartreuse, black |
| Sinking | Hot | yellow (Type 3), orange (Type 5), red (Type 7) |
| Sink tip | Hot | any hot shade |

The app suggests a family. It never forces one.

## Layout

Two columns. They stack on narrow screens.

- **Left, preview**
  - Reel preview with a mode switch: **Reel** (default), **See-through**, **Line only**.
  - Straight line diagram showing the fly line's taper and color zones, with a backing stub.
  - Checks: spool fill and backing vs. running line contrast.
  - **Rack strip**, collapsed by default: saved setups and the color conflicts between them.
- **Right, options** (stacked sections)
  - **Reel**: model dropdown (generic models in v1), color presets in one row.
  - **Fly line**: preset dropdown, line type, line weight, taper lengths (front taper, body, back taper, running line), and color zones.
  - **Backing**: length (100 / 150 / 200 / 250 yd or custom), strength (20 / 30 lb), and a color grid grouped by family, with the row for the current line type highlighted.
- **Header**: Save to rack, Copy share link, Export PNG, Export SVG.

## Fly line model

Taper and color are independent:

- **Taper sections** set thickness: front taper, body, back taper, running line. Their lengths add up to the total line length.
- **Color zones** are an ordered list, starting at the tip: `{ length, color }`. The last zone takes up whatever line is left. Zones can be added and removed, and they are edited one at a time in tabs.

Line diameter by weight (inches, floating). Intermediate lines are multiplied by 0.9 and sinking lines by 0.82. A sink tip has a sinking head (× 0.82) on a floating running line (× 1):

- tip `0.026 + 0.0010 × wt`
- body `0.036 + 0.0040 × wt`
- running line `0.026 + 0.0012 × wt`

Thickness changes linearly across the tapers.

## Spool geometry

Each reel model has a rim diameter, a spool (capacity) diameter, a spool width and an arbor diameter.

Makers rarely publish arbor size, so a reel can leave it out:

1. If the reel gives its **rated capacity** (for example "WF5F + 100 yd of 20 lb"), the arbor is solved so that this load fills the spool exactly: `arbor = 2 × sqrt(R_spool² − area / π)`, where `area` is the rated line (Generic WF5 Floating taper at the rated weight) plus the rated backing. The rated load then shows as 100% fill.
2. Otherwise the arbor is **0.57 × the spool diameter**, close to the generic reels.

A solved arbor is never smaller than 0.3 × the spool diameter.

Material is wound onto the spool from the arbor outward: backing first, then the fly line from the running-line end to the tip, so the tip is the outermost layer.

Each piece of line takes up a ring of the spool's cross-section:

```
area = length × diameter² × PACK / spoolWidth      (PACK = 1.1)
r_out = sqrt(r_in² + area / π)
```

Backing diameter: 20 lb = 0.021 in, 30 lb = 0.025 in.

- **Spool fill** = total area ÷ π(R_spool² − R_arbor²). Above 100%, show "Won't fit" and the largest backing length that does fit.
- **Rendering:** draw filled circles from the outermost ring inward, so neighboring rings share an edge with no gaps between them. The arbor hole is drawn last.

### Generic reels (v1)

| Model | Rim | Spool | Arbor | Width |
|---|---|---|---|---|
| Generic 3–4 wt | 3.2″ | 2.98″ | 1.65″ | 0.68″ |
| Generic 5–6 wt | 3.6″ | 3.36″ | 1.95″ | 0.78″ |
| Generic 7–8 wt | 4.0″ | 3.74″ | 2.20″ | 0.95″ |
| Generic 9–10 wt | 4.4″ | 4.12″ | 2.40″ | 1.10″ |

The generic reel face has 8 ports and a metallic sheen.

### Generic lines (v1)

Taper lengths in feet. Zones run from the tip.

| Preset | Type | Front | Body | Back | Running | Total | Zones |
|---|---|---|---|---|---|---|---|
| Generic WF5 Floating | Floating | 5.5 | 30 | 11.5 | 43 | 90 | green 47, yellow rest |
| Generic WF7 Intermediate | Intermediate | 6 | 26 | 8 | 50 | 90 | smoke |
| Generic WF8 Sink Tip | Sink tip | 4 | 16 | 7 | 73 | 100 | black 18, blue 9, chartreuse rest |

The floating line follows a 47 ft head with a long back taper, and the sink tip a short 27 ft streamer head on a 100 ft line, modeled loosely on lines being considered. These are estimates, not product specs.

## Color checks

Similarity is measured as CIE76 ΔE in Lab color space.

- **Backing vs. running line:** warn when ΔE < 30. The boundary between them will be hard to see.
- **Across the rack:** warn when two saved setups of *different* line types have backing colors with ΔE < 30, or when any setup's backing is too close to its own running line.

## Palettes

- **Fly line:** black, white, smoke, chartreuse, green, yellow, orange, red, blue, purple.
- **Backing:** black, white, chartreuse, green, yellow, orange, red, blue, purple, arranged in family rows.
- **Reel:** black, gunmetal, silver, champagne, forest green, red, blue.

## Sharing and saving

- **Share link:** the full setup is encoded in the URL hash.
- **Export:** PNG (2× scale) and SVG of the reel preview.
- **Rack:** saved setups are kept in `localStorage`.

## Out of scope for v1

- Real reel and line presets. These will be entered by hand later.
- Units other than feet and yards.
- Colorblindness simulation.
