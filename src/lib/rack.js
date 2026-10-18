import { LINE_PRESETS, LINE_TYPES, REELS, findById, presetForLine } from '../data/catalog.js';

export const STYLES = [
  { id: 'dry', letter: 'D', name: 'Dry' },
  { id: 'nymph', letter: 'N', name: 'Nymph' },
  { id: 'streamer', letter: 'S', name: 'Streamer' },
];

// Which setup fields each section of the editor owns; section reset copies these back from the baseline.
export const SECTION_KEYS = { reel: ['reel'], line: ['line'], backing: ['backing'], details: ['title', 'styles', 'notes'] };

// JSON with sorted keys, so setups compare equal whatever order their fields were built in.
const canonical = (value) => JSON.stringify(value, (_, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v));

const presetName = (line) => findById(LINE_PRESETS, presetForLine(line))?.name;

const validLine = (line) =>
  line && typeof line.type === 'string' && Number.isFinite(line.weight) && line.taper && Array.isArray(line.zones) && line.zones.length > 0;

// Setups used to carry a `name`, defaulting to the preset's. Only a name the user chose is a title.
export function legacyTitle(name, line) {
  const old = typeof name === 'string' ? name.trim() : '';
  return old && old !== presetName(line) && old !== 'Generic WF5 Floating Two-Tone' ? old : '';
}

// An entry from storage or an older version, as a current setup; null if it can't be used.
export function normalizeEntry(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const { reel, line, backing } = raw;
  if (!reel || !findById(REELS, reel.model) || !validLine(line) || !backing || typeof backing !== 'object') return null;
  const title = typeof raw.title === 'string' ? raw.title : legacyTitle(raw.name, line);
  const styles = Array.isArray(raw.styles) ? raw.styles.filter((id) => STYLES.some((s) => s.id === id)) : [];
  const entry = { title, styles, notes: typeof raw.notes === 'string' ? raw.notes : '', reel, line, backing };
  return raw.id === undefined ? entry : { id: raw.id, ...entry };
}

export const loadEntries = (raw) => (Array.isArray(raw) ? raw.map(normalizeEntry).filter(Boolean) : []);

// What a setup is called: its title, else its line preset, else a description of the custom line.
export function displayName(setup) {
  const title = setup.title?.trim();
  if (title) return title;
  const preset = presetName(setup.line);
  if (preset) return preset;
  return `Custom ${findById(LINE_TYPES, setup.line.type)?.name ?? setup.line.type} ${setup.line.weight} wt`;
}

// A rack entry as a new, unsaved setup titled after it, e.g. "RIO Gold WF5F (copy)".
export function copyOf(entry) {
  const { id, ...rest } = structuredClone(entry);
  return { ...rest, title: `${displayName(entry)} (copy)` };
}

const normalizedDetails = (s) => ({ title: (s.title ?? '').trim(), styles: [...(s.styles ?? [])].sort(), notes: (s.notes ?? '').trim() });

// Which sections of a setup differ from the baseline (the rack id doesn't count).
export function changedSections(setup, baseline) {
  return {
    reel: canonical(setup.reel) !== canonical(baseline.reel),
    line: canonical(setup.line) !== canonical(baseline.line),
    backing: canonical(setup.backing) !== canonical(baseline.backing),
    details: canonical(normalizedDetails(setup)) !== canonical(normalizedDetails(baseline)),
  };
}

export const isDirty = (setup, baseline) => Object.values(changedSections(setup, baseline)).some(Boolean);
