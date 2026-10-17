import { useEffect, useState } from 'react';
import { presetForLine } from '../data/catalog.js';
import { rackConflicts } from '../lib/checks.js';
import { loadEntries } from '../lib/rack.js';
import { fetchShare } from '../lib/shareApi.js';
import { stateToQuery } from '../lib/share.js';
import { useTheme } from '../lib/theme.js';
import Button from './Button.jsx';
import RackPage from './RackPage.jsx';

const GUTTER = 'px-[max(16px,2.5vw)]';

// Someone's rack from a view link (/r/<id>), view-only. Opening a setup starts a copy in the designer,
// which the viewer can save to their own rack; nothing here writes to the shared one.
export default function SharedRackPage({ shareId }) {
  useTheme();
  // null while loading, then { rack } or { error: 'missing' | 'failed' }.
  const [state, setState] = useState(null);

  useEffect(() => {
    let live = true;
    fetchShare(shareId).then(
      // Shared entries are checked like stored ones; any without an id get one for this page.
      ({ rack }) => live && setState({ rack: loadEntries(rack).map((s, i) => ({ ...s, id: s.id ?? `shared-${i}` })) }),
      (err) => live && setState({ error: err.status === 404 ? 'missing' : 'failed' }),
    );
    return () => {
      live = false;
    };
  }, [shareId]);

  const openCopy = ({ id, ...setup }) => {
    window.location.assign(`/?${stateToQuery({ setup, presetId: presetForLine(setup.line), side: 'drag', mode: 'reel' })}`);
  };

  const message = (text) => <p className={`pt-6 text-[14px] text-muted-foreground ${GUTTER}`}>{text}</p>;

  return (
    <div>
      <header className={`flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card py-3.5 ${GUTTER}`}>
        <h1 className="font-heading text-[24px] leading-none font-bold tracking-[0.04em] whitespace-nowrap uppercase">
          <a href="/">Flyline Designer</a>
        </h1>
        <Button onClick={() => window.location.assign('/')}>Design your own</Button>
      </header>
      {state === null
        ? message('Loading the rack…')
        : state.error === 'missing'
          ? message('This link doesn’t work any more. The owner may have stopped sharing it or made a new link.')
          : state.error
            ? message('Couldn’t load this rack. Try again in a minute.')
            : <RackPage setups={state.rack} conflicts={rackConflicts(state.rack)} onLoad={openCopy} readOnly title="Shared rack" />}
    </div>
  );
}
