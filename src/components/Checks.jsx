import { hexOf, nameOf } from '../data/catalog.js';
import { backingContrast } from '../lib/checks.js';
import { spoolLayout } from '../lib/geometry.js';

const R = 10;

// Pie slice from 12 o'clock, clockwise; a full circle once fill reaches 100%.
function pie(fraction) {
  if (fraction >= 1) return <circle cx="12" cy="12" r={R} />;
  const a = 2 * Math.PI * Math.max(0, fraction);
  const x = 12 + R * Math.sin(a);
  const y = 12 - R * Math.cos(a);
  return <path d={`M12 12V${12 - R}A${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}Z`} />;
}

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

  return (
    <div className="checks" role="status">
      <div className={`check${layout.fits ? '' : ' is-bad'}`} title={fillText}>
        <svg className="check__icon" viewBox="0 0 24 24" aria-hidden="true">
          <g className="check__fill">{pie(layout.fill)}</g>
          <circle className="check__ring" cx="12" cy="12" r={R} />
        </svg>
        <span className="check__text">
          <strong className="mono">{pct}%</strong>
          <span>{layout.fits ? 'Spool fill' : "Won't fit"}</span>
        </span>
        <span className="visually-hidden">Spool fill {pct}%. {fillText}</span>
      </div>
      <div className={`check check--end${contrast.similar ? ' is-warn' : ''}`} title={contrastText}>
        <span className="check__text">
          <strong className="mono">ΔE {Math.round(contrast.value)}</strong>
          <span>{contrast.similar ? 'Look alike' : 'Backing vs. line'}</span>
        </span>
        <svg className="check__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d={`M12 ${12 - R}A${R} ${R} 0 0 0 12 ${12 + R}Z`} fill={hexOf(contrast.backing)} />
          <path d={`M12 ${12 - R}A${R} ${R} 0 0 1 12 ${12 + R}Z`} fill={hexOf(contrast.run)} />
          <circle className="check__ring" cx="12" cy="12" r={R} />
        </svg>
        <span className="visually-hidden">
          Backing vs. running line, delta E {Math.round(contrast.value)}. {contrastText}
        </span>
      </div>
    </div>
  );
}
