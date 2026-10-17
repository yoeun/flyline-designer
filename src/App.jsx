import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Button from './components/Button.jsx';
import Checks from './components/Checks.jsx';
import DetailsDialog from './components/DetailsDialog.jsx';
import { BackingOptions, FlyLineOptions, ReelOptions } from './components/Options.jsx';
import PreviewModeToggle from './components/PreviewModeToggle.jsx';
import Rack from './components/Rack.jsx';
import RackPage from './components/RackPage.jsx';
import Segmented from './components/Segmented.jsx';
import ReelPreview from './components/ReelPreview.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import SetupTitle from './components/SetupTitle.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import { DEFAULT_SETUP, LINE_PRESETS, REELS, findById, presetForLine, switchLine } from './data/catalog.js';
import { DEMO_RACK } from './data/demoRack.js';
import { exportPng, exportSvg } from './lib/export.js';
import { rackConflicts } from './lib/checks.js';
import { clampSelection } from './lib/lineEdit.js';
import { SECTION_KEYS, changedSections, displayName, isDirty, loadEntries } from './lib/rack.js';
import { resolveView } from './lib/rackView.js';
import { SIDES } from './lib/reelFrames.js';
import { queryToState, stateToQuery } from './lib/share.js';
import { STAGE, useTheme } from './lib/theme.js';

const RACK_KEY = 'flyline-designer:rack';

function loadRack() {
  try {
    return loadEntries(JSON.parse(localStorage.getItem(RACK_KEY)));
  } catch {
    return [];
  }
}

// Desktop gutter grows with the window; never under 16px.
const GUTTER = 'px-[max(16px,2.5vw)]';

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'flyline';

