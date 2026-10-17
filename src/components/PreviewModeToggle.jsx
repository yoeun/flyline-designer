import { ReelIconPaths } from './ReelIcon.jsx';
import Segmented from './Segmented.jsx';

// Custom icons: Material Symbols has nothing for these reel-specific modes.

const MODES = [
  [
    'reel',
    'Reel',
    <ReelIconPaths />,
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
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
    {icon}
  </svg>,
]);

export default function PreviewModeToggle({ value, onChange }) {
  return <Segmented label="Preview mode" options={OPTIONS} value={value} onChange={onChange} />;
}
