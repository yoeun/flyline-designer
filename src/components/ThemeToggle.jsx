import { THEMES } from '../lib/theme.js';

const ICONS = { system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' };

export default function ThemeToggle({ value, onChange }) {
  return (
    <div className="segmented segmented--icons" role="group" aria-label="Theme">
      {THEMES.map(([id, label]) => (
        <button key={id} type="button" aria-pressed={value === id} aria-label={label} title={label} onClick={() => onChange(id)}>
          <span className="icon" aria-hidden="true">
            {ICONS[id]}
          </span>
        </button>
      ))}
    </div>
  );
}
