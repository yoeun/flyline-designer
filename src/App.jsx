import { useEffect, useRef, useState } from 'react';
import Checks from './components/Checks.jsx';
import { BackingOptions, FlyLineOptions, ReelOptions } from './components/Options.jsx';
import PreviewModeToggle from './components/PreviewModeToggle.jsx';
import Rack from './components/Rack.jsx';
import ReelPreview from './components/ReelPreview.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import { DEFAULT_SETUP, LINE_PRESETS, findById } from './data/catalog.js';
import { exportPng, exportSvg } from './lib/export.js';
import { clampSelection } from './lib/lineEdit.js';
import { SIDES } from './lib/reelFrames.js';
import { decodeSetup, encodeSetup } from './lib/share.js';
import { STAGE, useTheme } from './lib/theme.js';

const RACK_KEY = 'flyline-designer:rack';

function loadRack() {
  try {
    return JSON.parse(localStorage.getItem(RACK_KEY)) ?? [];
  } catch {
    return [];
  }
}

function initialSetup() {
  const fromHash = decodeSetup(window.location.hash.slice(1));
  return fromHash ? { setup: fromHash, presetId: 'custom' } : { setup: structuredClone(DEFAULT_SETUP), presetId: LINE_PRESETS[0].id };
}

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'flyline';

export default function App() {
  const [{ setup, presetId }, setState] = useState(initialSetup);
  const [mode, setMode] = useState('reel');
  const [side, setSide] = useState('drag');
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
    setState({ setup: { ...setup, name: preset.name.replace(' (example)', ''), line: structuredClone(preset.line) }, presetId: id });
  };

  const saveToRack = () => {
    setRack((r) => [...r, { ...structuredClone(setup), id: crypto.randomUUID() }]);
    setRackOpen(true);
    setNotice(`Saved “${setup.name}” to your rack.`);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${encodeSetup(setup)}`;
    window.history.replaceState(null, '', url);
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Share link copied.');
    } catch {
      setNotice('Copy failed. The link is in the address bar.');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__title">
          <h1>Flyline Designer</h1>
          <label className="setup-name">
            <span className="visually-hidden">Setup name</span>
            <input value={setup.name} onChange={(e) => update({ name: e.target.value })} />
          </label>
        </div>
        <div className="app-header__actions">
          <ThemeToggle value={themeChoice} onChange={setThemeChoice} />
          <button type="button" className="button" onClick={saveToRack}>
            Save to rack
          </button>
          <button type="button" className="button" onClick={copyLink}>
            Copy share link
          </button>
          <button type="button" className="button" onClick={() => exportSvg(svgRef.current, slug(setup.name))}>
            Export SVG
          </button>
          <button type="button" className="button button--primary" onClick={() => exportPng(svgRef.current, slug(setup.name))}>
            Export PNG
          </button>
        </div>
      </header>
      <p className="notice" role="status" aria-live="polite">
        {notice}
      </p>

      <main className="layout">
        <section className="preview-column" aria-label="Preview">
          <div className="stage">
            <div className="stage__controls">
              <div className="segmented" role="group" aria-label="Reel side">
                {SIDES.map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={side === id} onClick={() => setSide(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <PreviewModeToggle value={mode} onChange={setMode} />
            </div>
            <div className="stage__reel">
              <ReelPreview setup={setup} mode={mode} side={side} background={STAGE[theme]} svgRef={svgRef} title={`${setup.name} preview`} />
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
              setState({ setup: rest, presetId: 'custom' });
            }}
            onRemove={(id) => setRack((r) => r.filter((s) => s.id !== id))}
          />
        </section>

        <section className="options-column" aria-label="Options">
          <ReelOptions reel={setup.reel} onChange={(reel) => update({ reel })} />
          <FlyLineOptions
            line={setup.line}
            backingColor={setup.backing.color}
            presetId={presetId}
            onPreset={applyPreset}
            onChange={(line) => update({ line }, 'custom')}
            selection={selection}
            onSelect={setLineSelection}
          />
          <BackingOptions backing={setup.backing} onChange={(backing) => update({ backing })} />
        </section>
      </main>
    </div>
  );
}
