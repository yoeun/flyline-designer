import { DEFAULT_SETUP, LINE_PRESETS, REELS, findById, presetForLine, reelColors } from '../data/catalog.js';
import { backingYardsForFill } from './geometry.js';

// The setup each size is drawn with on the Reels page: the generic WF floating line at the middle of
// the size's weights (rounded up) on 20 lb backing (or the pound test the maker rates it for): at least
// 100 yd, and more where it takes more to fill the spool to PREVIEW_FILL, as a bigger reel would be spooled.
// `colors` sets the backing, the head (front taper to back taper) and the running line for every reel.
const LINE = findById(LINE_PRESETS, 'generic-wf5f').line;
const HEAD = LINE.taper.front + LINE.taper.body + LINE.taper.back;
export const PREVIEW_COLORS = { backing: 'blue', head: 'green', running: 'yellow' };
export const previewWeight = ({ weights: [lo, hi] }) => Math.ceil((lo + hi) / 2);
export const PREVIEW_FILL = 0.85;
const MIN_PREVIEW_BACKING = 100;

export function previewSetup(size, color, colors = PREVIEW_COLORS) {
  const finishes = reelColors(size).map((c) => c.id);
  const setup = {
    reel: { model: size.id, color: finishes.includes(color) ? color : finishes[0] },
    line: {
      ...structuredClone(LINE),
      weight: previewWeight(size),
      zones: [
        { length: HEAD, color: colors.head },
        { length: 0, color: colors.running },
      ],
    },
    backing: { yards: MIN_PREVIEW_BACKING, pounds: size.rated?.pounds ?? 20, color: colors.backing },
  };
  setup.backing.yards = Math.max(MIN_PREVIEW_BACKING, backingYardsForFill(setup, PREVIEW_FILL));
  return setup;
}

// A new setup on a reel from the Reels page: the defaults, with the line at the weight the page draws
// that size with (the middle of its weights), so the designer opens on what the card showed.
export function setupForReel(reel) {
  const setup = structuredClone(DEFAULT_SETUP);
  const line = { ...setup.line, weight: previewWeight(findById(REELS, reel.model)) };
  return { setup: { ...setup, reel: { ...reel }, line }, presetId: presetForLine(line) };
}

// A size's capacity as the maker rates it, or its arbor when that's what we have instead.
export function capacityText(size) {
  if (size.rated) return `WF${size.rated.weight} + ${size.rated.yards} yd of ${size.rated.pounds} lb`;
  if (size.arbor) return `arbor ${size.arbor}″`;
  return null;
}

// Reference photos per model id. A photo belongs to the model whose id is the longest prefix of its file
// name (so "sage-spectrum-c-…" goes to Spectrum C, not Spectrum); photos matching no model are left out.
export function photosByModel(models, photos) {
  const ids = models.map((m) => m.id).sort((a, b) => b.length - a.length);
  const byModel = {};
  for (const photo of photos) {
    const id = ids.find((m) => photo.file.startsWith(`${m}-`));
    if (id) (byModel[id] ??= []).push(photo);
  }
  return byModel;
}

// How far to scroll so a card sits fully in the visible band from `top` to `bottom` (viewport pixels), with
// `gap` to spare: 0 when it already does. A card taller than the band scrolls only as far as it takes to
// fill the band, showing its top if that was the end cut off; one that already fills it stays put.
export function scrollToFit(card, top, bottom, gap = 12) {
  const up = card.top - (top + gap);
  const down = card.bottom - (bottom - gap);
  if (up < 0) return down > 0 ? 0 : Math.max(up, down);
  return down > 0 ? Math.min(up, down) : 0;
}
