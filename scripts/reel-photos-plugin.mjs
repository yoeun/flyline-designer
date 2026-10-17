// Vite plugin for `import PHOTOS from 'reel-photos'`: the maker reel photos in data/reel-photos/<maker>/,
// for comparing drawings with the real reels on the Reels page. The photos are gitignored reference
// material, not ours to ship, so only the dev server lists and serves them; a build gets an empty list.
// A worktree has no photos of its own, so they're read from the main checkout's data/reel-photos.
import { execSync } from 'node:child_process';
import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';

const ID = 'reel-photos';
const RESOLVED = `\0${ID}`;
const URL_BASE = '/@reel-photos/';
const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };

function photosDir(root) {
  try {
    const common = execSync('git rev-parse --path-format=absolute --git-common-dir', { cwd: root, encoding: 'utf8' }).trim();
    const main = join(dirname(common), 'data', 'reel-photos');
    if (existsSync(main)) return main;
  } catch {
    // Not a git checkout: fall back to this one's folder.
  }
  return join(root, 'data', 'reel-photos');
}

// Every photo as { maker, file, url }, makers and files A–Z.
function listPhotos(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((maker) => statSync(join(dir, maker)).isDirectory())
    .sort()
    .flatMap((maker) =>
      readdirSync(join(dir, maker))
        .filter((file) => TYPES[extname(file).toLowerCase()])
        .sort()
        .map((file) => ({ maker, file, url: `${URL_BASE}${maker}/${file}` })),
    );
}

export default function reelPhotos() {
  let dir;
  let serving = false;
  return {
    name: 'reel-photos',
    configResolved(config) {
      dir = photosDir(config.root);
      serving = config.command === 'serve' && !config.isProduction;
    },
    resolveId: (id) => (id === ID ? RESOLVED : null),
    load(id) {
      if (id !== RESOLVED) return null;
      return `export default ${JSON.stringify(serving ? listPhotos(dir) : [])};`;
    },
    configureServer(server) {
      server.middlewares.use(URL_BASE, (req, res, next) => {
        const path = resolve(dir, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, ''));
        const type = TYPES[extname(path).toLowerCase()];
        if (!path.startsWith(dir + sep) || !type || !existsSync(path)) return next();
        res.setHeader('Content-Type', type);
        createReadStream(path).pipe(res);
      });
    },
  };
}
