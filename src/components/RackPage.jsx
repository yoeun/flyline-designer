import { useState } from 'react';
import { conflictsFor } from '../lib/checks.js';
import { STYLES } from '../lib/rack.js';
import { filterRack, rackWeights } from '../lib/rackView.js';
import Button from './Button.jsx';
import Chips from './Chips.jsx';
import Icon from './Icon.jsx';
import RackCard from './RackCard.jsx';

// The whole rack, filtered by line weight and style.
export default function RackPage({ setups, currentId, conflicts, showBack, onBack, onNew, onLoad, onEditDetails, onRemove }) {
  const [pickedWeight, setWeight] = useState(null);
  const [style, setStyle] = useState(null);
  const weights = rackWeights(setups);
  // A weight whose last setup was removed falls back to All.
  const weight = weights.includes(pickedWeight) ? pickedWeight : null;
  const { exact, near } = filterRack(setups, { weight, style });

  const grid = (list, label) => (
    <ul className="flex flex-wrap gap-3" aria-label={label}>
      {list.map((s) => (
        <li key={s.id} className="flex">
          <RackCard setup={s} current={s.id === currentId} conflicts={conflictsFor(s.id, conflicts, setups)} currentStyle="label" showNotes size="lg" onLoad={onLoad} onEditDetails={onEditDetails} onRemove={onRemove} />
        </li>
      ))}
    </ul>
  );

  const heading = 'font-heading text-[15px] font-bold tracking-[0.06em] uppercase';

  return (
    <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Rack">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {showBack && (
            <button type="button" onClick={onBack} className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg pr-2 text-[14px] font-semibold text-primary hover:bg-accent">
              <Icon name="arrow_back" />
              Back to designer
            </button>
          )}
          <h2 className="font-heading text-[20px] font-bold tracking-[0.06em] uppercase">Your rack</h2>
          <span className="text-[14px] text-muted-foreground">
            {setups.length} {setups.length === 1 ? 'setup' : 'setups'}
          </span>
        </div>
        <Button onClick={onNew}>New</Button>
      </div>

      {setups.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">Nothing saved yet. Design a setup and save it to keep it here.</p>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            <Chips label="Rod weight" value={weight} onChange={setWeight} options={[{ value: null, label: 'All' }, ...weights.map((w) => ({ value: w, label: `${w} wt` }))]} />
            <Chips label="Style" value={style} onChange={setStyle} options={[{ value: null, label: 'All' }, ...STYLES.map((s) => ({ value: s.id, label: s.name }))]} />
          </div>
          {exact.length === 0 && near.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">No setups match these filters.</p>
          ) : weight === null ? (
            grid(exact, 'Saved setups')
          ) : (
            <>
              {exact.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className={heading}>{weight} wt</h3>
                  {grid(exact, `${weight} wt setups`)}
                </section>
              )}
              {near.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className={heading}>Also fits a {weight} wt</h3>
                  {grid(near, `Also fits a ${weight} wt`)}
                </section>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
