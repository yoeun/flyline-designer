import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Button from './components/Button.jsx';
import Checks from './components/Checks.jsx';
import DetailsDialog from './components/DetailsDialog.jsx';
import DiscardDialog from './components/DiscardDialog.jsx';
import FlippingReelPreview from './components/FlippingReelPreview.jsx';
import { BackingOptions, FlyLineOptions, ReelOptions } from './components/Options.jsx';
import HeaderMenu from './components/HeaderMenu.jsx';
import NavMenu from './components/NavMenu.jsx';
import PreviewModeToggle from './components/PreviewModeToggle.jsx';
import Rack from './components/Rack.jsx';
import { NO_FILTER } from './components/RackFilter.jsx';
import RackPage from './components/RackPage.jsx';
import ReelSideToggle from './components/ReelSideToggle.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import SetupDrawer from './components/SetupDrawer.jsx';
import SetupTitle from './components/SetupTitle.jsx';
import ShareDialog from './components/ShareDialog.jsx';
import { DEFAULT_SETUP, LINE_PRESETS, REELS, findById, fitLineToReel, presetForLine, switchLine } from './data/catalog.js';
import { DEMO_RACK } from './data/demoRack.js';
import { exportPng, exportSvg } from './lib/export.js';
import { spoolLayout } from './lib/geometry.js';
import { rackConflicts } from './lib/checks.js';
import { clampSelection } from './lib/lineEdit.js';
import { SECTION_KEYS, changedSections, copyOf, displayName, isDirty, loadEntries } from './lib/rack.js';
import { resolveView } from './lib/rackView.js';
import { setupForReel } from './lib/reelsPage.js';
import { queryToState, stateToQuery } from './lib/share.js';
import { createShare, deleteShare, loadShare, rotateShare, storeShare, updateShare } from './lib/shareApi.js';
import { FIXED_HEADER, HEADER_SPACER, useFixedHeader } from './lib/fixedHeader.js';
import { STAGE, useTheme } from './lib/theme.js';

const RACK_KEY = 'flyline-designer:rack';

// The guide and its maker data load on first visit, so the designer doesn't wait for them.
const GuidePage = lazy(() => import('./components/GuidePage.jsx'));
const ReelsPage = lazy(() => import('./components/ReelsPage.jsx'));

function loadRack() {
  try {
    return loadEntries(JSON.parse(localStorage.getItem(RACK_KEY)));
  } catch {
    return [];
  }
}

// Desktop gutter grows with the window; never under 16px.
const GUTTER = 'px-[max(16px,2.5vw)]';

