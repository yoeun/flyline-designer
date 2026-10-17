import Segmented from './Segmented.jsx';

// Custom icons: Material Symbols has nothing for these reel-specific modes.
const SPOKES = [0, 60, 120, 180, 240, 300].map((deg) => (deg * Math.PI) / 180);

const MODES = [
  [
    'reel',
    'Reel',
    <>
      <circle cx="12" cy="12" r="9.5" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.6" fill="currentColor" stroke="none" />
      {SPOKES.map((a) => (
        <line key={a} x1={12 + 4.6 * Math.cos(a)} y1={12 + 4.6 * Math.sin(a)} x2={12 + 9.5 * Math.cos(a)} y2={12 + 9.5 * Math.sin(a)} strokeWidth="1.8" />
      ))}
    </>,
  ],
  [
    'see-through',
    'See-through',
    <>
      <circle cx="12" cy="12" r="10" strokeWidth="1.4" strokeDasharray="2.2 2" />
      <circle cx="12" cy="12" r="5.6" strokeWidth="3.6" />
    </>,
  ],
  ['line-only', 'Line only', <circle cx="12" cy="12" r="6.5" strokeWidth="4" />],
];

const OPTIONS = MODES.map(([id, label, icon]) => [
  id,
  label,
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
    {icon}
  </svg>,
]);

export default function PreviewModeToggle({ value, onChange }) {
  return <Segmented label="Preview mode" options={OPTIONS} value={value} onChange={onChange} />;
}
