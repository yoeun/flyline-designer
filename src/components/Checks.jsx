import { cn } from '@/lib/utils';
import { hexOf, nameOf } from '../data/catalog.js';
import { backingContrast } from '../lib/checks.js';
import { spoolLayout } from '../lib/geometry.js';

const R = 10;

const RING = 8.5;

const CHECK = 'flex items-center gap-2.5';
const ICON = 'size-8 flex-none';
const TEXT = 'flex flex-col leading-[1.2]';
// The number, then its caption; a failing check colors both.
const VALUE = 'font-mono text-[15px] tabular-nums';
const CAPTION = 'text-[12px]';

// Compact readouts that sit at the bottom of the preview stage. The full sentence is the tooltip
// and is read out to screen readers.
export default function Checks({ setup }) {
  const layout = spoolLayout(setup);
  const contrast = backingContrast(setup);
  const pct = Math.round(layout.fill * 100);
  const extra = layout.maxBackingYards - setup.backing.yards;
  const fillText = layout.fits
    ? `Fits. Room for about ${extra} more yd of ${setup.backing.pounds} lb backing.`
    : `Won't fit. This line takes at most ${layout.maxBackingYards} yd of ${setup.backing.pounds} lb backing.`;
  const contrastText = contrast.similar
    ? `${nameOf(contrast.backing)} backing and ${nameOf(contrast.run).toLowerCase()} running line look alike. The boundary will be hard to see.`
    : 'Clear contrast. You will see where the backing ends.';

  const fillTone = layout.fits ? null : 'text-destructive';
  const contrastTone = contrast.similar ? 'text-warn' : null;

  return (
    <div className="flex items-center justify-between gap-3 self-stretch" role="status">
      <div className={CHECK} title={fillText}>
        <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
          <circle className="fill-none stroke-current stroke-4 opacity-18" cx="12" cy="12" r={RING} />
          {/* Starts at 12 o'clock and runs clockwise; pathLength makes the dash a percentage. */}
          <circle
            className={cn('fill-none stroke-4', layout.fits ? 'stroke-primary' : 'stroke-destructive')}
            cx="12"
            cy="12"
            r={RING}
            pathLength="100"
            strokeDasharray={pct < 100 ? `${pct} 100` : undefined}
            transform="rotate(-90 12 12)"
          />
        </svg>
        <span className={TEXT}>
          <strong className={cn(VALUE, fillTone ?? 'text-foreground')}>{pct}%</strong>
          <span className={cn(CAPTION, fillTone)}>{layout.fits ? 'Spool fill' : "Won't fit"}</span>
        </span>
        <span className="sr-only">Spool fill {pct}%. {fillText}</span>
      </div>
      <div className={CHECK} title={contrastText}>
        <span className={cn(TEXT, 'text-right')}>
          <strong className={cn(VALUE, contrastTone ?? 'text-foreground')}>ΔE {Math.round(contrast.value)}</strong>
          <span className={cn(CAPTION, contrastTone)}>{contrast.similar ? 'Look alike' : 'Contrast'}</span>
        </span>
        <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
          <path d={`M12 ${12 - R}A${R} ${R} 0 0 0 12 ${12 + R}Z`} fill={hexOf(contrast.backing)} />
          <path d={`M12 ${12 - R}A${R} ${R} 0 0 1 12 ${12 + R}Z`} fill={hexOf(contrast.run)} />
          <circle className="fill-none stroke-current stroke-[1.5]" cx="12" cy="12" r={R} />
        </svg>
        <span className="sr-only">
          Contrast between backing and running line, delta E {Math.round(contrast.value)}. {contrastText}
        </span>
      </div>
    </div>
  );
}
