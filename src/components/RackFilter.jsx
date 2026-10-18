import { cn } from '@/lib/utils';
import { STYLES } from '../lib/rack.js';
import Chips from './Chips.jsx';
import FilterSheet from './FilterSheet.jsx';
import Icon from './Icon.jsx';
import { Input } from './Input.jsx';

export const NO_FILTER = { query: '', weight: null, style: null };

// The filter as it applies to this rack: a weight whose last setup was removed falls back to All.
export function rackFilter(filter, weights) {
  return { ...filter, weight: weights.includes(filter.weight) ? filter.weight : null };
}

export const isFiltered = (filter) => Boolean(filter.query.trim()) || filter.weight !== null || filter.style !== null;

// The rack's search box and Filter button (rod weight and style), shared by the designer's rack strip and
// the rack page so a search carries from one to the other. count is how many setups the filter leaves.
export default function RackFilter({ filter, weights, count, onChange, className }) {
  const { weight, style } = filter;
  const set = (change) => onChange({ ...filter, ...change });
  // What the Filter button shows once a filter is on, e.g. "5 wt · Dry".
  const active = [weight !== null && `${weight} wt`, STYLES.find((s) => s.id === style)?.name].filter(Boolean).join(' · ');

  return (
    <div className={cn('flex min-w-0 items-center gap-2', className)}>
      <label className="relative flex min-w-0 flex-[0_1_260px] items-center">
        <Icon name="search" className="pointer-events-none absolute left-2.5 text-muted-foreground" />
        <Input type="search" aria-label="Search rack" placeholder="Search rack" value={filter.query} onChange={(e) => set({ query: e.target.value })} className="w-full pl-9" />
      </label>
      <FilterSheet
        always
        active={active}
        onClear={() => set({ weight: null, style: null })}
        doneLabel={`Show ${count} ${count === 1 ? 'setup' : 'setups'}`}
        className="flex-none"
      >
        <Chips label="Rod weight" value={weight} onChange={(w) => set({ weight: w })} options={[{ value: null, label: 'All' }, ...weights.map((w) => ({ value: w, label: `${w} wt` }))]} />
        <Chips label="Style" value={style} onChange={(s) => set({ style: s })} options={[{ value: null, label: 'All' }, ...STYLES.map((s) => ({ value: s.id, label: s.name }))]} />
      </FilterSheet>
    </div>
  );
}
