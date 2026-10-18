import * as LINEUP from 'lineups:cortland';
import { makerProduct, overriding, publishedTaper, zones } from './product.js';

// Matched by eye to product photos and Cortland's taper charts.
export const COLORS = [
  { id: 'cortland-peach', name: 'Peach', hex: '#f7c89c' },
  { id: 'cortland-clear-camo', name: 'Clear Camo', hex: '#6e6a5c' },
  { id: 'cortland-dark-brown', name: 'Dark Brown', hex: '#37261e' },
  { id: 'cortland-black', name: 'Black', hex: '#222222' },
  { id: 'cortland-green', name: 'Green', hex: '#89a64c' },
  { id: 'cortland-mustard', name: 'Mustard', hex: '#f6c73b' },
  // Sampled from the swatch or line on each line's taper chart.
  { id: 'cortland-mint-green', name: 'Mint Green', hex: '#6cbe67' },
  { id: 'cortland-moss-green', name: 'Moss Green', hex: '#83944e' },
  { id: 'cortland-orange', name: 'Orange', hex: '#f27944' },
  { id: 'cortland-heron', name: 'Heron', hex: '#8db8c9' },
  { id: 'cortland-light-blue', name: 'Light Blue', hex: '#add7ed' },
  // Cortland's charts draw clear line as this pale grey.
  { id: 'cortland-clear', name: 'Clear', hex: '#e6e6e6' },
  { id: 'cortland-seafoam-green', name: 'Seafoam Green', hex: '#9bdc98' },
  { id: 'cortland-tan', name: 'Tan', hex: '#c4bb9c' },
  { id: 'cortland-sand', name: 'Sand', hex: '#ebe5cd' },
  { id: 'cortland-blue', name: 'Blue', hex: '#75d3db' },
  { id: 'cortland-seafoam', name: 'Seafoam', hex: '#4ebfa9' },
  { id: 'cortland-sky-blue', name: 'Sky Blue', hex: '#a1d1e7' },
  { id: 'cortland-olive', name: 'Olive', hex: '#878e4b' },
  { id: 'cortland-ice-blue', name: 'Ice Blue', hex: '#0fa7e2' },
  { id: 'cortland-streamer-olive', name: 'Streamer Olive', hex: '#b8ab77' },
  { id: 'cortland-streamer-green', name: 'Streamer Green', hex: '#90ca51' },
  { id: 'cortland-hi-vis-orange', name: 'Hi-Vis Orange', hex: '#ff7300' },
  // The charts draw white in the same pale grey as clear.
  { id: 'cortland-white', name: 'White', hex: '#e6e6e6' },
  { id: 'cortland-aqua-green', name: 'Aqua Green', hex: '#d0e27f' },
  { id: 'cortland-yellow', name: 'Yellow', hex: '#eedf52' },
  { id: 'cortland-brown', name: 'Brown', hex: '#75613c' },
  { id: 'cortland-pike-olive', name: 'Pike Olive', hex: '#a29d59' },
  { id: 'cortland-dark-green', name: 'Dark Green', hex: '#164722' },
  { id: 'cortland-seaweed', name: 'Seaweed', hex: '#d0e298' },
  // The Striped Bass Float's light blue is far bluer than the Finesse Trout II's.
  { id: 'cortland-cold-salt-light-blue', name: 'Cold Salt Light Blue', hex: '#17aadd' },
  { id: 'cortland-aqua-blue', name: 'Aqua Blue', hex: '#7aced9' },
  { id: 'cortland-pale-yellow', name: 'Pale Yellow', hex: '#f1d07f' },
  // Far brighter than the 333 Trout All Purpose's yellow. Shared by the 50+ Giant Trevally, Trout Boss and
  // Trout Double Taper; the id keeps its first line's name so saved setups still find it.
  { id: 'cortland-giant-trevally-yellow', name: 'Bright Yellow', hex: '#f9ed25' },
  { id: 'cortland-pineapple', name: 'Pineapple', hex: '#eee04c' },
  // The Striped Bass Blitz's blues are both darker than the Striped Bass Intermediate's and Float's.
  { id: 'cortland-striped-bass-blitz-ice-blue', name: 'Striped Bass Blitz Ice Blue', hex: '#0a80c8' },
  { id: 'cortland-striped-bass-blitz-sky-blue', name: 'Striped Bass Blitz Sky Blue', hex: '#51cced' },
  // The Cold Salt Clear Tip's sand is darker than the Tropic Plus All Purpose's.
  { id: 'cortland-cold-salt-clear-tip-sand', name: 'Cold Salt Clear Tip Sand', hex: '#ddcdac' },
  { id: 'cortland-streamer-sink-tip-25-sage-green', name: 'Streamer Sink Tip 25 Sage Green', hex: '#cbd18b' },
  { id: 'cortland-streamer-intermediate-tip-space-grey', name: 'Streamer Intermediate Tip Space Grey', hex: '#8a8f92' },
  // Cortland's moss greens and olives differ from chart to chart.
  { id: 'cortland-streamer-intermediate-tip-moss-green', name: 'Streamer Intermediate Tip Moss Green', hex: '#9ba66c' },
  { id: 'cortland-headwater-olive', name: 'Headwater Olive', hex: '#4c5538' },
  // Far paler than the Modern Trout's moss green. Shared by the Headwater, Trout Double Taper and
  // Indicator II, whose chart draws its olive in the same hex.
  { id: 'cortland-headwater-moss-green', name: 'Pale Moss Green', hex: '#bac78f' },
  // The Pike Musky Float's pale yellow is far brighter than the Tropic Plus All Purpose XP's.
  { id: 'cortland-pike-musky-float-pale-yellow', name: 'Pike Musky Float Pale Yellow', hex: '#f8ec80' },
  { id: 'cortland-333-double-taper-mango', name: 'Mango', hex: '#f99d3a' },
  // The Ultralight II's aqua green is far duller than the Cold Salt lines'.
  { id: 'cortland-ultralight-ii-aqua-green', name: 'Ultralight II Aqua Green', hex: '#c5cb85' },
  { id: 'cortland-ultralight-ii-dark-green', name: 'Ultralight II Dark Green', hex: '#6a754b' },
  // Greyer than the Streamer Sink Tip 25's sage green.
  { id: 'cortland-top-shelf-sage-green', name: 'Top Shelf Sage Green', hex: '#c3c28a' },
  { id: 'cortland-top-shelf-lime-green', name: 'Top Shelf Lime Green', hex: '#cedd28' },
  // Far paler than the 444 SL's mint green.
  { id: 'cortland-sink-tip-type-6-mint-green', name: 'Sink Tip Type 6 Mint Green', hex: '#98cc9b' },
  { id: 'cortland-fairplay-blue-green', name: 'Fairplay Blue Green', hex: '#98d096' },
  { id: 'cortland-compact-sink-type-6-electric-green', name: 'Compact Sink Type 6 Electric Green', hex: '#05834c' },
  // Darker than the Striped Bass Blitz's ice blue.
  { id: 'cortland-50-plus-heavy-sink-deep-blue', name: '50+ Heavy Sink Deep Blue', hex: '#1b80c4' },
  // Far darker than the 333 Full Sinking Type 3's brown.
  { id: 'cortland-pike-musky-sink-4-brown', name: 'Pike Musky Sink 4 Brown', hex: '#422a12' },
  { id: 'cortland-pike-musky-sink-4-gray', name: 'Pike Musky Sink 4 Gray', hex: '#868b8e' },
  // Far yellower than the Modern Trout's orange.
  { id: 'cortland-rock-bottom-orange', name: 'Rock Bottom Orange', hex: '#f79128' },
  { id: 'cortland-dungeon-30-green', name: 'Dungeon 30 Green', hex: '#54b96a' },
];

