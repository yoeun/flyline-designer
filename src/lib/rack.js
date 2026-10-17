import { DEFAULT_SETUP } from '../data/catalog.js';

// JSON with sorted keys, so setups compare equal whatever order their fields were built in.
const canonical = (value) => JSON.stringify(value, (_, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v));

const withoutId = ({ id, ...setup }) => setup;

// Whether starting over would lose work: the setup differs from the default and isn't saved in the rack.
export function hasUnsavedChanges(setup, rack) {
  const current = canonical(withoutId(setup));
  return current !== canonical(DEFAULT_SETUP) && !rack.some((saved) => canonical(withoutId(saved)) === current);
}
