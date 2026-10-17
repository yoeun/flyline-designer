import { useEffect, useRef, useState } from 'react';
import Button from './components/Button.jsx';
import Checks from './components/Checks.jsx';
import { Input } from './components/Input.jsx';
import { BackingOptions, FlyLineOptions, ReelOptions } from './components/Options.jsx';
import PreviewModeToggle from './components/PreviewModeToggle.jsx';
import Rack from './components/Rack.jsx';
import Segmented from './components/Segmented.jsx';
import ReelPreview from './components/ReelPreview.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import { DEFAULT_SETUP, LINE_PRESETS, findById, presetForLine } from './data/catalog.js';
import { exportPng, exportSvg } from './lib/export.js';
import { clampSelection } from './lib/lineEdit.js';
import { hasUnsavedChanges } from './lib/rack.js';
import { SIDES } from './lib/reelFrames.js';
import { queryToState, stateToQuery } from './lib/share.js';
import { STAGE, useTheme } from './lib/theme.js';

const RACK_KEY = 'flyline-designer:rack';

function loadRack() {
  try {
    return JSON.parse(localStorage.getItem(RACK_KEY)) ?? [];
  } catch {
    return [];
  }
}

// Desktop gutter grows with the window; never under 16px.
const GUTTER = 'px-[max(16px,2.5vw)]';

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'flyline';

export default function App() {
  const [initial] = useState(() => queryToState(window.location.search, window.location.hash));
  const [{ setup, presetId }, setState] = useState({ setup: initial.setup, presetId: initial.presetId });
  const [mode, setMode] = useState(initial.mode);
  const [side, setSide] = useState(initial.side);
  const [lineSelection, setLineSelection] = useState(null);
  const [themeChoice, setThemeChoice, theme] = useTheme();
  const [rack, setRack] = useState(loadRack);
  const [rackOpen, setRackOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const svgRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(RACK_KEY, JSON.stringify(rack));
    } catch {
      // Storage can be unavailable (private mode); the rack then lasts for this visit only.
    }
  }, [rack]);

  // Keep the URL in step with the design so a reload or a copied link restores it.
  useEffect(() => {
    const query = stateToQuery({ setup, presetId, side, mode });
    window.history.replaceState(null, '', `${window.location.pathname}?${query}`);
  }, [setup, presetId, side, mode]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const update = (patch, nextPreset = presetId) => setState({ setup: { ...setup, ...patch }, presetId: nextPreset });

  const selection = clampSelection(lineSelection, setup.line);

  const applyPreset = (id) => {
    setLineSelection(null);
    if (id === 'custom') {
      setState({ setup, presetId: 'custom' });
      return;
    }
    const preset = findById(LINE_PRESETS, id);
    if (!preset) return;
    setState({ setup: { ...setup, name: preset.name, line: structuredClone(preset.line) }, presetId: id });
  };

  // Back to the default reel, line and backing, to design the next setup. The preview view stays as is.
  const startNew = () => {
    if (hasUnsavedChanges(setup, rack) && !window.confirm(`Discard “${setup.name}”? It isn't saved to your rack.`)) return;
    setLineSelection(null);
    setState({ setup: structuredClone(DEFAULT_SETUP), presetId: LINE_PRESETS[0].id });
    setNotice('Started a new setup.');
  };

  const saveToRack = () => {
    setRack((r) => [...r, { ...structuredClone(setup), id: crypto.randomUUID() }]);
    setRackOpen(true);
    setNotice(`Saved “${setup.name}” to your rack.`);
  };

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Share link copied.');
    } catch {
      setNotice('Copy failed. The link is in the address bar.');
    }
  };

  return (
    // Side by side, the page fits the window: the reel takes whatever height the checks and rack
    // leave, and the rack list and options panel scroll inside their own boxes.
    <div className="wide:flex wide:h-dvh wide:flex-col">
      <header className={`flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card py-3.5 ${GUTTER}`}>
        <div className="flex min-w-0 items-center gap-3.5">
          <h1 className="font-heading text-[24px] leading-none font-bold tracking-[0.04em] whitespace-nowrap uppercase">Flyline Designer</h1>
          <Input
            aria-label="Setup name"
            className="min-h-0 w-[18ch] rounded-sm border-transparent bg-transparent px-1.5 py-1 text-muted-foreground hover:border-input hover:text-foreground focus:border-input focus:text-foreground dark:bg-transparent"
            value={setup.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <ThemeToggle value={themeChoice} onChange={setThemeChoice} />
          <Button onClick={startNew}>New setup</Button>
          <Button onClick={saveToRack}>Save to rack</Button>
          <Button onClick={copyLink}>Copy share link</Button>
          <Button onClick={() => exportSvg(svgRef.current, slug(setup.name))}>Export SVG</Button>
          <Button variant="primary" onClick={() => exportPng(svgRef.current, slug(setup.name))}>
            Export PNG
          </Button>
        </div>
      </header>
      <p className={`text-[14px] text-primary not-empty:pt-2 ${GUTTER}`} role="status" aria-live="polite">
        {notice}
      </p>

      <main className={`flex flex-wrap items-start gap-7 pt-6 pb-10 wide:min-h-0 wide:flex-1 wide:flex-nowrap wide:items-stretch wide:pb-6 ${GUTTER}`}>
        <section className="flex min-w-0 flex-[1_1_560px] flex-col gap-4 wide:min-h-0" aria-label="Preview">
          <div className="flex flex-col items-center gap-2 rounded-panel bg-stage p-4 text-stage-foreground wide:min-h-0 wide:flex-1">
            <div className="flex flex-wrap justify-end gap-2 self-stretch">
              <Segmented label="Reel side" options={SIDES} value={side} onChange={setSide} />
              <PreviewModeToggle value={mode} onChange={setMode} />
            </div>
            <div className="w-[min(100%,460px)] wide:flex wide:min-h-0 wide:w-full wide:flex-1 wide:justify-center">
              <ReelPreview
                setup={setup}
                mode={mode}
                side={side}
                background={STAGE[theme]}
                svgRef={svgRef}
                title={`${setup.name} preview`}
                className="wide:h-full wide:w-auto wide:max-w-full"
              />
            </div>
            <Checks setup={setup} />
          </div>
          <Rack
            setups={rack}
            open={rackOpen}
            onToggle={() => setRackOpen((o) => !o)}
            onLoad={(s) => {
              const { id, ...rest } = structuredClone(s);
              setLineSelection(null);
              setState({ setup: rest, presetId: presetForLine(rest.line) });
            }}
            onRemove={(id) => setRack((r) => r.filter((s) => s.id !== id))}
          />
        </section>

        <section className="min-w-0 flex-[1_1_380px] divide-y divide-border rounded-panel border border-border bg-card wide:overflow-y-auto" aria-label="Options">
          <ReelOptions reel={setup.reel} onChange={(reel) => update({ reel })} />
          <FlyLineOptions
            line={setup.line}
            backingColor={setup.backing.color}
            presetId={presetId}
            onPreset={applyPreset}
            onChange={(line) => update({ line }, 'custom')}
            onColorway={(cw) => update({ line: { ...setup.line, zones: structuredClone(cw.zones) } })}
            selection={selection}
            onSelect={setLineSelection}
          />
          <BackingOptions backing={setup.backing} onChange={(backing) => update({ backing })} />
        </section>
      </main>
    </div>
  );
}