// Old preset ids that are now sizes with another id (old → new). The 444 Full Sinking was one
// product holding both types; it is now one product per type.
export const LEGACY_IDS = {
  'cortland-444-full-sink-wf4s3': 'cortland-444-full-sinking-type-3-wf4s3',
  'cortland-444-full-sink-wf5s3': 'cortland-444-full-sinking-type-3-wf5s3',
  'cortland-444-full-sink-wf6s3': 'cortland-444-full-sinking-type-3-wf6s3',
  'cortland-444-full-sink-wf7s3': 'cortland-444-full-sinking-type-3-wf7s3',
  'cortland-444-full-sink-wf8s3': 'cortland-444-full-sinking-type-3-wf8s3',
  'cortland-444-full-sink-wf5s6': 'cortland-444-full-sinking-type-6-wf5s6',
  'cortland-444-full-sink-wf6s6': 'cortland-444-full-sinking-type-6-wf6s6',
  'cortland-444-full-sink-wf7s6': 'cortland-444-full-sinking-type-6-wf7s6',
  'cortland-444-full-sink-wf8s6': 'cortland-444-full-sinking-type-6-wf8s6',
};

// Cortland draws one taper chart per line with the head length on it but no size. Every size of a
// line has that head, so the lineup gives each size the chart's split.
const sizes = (product, { label = (size) => size.label, id = (w) => `wf${w}f`, lineup = (size) => size, ...rest }) =>
  product.sizes.map((size) => ({ ...rest, id: id(size.weight), label: label(size), weight: size.weight, taper: publishedTaper(size), lineup: lineup(size) }));

// A double taper has no head: Cortland charts it as taper, body and taper over the whole 90 ft, so the
// lineup leaves its head empty. The menu draws all of it as head, with no running line.
const doubleTaper = (size) => overriding(size, { head: size.total });

