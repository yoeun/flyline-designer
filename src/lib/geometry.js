import { BACKING_DIAMETER, LINE_PRESETS, LINE_TYPES, REELS, findById } from '../data/catalog.js';

// Slack in how line packs onto a spool compared with a perfect square stack.
export const PACK = 1.1;
const STEP_FT = 0.25;
// Arbor ÷ spool diameter when a reel has neither an arbor size nor a rated capacity.
export const ARBOR_RATIO = 0.57;
const MIN_ARBOR_RATIO = 0.3;

export function lineDiameters(line) {
  const type = findById(LINE_TYPES, line.type);
  const factor = type?.diameterFactor ?? 1;
  const runningFactor = type?.runningDiameterFactor ?? factor;
  const w = line.weight;
  return {
    tip: (0.026 + 0.001 * w) * factor,
    body: (0.036 + 0.004 * w) * factor,
    running: (0.026 + 0.0012 * w) * runningFactor,
  };
}

export const totalLength = (line) => {
  const t = line.taper;
  return t.front + t.body + t.back + t.running;
};

// Thickness profile as [distanceFromTipFt, diameterIn] points, linear between them.
export function lineProfile(line) {
  const t = line.taper;
  const d = lineDiameters(line);
  return [
    [0, d.tip],
    [t.front, d.body],
    [t.front + t.body, d.body],
    [t.front + t.body + t.back, d.running],
    [totalLength(line), d.running],
  ];
}

export function diameterAt(profile, x) {
  for (let i = 0; i < profile.length - 1; i++) {
    const [x0, d0] = profile[i];
    const [x1, d1] = profile[i + 1];
    if (x <= x1) return x1 === x0 ? d1 : d0 + ((x - x0) / (x1 - x0)) * (d1 - d0);
  }
  return profile[profile.length - 1][1];
}

// Zone extents in feet from the tip. The last zone always takes the rest of the line.
export function zoneRanges(line) {
  const total = totalLength(line);
  let start = 0;
  return line.zones.map((zone, i) => {
    const last = i === line.zones.length - 1;
    const length = last ? Math.max(0, total - start) : Math.min(Math.max(0, zone.length), Math.max(0, total - start));
    const range = { start, end: start + length, length, color: zone.color, index: i };
    start += length;
    return range;
  });
}

// Cross-section area (in²) a stretch of fly line takes up on a spool of the given width.
function lineArea(profile, fromFt, toFt, spoolWidth) {
  if (toFt <= fromFt) return 0;
  const steps = Math.max(1, Math.ceil((toFt - fromFt) / STEP_FT));
  const dx = (toFt - fromFt) / steps;
  let sum = 0;
  for (let k = 0; k < steps; k++) {
    const d = diameterAt(profile, fromFt + (k + 0.5) * dx);
    sum += d * d * dx * 12;
  }
  return (sum * PACK) / spoolWidth;
}

const backingAreaPerYard = (pounds, spoolWidth) => {
  const d = BACKING_DIAMETER[pounds] ?? BACKING_DIAMETER[20];
  return (36 * d * d * PACK) / spoolWidth;
};

// The line a rated capacity refers to: a generic floating WF line of that weight.
const ratedLine = (weight) => ({ ...findById(LINE_PRESETS, 'generic-wf5f').line, type: 'floating', weight });

// Arbor diameter (in). Uses the reel's own value if it has one; otherwise solves for the arbor
// at which the rated line plus rated backing exactly fill the spool; otherwise ARBOR_RATIO × spool.
export function reelArbor(reel) {
  if (reel.arbor) return reel.arbor;
  if (!reel.rated) return reel.spool * ARBOR_RATIO;
  const line = ratedLine(reel.rated.weight);
  const area = lineArea(lineProfile(line), 0, totalLength(line), reel.width) + reel.rated.yards * backingAreaPerYard(reel.rated.pounds, reel.width);
  const spoolR = reel.spool / 2;
  const arbor = 2 * Math.sqrt(Math.max(0, spoolR * spoolR - area / Math.PI));
  return Math.max(arbor, reel.spool * MIN_ARBOR_RATIO);
}

// Rings from the arbor outward: backing, then the fly line from the running-line end to the tip.
export function spoolLayout(setup) {
  const reel = findById(REELS, setup.reel.model) ?? REELS[1];
  const profile = lineProfile(setup.line);
  const arborR = reelArbor(reel) / 2;
  const spoolR = reel.spool / 2;

  const rings = [];
  let r2 = arborR * arborR;
  const push = (area, color, kind, label) => {
    const inner = Math.sqrt(r2);
    r2 += area / Math.PI;
    rings.push({ inner, outer: Math.sqrt(r2), color, kind, label, area });
  };

  const backingArea = setup.backing.yards * backingAreaPerYard(setup.backing.pounds, reel.width);
  push(backingArea, setup.backing.color, 'backing', 'Backing');

  const zones = zoneRanges(setup.line);
  for (let i = zones.length - 1; i >= 0; i--) {
    const z = zones[i];
    push(lineArea(profile, z.start, z.end, reel.width), z.color, 'line', `Zone ${i + 1}`);
  }

  const capacity = Math.PI * (spoolR * spoolR - arborR * arborR);
  const flyLineArea = rings.filter((r) => r.kind === 'line').reduce((s, r) => s + r.area, 0);
  const used = backingArea + flyLineArea;
  const maxBackingYards = Math.max(0, Math.floor((capacity - flyLineArea) / backingAreaPerYard(setup.backing.pounds, reel.width)));

  return {
    reel,
    rings,
    arborR,
    spoolR,
    rimR: reel.rim / 2,
    outerR: Math.sqrt(r2),
    fill: used / capacity,
    fits: used <= capacity,
    maxBackingYards,
  };
}

// The color of the fly line right next to the backing.
export const innermostLineColor = (line) => line.zones[line.zones.length - 1].color;
