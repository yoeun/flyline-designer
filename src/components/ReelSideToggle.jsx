import { SIDES } from '../lib/reelFrames.js';
import Icon from './Icon.jsx';
import Segmented from './Segmented.jsx';

// Drag/Spool, and beside it a button that spins the spool from either side, like clicking its handle does.
export default function ReelSideToggle({ side, onChange, onSpin }) {
  return (
    <div className="flex gap-2">
      <Segmented label="Reel side" options={SIDES} value={side} onChange={onChange} />
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