export const PRODUCTS = [
  makerProduct({
    id: 'cortland-444-peach',
    maker: 'Cortland',
    name: 'Cortland 444 Peach',
    sizes: sizes(LINEUP['cortland-444-peach'], {
      type: 'floating',
      colorways: [{ id: 'peach', name: 'Peach', zones: zones([0, 'cortland-peach']) }],
    }),
  }),
  // 8 ft tapers at both ends of a 74 ft body.
  makerProduct({
    id: 'cortland-444-peach-dt',
    maker: 'Cortland',
    name: 'Cortland 444 Peach Double Taper',
    sizes: sizes(LINEUP['cortland-444-peach-dt'], {
      id: (w) => `dt${w}f`,
      lineup: doubleTaper,
      type: 'floating',
      colorways: [{ id: 'peach', name: 'Peach', zones: zones([0, 'cortland-peach']) }],
    }),
  }),
  // Supple, slightly longer-headed sister of the 444 Peach.
  makerProduct({
    id: 'cortland-444-sylk',
    maker: 'Cortland',
    name: 'Cortland 444 Sylk',
    sizes: sizes(LINEUP['cortland-444-sylk'], {
      type: 'floating',
      colorways: [{ id: 'mustard', name: 'Mustard', zones: zones([0, 'cortland-mustard']) }],
    }),
  }),
  // Longer 12 ft tapers than the Peach double taper, for bamboo and glass rods.
  makerProduct({
    id: 'cortland-444-sylk-dt',
    maker: 'Cortland',
    name: 'Cortland 444 Sylk Double Taper',
    sizes: sizes(LINEUP['cortland-444-sylk-dt'], {
      id: (w) => `dt${w}f`,
      lineup: doubleTaper,
      type: 'floating',
      colorways: [{ id: 'mustard', name: 'Mustard', zones: zones([0, 'cortland-mustard']) }],
    }),
  }),
  // 105 ft long, with a 41 ft head for distance and long mends.
  makerProduct({
    id: 'cortland-444-sl',
    maker: 'Cortland',
    name: 'Cortland 444 SL',
    sizes: sizes(LINEUP['cortland-444-sl'], {
      type: 'floating',
      colorways: [{ id: 'mint-green', name: 'Mint Green', zones: zones([0, 'cortland-mint-green']) }],
    }),
  }),
  // Dark olive to cut line flash on spring creeks, with a long 8 ft front taper in a 35 ft head.
  makerProduct({
    id: 'cortland-spring-creek',
    maker: 'Cortland',
    name: 'Cortland Spring Creek',
    sizes: sizes(LINEUP['cortland-spring-creek'], {
      type: 'floating',
      colorways: [{ id: 'olive', name: 'Olive', zones: zones([0, 'cortland-olive']) }],
    }),
  }),
  // Full size heavy, with a compact 26 ft head for big flies, heavy nymph rigs and wind.
  makerProduct({
    id: 'cortland-big-shot',
    maker: 'Cortland',
    name: 'Cortland Big Shot',
    sizes: sizes(LINEUP['cortland-big-shot'], {
      type: 'floating',
      colorways: [{ id: 'sky-blue', name: 'Sky Blue', zones: zones([0, 'cortland-sky-blue']) }],
    }),
  }),
  // Half a size heavy. Short front taper and a 25 ft back taper; sold as two listings, one per color.
  makerProduct({
    id: 'cortland-modern-trout',
    maker: 'Cortland',
    name: 'Cortland Modern Trout',
    sizes: sizes(LINEUP['cortland-modern-trout'], {
      type: 'floating',
      colorways: [
        { id: 'moss-green', name: 'Moss Green', zones: zones([0, 'cortland-moss-green']) },
        { id: 'orange', name: 'Orange', zones: zones([0, 'cortland-orange']) },
      ],
    }),
  }),
  // Half a size heavy, with a long front taper and 28 ft body. The photo calls it heron and light blue;
  // the taper chart draws the head in the darker blue and the running line in the light one.
  makerProduct({
    id: 'cortland-finesse-trout-ii',
    maker: 'Cortland',
    name: 'Cortland Finesse Trout II',
    sizes: sizes(LINEUP['cortland-trout-finesse-trout-ii'], {
      type: 'floating',
      colorways: [{ id: 'heron-light-blue', name: 'Heron/Light Blue', zones: zones([43, 'cortland-heron'], [0, 'cortland-light-blue']) }],
    }),
  }),
  // 1.5–2 ips. Short front taper and body, long back taper.
  makerProduct({
    id: 'cortland-444-clear-camo',
    maker: 'Cortland',
    name: 'Cortland Clear Camo Intermediate',
    sizes: sizes(LINEUP['cortland-444-clear-camo-intermediate'], {
      id: (w) => `wf${w}i`,
      type: 'intermediate',
      colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'cortland-clear-camo']) }],
    }),
  }),
  // Full size heavy, with a compact 26 ft head for big flies and mice. The olive runs on through the
  // chart's 10 ft step down to the running line, which is drawn here as running line.
  makerProduct({
    id: 'cortland-streamer',
    maker: 'Cortland',
    name: 'Cortland Streamer',
    sizes: sizes(LINEUP['cortland-streamer'], {
      type: 'floating',
      colorways: [{ id: 'olive-green', name: 'Olive/Green', zones: zones([36, 'cortland-streamer-olive'], [0, 'cortland-streamer-green']) }],
    }),
  }),
  // Full size heavy. 10 ft Type 6 tip (6 ips) on a floating olive head and running line; the chart's
  // 10 ft step down to the running line is drawn here as running line.
  makerProduct({
    id: 'cortland-streamer-sink-tip-10',
    maker: 'Cortland',
    name: 'Cortland Streamer Sink Tip 10',
    sizes: sizes(LINEUP['cortland-streamer-sink-tip-10'], {
      id: (w) => `wf${w}`,
      type: 'sinktip',
      colorways: [{ id: 'black-olive', name: 'Black/Olive', zones: zones([10, 'cortland-black'], [0, 'cortland-streamer-olive']) }],
    }),
  }),
  // Type 3 sinks 3–4 ips (dark brown). Shares one chart with the Type 6.
  makerProduct({
    id: 'cortland-444-full-sinking-type-3',
    maker: 'Cortland',
    name: 'Cortland 444 Full Sinking Type 3',
    sizes: sizes(LINEUP['cortland-444-full-sinking-type-3'], {
      id: (w) => `wf${w}s3`,
      type: 'sink3',
      colorways: [{ id: 'dark-brown', name: 'Dark Brown', zones: zones([0, 'cortland-dark-brown']) }],
    }),
  }),
  // Type 6 sinks 6–7 ips (black), drawn as Type 7. Shares one chart with the Type 3.
  makerProduct({
    id: 'cortland-444-full-sinking-type-6',
    maker: 'Cortland',
    name: 'Cortland 444 Full Sinking Type 6',
    sizes: sizes(LINEUP['cortland-444-full-sinking-type-6'], {
      id: (w) => `wf${w}s6`,
      type: 'sink7',
      colorways: [{ id: 'black', name: 'Black', zones: zones([0, 'cortland-black']) }],
    }),
  }),
  // Full size heavy. Type 6 (5–6 ips) 15 ft tip, then a floating body and a 10 ft step down to the
  // running line, drawn here as running line.
  makerProduct({
    id: 'cortland-streamer-sink-tip-15',
    maker: 'Cortland',
    name: 'Cortland Streamer Sink Tip 15',
    sizes: sizes(LINEUP['cortland-streamer-sink-tip-15'], {
      id: (w) => `wf${w}`,
      type: 'sinktip',
      colorways: [{ id: 'black-green', name: 'Black/Green', zones: zones([15, 'cortland-black'], [0, 'cortland-green']) }],
    }),
  }),
  // Full clear on a mono core. Short 7 ft body and a 31 ft back taper.
  makerProduct({
    id: 'cortland-liquid-crystal-tarpon-taper',
    maker: 'Cortland',
    name: 'Cortland Liquid Crystal Tarpon Taper',
    sizes: sizes(LINEUP['cortland-liquid-crystal-tarpon-taper'], {
      type: 'floating',
      colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'cortland-clear']) }],
    }),
  }),
  // Full clear on a mono core. 14 ft body and a 26 ft back taper.
  makerProduct({
    id: 'cortland-liquid-crystal-flats-taper',
    maker: 'Cortland',
    name: 'Cortland Liquid Crystal Flats Taper',
    sizes: sizes(LINEUP['cortland-liquid-crystal-flats-taper'], {
      type: 'floating',
      colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'cortland-clear']) }],
    }),
  }),
  // Rated by grain weight for two rod weights, drawn at the lower. A clear 26 ft intermediate head
  // on a light blue running line Cortland calls floating, so it's drawn as a sink tip; the chart's
  // 13 ft step down to the running line is drawn here as running line.
  makerProduct({
    id: 'cortland-compact-intermediate',
    maker: 'Cortland',
    name: 'Cortland Compact Intermediate',
    sizes: sizes(LINEUP['cortland-specialty-compact-intermediate'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'clear-light-blue', name: 'Clear/Light Blue', zones: zones([26, 'cortland-clear'], [0, 'cortland-light-blue']) }],
    }),
  }),
  // True to size. A 15 ft clear intermediate tip on a mint green floating head and running line, so
  // it's drawn as a sink tip. The chart, not to scale, draws the tip ending partway along the body.
  makerProduct({
    id: 'cortland-specialty-ghost-tip-15',
    maker: 'Cortland',
    name: 'Cortland Ghost Tip 15',
    sizes: sizes(LINEUP['cortland-specialty-ghost-tip-15'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'clear-mint-green', name: 'Clear/Mint Green', zones: zones([15, 'cortland-clear'], [0, 'cortland-mint-green']) }],
    }),
  }),
  // Half a size heavy, with a short 30 ft head for quick shots.
  makerProduct({
    id: 'cortland-tropic-plus-redfish',
    maker: 'Cortland',
    name: 'Cortland Tropic Plus Redfish',
    sizes: sizes(LINEUP['cortland-tropic-plus-redfish'], {
      type: 'floating',
      colorways: [{ id: 'seafoam-green-tan', name: 'Seafoam Green/Tan', zones: zones([30, 'cortland-seafoam-green'], [0, 'cortland-tan']) }],
    }),
  }),
  // Short 30 ft head with a 22 ft body, for quick shots in stained water. Also sold reversed as
  // White/Hi-Vis Orange, which has no chart, so only the charted orange head on white is drawn.
  makerProduct({
    id: 'cortland-tropic-plus-hi-vis-flip',
    maker: 'Cortland',
    name: 'Cortland Tropic Plus Hi-Vis Flip',
    sizes: sizes(LINEUP['cortland-tropic-plus-hi-vis-flip'], {
      type: 'floating',
      colorways: [{ id: 'hi-vis-orange-white', name: 'Hi-Vis Orange/White', zones: zones([30, 'cortland-hi-vis-orange'], [0, 'cortland-white']) }],
    }),
  }),
  // Long 27 ft body in a 41 ft head, for wind and long shots.
  makerProduct({
    id: 'cortland-tropic-plus-all-purpose',
    maker: 'Cortland',
    name: 'Cortland Tropic Plus All Purpose Taper',
    sizes: sizes(LINEUP['cortland-tropic-plus-all-purpose'], {
      type: 'floating',
      colorways: [{ id: 'sand-blue', name: 'Sand/Blue', zones: zones([41, 'cortland-sand'], [0, 'cortland-blue']) }],
    }),
  }),
  // The Tarpon Taper's 41 ft head with a clear intermediate tip on a seafoam floating head and running
  // line, so it's drawn as a sink tip. The description gives the tip as 9 ft; the chart, not to scale,
  // draws it ending partway along the body.
  makerProduct({
    id: 'cortland-tropic-plus-ghost-tip',
    maker: 'Cortland',
    name: 'Cortland Tropic Plus Ghost Tip',
    sizes: sizes(LINEUP['cortland-tropic-plus-ghost-tip'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'clear-seafoam', name: 'Clear/Seafoam', zones: zones([9, 'cortland-clear'], [0, 'cortland-seafoam']) }],
    }),
  }),
  // 1.5–2 ips full intermediate for cold-water surf, flats and boats. 22 ft body in a 32 ft head.
  makerProduct({
    id: 'cortland-cold-salt-striped-bass-intermediate',
    maker: 'Cortland',
    name: 'Cortland Cold Salt Striped Bass Intermediate',
    sizes: sizes(LINEUP['cortland-cold-salt-striped-bass-intermediate'], {
      id: (w) => `wf${w}i`,
      type: 'intermediate',
      colorways: [{ id: 'ice-blue', name: 'Ice Blue', zones: zones([0, 'cortland-ice-blue']) }],
    }),
  }),
  // Half a size heavy, on a braided core that stays supple in the cold. Short 30 ft head with a 21 ft body.
  makerProduct({
    id: 'cortland-cold-salt-redfish',
    maker: 'Cortland',
    name: 'Cortland Cold Salt Redfish',
    sizes: sizes(LINEUP['cortland-cold-salt-redfish'], {
      type: 'floating',
      colorways: [{ id: 'aqua-green-sky-blue', name: 'Aqua Green/Sky Blue', zones: zones([30, 'cortland-aqua-green'], [0, 'cortland-sky-blue']) }],
    }),
  }),
  // Cortland's original PVC line, high floating. The chart's head adds up to 41 ft (10, 25 and 6 ft)
  // where the spec table says 42 ft; the chart is drawn as is.
  makerProduct({
    id: 'cortland-333-trout-all-purpose',
    maker: 'Cortland',
    name: 'Cortland 333 Trout All Purpose',
    sizes: sizes(LINEUP['cortland-333-trout-all-purpose'], {
      lineup: (size) => overriding(size, { head: 41 }),
      type: 'floating',
      colorways: [{ id: 'yellow', name: 'Yellow', zones: zones([0, 'cortland-yellow']) }],
    }),
  }),
  // Type 3 (3–4 ips) on the 333 Trout All Purpose's 41 ft head.
  makerProduct({
    id: 'cortland-333-full-sinking-type-3',
    maker: 'Cortland',
    name: 'Cortland 333 Full Sinking Type 3',
    sizes: sizes(LINEUP['cortland-333-full-sinking-type-3'], {
      id: (w) => `wf${w}s3`,
      type: 'sink3',
      colorways: [{ id: 'brown', name: 'Brown', zones: zones([0, 'cortland-brown']) }],
    }),
  }),
  // Sold by grain weight, with two sizes at 12 wt, so its sizes go by grains. On a 50 lb core, with a
  // short 30 ft head for big flies and wind; the chart's 15 ft step down to the running line is drawn
  // here as running line. Its seafoam is drawn in the near-identical Seafoam Green of the Tropic Plus
  // Redfish.
  makerProduct({
    id: 'cortland-50-plus-cannon',
    maker: 'Cortland',
    name: 'Cortland 50+ Cannon',
    sizes: sizes(LINEUP['cortland-50-plus-cannon'], {
      type: 'floating',
      colorways: [{ id: 'seafoam-peach', name: 'Seafoam/Peach', zones: zones([30, 'cortland-seafoam-green'], [0, 'cortland-peach']) }],
    }).map((size) => ({ ...size, id: `${size.lineup.label.match(/(\d+) gr$/)[1]}gr` })),
  }),
  // True to size. The Ghost Tip 15's head with a 5 ft clear intermediate tip on a mint green floating
  // head and running line, so it's drawn as a sink tip.
  makerProduct({
    id: 'cortland-specialty-ghost-tip-5',
    maker: 'Cortland',
    name: 'Cortland Ghost Tip 5',
    sizes: sizes(LINEUP['cortland-specialty-ghost-tip-5'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'clear-mint-green', name: 'Clear/Mint Green', zones: zones([5, 'cortland-clear'], [0, 'cortland-mint-green']) }],
    }),
  }),
  // Full intermediate with a short 26 ft head for big flies; the chart's 13 ft step down to the
  // running line is drawn here as running line. The page calls it olive and green; the chart names
  // the dark green.
  makerProduct({
    id: 'cortland-specialty-pike-musky-intermediate',
    maker: 'Cortland',
    name: 'Cortland Pike Musky Intermediate',
    sizes: sizes(LINEUP['cortland-specialty-pike-musky-intermediate'], {
      id: (w) => `wf${w}i`,
      type: 'intermediate',
      colorways: [{ id: 'olive-dark-green', name: 'Olive/Dark Green', zones: zones([26, 'cortland-pike-olive'], [0, 'cortland-dark-green']) }],
    }),
  }),
  // Short 7 ft body and a long 31 ft back taper in a 41 ft head, for quick changes of direction.
  makerProduct({
    id: 'cortland-tropic-plus-backcountry',
    maker: 'Cortland',
    name: 'Cortland Tropic Plus Backcountry',
    sizes: sizes(LINEUP['cortland-tropic-plus-backcountry'], {
      type: 'floating',
      colorways: [{ id: 'seaweed-sand', name: 'Seaweed/Sand', zones: zones([41, 'cortland-seaweed'], [0, 'cortland-sand']) }],
    }),
  }),
  // Full floating for stripers and albies in cooler water. Short 30 ft head: a 21 ft body between a
  // 4 ft front taper and a 5 ft back taper.
  makerProduct({
    id: 'cortland-cold-salt-striped-bass-float',
    maker: 'Cortland',
    name: 'Cortland Cold Salt Striped Bass Float',
    sizes: sizes(LINEUP['cortland-cold-salt-striped-bass-float'], {
      type: 'floating',
      colorways: [{ id: 'aqua-green-light-blue', name: 'Aqua Green/Light Blue', zones: zones([30, 'cortland-aqua-green'], [0, 'cortland-cold-salt-light-blue']) }],
    }),
  }),
  // 1.5–2 ips, clear on a mono core. Short 7 ft body and a 28 ft back taper in a 41 ft head.
  makerProduct({
    id: 'cortland-444-clear-intermediate',
    maker: 'Cortland',
    name: 'Cortland 444 Clear Intermediate',
    sizes: sizes(LINEUP['cortland-444-clear-intermediate'], {
      id: (w) => `wf${w}i`,
      type: 'intermediate',
      colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'cortland-clear']) }],
    }),
  }),
  // Overweighted, with a compact 26 ft head for wind and big flies. The chart's 10 ft step down to
  // the running line, pale yellow like the running line, is drawn here as running line.
  makerProduct({
    id: 'cortland-tropic-plus-all-purpose-xp',
    maker: 'Cortland',
    name: 'Cortland Tropic Plus All Purpose XP',
    sizes: sizes(LINEUP['cortland-tropic-plus-all-purpose-xp'], {
      type: 'floating',
      colorways: [{ id: 'aqua-blue-pale-yellow', name: 'Aqua Blue/Pale Yellow', zones: zones([26, 'cortland-aqua-blue'], [0, 'cortland-pale-yellow']) }],
    }),
  }),
  // On a 50 lb braided core. Short 7 ft body and a 31 ft back taper in a 41 ft head.
  makerProduct({
    id: 'cortland-50-plus-giant-trevally',
    maker: 'Cortland',
    name: 'Cortland 50+ Giant Trevally',
    sizes: sizes(LINEUP['cortland-50-plus-giant-trevally'], {
      type: 'floating',
      colorways: [{ id: 'light-blue-yellow', name: 'Light Blue/Yellow', zones: zones([41, 'cortland-light-blue'], [0, 'cortland-giant-trevally-yellow']) }],
    }),
  }),
  // The Streamer Sink Tip 10 with a 10 ft Type 3 tip (3–4 ips) instead of Type 6, on the same chart, so
  // it draws exactly like it. The chart's 10 ft step down to the running line is drawn as running line.
  makerProduct({
    id: 'cortland-streamer-sink-tip-10-t3',
    maker: 'Cortland',
    name: 'Cortland Streamer Sink Tip 10 T3',
    sizes: sizes(LINEUP['cortland-streamer-sink-tip-10-t3'], {
      id: (w) => `wf${w}`,
      type: 'sinktip',
      colorways: [{ id: 'black-olive', name: 'Black/Olive', zones: zones([10, 'cortland-black'], [0, 'cortland-streamer-olive']) }],
    }),
  }),
  // Mono core with a hard finish for the heat. Short 27 ft head with an 18 ft body.
  makerProduct({
    id: 'cortland-444-tropic-all-purpose',
    maker: 'Cortland',
    name: 'Cortland 444 Tropic All Purpose',
    sizes: sizes(LINEUP['cortland-444-tropic-all-purpose'], {
      type: 'floating',
      colorways: [{ id: 'pineapple', name: 'Pineapple', zones: zones([0, 'cortland-pineapple']) }],
    }),
  }),
  // Overweighted, with a long 65 ft head that roll casts and mends easily. The chart, not to scale, gives
  // no length for the olive-to-white change partway along the body; 33 ft from the tip is an estimate
  // read off where it sits between the body's ends.
  makerProduct({
    id: 'cortland-specialty-salmon-steelhead',
    maker: 'Cortland',
    name: 'Cortland Salmon Steelhead',
    sizes: sizes(LINEUP['cortland-specialty-salmon-steelhead'], {
      type: 'floating',
      colorways: [{ id: 'olive-white', name: 'Olive/White', zones: zones([33, 'cortland-olive'], [0, 'cortland-white']) }],
    }),
  }),
  // A line and a half size heavy, on a braided core. A 26 ft intermediate head (1.5–2 ips) on a
  // floating running line, so it's drawn as a sink tip; the chart's 13 ft step down to the running
  // line is drawn here as running line. The chart's legend calls the sky blue light blue.
  makerProduct({
    id: 'cortland-cold-salt-striped-bass-blitz',
    maker: 'Cortland',
    name: 'Cortland Cold Salt Striped Bass Blitz',
    sizes: sizes(LINEUP['cortland-cold-salt-striped-bass-blitz'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'ice-blue-sky-blue', name: 'Ice Blue/Sky Blue', zones: zones([26, 'cortland-striped-bass-blitz-ice-blue'], [0, 'cortland-striped-bass-blitz-sky-blue']) }],
    }),
  }),
  // Half a size heavy, full seafoam on a mono core. Short 6 ft body and a 29 ft back taper in a 38 ft head.
  makerProduct({
    id: 'cortland-liquid-crystal-guide',
    maker: 'Cortland',
    name: 'Cortland Liquid Crystal Guide',
    sizes: sizes(LINEUP['cortland-liquid-crystal-guide'], {
      type: 'floating',
      colorways: [{ id: 'seafoam', name: 'Seafoam', zones: zones([0, 'cortland-seafoam']) }],
    }),
  }),
  // A 10 ft clear intermediate tip on a sand floating head and running line, so it's drawn as a sink
  // tip. The chart's clear runs through the 3 ft front taper and 7 ft body of a 41 ft head.
  makerProduct({
    id: 'cortland-cold-salt-clear-tip',
    maker: 'Cortland',
    name: 'Cortland Cold Salt Clear Tip',
    sizes: sizes(LINEUP['cortland-cold-salt-clear-tip'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'clear-sand', name: 'Clear/Sand', zones: zones([10, 'cortland-clear'], [0, 'cortland-cold-salt-clear-tip-sand']) }],
    }),
  }),
  // Hard finish on a mono core for summer heat. Short 27 ft head with an 18 ft body, for poppers and streamers.
  makerProduct({
    id: 'cortland-333-bass-panfish',
    maker: 'Cortland',
    name: 'Cortland 333 Bass Panfish',
    sizes: sizes(LINEUP['cortland-333-bass-panfish'], {
      type: 'floating',
      colorways: [{ id: 'yellow', name: 'Yellow', zones: zones([0, 'cortland-yellow']) }],
    }),
  }),
  // A 3 ft clear intermediate tip on a mint green floating head and running line, so it's drawn as a
  // sink tip. The chart, not to scale, draws the tip ending partway along the 5 ft front taper.
  makerProduct({
    id: 'cortland-specialty-ghost-tip-3',
    maker: 'Cortland',
    name: 'Cortland Ghost Tip 3',
    sizes: sizes(LINEUP['cortland-specialty-ghost-tip-3'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'clear-mint-green', name: 'Clear/Mint Green', zones: zones([3, 'cortland-clear'], [0, 'cortland-mint-green']) }],
    }),
  }),
  // Rated by grain weight for two rod weights, drawn at the lower. A 25 ft Type 6 tip (6 ips) on a
  // floating sage green body and running line, in a 40 ft head with a 27 ft body.
  makerProduct({
    id: 'cortland-streamer-sink-tip-25',
    maker: 'Cortland',
    name: 'Cortland Streamer Sink Tip 25',
    sizes: sizes(LINEUP['cortland-streamer-sink-tip-25'], {
      id: (w) => `wf${w}`,
      type: 'sinktip',
      colorways: [{ id: 'black-sage-green', name: 'Black/Sage Green', zones: zones([25, 'cortland-black'], [0, 'cortland-streamer-sink-tip-25-sage-green']) }],
    }),
  }),
  // A 10 ft intermediate tip (1.5–2 ips) on a moss green floating head and running line, so it's drawn
  // as a sink tip, in a short 26 ft head with a 10 ft front taper. The chart's 10 ft step down to the
  // running line is drawn here as running line. The chart, not to scale, draws the grey tip ending
  // partway along the front taper; the description gives it as 10 ft.
  makerProduct({
    id: 'cortland-streamer-intermediate-tip',
    maker: 'Cortland',
    name: 'Cortland Streamer Intermediate Tip',
    sizes: sizes(LINEUP['cortland-streamer-intermediate-tip'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'space-grey-moss-green', name: 'Space Grey/Moss Green', zones: zones([10, 'cortland-streamer-intermediate-tip-space-grey'], [0, 'cortland-streamer-intermediate-tip-moss-green']) }],
    }),
  }),
  // True to size, 80 ft long for small streams. A muted olive front taper and body, then moss green
  // from the 15 ft back taper on.
  makerProduct({
    id: 'cortland-headwater',
    maker: 'Cortland',
    name: 'Cortland Headwater',
    sizes: sizes(LINEUP['cortland-trout-headwater'], {
      type: 'floating',
      colorways: [{ id: 'olive-moss-green', name: 'Olive/Moss Green', zones: zones([17, 'cortland-headwater-olive'], [0, 'cortland-headwater-moss-green']) }],
    }),
  }),
  // Braided core 1.5–2 ips full intermediate on the 444 Peach's 32 ft head.
  makerProduct({
    id: 'cortland-444-intermediate',
    maker: 'Cortland',
    name: 'Cortland 444 Intermediate',
    sizes: sizes(LINEUP['cortland-444-intermediate'], {
      id: (w) => `wf${w}i`,
      type: 'intermediate',
      colorways: [{ id: 'ice-blue', name: 'Ice Blue', zones: zones([0, 'cortland-ice-blue']) }],
    }),
  }),
  // Full floating, with a short 26 ft head for big bulky flies; the chart's 13 ft step down to the
  // running line, pale yellow like the running line, is drawn here as running line.
  makerProduct({
    id: 'cortland-specialty-pike-musky-float',
    maker: 'Cortland',
    name: 'Cortland Pike Musky Float',
    sizes: sizes(LINEUP['cortland-specialty-pike-musky-float'], {
      type: 'floating',
      colorways: [{ id: 'olive-pale-yellow', name: 'Olive/Pale Yellow', zones: zones([26, 'cortland-pike-olive'], [0, 'cortland-pike-musky-float-pale-yellow']) }],
    }),
  }),
  // The 444 Intermediate's 32 ft head with a Type 3 tip (3–4 ips) on a floating peach body and running
  // line. The description gives the tip as 10 ft; the chart, not to scale, draws the brown over the
  // 8 ft front taper.
  makerProduct({
    id: 'cortland-444-sink-tip-type-3',
    maker: 'Cortland',
    name: 'Cortland 444 Sink Tip Type 3',
    sizes: sizes(LINEUP['cortland-444-sink-tip-type-3'], {
      id: (w) => `wf${w}`,
      type: 'sinktip',
      colorways: [{ id: 'brown-peach', name: 'Brown/Peach', zones: zones([10, 'cortland-brown'], [0, 'cortland-peach']) }],
    }),
  }),
  // Full size heavy, for fast rods. 20 ft body and a 9 ft back taper in a 35 ft head.
  makerProduct({
    id: 'cortland-trout-boss',
    maker: 'Cortland',
    name: 'Cortland Trout Boss',
    sizes: sizes(LINEUP['cortland-trout-boss'], {
      type: 'floating',
      colorways: [{ id: 'green-yellow', name: 'Green/Yellow', zones: zones([35, 'cortland-green'], [0, 'cortland-giant-trevally-yellow']) }],
    }),
  }),
  // Sold on the 333 Trout All Purpose's chart, so its sizes draw exactly like that line's WF8–10.
  makerProduct({
    id: 'cortland-333-salmon',
    maker: 'Cortland',
    name: 'Cortland 333 Salmon',
    sizes: sizes(LINEUP['cortland-333-salmon'], {
      type: 'floating',
      colorways: [{ id: 'yellow', name: 'Yellow', zones: zones([0, 'cortland-yellow']) }],
    }),
  }),
  // 8 ft tapers at both ends of a 74 ft body, like the 444 Peach double taper, in what the page calls
  // mango.
  makerProduct({
    id: 'cortland-333-double-taper',
    maker: 'Cortland',
    name: 'Cortland 333 Double Taper',
    sizes: sizes(LINEUP['cortland-333-double-taper'], {
      id: (w) => `dt${w}f`,
      lineup: doubleTaper,
      type: 'floating',
      colorways: [{ id: 'mango', name: 'Mango', zones: zones([0, 'cortland-333-double-taper-mango']) }],
    }),
  }),
  // Overweighted. A clear 26 ft intermediate head on a pale yellow running line, sold as I/F, so it's
  // drawn as a sink tip; the chart's 10 ft step down to the running line is drawn here as running line.
  makerProduct({
    id: 'cortland-tropic-plus-intermediate-xp',
    maker: 'Cortland',
    name: 'Cortland Tropic Plus Intermediate XP',
    sizes: sizes(LINEUP['cortland-tropic-plus-intermediate-xp'], {
      id: (w) => `wf${w}i`,
      type: 'sinktip',
      colorways: [{ id: 'clear-pale-yellow', name: 'Clear/Pale Yellow', zones: zones([26, 'cortland-clear'], [0, 'cortland-pale-yellow']) }],
    }),
  }),
  // True to size, with 6 ft tapers at both ends: a 68 ft body on the 80 ft DT2–3 and a 78 ft body on the
  // 90 ft DT4–6. Moss green at both ends with a yellow middle. The chart gives no lengths for the color
  // changes; read off where they sit along the body, each green end is about 23 ft of the 80 ft line
  // and 26 ft of the 90 ft one, which are estimates.
  makerProduct({
    id: 'cortland-trout-double-taper',
    maker: 'Cortland',
    name: 'Cortland Trout Double Taper',
    sizes: [80, 90].flatMap((total) => {
      const end = total === 80 ? 23 : 26;
      return sizes(
        { ...LINEUP['cortland-trout-double-taper'], sizes: LINEUP['cortland-trout-double-taper'].sizes.filter((size) => size.total === total) },
        {
          id: (w) => `dt${w}f`,
          lineup: doubleTaper,
          type: 'floating',
          colorways: [
            {
              id: 'moss-green-yellow',
              name: 'Moss Green/Yellow',
              zones: zones([end, 'cortland-headwater-moss-green'], [total - 2 * end, 'cortland-giant-trevally-yellow'], [0, 'cortland-headwater-moss-green']),
            },
          ],
        },
      );
    }),
  }),
  // True to size, with a long 18 ft front taper: a 40 ft head on the 80 ft WF2–3 and a 45 ft head on the
  // 90 ft WF4–6. Aqua green, with dark green from partway along the body to its end. The chart gives no
  // lengths for the color changes; read off where the dark green starts along the body, it begins about
  // 24 ft from the tip on the WF2–3 and 25 ft on the WF4–6, which are estimates.
  makerProduct({
    id: 'cortland-ultralight-ii',
    maker: 'Cortland',
    name: 'Cortland Ultralight II',
    sizes: [
      [80, 24, 10],
      [90, 25, 12],
    ].flatMap(([total, start, dark]) =>
      sizes(
        { ...LINEUP['cortland-trout-ultralight-ii'], sizes: LINEUP['cortland-trout-ultralight-ii'].sizes.filter((size) => size.total === total) },
        {
          type: 'floating',
          colorways: [
            {
              id: 'aqua-green-dark-green',
              name: 'Aqua Green/Dark Green',
              zones: zones([start, 'cortland-ultralight-ii-aqua-green'], [dark, 'cortland-ultralight-ii-dark-green'], [0, 'cortland-ultralight-ii-aqua-green']),
            },
          ],
        },
      ),
    ),
  }),
  // Kelly Galloup's streamer line, 100 ft long, with a short 15 ft body and an 18 ft back taper in a 37 ft
  // head. The chart's 12 ft step down to the running line, lime green like the running line, is drawn
  // here as running line.
  makerProduct({
    id: 'cortland-top-shelf',
    maker: 'Cortland',
    name: 'Cortland Top Shelf',
    sizes: sizes(LINEUP['cortland-galloup-top-shelf'], {
      type: 'floating',
      colorways: [{ id: 'sage-green-lime-green', name: 'Sage Green/Lime Green', zones: zones([37, 'cortland-top-shelf-sage-green'], [0, 'cortland-top-shelf-lime-green']) }],
    }),
  }),
  // Full size heavy, with a 25 ft back taper in a 48 ft head for mending and roll casts. A hi-vis white
  // tip, then olive to the end of the head and a white running line. The chart, not to scale, draws the
  // tip only as a short stub at the loop and gives no length for it; read off where the olive starts
  // within the 7 ft front taper, about 2 ft is an estimate.
  makerProduct({
    id: 'cortland-indicator-ii',
    maker: 'Cortland',
    name: 'Cortland Indicator II',
    sizes: sizes(LINEUP['cortland-trout-indicator-ii'], {
      type: 'floating',
      colorways: [{ id: 'white-olive-white', name: 'White/Olive/White', zones: zones([2, 'cortland-white'], [46, 'cortland-headwater-moss-green'], [0, 'cortland-white']) }],
    }),
  }),
  // The 444 Sink Tip Type 3's 32 ft head with a Type 6 tip (6–7 ips) on a floating mint green body and
  // running line. The description gives the tip as 10 ft; the chart, not to scale, draws the black over
  // the 8 ft front taper.
  makerProduct({
    id: 'cortland-444-sink-tip-type-6',
    maker: 'Cortland',
    name: 'Cortland 444 Sink Tip Type 6',
    sizes: sizes(LINEUP['cortland-444-sink-tip-type-6'], {
      id: (w) => `wf${w}`,
      type: 'sinktip',
      colorways: [{ id: 'black-mint-green', name: 'Black/Mint Green', zones: zones([10, 'cortland-black'], [0, 'cortland-sink-tip-type-6-mint-green']) }],
    }),
  }),
  // Cortland's budget line, 84 ft long, with 8 ft tapers either side of a 20 ft body.
  makerProduct({
    id: 'cortland-fairplay-floating',
    maker: 'Cortland',
    name: 'Cortland Fairplay Floating',
    sizes: sizes(LINEUP['cortland-fairplay-floating'], {
      type: 'floating',
      colorways: [{ id: 'blue-green', name: 'Blue Green', zones: zones([0, 'cortland-fairplay-blue-green']) }],
    }),
  }),
  // Cortland's budget inshore line, sold in one size for two rod weights, drawn at the lower. Short 27 ft
  // head with an 18 ft body.
  makerProduct({
    id: 'cortland-fairplay-saltwater-floating',
    maker: 'Cortland',
    name: 'Cortland Fairplay Saltwater Floating',
    sizes: sizes(LINEUP['cortland-fairplay-saltwater-floating'], {
      type: 'floating',
      colorways: [{ id: 'yellow', name: 'Yellow', zones: zones([0, 'cortland-yellow']) }],
    }),
  }),
  // Rated by grain weight for two rod weights, drawn at the lower. A black 28 ft Type 6 sinking head
  // on an electric green intermediate running line; the chart's 12 ft step down to the running line,
  // green like the running line, is drawn here as running line.
  makerProduct({
    id: 'cortland-compact-sink-type-6',
    maker: 'Cortland',
    name: 'Cortland Compact Sink Type 6',
    sizes: sizes(LINEUP['cortland-specialty-compact-sink-type-6'], {
      id: (w) => `wf${w}s6`,
      type: 'sinkhead-int',
      colorways: [{ id: 'black-electric-green', name: 'Black/Electric Green', zones: zones([28, 'cortland-black'], [0, 'cortland-compact-sink-type-6-electric-green']) }],
    }),
  }),
  // The Compact Sink Type 6's chart and split with a Type 9 head (8–9 ips), drawn on an intermediate
  // running line like it. A black 28 ft head on a light blue running line; the chart's 12 ft step down
  // to the running line, light blue like the running line, is drawn here as running line.
  makerProduct({
    id: 'cortland-compact-sink-type-9',
    maker: 'Cortland',
    name: 'Cortland Compact Sink Type 9',
    sizes: sizes(LINEUP['cortland-specialty-compact-sink-type-9'], {
      id: (w) => `wf${w}s9`,
      type: 'sinkhead-int',
      colorways: [{ id: 'black-light-blue', name: 'Black/Light Blue', zones: zones([28, 'cortland-black'], [0, 'cortland-light-blue']) }],
    }),
  }),
  // On a 50 lb braided core, sold by grain weight, with two sizes at 12 wt, so its sizes go by grains.
  // A black 30 ft Type 8 head (7–8 ips) on a deep blue intermediate running line; the chart's 15 ft
  // step down to the running line, blue like the running line, is drawn here as running line. The
  // WF13–15 is drawn at 13 wt.
  makerProduct({
    id: 'cortland-50-plus-heavy-sink',
    maker: 'Cortland',
    name: 'Cortland 50+ Heavy Sink',
    sizes: sizes(LINEUP['cortland-50-plus-heavy-sink'], {
      type: 'sinkhead-int',
      colorways: [{ id: 'black-deep-blue', name: 'Black/Deep Blue', zones: zones([30, 'cortland-black'], [0, 'cortland-50-plus-heavy-sink-deep-blue']) }],
    }).map((size) => ({ ...size, id: `${size.lineup.label.match(/(\d+) gr$/)[1]}gr` })),
  }),
  // For teasing billfish in the prop wash: a 600 gr Type 6 head on a 50 lb braided core and a floating
  // running line, rated WF13–15 and drawn at 13 wt. An 18 in orange tip, a 30 ft black body, then
  // orange from the 3 ft back taper on. The lineup gives the head as 34 ft; the chart's head adds up to
  // 34.5 ft (18 in, 30 and 3 ft) and is drawn as is. The chart draws the body grey; the photo and box
  // say black. The orange is drawn in the near-identical Rock Bottom Orange.
  makerProduct({
    id: 'cortland-50-plus-billfish',
    maker: 'Cortland',
    name: 'Cortland 50+ Billfish',
    sizes: sizes(LINEUP['cortland-50-plus-billfish'], {
      id: (w) => `wf${w}s6`,
      lineup: (size) => overriding(size, { head: 34.5 }),
      type: 'sinktip',
      colorways: [{ id: 'orange-black', name: 'Orange/Black', zones: zones([1.5, 'cortland-rock-bottom-orange'], [30, 'cortland-black'], [0, 'cortland-rock-bottom-orange']) }],
    }),
  }),
  // A black 28 ft Type 8 head (8–9 ips) on an ice blue intermediate running line, for current and
  // depth; the chart's 12 ft step down to the running line, ice blue like the running line, is drawn
  // here as running line.
  makerProduct({
    id: 'cortland-cold-salt-striped-bass-sink-8',
    maker: 'Cortland',
    name: 'Cortland Cold Salt Striped Bass Sink 8',
    sizes: sizes(LINEUP['cortland-cold-salt-striped-bass-sink-8'], {
      id: (w) => `wf${w}s8`,
      type: 'sinkhead-int',
      colorways: [{ id: 'black-ice-blue', name: 'Black/Ice Blue', zones: zones([28, 'cortland-black'], [0, 'cortland-ice-blue']) }],
    }),
  }),
  // A brown 30 ft Type 4 head (4–5 ips) on a gray intermediate running line; the chart's 15 ft step down
  // to the running line, gray like the running line, is drawn here as running line. The WF12 and WF12+
  // are both 12 wt.
  makerProduct({
    id: 'cortland-specialty-pike-musky-sink-4',
    maker: 'Cortland',
    name: 'Cortland Pike Musky Sink 4',
    sizes: sizes(LINEUP['cortland-specialty-pike-musky-sink-4'], {
      id: (w) => `wf${w}s4`,
      type: 'sinkhead-int',
      colorways: [{ id: 'brown-gray', name: 'Brown/Gray', zones: zones([30, 'cortland-pike-musky-sink-4-brown'], [0, 'cortland-pike-musky-sink-4-gray']) }],
    }).map((size) => (size.lineup.label.includes('+') ? { ...size, id: `${size.id}-plus` } : size)),
  }),
  // The Pike Musky Sink 4's chart and split with a black Type 8 head (8–8.5 ips) on an olive intermediate
  // running line; the chart's 15 ft step down to the running line, olive like the running line, is
  // drawn here as running line. The WF12 and WF12+ are both 12 wt; the 700 gr size has no line weight.
  makerProduct({
    id: 'cortland-specialty-pike-musky-sink-8',
    maker: 'Cortland',
    name: 'Cortland Pike Musky Sink 8',
    sizes: sizes(
      { ...LINEUP['cortland-specialty-pike-musky-sink-8'], sizes: LINEUP['cortland-specialty-pike-musky-sink-8'].sizes.filter((size) => size.weight) },
      {
        id: (w) => `wf${w}s8`,
        type: 'sinkhead-int',
        colorways: [{ id: 'black-olive', name: 'Black/Olive', zones: zones([30, 'cortland-black'], [0, 'cortland-pike-olive']) }],
      },
    ).map((size) => (size.lineup.label.includes('+') ? { ...size, id: `${size.id}-plus` } : size)),
  }),
  // Kelly Galloup's deep streamer line, rated by grain weight for two rod weights and drawn at the lower.
  // A 40 ft Type 6 head (6–7.5 ips) on an intermediate running line, one running line color per size
  // (yellow 200 gr, blue 250 gr, orange 300 gr). The page gives the head
  // as 40 ft; the chart's head adds up to 43 ft (1, 40 and 2 ft) and is drawn as is. The chart draws the
  // head black through the body, then the running line's color from the 2 ft back taper on. The blue is
  // drawn in the near-identical Sky Blue of the Big Shot.
  makerProduct({
    id: 'cortland-galloup-rock-bottom',
    maker: 'Cortland',
    name: 'Cortland Rock Bottom',
    sizes: sizes(LINEUP['cortland-galloup-rock-bottom'], {
      id: (w) => `wf${w}s6`,
      lineup: (size) => overriding(size, { head: 43 }),
      type: 'sinkhead-int',
      colorways: [],
    }).map((size) => {
      const [id, name, color] = {
        200: ['black-yellow', 'Black/Yellow', 'cortland-yellow'],
        250: ['black-blue', 'Black/Blue', 'cortland-sky-blue'],
        300: ['black-orange', 'Black/Orange', 'cortland-rock-bottom-orange'],
      }[size.lineup.label.match(/(\d+) gr$/)[1]];
      return { ...size, colorways: [{ id, name, zones: zones([41, 'cortland-black'], [0, color]) }] };
    }),
  }),
  // Kelly Galloup's big-river streamer line, rated by grain weight for two rod weights and drawn at the
  // lower. An overweighted 30 ft Type 6 head (6–7.5 ips) with a 20 ft back taper on an intermediate
  // running line, one running line color per size (white 230 gr, green 280 gr, olive 330 gr). The page gives the head as 30 ft; the chart's head adds up to 31 ft (1, 10
  // and 20 ft) and is drawn as is. The chart draws the whole head black. The olive is drawn in the
  // near-identical Pike Olive of the Pike Musky lines.
  makerProduct({
    id: 'cortland-galloup-dungeon-30',
    maker: 'Cortland',
    name: 'Cortland Dungeon 30',
    sizes: sizes(LINEUP['cortland-galloup-dungeon-30'], {
      id: (w) => `wf${w}s6`,
      lineup: (size) => overriding(size, { head: 31 }),
      type: 'sinkhead-int',
      colorways: [],
    }).map((size) => {
      const [id, name, color] = {
        230: ['black-white', 'Black/White', 'cortland-white'],
        280: ['black-green', 'Black/Green', 'cortland-dungeon-30-green'],
        330: ['black-olive', 'Black/Olive', 'cortland-pike-olive'],
      }[size.lineup.label.match(/(\d+) gr$/)[1]];
      return { ...size, colorways: [{ id, name, zones: zones([31, 'cortland-black'], [0, color]) }] };
    }),
  }),
  // Cortland's budget full sinker, 84 ft long, with 8 ft tapers either side of a 20 ft body. Type 2
  // (2 ips), drawn as Type 3.
  makerProduct({
    id: 'cortland-fairplay-sinking-type-2',
    maker: 'Cortland',
    name: 'Cortland Fairplay Sinking Type 2',
    sizes: sizes(LINEUP['cortland-fairplay-sinking-type-2'], {
      id: (w) => `wf${w}s2`,
      type: 'sink3',
      colorways: [{ id: 'black', name: 'Black', zones: zones([0, 'cortland-black']) }],
    }),
  }),
];
