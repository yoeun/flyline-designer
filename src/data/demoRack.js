// A fixed rack for trying the rack page without saving setups by hand (open the app with ?demo=1).
// Mostly nine near-identical Liquid S reels told apart by line and backing color. Every line is a real preset except the one titled Custom. Raw entries, run through loadEntries.
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
  // Liquid S 3+ on 3 wt
  { id: 'demo-1', title: '', styles: ['nymph'], notes: '', reel: { model: 'lamson-liquid-s-3', color: 'smoke' }, line: line('rio-technical-euro-nymph'), backing: backing(100, 'orange') },
  { id: 'demo-2', title: '', styles: ['nymph'], notes: 'Competition rig.', reel: { model: 'lamson-liquid-s-3', color: 'day-break' }, line: line('sa-mastery-competition-nymph'), backing: backing(100, 'red') },
  { id: 'demo-3', title: '', styles: ['dry', 'nymph'], notes: '', reel: { model: 'lamson-liquid-s-3', color: 'smoke' }, line: line('rio-technical-euro-nymph'), backing: backing(100, 'blue') },
  // Liquid S 5+ on 5 wt
  { id: 'demo-4', title: '', styles: ['dry'], notes: '', reel: { model: 'lamson-liquid-s-5', color: 'smoke' }, line: line('twotone-wf5f'), backing: backing(100, 'red') },
  { id: 'demo-5', title: '', styles: ['dry'], notes: LONG_NOTE, reel: { model: 'lamson-liquid-s-5', color: 'day-break' }, line: line('generic-wf5f'), backing: backing(100, 'red') },
  { id: 'demo-6', title: '', styles: ['dry', 'nymph'], notes: '', reel: { model: 'lamson-liquid-s-5', color: 'smoke' }, line: line('rio-premier-gold-wf5f', { colorway: 1 }), backing: backing(100, 'blue') },
  // Liquid S 7+ on 7 wt
  { id: 'demo-7', title: '', styles: ['streamer'], notes: 'Slow intermediate for stillwater.', reel: { model: 'lamson-liquid-s-7', color: 'day-break' }, line: line('generic-wf7i'), backing: backing(150, 'white') },
  { id: 'demo-8', title: '', styles: ['streamer'], notes: '', reel: { model: 'lamson-liquid-s-7', color: 'smoke' }, line: line('airflo-sixth-sense-wf7-di5'), backing: backing(150, 'purple') },
  { id: 'demo-9', title: '', styles: ['streamer'], notes: '', reel: { model: 'lamson-liquid-s-7', color: 'day-break' }, line: line('cortland-streamer-sink-tip-15-wf7'), backing: backing(150, 'black') },
  // One of each other reel
  { id: 'demo-10', title: 'Custom', styles: [], notes: '', reel: { model: 'g910', color: 'gunmetal' }, line: line('twotone-wf5f', { weight: 10 }), backing: backing(200, 'blue', 30) },
  { id: 'demo-11', title: '', styles: ['streamer', 'nymph'], notes: '', reel: { model: 'orvis-hydros-2026-3', color: 'black' }, line: line('wf6i'), backing: backing(125, 'chartreuse') },
  { id: 'demo-12', title: '', styles: ['streamer'], notes: '', reel: { model: 'orvis-hydros-4', color: 'olive' }, line: line('wf8-sink5'), backing: backing(150, 'purple') },
  { id: 'demo-13', title: '', styles: ['streamer'], notes: '', reel: { model: 'orvis-clearwater-4', color: 'dark-pine' }, line: line('generic-wf8-sinktip'), backing: backing(150, 'orange') },
  // Old format: a name instead of title, no styles or notes
  { id: 'demo-14', name: 'Brook trout', reel: { model: 'redington-run-34', color: 'sand' }, line: line('rio-technical-euro-nymph'), backing: backing(50, 'green') },
  { id: 'demo-15', title: '', styles: ['dry'], notes: '', reel: { model: 'redington-behemoth-78', color: 'army-green' }, line: line('rio-premier-gold-wf8f'), backing: backing(150, 'blue') },
];
