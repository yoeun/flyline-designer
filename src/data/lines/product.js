// Maker lines are products sold in sizes. Each size is its own preset, so preset ids, share links
// and saved setups stay flat; `product` groups the sizes into one menu entry.

// Zones from [length, color] pairs, tip first; the last runs to the end of the line.
export const zones = (...pairs) => pairs.map(([length, color]) => ({ length, color }));

// Per-size specs come from the maker's lineup research, data/lineups/<maker>.json, imported as
// `import * as LINEUP from 'lineups:<maker>'` (see scripts/lineups-plugin.mjs). A lineup product
// lists its sizes, each with its label, weight, density, head and total length in feet, and the
// maker's taper split where one is published for that size.

// The lineup size labelled `label`; `densityLabel` picks one where a label is sold in several densities.
export function lineupSize(product, label, densityLabel) {
  const size = product.sizes.find((s) => s.label === label && (densityLabel === undefined || s.densityLabel === densityLabel));
  if (!size) throw new Error(`${product.id} has no size ${label}${densityLabel ? ` ${densityLabel}` : ''}`);
  return size;
}

// A size's taper from the maker's own split for it, with the running line making up the lineup's total.
export const publishedTaper = ({ taper: { front, body, back }, total }) => [front, body, back, total - front - body - back];

// A lineup size with some of its numbers replaced, where a menu size knowingly departs from the
// maker's table. Say why where it's used; the lineup test checks every number not replaced.
export const overriding = (size, changes) => ({ ...size, ...changes, overrides: Object.keys(changes) });

// A maker product: one menu entry. Each size becomes a LINE_PRESETS entry `${id}-${size.id}`.
// A size's taper is [front, body, back, running] in feet; its zones start as its first colorway.
// `estimated` marks a taper split scaled from another size because the maker publishes only the head length.
// `lineup` is the lineup size the size's weight, head and total length come from.
export const makerProduct = ({ id, maker, name, discontinued = false, sizes }) =>
  sizes.map(({ id: sizeId, label, type, weight, taper: [front, body, back, running], estimated = false, colorways, lineup }) => ({
    id: `${id}-${sizeId}`,
    product: id,
    maker,
    name: `${name} ${label}`,
    productName: name,
    sizeLabel: label,
    discontinued,
    estimated,
    colorways,
    lineup,
    line: { type, weight, taper: { front, body, back, running }, zones: colorways[0].zones },
  }));
