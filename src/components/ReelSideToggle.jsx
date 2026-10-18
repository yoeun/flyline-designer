import { SIDES } from '../lib/reelFrames.js';
import Icon from './Icon.jsx';
import Segmented from './Segmented.jsx';

// Custom icons, as Material Symbols has no reel. The drag side has its big knurled knob in the middle; the spool
// side a small hub and the handle out on the rim, which breaks around it.
const P = (r, deg) => [12 + r * Math.cos((deg * Math.PI) / 180), 12 + r * Math.sin((deg * Math.PI) / 180)].map((v) => v.toFixed(2)).join(' ');
const KNOB = `M${Array.from({ length: 20 }, (_, i) => P(i % 2 ? 4.5 : 5.4, i * 18)).join('L')}Z`;
// The handle sits on the rim at 45°; the rim stops 30° either side of it.
const RIM_GAPPED = `M${P(9.5, -15)}A9.5 9.5 0 1 1 ${P(9.5, -75)}`;
const icon = (children) => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    {children}
  </svg>
);
const ICONS = {
  drag: icon(
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d={KNOB} fill="currentColor" stroke="none" />
    </>,
  ),
  spool: icon(
    <>
      <path d={RIM_GAPPED} />
      <g fill="currentColor" stroke="none">
        <circle cx="12" cy="12" r="1.8" />
        <circle cx={12 + 9.5 * Math.SQRT1_2} cy={12 - 9.5 * Math.SQRT1_2} r="3" />
      </g>
    </>,
  ),
};
const OPTIONS = SIDES.map(([id, label]) => [id, `${label} side`, ICONS[id]]);

// Drag/Spool, and beside it a button that spins the spool from either side, like clicking its handle does.
export default function ReelSideToggle({ side, onChange, onSpin }) {
  return (
    <div className="flex gap-2">
      <Segmented label="Reel side" options={OPTIONS} value={side} onChange={onChange} />
      <button
        type="button"
        onClick={onSpin}
        aria-label="Spin the spool"
        title="Spin the spool"
        className="grid size-[42px] pointer-coarse:size-[52px] flex-none cursor-pointer place-items-center rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Icon name="rotate_left" className="text-[20px]" />
      </button>
    </div>
  );
}
