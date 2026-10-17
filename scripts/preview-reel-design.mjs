// Renders a reel design's drag and spool sides to a PNG, for checking a drawing against the maker's photos:
//   node scripts/preview-reel-design.mjs <design> [--color #hex] [--accent #hex] [--trim #hex] [--out file.png] [photo ...]
// Photos (jpg/png/webp) are drawn to the right of the two sides at the same height. Draws the SVGs in
// src/assets/reels, so run `npm run reels` first. Needs Google Chrome (headless) for the screenshot.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ASSETS = new URL('../src/assets/reels/', import.meta.url);
const H = 420;

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i < 0 ? fallback : args.splice(i, 2)[1];
};
const color = opt('--color', '#8a8f94');
const accent = opt('--accent', null);
const trim = opt('--trim', null);
const out = resolve(opt('--out', `${args[0]}-preview.png`));
const [design, ...photos] = args;
if (!design) throw new Error('usage: preview-reel-design.mjs <design> [--color #hex] [--accent #hex] [--trim #hex] [--out file.png] [photo ...]');

// A side as ReelPreview shows it, roughly: the frame over a wound line that fills the spool.
const side = (name) => {
  const svg = readFileSync(new URL(`${design}-${name}.svg`, ASSETS), 'utf8');
  // Ids get the side as a suffix: both sides share one page.
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/(id="|url\(#|href="#)([\w-]+)/g, `$1$2-${name}`);
  return `<figure><svg viewBox="-215 -250 430 470" height="${H}" color="${color}" style="${accent ? `--reel-accent:${accent};` : ''}${trim ? `--reel-trim:${trim}` : ''}"><rect x="-215" y="-250" width="430" height="470" fill="#e9ebe6"/><circle r="182" fill="#5d7f4f"/><circle r="90" fill="#e9ebe6"/>${inner}</svg><figcaption>${design} · ${name}</figcaption></figure>`;
};
const photo = (file) => `<figure><img src="${pathToFileURL(resolve(file))}" height="${H}"><figcaption>${file.split('/').pop()}</figcaption></figure>`;

const width = 2 * Math.round((H * 430) / 470) + photos.length * H + 40 * (2 + photos.length);
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:16px;display:flex;gap:16px;background:#fff;font:13px system-ui}figure{margin:0}img{object-fit:contain;width:${H}px;background:#fff}</style>${side('drag')}${side('spool')}${photos.map(photo).join('')}`;
const dir = mkdtempSync(join(tmpdir(), 'reel-preview-'));
const page = join(dir, 'page.html');
writeFileSync(page, html);
// Its own profile, so several previews can run at once.
execFileSync(CHROME, ['--headless=new', `--user-data-dir=${join(dir, 'profile')}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--window-size=${width},${H + 70}`, `--screenshot=${out}`, pathToFileURL(page).href], { stdio: 'ignore' });
console.log(out);