// What to tell the owner when a sharing call fails.
const shareFailed = (err) =>
  toast(
    err.status === 429
      ? 'Too many new links right now. Try again later.'
      : err.status === 0
        ? 'Couldn’t reach the server. Check your connection and try again.'
        : 'Something went wrong with sharing. Try again.',
  );

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
  const [spins, setSpins] = useState(0);
  const [lineSelection, setLineSelection] = useState(null);
  const [themeChoice, setThemeChoice, theme] = useTheme();
  const [rack, setRack] = useState(initial.rack);
  const [rackOpen, setRackOpen] = useState(false);
  // The rack's search and filter, shared by the strip and the rack page; not kept across reloads.
  const [rackFilter, setRackFilter] = useState(NO_FILTER);
  // This browser's view link to its rack ({ shareId, ownerToken }), if it has one.
  const [share, setShare] = useState(loadShare);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const shareRef = useRef(share);
  shareRef.current = share;
  // The rack and link the server last took, so an unchanged rack isn't sent again.
  const synced = useRef(null);
  // Which way the Details dialog is open (null when closed): 'edit', 'save' or 'save-as-new'.
  const [detailsMode, setDetailsMode] = useState(null);
  // The rack entry whose details are open in the dialog (from a rack card's menu), if any.
  const [detailsEntryId, setDetailsEntryId] = useState(null);
  // The rack entry shown in the setup drawer (from a rack card's menu), if any.
  const [viewingId, setViewingId] = useState(null);
  // The unsaved-changes dialog, and the action to run if the changes are discarded.
  const [discard, setDiscard] = useState({ open: false, run: null, name: '' });
  const svgRef = useRef(null);
  const headerRef = useFixedHeader();
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

  // A shared rack follows this one: a second after the rack changes, the server gets the new version.
  // On load it is sent once too, catching up on changes that didn't reach it last visit.
  useEffect(() => {
    if (demo || !share || (synced.current?.rack === rack && synced.current?.shareId === share.shareId)) return;
    const timer = setTimeout(() => {
      updateShare(share, rack).then(
        () => (synced.current = { rack, shareId: share.shareId }),
        (err) => {
          // A link renewed or stopped while this was out has moved on; its 404 is for the old id.
          if (shareRef.current?.shareId !== share.shareId) return;
          if (err.status !== 404) return toast('Couldn’t update your shared rack. It tries again when you next save.');
          changeShare(null);
          toast('Your rack is no longer shared. Share it again for a new link.');
        },
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [rack, share, demo]);

  const changeShare = (next) => {
    storeShare(next);
    setShare(next);
  };

  // Each call returns the share as it is afterwards; a 404 means the link is already gone.
  const runShare = async (call) => {
    setShareBusy(true);
    try {
      changeShare(await call());
    } catch (err) {
      if (err.status === 404) changeShare(null);
      else shareFailed(err);
    } finally {
      setShareBusy(false);
    }
  };

  const startSharing = () =>
    runShare(async () => {
      const next = await createShare(rack);
      synced.current = { rack, shareId: next.shareId };
      toast('Your rack is shared. Copy the link to send it.');
      return next;
    });

  const newShareLink = () =>
    runShare(async () => {
      const { shareId } = await rotateShare(share);
      synced.current = { rack, shareId };
      toast('Made a new link. The old one no longer works.');
      return { ...share, shareId };
    });

  const stopSharing = () =>
    runShare(async () => {
      await deleteShare(share);
      setShareOpen(false);
      toast('Stopped sharing your rack.');
      return null;
    });

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
  const reelSize = findById(REELS, setup.reel.model);

  // id is a product or generic preset from the Preset menu, a size from the Weight menu, or 'custom'.
  const applyPreset = (id) => {
    setLineSelection(null);
    if (id === 'custom') {
      setState({ setup, presetId: 'custom' });
      return;
    }
    const next = switchLine(id, setup.line, presetId, reelSize);
    if (next) setState({ setup: { ...setup, line: next.line }, presetId: next.presetId });
  };

  // A new reel size that doesn't take the line's weight moves the line to one it does, where it can.
  const changeReel = (reel) => {
    const next = fitLineToReel(setup.line, presetId, findById(REELS, reel.model));
    if (!next) {
      update({ reel });
      return;
    }
    setLineSelection(null);
    setState({ setup: { ...setup, reel, line: next.line }, presetId: next.presetId });
  };

  // Runs an action that replaces the design, first asking in a dialog when there are unsaved changes.
  const discardThen = (run) => (dirty ? setDiscard({ open: true, run, name: displayName(setup) }) : run());

  // Open a rack entry in the designer to edit it in place.
  const loadEntry = (entry) => {
    discardThen(() => {
      const { id, ...rest } = structuredClone(entry);
      setLineSelection(null);
      setState({ setup: rest, presetId: presetForLine(rest.line) });
      setEditingId(id);
      setCameFromDesigner(false);
      setPage('designer');
    });
  };

  // A copy of a rack entry as a new setup in the designer; it joins the rack when saved.
  const duplicateEntry = (entry) => {
    discardThen(() => {
      const copy = copyOf(entry);
      setLineSelection(null);
      setState({ setup: copy, presetId: presetForLine(copy.line) });
      setEditingId(null);
      setCameFromDesigner(false);
      setPage('designer');
      toast(`Started “${copy.title}”.`);
    });
  };

  // Back to the default reel, line and backing, to design the next setup. The preview view stays as is.
  const startNew = () => {
    discardThen(() => {
      setLineSelection(null);
      setState({ setup: structuredClone(DEFAULT_SETUP), presetId: LINE_PRESETS[0].id });
      setEditingId(null);
      setCameFromDesigner(false);
      setPage('designer');
      toast('Started a new setup.');
    });
  };

  // Back to the saved entry (or the defaults for a new setup), staying on it.
  const resetAll = () => {
    discardThen(() => {
      const { id, ...rest } = structuredClone(baseline);
      setLineSelection(null);
      setState({ setup: rest, presetId: presetForLine(rest.line) });
    });
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
    setCameFromDesigner(page === 'designer');
    setPage('rack');
  };

  const openGuide = () => {
    setCameFromDesigner(page === 'designer');
    setPage('guide');
  };

  const openReels = () => {
    setCameFromDesigner(page === 'designer');
    setPage('reels');
  };

  // From the guide: a new setup on the current reel and backing, with the guide's line, even one the
  // reel doesn't take (the checks then say so).
  const tryLine = (id) => {
    const preset = findById(LINE_PRESETS, id);
    if (!preset) return;
    discardThen(() => {
      setLineSelection(null);
      setState({ setup: { ...structuredClone(DEFAULT_SETUP), reel: setup.reel, backing: setup.backing, line: structuredClone(preset.line) }, presetId: id });
      setEditingId(null);
      setCameFromDesigner(false);
      setPage('designer');
    });
  };

  // From the Reels page: a new setup on the reel and finish picked there.
  const newFromReel = (reel) => {
    discardThen(() => {
      const next = setupForReel(reel);
      setLineSelection(null);
      setState(next);
      setEditingId(null);
      setCameFromDesigner(false);
      setPage('designer');
      toast(`Started a new setup on the ${findById(REELS, reel.model)?.name ?? 'reel'}.`);
    });
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

  // Where each page menu item goes, and what each overflow menu item does; lib/headerMenu.js lists them.
  const navigate = { designer: backToDesigner, rack: openRack, guide: openGuide, reels: openReels };
  const menuActions = {
    svg: () => exportSvg(svgRef.current, slug(displayName(setup))),
    png: () => exportPng(svgRef.current, slug(displayName(setup))),
  };

  // Reset, Save and (when editing a saved setup) Save as new: in the header, or the bottom bar on phones.
  const saveButtons = (
    <>
      <Button onClick={resetAll} disabled={!dirty}>
        Reset
      </Button>
      <Button variant="primary" onClick={() => (editingId ? saveEntry({ asNew: false }) : setDetailsMode('save'))} disabled={!!editingId && !dirty}>
        Save
      </Button>
      {editingId && (
        <Button onClick={() => setDetailsMode('save-as-new')} disabled={!dirty}>
          Save as new
        </Button>
      )}
    </>
  );

  return (
    // Side by side, the page fits the window: the reel takes whatever height the checks and rack
    // leave, and the rack list and options panel scroll inside their own boxes.
    <div className="wide:flex wide:h-dvh wide:flex-col">
      <header ref={headerRef} className={`${FIXED_HEADER} flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card py-3.5 ${GUTTER}`}>
        <div className="flex min-w-0 items-center gap-2">
          <NavMenu page={page} onNavigate={(id) => navigate[id]()} theme={themeChoice} onTheme={setThemeChoice} />
          <h1 className="font-heading text-[clamp(20px,6.5vw,24px)] leading-none font-bold tracking-[0.04em] whitespace-nowrap uppercase">Flyline Designer</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {page !== 'guide' && page !== 'reels' && <Button onClick={startNew}>New</Button>}
          {/* On phones these move to the bar fixed at the bottom of the designer. */}
          {page === 'designer' && <div className="hidden sm:contents">{saveButtons}</div>}
          <HeaderMenu page={page} onSelect={(id) => menuActions[id]()} />
        </div>
      </header>
      <div className={HEADER_SPACER} aria-hidden="true" />
      {/* On phones the designer's save bar takes the bottom of the screen, so toasts sit above it. */}
      <Toaster theme={theme} position="bottom-center" duration={2500} mobileOffset={page === 'designer' ? { bottom: 84 } : undefined} />

      {page === 'reels' ? (
        <Suspense fallback={<p className={`pt-6 text-[14px] text-muted-foreground ${GUTTER}`}>Loading reels…</p>}>
          <ReelsPage onNewSetup={newFromReel} />
        </Suspense>
      ) : page === 'guide' ? (
        <Suspense fallback={<p className={`pt-6 text-[14px] text-muted-foreground ${GUTTER}`}>Loading the line guide…</p>}>
          <GuidePage onTry={tryLine} />
        </Suspense>
      ) : page === 'rack' ? (
        <RackPage
          setups={rack}
          currentId={editingId}
          conflicts={rackConflicts(rack)}
          filter={rackFilter}
          onFilterChange={setRackFilter}
          onLoad={loadEntry}
          onViewDetails={(entry) => setViewingId(entry.id)}
          onEditDetails={(entry) => setDetailsEntryId(entry.id)}
          onDuplicate={duplicateEntry}
          onRemove={removeEntry}
          actions={
            !demo && (
              <Button onClick={() => setShareOpen(true)} disabled={!share && rack.length === 0}>
                {share ? 'Shared' : 'Share'}
              </Button>
            )
          }
        />
      ) : (
        <main className={`flex flex-wrap items-start gap-7 pt-6 pb-10 max-sm:pb-24 wide:min-h-0 wide:flex-1 wide:flex-nowrap wide:items-stretch wide:pb-6 ${GUTTER}`}>
          <section className="flex min-w-0 flex-[1_1_560px] flex-col gap-4 wide:min-h-0" aria-label="Preview">
            <div className="flex flex-col items-center gap-2 rounded-panel bg-stage p-4 text-stage-foreground wide:min-h-0 wide:flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2 self-stretch">
                <SetupTitle
                  name={displayName(setup)}
                  subtitle={`${reelSize?.name ?? 'Reel'} · ${setup.line.weight} wt`}
                  isNew={!editingId}
                  detailsChanged={!!changed?.details}
                  onOpenDetails={() => setDetailsMode('edit')}
                />
                {/* On a phone the toggles get their own row, Drag/Spool at the left and the view at the right. */}
                <div className="flex flex-wrap justify-end gap-2 max-sm:w-full max-sm:justify-between">
                  <ReelSideToggle side={side} onChange={setSide} onSpin={() => setSpins((n) => n + 1)} />
                  <PreviewModeToggle value={mode} onChange={setMode} />
                </div>
              </div>
              <div className="w-[min(100%,460px)] wide:flex wide:min-h-0 wide:w-full wide:flex-1 wide:justify-center">
                <FlippingReelPreview
                  setup={setup}
                  mode={mode}
                  side={side}
                  spins={spins}
                  background={STAGE[theme]}
                  svgRef={svgRef}
                  title={`${displayName(setup)} preview`}
                  className="wide:h-full"
                  svgClassName="wide:h-full wide:w-auto wide:max-w-full"
                />
              </div>
              <Checks setup={setup} />
            </div>
            <Rack
              setups={rack}
              open={rackOpen}
              onToggle={() => setRackOpen((o) => !o)}
              filter={rackFilter}
              onFilterChange={setRackFilter}
              currentId={editingId}
              onLoad={loadEntry}
              onEditDetails={(entry) => setDetailsEntryId(entry.id)}
              onDuplicate={duplicateEntry}
              onRemove={removeEntry}
              onExpand={openRack}
            />
          </section>

          <section className="min-w-0 flex-[1_1_380px] divide-y divide-border rounded-panel border border-border bg-card wide:overflow-y-auto" aria-label="Options">
            <ReelOptions reel={setup.reel} weight={setup.line.weight} onChange={changeReel} changed={changed?.reel ?? false} onReset={() => resetSection('reel')} />
            <FlyLineOptions
              line={setup.line}
              reel={reelSize}
              backingColor={setup.backing.color}
              presetId={presetId}
              onPreset={applyPreset}
              onChange={(line) => update({ line }, 'custom')}
              onColorway={(cw) => update({ line: { ...setup.line, zones: structuredClone(cw.zones) } })}
              selection={selection}
              onSelect={setLineSelection}
              changed={changed?.line ?? false}
              onReset={() => resetSection('line')}
              onOpenGuide={openGuide}
            />
            <BackingOptions
              backing={setup.backing}
              onChange={(backing) => update({ backing })}
              changed={changed?.backing ?? false}
              onReset={() => resetSection('backing')}
              maxYards={(pounds) => spoolLayout({ ...setup, backing: { ...setup.backing, pounds } }).maxBackingYards}
            />
          </section>
        </main>
      )}
      {page === 'designer' && (
        // Reset and Save stay in reach on a phone, fixed to the bottom of the screen.
        <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-card px-4 py-3 sm:hidden [&>*]:flex-1">{saveButtons}</div>
      )}
      <DiscardDialog
        open={discard.open}
        name={discard.name}
        onDiscard={() => {
          setDiscard((d) => ({ ...d, open: false }));
          discard.run();
        }}
        onCancel={() => setDiscard((d) => ({ ...d, open: false }))}
      />
      <ShareDialog open={shareOpen} share={share} busy={shareBusy} onShare={startSharing} onRotate={newShareLink} onStop={stopSharing} onClose={() => setShareOpen(false)} />
      <SetupDrawer
        setup={rack.find((s) => s.id === viewingId) ?? null}
        theme={theme}
        onOpen={(entry) => {
          setViewingId(null);
          loadEntry(entry);
        }}
        openLabel="Open in the designer"
        onClose={() => setViewingId(null)}
      />
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
