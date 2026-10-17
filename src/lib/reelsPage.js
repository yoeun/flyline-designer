import { LINE_PRESETS, findById, reelColors } from '../data/catalog.js';

// The setup each size is drawn with on the Reels page: the generic WF floating line at the middle of
// the size's weights (rounded up) on 100 yd of 20 lb backing, so the fill is comparable across reels.
// `colors` sets the backing, the head (front taper to back taper) and the running line for every reel.
const LINE = findById(LINE_PRESETS, 'generic-wf5f').line;
const HEAD = LINE.taper.front + LINE.taper.body + LINE.taper.back;
export const PREVIEW_COLORS = { backing: 'blue', head: 'green', running: 'yellow' };
export const previewWeight = ({ weights: [lo, hi] }) => Math.ceil((lo + hi) / 2);

export function previewSetup(size, color, colors = PREVIEW_COLORS) {
  const finishes = reelColors(size).map((c) => c.id);
  return {
    reel: { model: size.id, color: finishes.includes(color) ? color : finishes[0] },
    line: {
      ...structuredClone(LINE),
      weight: previewWeight(size),
      zones: [
        { length: HEAD, color: colors.head },
        { length: 0, color: colors.running },
      ],
    },
    backing: { yards: 100, pounds: 20, color: colors.backing },
  };
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
