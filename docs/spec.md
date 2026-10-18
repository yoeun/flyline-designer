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

The app suggests a family. It never forces one. This family mapping is a draft and is not yet shown in the app.

## Layout

Two columns. They stack on narrow screens.

- **Left, preview**
  - Reel preview with a mode switch: **Reel** (default), **See-through**, **Line only**.
  - Checks: spool fill and backing vs. running line contrast, plus a warning when the line weight is out of range for the reel.
  - **Rack strip**, collapsed by default: saved setups, with a count of the color conflicts between them. **Expand** opens the rack page.
- **Right, options** (stacked sections)
  - **Reel**: Model and Size in one row, color presets below. Model has one entry per reel model, grouped by maker. Size lists only the sizes that model comes in, labelled the same way for every maker: the line weights it suits, then the maker's size when it differs (e.g. "6/7/8 wt (-7+)", "5/6/7 wt (III)", "7/8 wt"). A new model lands on the first size that suits the line's weight, otherwise the size nearest the current reel's rim.
  - **Fly line**: Preset, Type and Weight in one row (Type and Weight unlock with the **Custom** preset). A reel size takes its own weights plus one under and one over (underlining and overlining, within 2–15 wt), e.g. 4–8 wt for a 5–7 wt reel. Weight lists only those (a maker line's sizes among them), with over- and underlines labelled; a loaded setup's out-of-range weight still shows, labelled so, and is never changed. Preset disables, and lists last within its maker, lines with no size the reel takes. A product picked from Preset keeps the line's weight if the reel takes it, else lands on its nearest size in the reel's range, else the nearest over- or underline. A new reel size that doesn't take the line's weight moves the line to its nearest size in range (maker lines, keeping the colorway) or the nearest weight in range (any other line, keeping its taper and colors); a maker line with no such size stays as is. Lines tried from the line guide keep the current reel, even out of range. Below it, a line editor: a dimension line for the taper sections (front taper, body, back taper, running line) above the line drawn in its color zones. Click a section or zone to edit it underneath (length; zones also get color, Split and Remove). Drag or arrow-key a boundary to resize; dragging keeps the total length.
  - **Backing**: length (100 / 150 / 200 / 250 yd or custom), strength (20 / 30 lb), and colors in one row in gradient order (red, orange, yellow, chartreuse, green, blue, purple, white, black).
- **Header**: New, Reset, Save, Save as new (when editing a saved setup), Export PNG, Export SVG, and a System / Light / Dark theme switch.

## Rack

Saved setups carry a title (optional, falls back to the line preset name, or "Custom <type> <wt> wt"), styles (Dry, Nymph, Streamer, any number) and free-text notes. **Weight** always means the line weight.

- **Cards:** the reel drawing, a band with the line weight and style letters, the name and reel model, and a menu with Edit details and Remove (Remove asks first). A warning icon beside the weight marks a setup with a color conflict; hover or tap it for the explanation.
- **Editing in place:** clicking a card loads it in the designer (asking first if there are unsaved changes). Save then updates that setup right away (no form; a toast confirms); Save as new opens the details form and keeps the current setup while adding a copy. A new setup's Save opens the details form. Section dots and per-section reset show what changed from the saved version.
- **Details:** title, styles and notes are edited in one dialog, from the designer (Save on a new setup, Save as new, or the title's edit control) or from a card's menu.
- **Rack page:** Your rack, with the setup count, **New** top right, and **← Back to designer** when you arrived via Expand (it returns to your unsaved work). Two pick-one filters: **Rod weight** (All plus the weights in the rack) and **Style** (All, Dry, Nymph, Streamer). With a weight picked, setups at that weight come first, then **Also fits a N wt** for lines one weight either side. Within a group, setups sort by reel model. Cards show notes clamped to three lines. The setup loaded in the designer shows a small Editing label instead of an outline.
- **Pages:** `?page=rack` is the rack page; browser Back and Forward move between pages. A URL with a setup opens the designer. With no params the app opens the rack page if the rack has setups, else the designer.
- **Demo:** `?demo=1` uses a fixed test rack for that visit only. Nothing is written to `localStorage`, and your own rack returns without the param.

## Fly line model

Taper and color are independent:

- **Taper sections** set thickness: front taper, body, back taper, running line. Their lengths add up to the total line length.
- **Color zones** are an ordered list, starting at the tip: `{ length, color }`. The last zone takes up whatever line is left. Zones are split and removed in the line editor.

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

### Real reels

Reel data lives in `src/data/reels/<maker>.json`, one file per maker (see the README there). Each model lists its sizes, and each size has its own id, which is what saved setups and links store.

The JSON files are the full list, with sources and estimates in each model's notes. The table below covers the first reels added. The **Reels** page (in the page menu) draws every model and size to scale from both sides, with the maker's specs, for checking the drawings and data at a glance. Page-wide controls show or hide the line and set the backing, head and running line colors. In dev only, it also shows the maker's photos from the gitignored `data/reel-photos/`.


Lamson figures come from Lamson's spec table (capacity with the largest line each size takes); the rest come from retailer listings. Spool diameter is estimated as rim − 0.24″, and the arbor is solved from the rated capacity.

| Model | Rim | Spool (est.) | Width | Rated capacity |
|---|---|---|---|---|
| Lamson Liquid S -3+ | 3.35″ | 3.11″ | 1.00″ | WF4 + 100 yd of 20 lb |
| Lamson Liquid S -5+ | 3.65″ | 3.41″ | 1.00″ | WF6 + 100 yd of 20 lb |
| Lamson Liquid S -7+ | 3.9″ | 3.66″ | 1.15″ | WF8 + 200 yd of 20 lb |
| Lamson Liquid S -9+ | 4.45″ | 4.21″ | 1.25″ | WF10 + 250 yd of 30 lb |
| Orvis Hydros II (2026) | 3.4″ | 3.16″ | 0.85″ (est.) | WF4 + 125 yd of 20 lb (est.) |
| Orvis Hydros III (2026) | 3.88″ | 3.62″ (measured) | 0.90″ (measured) | arbor 2.43″ (measured) |
| Orvis Hydros IV (2026) | 4.25″ | 4.01″ | 1.00″ (est.) | WF8 + 200 yd of 20 lb (est.) |
| Orvis Hydros II (2020–25) | 3.4″ | 3.16″ | 0.90″ (est.) | WF4 + 125 yd of 20 lb |
| Orvis Hydros III (2020–25) | 3.7″ | 3.46″ | 1.00″ (est.) | WF6 + 125 yd of 20 lb |
| Orvis Hydros IV (2020–25) | 4.0″ | 3.76″ | 1.10″ (est.) | WF8 + 200 yd of 20 lb |
| Orvis Clearwater II | 3.4″ | 3.16″ | 1.05″ (est.) | WF4 + 125 yd of 20 lb |
| Orvis Clearwater III | 3.7″ | 3.46″ | 1.15″ (est.) | WF6 + 125 yd of 20 lb |
| Orvis Clearwater IV | 4.0″ | 3.76″ | 1.30″ (est.) | WF8 + 200 yd of 20 lb |
| Redington Behemoth 4/5 | 3.4″ | 3.16″ | 0.95″ (est.) | WF4 + 125 yd of 20 lb |
| Redington Behemoth 5/6 | 3.6″ | 3.36″ | 1.00″ (est.) | WF5 + 125 yd of 20 lb |
| Redington Behemoth 7/8 | 4.0″ | 3.76″ | 1.10″ (est.) | WF7 + 200 yd of 20 lb |
| Redington Behemoth 9/10 | 4.4″ | 4.16″ | 1.20″ (est.) | WF9 + 200 yd of 30 lb |
| Redington Behemoth 11/12 | 4.7″ | 4.46″ | 1.30″ (est.) | WF11 + 250 yd of 30 lb |
| Redington Run 3/4 | 3.2″ | 2.96″ | 0.87″ (listings say 0.87–1.3″) | WF3 + 75 yd of 20 lb |
| Redington Run 5/6 | 3.6″ | 3.36″ | 0.91″ (listings say 0.9–1.3″) | WF5 + 100 yd of 20 lb |
| Redington Run 7/8 | 4.0″ | 3.76″ | 0.94″ (listings say 0.94–1.5″) | WF7 + 200 yd of 20 lb |

Orvis and Redington (for the Behemoth) don't publish spool width, so those widths are estimates. The one exception is the 2026 Hydros III, which Trident Fly Fishing measured in its review (spool 3.62″, arbor 2.43″, width 0.9″); the other 2026 Hydros sizes scale from it. The Behemoth 4/5's 125 yd comes from Far Bank, Redington's parent; Trident lists 75 yd.

Lamson rates each size one line weight either side of its number, hence labels like -7+ (6–8 wt). Orvis labels sizes II–IV, without weights. The weights shown (3–5, 5–7, 7–9 wt) are estimates centred on each size's rated line.

Maker finish colors are sampled from the makers' studio product photos (lit faces, highlights and shadows dropped), since no maker publishes color values.

Each reel names a frame `design` (a size can name its own), drawn as SVG for the drag side and the spool side in `src/assets/reels` by `scripts/gen-reel-frames.mjs` from one module per design in `scripts/reel-designs` (`npm run reels`; `npm run reel-preview` renders a design beside the maker's photos). A finish can color a design's accent parts, and a model can set its own `accents` and `trims` per finish. The preview shows the drag side by default; a Drag/Spool toggle switches sides. The wound line shows through the frame's windows, shaded as fine wraps.

### Generic lines (v1)

Taper lengths in feet. Zones run from the tip.

| Preset | Type | Front | Body | Back | Running | Total | Zones |
|---|---|---|---|---|---|---|---|
| Generic WF5 Floating | Floating | 5.5 | 30 | 11.5 | 43 | 90 | green 47, yellow rest |
| Generic WF7 Intermediate | Intermediate | 6 | 26 | 8 | 50 | 90 | smoke |
| Generic WF8 Sink Tip | Sink tip | 4 | 16 | 7 | 73 | 100 | black 18, blue 9, chartreuse rest |

The floating line follows a 47 ft head with a long back taper, and the sink tip a short 27 ft streamer head on a 100 ft line, modeled loosely on lines being considered. These are estimates, not product specs.

### Real lines

Head and total length come from maker specs. Taper splits are estimates. Green stands for moss and yellow for gold.

| Preset | Type | Front | Body | Back | Running | Total | Zones |
|---|---|---|---|---|---|---|---|
| RIO Premier Gold WF5F | Floating | 5.5 | 30 | 11.5 | 43 | 90 | green 47, yellow rest |
| RIO Premier Gold WF8F | Floating | 6 | 32 | 12 | 40 | 90 | green 50, yellow rest |
| Airflo Streamer Max Short WF8 · black/blue/chartreuse | Sink tip | 4 | 16 | 7 | 73 | 100 | black 18, blue 9, chartreuse rest |
| Airflo Streamer Max Short WF8 · black/red/orange | Sink tip | 4 | 16 | 7 | 73 | 100 | black 18, red 9, orange rest |

The Airflo line comes in both colorways, so both are presets for comparison. Zones assume the colors run from the tip to the running line in the listed order.

## Color checks

Similarity is measured as CIE76 ΔE in Lab color space.

- **Backing vs. running line:** warn when ΔE < 30. The boundary between them will be hard to see.
- **Line weight:** warn when the line weight is out of range for the reel, even over- or underlined, e.g. "A 10 wt line is out of range for this reel (suits 5–7 wt; 4–8 wt with over/underlining)." Only a loaded setup or a line from the guide can be out of range.
- **Across the rack:** warn when two saved setups of *different* line types have backing colors with ΔE < 30, or when any setup's backing is too close to its own running line.

## Palettes

- **Fly line:** black, white, smoke, chartreuse, green, yellow, orange, red, blue, purple.
- **Backing:** black, white, chartreuse, green, yellow, orange, red, blue, purple, shown in one row in gradient order.
- **Reel:** black, gunmetal, silver, champagne, forest green, red, blue.

## Sharing and saving

- **Address bar:** the setup is written as readable query params (reel, color, line, backing, title, styles, notes; a custom line travels as one encoded param), so a copied URL restores the design. Old hash links still load.
- **Export:** PNG (2× scale) and SVG of the reel preview.
- **Rack:** saved setups are kept in `localStorage`. The address bar also marks which rack entry is being edited (`edit`).

## Out of scope for v1

- Units other than feet and yards.
- Colorblindness simulation.
