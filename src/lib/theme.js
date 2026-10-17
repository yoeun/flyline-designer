import { useEffect, useState } from 'react';

const THEME_KEY = 'flyline-designer:theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

export const THEMES = [
  ['system', 'System'],
  ['light', 'Light'],
  ['dark', 'Dark'],
];

// Preview background per theme. Not pure black, so black reels and lines still show.
export const STAGE = { light: '#e9ebe6', dark: '#111513' };

export const parseTheme = (stored) => (THEMES.some(([id]) => id === stored) ? stored : 'system');

export const resolveTheme = (choice, systemDark) => (choice === 'system' ? (systemDark ? 'dark' : 'light') : choice);

function loadTheme() {
  try {
    return parseTheme(localStorage.getItem(THEME_KEY));
  } catch {
    return 'system';
  }
}

// Returns [choice, setChoice, resolved], where resolved is 'light' or 'dark'.
export function useTheme() {
  const [choice, setChoice] = useState(loadTheme);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(DARK_QUERY).matches);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = (e) => setSystemDark(e.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const resolved = resolveTheme(choice, systemDark);

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    try {
      localStorage.setItem(THEME_KEY, choice);
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this visit only.
    }
  }, [choice, resolved]);

  return [choice, setChoice, resolved];
}
