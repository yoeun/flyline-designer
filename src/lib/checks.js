import { REELS, allowedWeights, findById, hexOf, nameOf, reelWeightFit } from '../data/catalog.js';
import { deltaE, SIMILAR_DELTA_E } from './color.js';
import { innermostLineColor } from './geometry.js';
import { displayName } from './rack.js';

export function backingContrast(setup) {
  const run = innermostLineColor(setup.line);
  const value = deltaE(hexOf(setup.backing.color), hexOf(run));
  return { value, similar: value < SIMILAR_DELTA_E, backing: setup.backing.color, run };
}

const span = (lo, hi) => (lo === hi ? `${lo} wt` : `${lo}–${hi} wt`);

// A line weight the reel doesn't take, even over- or underlined (only a loaded setup can have one).
export function weightCheck(setup) {
  const reel = findById(REELS, setup.reel.model);
  const { weight } = setup.line;
  if (reelWeightFit(reel, weight) !== 'out') return null;
  const [lo, hi] = reel.weights;
  const weights = allowedWeights(reel);
  const [min, max] = [weights[0], weights.at(-1)];
  const lining = min < lo && max > hi ? 'over/underlining' : max > hi ? 'overlining' : min < lo ? 'underlining' : null;
  const also = lining ? `; ${span(min, max)} with ${lining}` : '';
  const article = weight === 8 || weight === 11 ? 'An' : 'A';
  return { text: `${article} ${weight} wt line is out of range for this reel (suits ${span(lo, hi)}${also}).` };
}

// Conflicts across saved setups: a backing that blends into its own line, or two different
// line types whose backings look alike.
// Two setups with the same display name (identical reels) get their reel and backing added to tell them apart.
const pairLabels = (a, b) => {
  const [na, nb] = [displayName(a), displayName(b)];
  if (na !== nb) return [na, nb];
  const tag = (s) => `${na} (${findById(REELS, s.reel.model)?.name ?? s.reel.model}, ${nameOf(s.backing.color).toLowerCase()} backing)`;
  return [tag(a), tag(b)];
};

export function rackConflicts(setups) {
  const conflicts = [];
  setups.forEach((s) => {
    const c = backingContrast(s);
    if (c.similar) {
      conflicts.push({
        ids: [s.id],
        title: `${displayName(s)}: backing matches running line`,
        detail: `${nameOf(c.backing)} backing next to a ${nameOf(c.run).toLowerCase()} running line hides where the fly line ends.`,
      });
    }
  });
  for (let i = 0; i < setups.length; i++) {
    for (let j = i + 1; j < setups.length; j++) {
      const a = setups[i];
      const b = setups[j];
      if (a.line.type === b.line.type) continue;
      const [la, lb] = pairLabels(a, b);
      const value = deltaE(hexOf(a.backing.color), hexOf(b.backing.color));
      if (value < SIMILAR_DELTA_E) {
        conflicts.push({
          ids: [a.id, b.id],
          title: `${la} and ${lb} look alike`,
          detail: `${nameOf(a.backing.color)} and ${nameOf(b.backing.color).toLowerCase()} backing read as one color at a glance (ΔE ${Math.round(value)}), but the lines are different types.`,
        });
      }
    }
  }
  return conflicts;
}

// The conflicts that involve one setup, worded from its point of view: a two-setup conflict names the other setup.
export function conflictsFor(setupId, conflicts, setups) {
  return conflicts
    .filter((c) => c.ids.includes(setupId))
    .map((c) => {
      if (c.ids.length === 1) return { text: c.detail };
      const other = setups.find((s) => s.id === c.ids.find((id) => id !== setupId));
      if (!other) return { text: c.detail };
      const reel = findById(REELS, other.reel.model)?.name ?? 'reel';
      return { text: `Backing looks like the one on ${displayName(other)} (${reel}) at a glance, but the lines are different types.` };
    });
}
