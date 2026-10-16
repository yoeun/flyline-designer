import { useId } from 'react';
import { hexOf } from '../data/catalog.js';
import { lineDiameters, totalLength, zoneRanges } from '../lib/geometry.js';

const W = 900;
const X0 = 30; // backing stub
const TIP = 890;
const MID = 55;
const MAX_HALF = 14;

export function formatFeet(ft) {
  const whole = Math.floor(ft);
  const inches = Math.round((ft - whole) * 12);
  return inches ? `${whole}′${inches}″` : `${whole}′`;
}

// The fly line laid out straight: running line on the left, tip on the right.
export default function LineDiagram({ setup }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { line } = setup;
  const total = totalLength(line);
  const d = lineDiameters(line);
  const half = (dia) => Math.max(2, (dia / d.body) * MAX_HALF);
  const x = (fromTip) => TIP - (fromTip / total) * (TIP - X0);
  const t = line.taper;

  const stations = [
    [0, d.tip],
    [t.front, d.body],
    [t.front + t.body, d.body],
    [t.front + t.body + t.back, d.running],
    [total, d.running],
  ];
  const top = stations.map(([f, dia]) => `${x(f).toFixed(1)},${(MID - half(dia)).toFixed(1)}`);
  const bottom = [...stations].reverse().map(([f, dia]) => `${x(f).toFixed(1)},${(MID + half(dia)).toFixed(1)}`);
  const points = [...top, ...bottom].join(' ');

  const sections = [
    { label: 'FRONT TAPER', from: 0, to: t.front, anchor: 'end' },
    { label: 'BODY', from: t.front, to: t.front + t.body },
    { label: 'BACK TAPER', from: t.front + t.body, to: t.front + t.body + t.back },
    { label: 'RUNNING LINE', from: t.front + t.body + t.back, to: total, anchor: 'start' },
  ];
  const boundaries = [0, t.front, t.front + t.body, t.front + t.body + t.back, total];

  return (
    <svg viewBox={`0 0 ${W} 112`} className="line-diagram" role="img" aria-label="Fly line laid out straight, colored by zone">
      <defs>
        <clipPath id={`profile-${uid}`}>
          <polygon points={points} />
        </clipPath>
      </defs>
      <rect x="0" y={MID - 2} width={X0} height="4" fill={hexOf(setup.backing.color)} />
      <g clipPath={`url(#profile-${uid})`}>
        {zoneRanges(line).map((z) => (
          <rect key={z.index} x={x(z.end)} y="30" width={Math.max(0, x(z.start) - x(z.end))} height="50" fill={hexOf(z.color)} />
        ))}
      </g>
      <polygon points={points} fill="none" stroke="currentColor" strokeOpacity="0.25" />
      <ellipse cx={TIP + 5} cy={MID} rx="5" ry="4" fill="none" stroke={hexOf(line.zones[0].color)} strokeWidth="2" />
      <g stroke="currentColor" strokeOpacity="0.45" strokeDasharray="2 3">
        {boundaries.map((b) => (
          <line key={b} x1={x(b)} x2={x(b)} y1="22" y2="80" />
        ))}
      </g>
      <g className="line-diagram__labels">
        {sections.map((sec) => {
          const cx = sec.anchor === 'end' ? x(sec.from) - 4 : sec.anchor === 'start' ? x(sec.to) + 4 : (x(sec.from) + x(sec.to)) / 2;
          return (
            <text key={sec.label} x={cx} y="17" textAnchor={sec.anchor ?? 'middle'}>
              {sec.label}
            </text>
          );
        })}
      </g>
      <g className="line-diagram__lengths">
        {sections.map((sec) => (
          <text key={sec.label} x={(x(sec.from) + x(sec.to)) / 2} y="100" textAnchor="middle">
            {formatFeet(sec.to - sec.from)}
          </text>
        ))}
      </g>
    </svg>
  );
}
