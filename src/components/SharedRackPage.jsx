import { useEffect, useState } from 'react';
import { presetForLine } from '../data/catalog.js';
import { rackConflicts } from '../lib/checks.js';
import { loadEntries } from '../lib/rack.js';
import { fetchShare } from '../lib/shareApi.js';
import { stateToQuery } from '../lib/share.js';
import { FIXED_HEADER, HEADER_SPACER, useFixedHeader } from '../lib/fixedHeader.js';
import { useTheme } from '../lib/theme.js';
import Button from './Button.jsx';
import RackPage from './RackPage.jsx';
import SetupDrawer from './SetupDrawer.jsx';

const GUTTER = 'px-[max(16px,2.5vw)]';

// Someone's rack from a view link (/r/<id>), view-only. A card opens its details in a drawer, from which
// the viewer can start a copy in the designer to save to their own rack; nothing here writes to the shared one.
export default function SharedRackPage({ shareId }) {
  const [, , theme] = useTheme();
  const headerRef = useFixedHeader();
  // The setup whose details are open in the drawer.
  const [selected, setSelected] = useState(null);
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
      <header ref={headerRef} className={`${FIXED_HEADER} flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card py-3.5 ${GUTTER}`}>
        <h1 className="font-heading text-[clamp(20px,6.5vw,24px)] leading-none font-bold tracking-[0.04em] whitespace-nowrap uppercase">
          <a href="/">Flyline Designer</a>
        </h1>
        <Button onClick={() => window.location.assign('/')}>Design your own</Button>
      </header>
      <div className={HEADER_SPACER} aria-hidden="true" />
      {state === null
        ? message('Loading the rack…')
        : state.error === 'missing'
          ? message('This link doesn’t work any more. The owner may have stopped sharing it or made a new link.')
          : state.error
            ? message('Couldn’t load this rack. Try again in a minute.')
            : <RackPage setups={state.rack} conflicts={rackConflicts(state.rack)} onLoad={setSelected} readOnly title="Shared rack" />}
      <SetupDrawer setup={selected} theme={theme} onOpenCopy={openCopy} onClose={() => setSelected(null)} />
    </div>
  );
}
