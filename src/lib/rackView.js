import { REELS, presetForLine } from '../data/catalog.js';
import { displayName } from './rack.js';

// The line weights in the rack, lightest first.
export const rackWeights = (setups) => [...new Set(setups.map((s) => s.line.weight))].sort((a, b) => a - b);

// Reel catalog order, then line weight, then name.
const byReel = (a, b) =>
  REELS.findIndex((r) => r.id === a.reel.model) - REELS.findIndex((r) => r.id === b.reel.model) ||
  a.line.weight - b.line.weight ||
  displayName(a).localeCompare(displayName(b));

// Setups matching the style, split into those at the chosen weight and those one weight either side.
export function filterRack(setups, { weight, style }) {
  const styled = setups.filter((s) => !style || s.styles.includes(style));
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
