# Flyline Designer

A design tool to help anglers put together the best looking fly fishing outfit for them. Pick a reel, reel color, backing color, and fly line, and see a live preview of what the combination looks like.

## Features

- **Live preview** of your reel, backing, and fly line together
- **Reel selection** with a choice of reel color
- **Backing color** selection
- **Fly line selection** with a choice of line color
- **Clickable line editor** for taper lengths and color zones
- **Color picker** laid out as a grid of common colors
- **Export** the preview as a PNG or SVG to share

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/) for the geometry and color logic

## Getting started

```sh
npm install
npm run dev      # start the dev server
npm test         # run unit tests
npm run build    # production build in dist/
```

## How it works

See [docs/spec.md](docs/spec.md) for the full v1 spec. In short:

- Ring sizes come from real line thickness: each piece of line takes up `length × diameter²` of the spool's cross-section, so ring widths grow by a square root rather than in proportion to length.
- Fly line taper (thickness) and color zones are separate, so two-tone heads and color changes partway through the body are supported.
- Backing colors are grouped by family (cool = floating, neutral = intermediate, hot = sinking), and the app warns when backing looks too similar to the running line or to another reel's backing.

## Status

v1: generic reels and example fly lines. Real reel and line presets will be added by hand.
