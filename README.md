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
- **Share your rack** through a view-only link that follows your changes

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) v4, alongside the hand-written `src/styles.css` while it's migrated
- [shadcn/ui](https://ui.shadcn.com/) on [Base UI](https://base-ui.com/): generated components live in `src/components/ui/`. App code uses them through our own wrapper components, never directly, so the library can be swapped later.
- [Vitest](https://vitest.dev/) for the geometry and color logic

## Getting started

```sh
npm install
npm run dev      # start the dev server
npm run api      # start the shares API (for sharing a rack), alongside dev
npm test         # run unit tests
npm run build    # production build in dist/
```

Sharing a rack needs the shares API. `npm run api` runs it on port 8787, keeping shares in memory, and the dev server sends `/api` to it.

To try the rack page without saving setups by hand, open the app with `?demo=1` (for example `http://localhost:5173/?demo=1`). It shows a fixed test rack for that visit and never touches your saved one.

## Deploy

The app runs on [Render](https://render.com/), set up by the Blueprint in [render.yaml](render.yaml):

- `flyline-designer`: the app as a static site. Every push to `main` runs the tests, builds, and publishes `dist/`. A failing test stops the deploy.
- `flyline-designer-api`: the shares API in `server/`, a Node web service.
- `flyline-designer-db`: the Postgres database the API keeps shared racks in. It accepts connections only from Render services.

The API, the database and their plans are covered under [Sharing a rack](#sharing-a-rack).

To connect it (once):

1. In the Render dashboard, choose **New → Blueprint** and pick this repository.
2. Render reads `render.yaml` and creates the `flyline-designer` static site. Apply it.
3. Add the final domain under the site's **Settings → Custom Domains** before people start using it. Saved racks live in the browser's `localStorage`, which belongs to one origin, so moving from `*.onrender.com` to a custom domain later would leave everyone's racks behind.

The Blueprint also:

- builds on Node 24 (`NODE_VERSION`). `engines` in `package.json` lists the versions Vite supports.
- serves `index.html` for any path that isn't a file, so path routes work without a 404.
- caches hashed files in `/assets/` for a year and has browsers recheck `index.html` on every load, so a deploy shows up on the next visit. A path route added later should get the same `no-cache` header as `/`.

## Sharing a rack

The Share button on the rack page publishes the rack to the shares API and gives a view-only link,
`/r/<share id>`. The link opens the rack without menus or saving. Opening a setup from it starts a copy in
the designer, saved to the viewer's own rack if they choose.

- **Live.** While the rack is shared, each change is sent to the API a second later, so the link shows the
  latest version when it is opened or reloaded.
- **Owner token.** Sharing returns a random owner token, kept in this browser's `localStorage`
  (`flyline-designer:share`). Updating, renewing (New link) and stopping the link all need it. The
  server stores only its hash. Clearing site data or switching browsers loses it. The link still
  works, but can't be updated or stopped from there.
- **Share ids** are 128 random bits, unrelated to the rack or the owner token, so a link can't be guessed or
  turned into edit access. New link swaps in a fresh id and the old link stops working.
- **Limits.** A rack can have up to 500 setups in a 512 KB request. New links are limited to 30 an hour
  per caller.

The API is in `server/` (`app.js` has the routes). It runs on Postgres when `DATABASE_URL` is set, and
in memory otherwise. `ALLOWED_ORIGINS` lists the site origins that may call it, and the site build
reads the API address from `VITE_API_URL`. Both are set in `render.yaml`. Add a custom domain to
`ALLOWED_ORIGINS` when there is one, and keep `VITE_API_URL` in step with the API's address on Render.

The API and the database are on Render's free plans for now. The free API sleeps when idle, so the
first share or view after a quiet spell can take a minute. Free databases expire and take every shared
rack with them, so move the database to a paid plan before people rely on their links.

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
