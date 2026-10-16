import { hexOf, nameOf } from '../data/catalog.js';
import { backingContrast } from '../lib/checks.js';
import { spoolLayout } from '../lib/geometry.js';

export default function Checks({ setup }) {
  const layout = spoolLayout(setup);
  const contrast = backingContrast(setup);
  const pct = Math.round(layout.fill * 100);
  const extra = layout.maxBackingYards - setup.backing.yards;

  return (
    <div className="checks">
      <div className={`check${layout.fits ? '' : ' is-bad'}`}>
        <div className="check__head">
          <span>Spool fill</span>
          <span className="mono">{pct}%</span>
        </div>
        <div className="meter">
          <div className="meter__bar" style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <p>
          {layout.fits
            ? `Fits. Room for about ${extra} more yd of ${setup.backing.pounds} lb backing.`
            : `Won't fit. This line takes at most ${layout.maxBackingYards} yd of ${setup.backing.pounds} lb backing.`}
        </p>
      </div>
      <div className={`check${contrast.similar ? ' is-warn' : ''}`} role="status">
        <div className="check__head">
          <span>Backing vs. running line</span>
          <span className="mono">ΔE {Math.round(contrast.value)}</span>
        </div>
        <div className="pair">
          <span className="dot dot--lg" style={{ background: hexOf(contrast.backing) }} />
          <span className="dot dot--lg" style={{ background: hexOf(contrast.run) }} />
        </div>
        <p>
          {contrast.similar
            ? `${nameOf(contrast.backing)} backing and ${nameOf(contrast.run).toLowerCase()} running line look alike. The boundary will be hard to see.`
            : 'Clear contrast. You will see where the backing ends.'}
        </p>
      </div>
    </div>
  );
}
