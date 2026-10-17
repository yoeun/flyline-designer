# Flyline Designer

A design tool to help anglers put together the best looking fly fishing outfit for them. Pick a reel, reel color, backing color, and fly line, and see a live preview of what the combination looks like.

## Features

- **Live preview** of your reel, backing, and fly line together
- **Reel selection** with a choice of reel color
- **Backing color** selection
- **Fly line selection** with a choice of line color
- **Clickable line editor** for taper lengths and color zones
- **Color picker** laid out as a grid of common colors
- **Rack** of saved setups with titles, styles and notes, and a full rack page filtered by rod weight and style
- **Export** the preview as a PNG or SVG to share

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) v4, alongside the hand-written `src/styles.css` while it's migrated
- [shadcn/ui](https://ui.shadcn.com/) on [Base UI](https://base-ui.com/): generated components live in `src/components/ui/`. App code uses them through our own wrapper components, never directly, so the library can be swapped later.
- [Vitest](https://vitest.dev/) for the geometry and color logic

## Getting started

```sh
npm install
npm run dev      # start the dev server
npm test         # run unit tests
npm run build    # production build in dist/
```

To try the rack page without saving setups by hand, open the app with `?demo=1` (for example `http://localhost:5173/?demo=1`). It shows a fixed test rack for that visit and never touches your saved one.

## Contributing

- PRs are squash merged, and the PR title becomes the commit on `main`.
- PR titles follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`, for example `feat(editor): split color zones` or `fix: keep backing labels aligned`. A check on each PR enforces this.

## How it works

See [docs/spec.md](docs/spec.md) for the full v1 spec. In short:

- Ring sizes come from real line thickness: each piece of line takes up `length × diameter²` of the spool's cross-section, so ring widths grow by a square root rather than in proportion to length.
- Fly line taper (thickness) and color zones are separate, so two-tone heads and color changes partway through the body are supported.
- Backing colors are shown in one row, and the app warns when backing looks too similar to the running line or to another reel's backing.

## Maker lines

Each maker's lines start as research in `data/lineups/<maker>.json`: every single-hand line the
maker sells, with per-size weight, density, head and total length, grain weights, colors and
(where the maker publishes one) the taper split. The schema is in
[data/lineups/SCHEMA.md](data/lineups/SCHEMA.md). That folder is outside `src`, so it isn't bundled
whole; the line guide and the line menu are both built from it.

To add a maker or refresh one:

1. **Research.** Write or update `data/lineups/<maker>.json` from the maker's own pages, following
   SCHEMA.md. Record only numbers you read from a source and leave the rest `null`; put anything
   odd about the numbers in `data_notes`.
2. **Regenerate the guide.** Run `npm run guide`. It rewrites `src/data/guide/<maker>.json` for
   every lineup file. Look over the diff before committing.
3. **Add menu lines.** In `src/data/lines/<maker>.js`, import the lineup with
   `import * as LINEUP from 'lineups:<maker>'` and build each product's sizes from
   `LINEUP['<product id>'].sizes`, which carry each size's weight, head and total length. The file
   adds only what the research doesn't have: the taper split (or the size whose diagram it comes
   from), colorways and colors, labels and the line type. Pass each size's lineup entry as `lineup`
   to `makerProduct`. Where a size knowingly departs from the maker's table, use
   `overriding(size, { head: 49 })` and say why in a comment. A new maker file also goes in `MAKERS`
   in `src/data/catalog.js`.
4. **Test.** `npm test` checks every menu size against its lineup entry (weight, head and total),
   apart from the numbers it overrides.

## Status

v1: generic reels and example fly lines. Real reel and line presets will be added by hand.
