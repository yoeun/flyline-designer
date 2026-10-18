import { LINE_PRESETS, REELS, findById, presetForLine } from '../data/catalog.js';
import { STYLES, displayName } from './rack.js';

// The line weights in the rack, lightest first.
export const rackWeights = (setups) => [...new Set(setups.map((s) => s.line.weight))].sort((a, b) => a - b);

// Reel catalog order, then line weight, then name.
const byReel = (a, b) =>
  REELS.findIndex((r) => r.id === a.reel.model) - REELS.findIndex((r) => r.id === b.reel.model) ||
  a.line.weight - b.line.weight ||
  displayName(a).localeCompare(displayName(b));

// The words a setup can be found by: reel make and name, line name, title, notes and style names. Not colors,
// since a setup has several. The weight is matched on its own (see matchesSearch).
function searchText(setup) {
  const reel = findById(REELS, setup.reel.model);
  const line = findById(LINE_PRESETS, presetForLine(setup.line))?.name;
  const styles = STYLES.filter((s) => setup.styles?.includes(s.id)).map((s) => s.name);
  return [reel?.maker, reel?.name, line, displayName(setup), setup.title, setup.notes, ...styles].filter(Boolean).join(' ').toLowerCase();
}

// Whether every word of the query matches the setup. "5wt" and "5 wt" match the line weight only;
// a bare number matches the weight or a whole number in the text, so "5" finds a Liquid S -5+ but not a 15 wt.
export function matchesSearch(setup, query) {
  const words = query.toLowerCase().replace(/(\d+)\s*wt\b/g, '$1wt').split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = searchText(setup);
  return words.every((word) => {
    const weight = word.match(/^(\d+)wt$/);
    if (weight) return setup.line.weight === Number(weight[1]);
    if (/^\d+$/.test(word) && setup.line.weight === Number(word)) return true;
    return /^\d+$/.test(word) ? new RegExp(`(^|\\D)${word}(\\D|$)`).test(text) : text.includes(word);
  });
}

// Setups matching the search and style, split into those at the chosen weight and those one weight either side.
export function filterRack(setups, { weight, style, query = '' }) {
  const styled = setups.filter((s) => (!style || s.styles.includes(style)) && matchesSearch(s, query));
  if (weight === null) return { exact: styled.sort(byReel), near: [] };
  return {
    exact: styled.filter((s) => s.line.weight === weight).sort(byReel),
    near: styled.filter((s) => Math.abs(s.line.weight - weight) === 1).sort(byReel),
  };
}

// Where the app opens: an explicit page choice wins, then the designer if a setup is loaded, else the rack if it has setups.
export function landingPage({ page, hasSetup }, rackCount) {
  if (page) return page;
  if (hasSetup) return 'designer';
  return rackCount > 0 ? 'rack' : 'designer';
}

// What the app shows for a URL's state: the edit marker counts only for an entry still in the rack,
// and a marker without a setup in the URL loads that entry.
export function resolveView(state, rack) {
  const entry = state.editingId ? rack.find((s) => s.id === state.editingId) : null;
  let { setup, presetId } = state;
  if (entry && !state.hasSetup) {
    const { id, ...rest } = structuredClone(entry);
    setup = rest;
    presetId = presetForLine(rest.line);
  }
  const page = landingPage({ page: state.page, hasSetup: state.hasSetup || Boolean(entry) }, rack.length);
  return { setup, presetId, editingId: entry ? entry.id : null, page };
}
