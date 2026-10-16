import { hexOf, nameOf } from '../data/catalog.js';
import { deltaE, SIMILAR_DELTA_E } from './color.js';
import { innermostLineColor } from './geometry.js';

export function backingContrast(setup) {
  const run = innermostLineColor(setup.line);
  const value = deltaE(hexOf(setup.backing.color), hexOf(run));
  return { value, similar: value < SIMILAR_DELTA_E, backing: setup.backing.color, run };
}

// Conflicts across saved setups: a backing that blends into its own line, or two different
// line types whose backings look alike.
export function rackConflicts(setups) {
  const conflicts = [];
  setups.forEach((s) => {
    const c = backingContrast(s);
    if (c.similar) {
      conflicts.push({
        ids: [s.id],
        title: `${s.name}: backing matches running line`,
        detail: `${nameOf(c.backing)} backing next to a ${nameOf(c.run).toLowerCase()} running line hides where the fly line ends.`,
      });
    }
  });
  for (let i = 0; i < setups.length; i++) {
    for (let j = i + 1; j < setups.length; j++) {
      const a = setups[i];
      const b = setups[j];
      if (a.line.type === b.line.type) continue;
      const value = deltaE(hexOf(a.backing.color), hexOf(b.backing.color));
      if (value < SIMILAR_DELTA_E) {
        conflicts.push({
          ids: [a.id, b.id],
          title: `${a.name} and ${b.name} look alike`,
          detail: `${nameOf(a.backing.color)} and ${nameOf(b.backing.color).toLowerCase()} backing read as one color at a glance (ΔE ${Math.round(value)}), but the lines are different types.`,
        });
      }
    }
  }
  return conflicts;
}
