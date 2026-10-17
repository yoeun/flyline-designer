// A fixed rack for trying the rack page without saving setups by hand (open the app with ?demo=1).
// Nine near-identical Liquid S reels told apart by line and backing color, then one of each other reel model. Every line is a real preset except the one titled Custom. Raw entries, run through loadEntries.
import { LINE_PRESETS, findById } from './catalog.js';

// A preset's line exactly, optionally in another of its colorways (only the "Custom" entry changes the weight).
function line(presetId, { weight, colorway = 0 } = {}) {
  const preset = findById(LINE_PRESETS, presetId);
  const copy = structuredClone(preset.line);
  if (preset.colorways) copy.zones = structuredClone(preset.colorways[colorway].zones);
  if (weight) copy.weight = weight;
  return copy;
}

const backing = (yards, color, pounds = 20) => ({ yards, pounds, color });

const LONG_NOTE = `Home water setup for the spring creek. Floating line, 9 ft 5X leader to start, drop to 6X once the hatch gets picky.

Backing is spooled to the rated capacity, so the line sits just below the rim. Check the knot at the arbor every few trips.

Spare spool lives in the truck: same line, same backing color, so it never gets mixed up with the others on the rack.`;

export const DEMO_RACK = [
  // Liquid S -3+ on 3 wt
  { id: 'demo-1', title: '', styles: ['nymph'], notes: '', reel: { model: 'lamson-liquid-s-3', color: 'smoke' }, line: line('rio-technical-euro-nymph-2-5'), backing: backing(100, 'orange') },
  { id: 'demo-2', title: '', styles: ['nymph'], notes: 'Competition rig.', reel: { model: 'lamson-liquid-s-3', color: 'day-break' }, line: line('sa-mastery-euro-tactical-nymph-mono-level'), backing: backing(100, 'red') },
  { id: 'demo-3', title: '', styles: ['dry', 'nymph'], notes: '', reel: { model: 'lamson-liquid-s-3', color: 'smoke' }, line: line('rio-technical-euro-nymph-2-5'), backing: backing(100, 'blue') },
  // Liquid S -5+ on 5 wt
  { id: 'demo-4', title: '', styles: ['dry'], notes: '', reel: { model: 'lamson-liquid-s-5', color: 'smoke' }, line: line('twotone-wf5f'), backing: backing(100, 'red') },
  { id: 'demo-5', title: '', styles: ['dry'], notes: LONG_NOTE, reel: { model: 'lamson-liquid-s-5', color: 'day-break' }, line: line('generic-wf5f'), backing: backing(100, 'red') },
  { id: 'demo-6', title: '', styles: ['dry', 'nymph'], notes: '', reel: { model: 'lamson-liquid-s-5', color: 'smoke' }, line: line('rio-premier-gold-wf5f', { colorway: 1 }), backing: backing(100, 'blue') },
  // Liquid S -7+ on 7 wt
  { id: 'demo-7', title: '', styles: ['streamer'], notes: 'Slow intermediate for stillwater.', reel: { model: 'lamson-liquid-s-7', color: 'day-break' }, line: line('generic-wf7i'), backing: backing(150, 'white') },
  { id: 'demo-8', title: '', styles: ['streamer'], notes: '', reel: { model: 'lamson-liquid-s-7', color: 'smoke' }, line: line('airflo-sixth-sense-wf7-di5'), backing: backing(150, 'purple') },
  { id: 'demo-9', title: '', styles: ['streamer'], notes: '', reel: { model: 'lamson-liquid-s-7', color: 'day-break' }, line: line('cortland-streamer-sink-tip-15-wf7'), backing: backing(150, 'black') },
  // One of each other reel
  { id: 'demo-10', title: 'Custom', styles: [], notes: '', reel: { model: 'g910', color: 'gunmetal' }, line: line('twotone-wf5f', { weight: 10 }), backing: backing(200, 'blue', 30) },
  { id: 'demo-11', title: '', styles: ['streamer', 'nymph'], notes: '', reel: { model: 'orvis-hydros-2026-3', color: 'black' }, line: line('wf6i'), backing: backing(125, 'chartreuse') },
  { id: 'demo-12', title: '', styles: ['streamer'], notes: '', reel: { model: 'orvis-hydros-4', color: 'olive' }, line: line('wf8-sink5'), backing: backing(150, 'purple') },
  { id: 'demo-13', title: '', styles: ['streamer'], notes: '', reel: { model: 'orvis-clearwater-4', color: 'dark-pine' }, line: line('generic-wf8-sinktip'), backing: backing(150, 'orange') },
  // Old format: a name instead of title, no styles or notes
  { id: 'demo-14', name: 'Brook trout', reel: { model: 'redington-run-34', color: 'sand' }, line: line('rio-technical-euro-nymph-2-5'), backing: backing(50, 'green') },
  { id: 'demo-15', title: '', styles: ['dry'], notes: '', reel: { model: 'redington-behemoth-78', color: 'army-green' }, line: line('rio-premier-gold-wf8f'), backing: backing(150, 'blue') },
  // One of each newer model, in finishes that show off their accent colors
  { id: 'demo-16', title: '', styles: ['dry'], notes: '', reel: { model: 'lamson-guru-s-5', color: 'lamson-og' }, line: line('rio-premier-gold-wf5f'), backing: backing(100, 'red') },
  { id: 'demo-17', title: '', styles: ['dry'], notes: '', reel: { model: 'lamson-speedster-s-3', color: 'lamson-ember' }, line: line('rio-premier-gold-wf4f'), backing: backing(50, 'orange') },
  { id: 'demo-18', title: '', styles: ['streamer'], notes: '', reel: { model: 'lamson-remix-s-7', color: 'day-break' }, line: line('generic-wf7i'), backing: backing(150, 'white') },
  { id: 'demo-19', title: '', styles: ['streamer', 'nymph'], notes: '', reel: { model: 'orvis-mirage-3', color: 'orvis-silver-dragonfly' }, line: line('wf6i'), backing: backing(100, 'chartreuse') },
  { id: 'demo-20', title: '', styles: ['dry'], notes: '', reel: { model: 'orvis-battenkill-disc-2', color: 'orvis-copper' }, line: line('rio-premier-gold-wf4f'), backing: backing(50, 'yellow') },
  { id: 'demo-21', title: '', styles: ['streamer'], notes: '', reel: { model: 'redington-grande-789', color: 'redington-marine' }, line: line('wf8-sink5'), backing: backing(150, 'purple', 30) },
  { id: 'demo-22', title: '', styles: ['dry'], notes: '', reel: { model: 'redington-zero-23', color: 'burgundy' }, line: line('rio-premier-gold-wf3f'), backing: backing(50, 'white') },
  { id: 'demo-23', title: '', styles: ['dry', 'nymph'], notes: '', reel: { model: 'redington-rise-iii-56', color: 'redington-amber' }, line: line('generic-wf5f'), backing: backing(100, 'purple') },
  { id: 'demo-24', title: '', styles: ['dry'], notes: '', reel: { model: 'ross-animas-56', color: 'ross-matte-blue' }, line: line('twotone-wf5f'), backing: backing(75, 'blue') },
  { id: 'demo-25', title: '', styles: ['streamer'], notes: '', reel: { model: 'ross-evolution-r-78', color: 'ross-matte-olive' }, line: line('generic-wf8-sinktip'), backing: backing(100, 'black') },
  { id: 'demo-26', title: '', styles: ['dry'], notes: '', reel: { model: 'sage-click-345', color: 'sage-bronze' }, line: line('rio-premier-gold-wf4f'), backing: backing(75, 'yellow') },
  { id: 'demo-27', title: '', styles: ['nymph'], notes: '', reel: { model: 'sage-spectrum-c-56', color: 'black' }, line: line('rio-premier-gold-wf6f'), backing: backing(100, 'orange') },
  { id: 'demo-28', title: '', styles: ['streamer'], notes: '', reel: { model: 'sage-spectrum-910', color: 'sage-platinum' }, line: line('rio-premier-gold-wf9f'), backing: backing(150, 'green', 30) },
  { id: 'demo-29', title: '', styles: ['streamer'], notes: '', reel: { model: 'sage-arbor-xl-678', color: 'sage-frost' }, line: line('generic-wf7i'), backing: backing(150, 'blue') },
  { id: 'demo-30', title: '', styles: ['dry'], notes: '', reel: { model: 'hatch-iconic-5-plus', color: 'hatch-clear-blue' }, line: line('rio-premier-gold-wf6f'), backing: backing(75, 'green') },
  { id: 'demo-31', title: '', styles: ['streamer'], notes: '', reel: { model: 'hatch-iconic-mid-arbor-7-plus', color: 'hatch-gray-black' }, line: line('wf8-sink5'), backing: backing(200, 'red') },
  { id: 'demo-32', title: '', styles: ['nymph'], notes: '', reel: { model: 'hatch-finatic-gen-2-3-plus', color: 'hatch-clear-red' }, line: line('rio-premier-gold-wf4f'), backing: backing(75, 'chartreuse') },
  { id: 'demo-33', title: '', styles: ['dry'], notes: '', reel: { model: 'piscifun-sword-ii-56', color: 'piscifun-green' }, line: line('generic-wf5f'), backing: backing(100, 'orange') },
];
