import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LINE_PRESETS } from '../catalog.js';

// Every maker's lineup research, read whole (the app only bundles the sizes its menu uses).
const DIR = new URL('../../../data/lineups/', import.meta.url);
const VARIANTS = new Map(
  readdirSync(DIR)
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => JSON.parse(readFileSync(new URL(f, DIR), 'utf8')).products)
    .map((p) => [p.id, p.variants]),
);

const head = ({ taper: t }) => t.front + t.body + t.back;
const numbers = (line) => ({ weight: line.weight, head: head(line), total: head(line) + line.taper.running });

describe('maker lines against their lineup', () => {
  const real = LINE_PRESETS.filter((p) => p.maker);

  it.each(real.map((p) => [p.id, p]))('%s has the weight, head and total length of its lineup size', (_, { line, lineup }) => {
    expect(lineup).toBeDefined();
    const variant = VARIANTS.get(lineup.product)?.find((v) => v.label === lineup.label && (v.density_label ?? undefined) === lineup.densityLabel);
    expect(variant, `${lineup.product} ${lineup.label}`).toBeDefined();
    const overrides = lineup.overrides ?? [];
    const research = { weight: variant.weight, head: variant.head_ft, total: variant.total_ft };
    // An override must replace something, or it's stale.
    for (const key of overrides) expect(lineup[key], key).not.toBe(research[key]);
    const expected = Object.fromEntries(Object.entries(research).map(([key, value]) => [key, overrides.includes(key) ? lineup[key] : value]));
    expect(numbers(line)).toEqual(expected);
  });
});
