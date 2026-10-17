// Maker lines are products sold in sizes. Each size is its own preset, so preset ids, share links
// and saved setups stay flat; `product` groups the sizes into one menu entry.

// Zones from [length, color] pairs, tip first; the last runs to the end of the line.
export const zones = (...pairs) => pairs.map(([length, color]) => ({ length, color }));

// A maker product: one menu entry. Each size becomes a LINE_PRESETS entry `${id}-${size.id}`.
// A size's taper is [front, body, back, running] in feet; its zones start as its first colorway.
// `estimated` marks a taper split scaled from another size because the maker publishes only the head length.
export const makerProduct = ({ id, maker, name, discontinued = false, sizes }) =>
  sizes.map(({ id: sizeId, label, type, weight, taper: [front, body, back, running], estimated = false, colorways }) => ({
    id: `${id}-${sizeId}`,
    product: id,
    maker,
    name: `${name} ${label}`,
    productName: name,
    sizeLabel: label,
    discontinued,
    estimated,
    colorways,
    line: { type, weight, taper: { front, body, back, running }, zones: colorways[0].zones },
  }));