export default function App() {
  // A demo visit uses the fixed test rack and never touches the stored one.
  const [initial] = useState(() => {
    const state = queryToState(window.location.search, window.location.hash);
    const rack = state.demo ? loadEntries(DEMO_RACK) : loadRack();
    return { ...state, ...resolveView(state, rack), rack };
  });
  const demo = initial.demo;
  const [{ setup, presetId }, setState] = useState({ setup: initial.setup, presetId: initial.presetId });
  const [editingId, setEditingId] = useState(initial.editingId);
  const [page, setPage] = useState(initial.page);
  const [cameFromDesigner, setCameFromDesigner] = useState(false);
  const [mode, setMode] = useState(initial.mode);
  const [side, setSide] = useState(initial.side);
  const [lineSelection, setLineSelection] = useState(null);
  const [themeChoice, setThemeChoice, theme] = useTheme();
  const [rack, setRack] = useState(initial.rack);
  const [rackOpen, setRackOpen] = useState(false);
  // Which way the Details dialog is open (null when closed): 'edit', 'save' or 'save-as-new'.
  const [detailsMode, setDetailsMode] = useState(null);
  // The rack entry whose details are open in the dialog (from a rack card's menu), if any.
  const [detailsEntryId, setDetailsEntryId] = useState(null);
  const svgRef = useRef(null);
  // The page the address bar shows; a change of page pushes a history entry, design edits replace it.
  const urlPage = useRef(initial.page);
  // Set while Back to designer steps back through history, so the work in memory is kept as is.
  const returning = useRef(false);
  const rackRef = useRef(rack);
  rackRef.current = rack;

  // What "unsaved" means: the saved entry when editing, the defaults for a new setup.
  const baseline = (editingId && rack.find((s) => s.id === editingId)) || DEFAULT_SETUP;
  const dirty = isDirty(setup, baseline);
  // Section dots show only when editing a rack entry.
  const changed = editingId ? changedSections(setup, baseline) : null;

  // Skip the mount write: normalizing the stored rack must not erase entries it dropped.
  const rackLoaded = useRef(initial.rack);
  useEffect(() => {
    if (demo || rack === rackLoaded.current) return;
    try {
      localStorage.setItem(RACK_KEY, JSON.stringify(rack));
    } catch {
      // Storage can be unavailable (private mode); the rack then lasts for this visit only.
    }
  }, [rack, demo]);

  // Keep the URL in step with the design so a reload or a copied link restores it.
  useEffect(() => {
    const url = `${window.location.pathname}?${stateToQuery({ setup, presetId, side, mode, editingId, page, demo })}`;
    if (page === urlPage.current) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
    urlPage.current = page;
  }, [setup, presetId, side, mode, editingId, page, demo]);

  // Browser back/forward: restore the page, and for a designer address the setup it carries.
  useEffect(() => {
    const onPop = () => {
      setCameFromDesigner(false);
      if (returning.current) {
        returning.current = false;
        urlPage.current = 'designer';
        setPage('designer');
        return;
      }
      const state = queryToState(window.location.search);
      const view = resolveView(state, rackRef.current);
      urlPage.current = view.page;
      setPage(view.page);
      if (view.page === 'designer') {
        setLineSelection(null);
        setState({ setup: view.setup, presetId: view.presetId });
        setEditingId(view.editingId);
        setSide(state.side);
        setMode(state.mode);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const update = (patch, nextPreset = presetId) => setState({ setup: { ...setup, ...patch }, presetId: nextPreset });

  const selection = clampSelection(lineSelection, setup.line);

  // id is a product or generic preset from the Preset menu, a size from the Weight menu, or 'custom'.
  const applyPreset = (id) => {
    setLineSelection(null);
    if (id === 'custom') {
      setState({ setup, presetId: 'custom' });
      return;
    }
    const next = switchLine(id, setup.line, presetId);
    if (next) setState({ setup: { ...setup, line: next.line }, presetId: next.presetId });
  };

  const discardOk = () => !dirty || window.confirm(`Discard your changes to “${displayName(setup)}”? They aren't saved to your rack.`);

  // Open a rack entry in the designer to edit it in place.
  const loadEntry = (entry) => {
    if (!discardOk()) return;
    const { id, ...rest } = structuredClone(entry);
    setLineSelection(null);
    setState({ setup: rest, presetId: presetForLine(rest.line) });
    setEditingId(id);
    setCameFromDesigner(false);
    setPage('designer');
  };

  // Back to the default reel, line and backing, to design the next setup. The preview view stays as is.
  const startNew = () => {
    if (!discardOk()) return;
    setLineSelection(null);
    setState({ setup: structuredClone(DEFAULT_SETUP), presetId: LINE_PRESETS[0].id });
    setEditingId(null);
    setCameFromDesigner(false);
    setPage('designer');
    toast('Started a new setup.');
  };

  // Back to the saved entry (or the defaults for a new setup), staying on it.
  const resetAll = () => {
    if (!discardOk()) return;
    const { id, ...rest } = structuredClone(baseline);
    setLineSelection(null);
    setState({ setup: rest, presetId: presetForLine(rest.line) });
  };

  const resetSection = (key) => {
    const fields = Object.fromEntries(SECTION_KEYS[key].map((f) => [f, structuredClone(baseline[f])]));
    if (key === 'line') {
      setLineSelection(null);
      update(fields, presetForLine(fields.line));
    } else update(fields);
  };

  // Save the design (with any details from the dialog): over the entry being edited, or as a new entry that is then edited.
  const saveEntry = ({ asNew, details = {} }) => {
    const next = { ...setup, ...details };
    setState({ setup: next, presetId });
    if (!asNew && editingId) {
      setRack((r) => r.map((s) => (s.id === editingId ? { ...structuredClone(next), id: editingId } : s)));
      toast(`Updated “${displayName(next)}”.`);
      return;
    }
    const id = crypto.randomUUID();
    setRack((r) => [...r, { ...structuredClone(next), id }]);
    setEditingId(id);
    setRackOpen(true);
    toast(`Saved “${displayName(next)}” to your rack.`);
  };

  // Edit an entry's details straight from the rack. If it's the one being edited and its details
  // weren't changed in the designer, the design follows so it stays unchanged.
  const updateEntry = (id, details) => {
    setRack((r) => r.map((s) => (s.id === id ? { ...s, ...structuredClone(details) } : s)));
    if (id === editingId && !changed?.details) setState({ setup: { ...setup, ...structuredClone(details) }, presetId });
  };

  // Removing the entry being edited leaves its design open as a new setup.
  const removeEntry = (id) => {
    setRack((r) => r.filter((s) => s.id !== id));
    if (id === editingId) setEditingId(null);
  };

  // The dialog's submit: Done in edit mode changes the working design only; the save modes also save it.
  const submitDetails = (details) => {
    const mode = detailsMode;
    setDetailsMode(null);
    if (mode === 'edit') setState({ setup: { ...setup, ...details }, presetId });
    else saveEntry({ asNew: mode === 'save-as-new' || !editingId, details });
  };

  // The dialog edits a rack entry when opened from a card's menu, else the setup in the designer.
  const detailsEntry = rack.find((s) => s.id === detailsEntryId);
  const dialogSource = detailsEntry ?? setup;
  // The last mode is kept so the closing dialog doesn't change heading.
  const lastMode = useRef('edit');
  if (detailsMode) lastMode.current = detailsMode;
  const shownMode = lastMode.current;
  const closeDetails = () => {
    setDetailsMode(null);
    setDetailsEntryId(null);
  };
  const submitEntryDetails = (details) => {
    updateEntry(detailsEntry.id, details);
    setDetailsEntryId(null);
  };

  const openRack = () => {
    setCameFromDesigner(true);
    setPage('rack');
  };

  const backToDesigner = () => {
    if (returning.current) return;
    if (cameFromDesigner) {
      returning.current = true;
      window.history.back();
      return;
    }
    setPage('designer');
  };

  return (
    // Side by side, the page fits the window: the reel takes whatever height the checks and rack
    // leave, and the rack list and options panel scroll inside their own boxes.
    <div className="wide:flex wide:h-dvh wide:flex-col">
      <header className={`flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card py-3.5 ${GUTTER}`}>
        <div className="flex min-w-0 items-center gap-3.5">
          <h1 className="font-heading text-[24px] leading-none font-bold tracking-[0.04em] whitespace-nowrap uppercase">Flyline Designer</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ThemeToggle value={themeChoice} onChange={setThemeChoice} />
          {page === 'designer' && (
            <>
              <Button onClick={startNew}>New</Button>
              <Button onClick={resetAll} disabled={!dirty}>
                Reset
              </Button>
              <Button onClick={() => (editingId ? saveEntry({ asNew: false }) : setDetailsMode('save'))} disabled={!!editingId && !dirty}>
                Save
              </Button>
              {editingId && (
                <Button onClick={() => setDetailsMode('save-as-new')} disabled={!dirty}>
                  Save as new
                </Button>
              )}
              <Button onClick={() => exportSvg(svgRef.current, slug(displayName(setup)))}>Export SVG</Button>
              <Button variant="primary" onClick={() => exportPng(svgRef.current, slug(displayName(setup)))}>
                Export PNG
              </Button>
            </>
          )}
        </div>
      </header>
      <Toaster theme={theme} position="bottom-center" duration={2500} />

      {page === 'rack' ? (
        <RackPage
          setups={rack}
          currentId={editingId}
          conflicts={rackConflicts(rack)}
          showBack={cameFromDesigner}
          onBack={backToDesigner}
          onNew={startNew}
          onLoad={loadEntry}
          onEditDetails={(entry) => setDetailsEntryId(entry.id)}
          onRemove={removeEntry}
        />
      ) : (
        <main className={`flex flex-wrap items-start gap-7 pt-6 pb-10 wide:min-h-0 wide:flex-1 wide:flex-nowrap wide:items-stretch wide:pb-6 ${GUTTER}`}>
          <section className="flex min-w-0 flex-[1_1_560px] flex-col gap-4 wide:min-h-0" aria-label="Preview">
            <div className="flex flex-col items-center gap-2 rounded-panel bg-stage p-4 text-stage-foreground wide:min-h-0 wide:flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2 self-stretch">
                <SetupTitle
                  name={displayName(setup)}
                  subtitle={`${findById(REELS, setup.reel.model)?.name ?? 'Reel'} · ${setup.line.weight} wt`}
                  isNew={!editingId}
                  detailsChanged={!!changed?.details}
                  onOpenDetails={() => setDetailsMode('edit')}
                />
                <div className="flex flex-wrap justify-end gap-2">
                  <Segmented label="Reel side" options={SIDES} value={side} onChange={setSide} />
                  <PreviewModeToggle value={mode} onChange={setMode} />
                </div>
              </div>
              <div className="w-[min(100%,460px)] wide:flex wide:min-h-0 wide:w-full wide:flex-1 wide:justify-center">
                <ReelPreview
                  setup={setup}
                  mode={mode}
                  side={side}
                  background={STAGE[theme]}
                  svgRef={svgRef}
                  title={`${displayName(setup)} preview`}
                  className="wide:h-full wide:w-auto wide:max-w-full"
                />
              </div>
              <Checks setup={setup} />
            </div>
            <Rack
              setups={rack}
              open={rackOpen}
              onToggle={() => setRackOpen((o) => !o)}
              currentId={editingId}
              onLoad={loadEntry}
              onEditDetails={(entry) => setDetailsEntryId(entry.id)}
              onRemove={removeEntry}
              onExpand={openRack}
            />
          </section>

          <section className="min-w-0 flex-[1_1_380px] divide-y divide-border rounded-panel border border-border bg-card wide:overflow-y-auto" aria-label="Options">
            <ReelOptions reel={setup.reel} onChange={(reel) => update({ reel })} changed={changed?.reel ?? false} onReset={() => resetSection('reel')} />
            <FlyLineOptions
              line={setup.line}
              backingColor={setup.backing.color}
              presetId={presetId}
              onPreset={applyPreset}
              onChange={(line) => update({ line }, 'custom')}
              onColorway={(cw) => update({ line: { ...setup.line, zones: structuredClone(cw.zones) } })}
              selection={selection}
              onSelect={setLineSelection}
              changed={changed?.line ?? false}
              onReset={() => resetSection('line')}
            />
            <BackingOptions backing={setup.backing} onChange={(backing) => update({ backing })} changed={changed?.backing ?? false} onReset={() => resetSection('backing')} />
          </section>
        </main>
      )}
      <DetailsDialog
        key={detailsEntryId ?? 'setup'}
        open={detailsMode !== null || detailsEntry !== undefined}
        mode={detailsEntry ? 'save-changes' : shownMode}
        details={{ title: dialogSource.title, styles: dialogSource.styles, notes: dialogSource.notes }}
        fallbackTitle={displayName({ ...dialogSource, title: '' })}
        onSubmit={detailsEntry ? submitEntryDetails : submitDetails}
        onClose={closeDetails}
      />
    </div>
  );
}
