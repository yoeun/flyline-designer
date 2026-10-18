// A card under the pointer rises a little and casts a shadow; with reduced motion it only casts the shadow.
// Hover styles apply only where there's a pointer that hovers, so touch screens leave the card alone.
export const CARD_LIFT = 'transition-[translate,box-shadow,border-color] duration-150 ease-out hover:shadow-md motion-safe:hover:-translate-y-0.5';
// The outline on hover, lighter than the ring that marks the setup being edited.
export const CARD_OUTLINE = 'hover:border-primary/60 hover:ring-1 hover:ring-primary/60';
