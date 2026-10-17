import { THEMES } from '../lib/theme.js';
import Segmented from './Segmented.jsx';

const ICONS = { system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' };

const OPTIONS = THEMES.map(([id, label]) => [
  id,
  label,
  <span className="icon" aria-hidden="true">
    {ICONS[id]}
  </span>,
]);

export default function ThemeToggle({ value, onChange }) {
  return <Segmented label="Theme" options={OPTIONS} value={value} onChange={onChange} />;
}
