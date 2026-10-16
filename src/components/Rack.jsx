import { LINE_TYPES, findById } from '../data/catalog.js';
import { rackConflicts } from '../lib/checks.js';
import ReelPreview from './ReelPreview.jsx';

export default function Rack({ setups, open, onToggle, onLoad, onRemove }) {
  const conflicts = rackConflicts(setups);
  const flagged = new Set(conflicts.flatMap((c) => c.ids));

  return (
    <section className="rack">
      <button type="button" className="rack__bar" aria-expanded={open} onClick={onToggle}>
        <span className="rack__summary">
          <span className="rack__title">Your rack</span>
          <span className="muted">
            {setups.length} {setups.length === 1 ? 'setup' : 'setups'}
          </span>
          {conflicts.length > 0 && (
            <span className="warn-text">
              {conflicts.length} color {conflicts.length === 1 ? 'conflict' : 'conflicts'}
            </span>
          )}
        </span>
        <span className="rack__toggle">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <div className="rack__body">
          {setups.length === 0 ? (
            <p className="muted">Nothing saved yet. Use Save to rack to keep a setup here and compare backing colors across your reels.</p>
          ) : (
            <ul className="rack__grid">
              {setups.map((s) => (
                <li key={s.id} className={`rack__item${flagged.has(s.id) ? ' is-flagged' : ''}`}>
                  <button type="button" className="rack__load" onClick={() => onLoad(s)} title={`Load ${s.name}`}>
                    <ReelPreview setup={s} mode="reel" background="transparent" title={s.name} />
                    <strong>{s.name}</strong>
                    <span className="muted">{findById(LINE_TYPES, s.line.type)?.name}</span>
                  </button>
                  <button type="button" className="rack__remove" aria-label={`Remove ${s.name}`} onClick={() => onRemove(s.id)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          {conflicts.length > 0 && (
            <ul className="conflicts">
              {conflicts.map((c) => (
                <li key={c.title} className="check is-warn">
                  <strong>{c.title}</strong>
                  <p>{c.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
