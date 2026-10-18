// A card under the pointer grows a little and casts a shadow, drawn over its neighbors; with reduced motion
// it only casts the shadow. Each card sets how much it grows (motion-safe:hover:scale-*): a big card needs
// less. Hover styles apply only where there's a pointer that hovers, so touch screens leave the card alone.
export const CARD_GROW = 'relative transition-[scale,box-shadow,border-color] duration-150 ease-out hover:z-10 hover:shadow-md';
// The outline on hover, lighter than the ring that marks the setup being edited.
export const CARD_OUTLINE = 'hover:border-primary/60 hover:ring-1 hover:ring-primary/60';
