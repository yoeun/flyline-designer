import * as LINEUP from 'lineups:scientific-anglers';
import { lineupSize, makerProduct, overriding, zones } from './product.js';

// Sampled from SA's swatches and taper diagrams. A new color whose SA name is already taken here
// carries the line's name in front (Titan Willow).
export const COLORS = [
  { id: 'sa-buckskin', name: 'Buckskin', hex: '#fad773' },
  { id: 'sa-mist-green', name: 'Mist Green', hex: '#abd691' },
  { id: 'sa-optic-green', name: 'Optic Green', hex: '#90c865' },
  { id: 'sa-creamsicle', name: 'Creamsicle', hex: '#ffe500' },
  { id: 'sa-satin-orange', name: 'Satin Orange', hex: '#f15522' },
  { id: 'sa-camo', name: 'Camo', hex: '#7f6d2d' },
  { id: 'sa-bamboo', name: 'Bamboo', hex: '#c3ab2f' },
  { id: 'sa-bass-camo', name: 'Camo', hex: '#73905a' },
  { id: 'sa-shad-blue', name: 'Shad Blue', hex: '#a3bdb2' },
  { id: 'sa-frog-green', name: 'Frog Green', hex: '#6a813b' },
  { id: 'sa-clear-camo', name: 'Clear Camo', hex: '#8a7b5e' },
  { id: 'sa-dark-green', name: 'Dark Green', hex: '#014935' },
  { id: 'sa-dark-gray', name: 'Dark Gray', hex: '#5f6062' },
  { id: 'sa-optic-yellow', name: 'Optic Yellow', hex: '#faf041' },
  { id: 'sa-pale-green', name: 'Pale Green', hex: '#d9e8a3' },
  { id: 'sa-titan-blue', name: 'Blue', hex: '#a2c6e6' },
  { id: 'sa-sonar-dark-green', name: 'Dark Green', hex: '#68843a' },
  { id: 'sa-ivory', name: 'Ivory', hex: '#d8d9db' },
  { id: 'sa-charcoal', name: 'Charcoal', hex: '#5f6062' },
  { id: 'sa-sonar-moss', name: 'Moss', hex: '#b2be36' },
  { id: 'sa-glow', name: 'Glow', hex: '#e8f3d2' },
  { id: 'sa-moss', name: 'Moss', hex: '#979735' },
  { id: 'sa-willow', name: 'Willow', hex: '#e0ddce' },
  { id: 'sa-butter', name: 'Butter', hex: '#fad874' },
  { id: 'sa-sage', name: 'Sage', hex: '#a3a983' },
  { id: 'sa-leather', name: 'Leather', hex: '#b1702a' },
  { id: 'sa-amber', name: 'Amber', hex: '#fbe285' },
  { id: 'sa-olive', name: 'Olive', hex: '#4a7637' },
  { id: 'sa-black', name: 'Black', hex: '#1e1f21' },
  { id: 'sa-celestial-blue', name: 'Celestial Blue', hex: '#1aa6dd' },
  { id: 'sa-blue-heron', name: 'Blue Heron', hex: '#5c6770' },
  { id: 'sa-pale-yellow', name: 'Pale Yellow', hex: '#f2eb5f' },
  { id: 'sa-sand', name: 'Sand', hex: '#f0c9a2' },
  { id: 'sa-horizon', name: 'Horizon', hex: '#bbccea' },
  { id: 'sa-titan-sage', name: 'Sage', hex: '#a3a468' },
  { id: 'sa-dark-olive', name: 'Dark Olive', hex: '#5f6738' },
  { id: 'sa-anadro-willow', name: 'Willow', hex: '#e3deb6' },
  { id: 'sa-anadro-optic-green', name: 'Optic Green', hex: '#59ba47' },
  { id: 'sa-orange', name: 'Orange', hex: '#d87c2f' },
  { id: 'sa-surf', name: 'Surf', hex: '#9cc7ea' },
  { id: 'sa-tropical-sand', name: 'Sand', hex: '#fde492' },
  { id: 'sa-tropical-horizon', name: 'Horizon', hex: '#b8e5fa' },
  { id: 'sa-clear', name: 'Clear', hex: '#e8e8ea' },
  { id: 'sa-magnitude-horizon', name: 'Horizon', hex: '#cad0d0' },
  { id: 'sa-tan', name: 'Tan', hex: '#fad771' },
  { id: 'sa-titan-buckskin', name: 'Titan Buckskin', hex: '#ffe49d' },
  { id: 'sa-titan-willow', name: 'Titan Willow', hex: '#c2b99a' },
  { id: 'sa-titan-pale-green', name: 'Titan Pale Green', hex: '#becf9b' },
  { id: 'sa-titan-dark-green', name: 'Titan Dark Green', hex: '#5f6937' },
  { id: 'sa-titan-black', name: 'Titan Black', hex: '#030708' },
  { id: 'sa-green', name: 'Green', hex: '#c6de70' },
  { id: 'sa-dark-grass', name: 'Dark Grass', hex: '#747c4b' },
  { id: 'sa-bronze', name: 'Bronze', hex: '#ddd17f' },
  { id: 'sa-carp-camo', name: 'Carp Camo', hex: '#bab780' },
  { id: 'sa-infinity-salt-sand', name: 'Infinity Salt Sand', hex: '#f8e0a4' },
  { id: 'sa-infinity-salt-horizon', name: 'Infinity Salt Horizon', hex: '#a5bdb0' },
  { id: 'sa-tarpon-sand', name: 'Tarpon Sand', hex: '#fdc995' },
  { id: 'sa-tarpon-black', name: 'Tarpon Black', hex: '#343233' },
  { id: 'sa-bonefish-plus-pale-yellow', name: 'Bonefish Plus Pale Yellow', hex: '#faf28a' },
  { id: 'sa-yellow', name: 'Yellow', hex: '#ffde62' },
  { id: 'sa-air-cel-orange', name: 'Air Cel Orange', hex: '#f8981d' },
  { id: 'sa-wet-cel-green', name: 'Wet Cel Green', hex: '#94cea8' },
  { id: 'sa-wet-cel-charcoal', name: 'Wet Cel Charcoal', hex: '#222222' },
  { id: 'sa-infinity-warm-bronze', name: 'Infinity Warm Bronze', hex: '#f4f098' },
  { id: 'sa-tannic', name: 'Tannic', hex: '#cd793d' },
  { id: 'sa-turtle-grass', name: 'Turtle Grass', hex: '#b3be34' },
  { id: 'sa-infinity-plus-buckskin', name: 'Infinity Plus Buckskin', hex: '#edc295' },
  { id: 'sa-infinity-plus-willow', name: 'Infinity Plus Willow', hex: '#cdcaa9' },
  { id: 'sa-panfish-pale-yellow', name: 'Panfish Pale Yellow', hex: '#e8ea6f' },
  { id: 'sa-frequency-saltwater-light-blue', name: 'Light Blue', hex: '#9cc7ea' },
  { id: 'sa-magnitude-balance-light-olive', name: 'Balance Light Olive', hex: '#c7be71' },
  { id: 'sa-magnitude-clear', name: 'Magnitude Clear', hex: '#d2d3d5' },
  { id: 'sa-mastery-expert-distance-orange', name: 'Expert Distance Orange', hex: '#f78934' },
  { id: 'sa-titan-sink-tip-mini-pale-yellow', name: 'Sink Tip Mini Pale Yellow', hex: '#ddda73' },
  { id: 'sa-titan-sink-tip-mini-shad-blue', name: 'Sink Tip Mini Shad Blue', hex: '#a8aeac' },
  { id: 'sa-titan-sink-tip-mini-charcoal', name: 'Sink Tip Mini Charcoal', hex: '#373737' },
  { id: 'sa-magnitude-bonefish-plus-ivory', name: 'Magnitude Ivory', hex: '#e7e7e9' },
  { id: 'sa-magnitude-infinity-salt-translucent-aqua', name: 'Translucent Aqua', hex: '#2ca886' },
  { id: 'sa-emerger-tip-dark-green', name: 'Emerger Tip Dark Green', hex: '#153f35' },
  { id: 'sa-mastery-grand-slam-cold-sand', name: 'Grand Slam Cold Sand', hex: '#e6b789' },
  { id: 'sa-mastery-anadro-green', name: 'Mastery Anadro Green', hex: '#7fc879' },
  { id: 'sa-mastery-anadro-yellow', name: 'Mastery Anadro Yellow', hex: '#ffe330' },
  { id: 'sa-amplitude-tropical-titan-camo', name: 'Tropical Titan Camo', hex: '#82996a' },
  { id: 'sa-amplitude-tropical-titan-dark-turtle-grass', name: 'Dark Turtle Grass', hex: '#6a813b' },
  { id: 'sa-frequency-magnum-optic-green', name: 'Magnum Optic Green', hex: '#d9e8a3' },
  { id: 'sa-sonar-stillwater-intermediate-light-gray', name: 'Light Gray', hex: '#b3b5b2' },
  { id: 'sa-sonar-stillwater-intermediate-olive-drab', name: 'Olive Drab', hex: '#766e47' },
  { id: 'sa-mastery-double-taper-dark-willow', name: 'Dark Willow', hex: '#b0953a' },
  { id: 'sa-frequency-mpx-orange', name: 'Frequency MPX Orange', hex: '#f15522' },
  { id: 'sa-mastery-grand-slam-aqua', name: 'Aqua', hex: '#61c6c0' },
  { id: 'sa-mastery-saltwater-sunrise', name: 'Sunrise', hex: '#f47667' },
  { id: 'sa-frequency-intermediate-atmosphere', name: 'Atmosphere', hex: '#89ceb9' },
  { id: 'sa-sonar-striper-blue', name: 'Striper Blue', hex: '#4b8dca' },
  { id: 'sa-sonar-striper-storm-grey', name: 'Storm Grey', hex: '#9eb1ad' },
];

// Old preset ids that are now sizes with another id (old → new). Mastery Competition Nymph is now
// sold as Mastery Euro Tactical Nymph Mono.
export const LEGACY_IDS = {
  'sa-mastery-competition-nymph': 'sa-mastery-euro-tactical-nymph-mono-level',
  'sa-mastery-competition-nymph-level': 'sa-mastery-euro-tactical-nymph-mono-level',
};

const half = (ft) => Math.round(ft * 2) / 2;

// Head and total length per size come from SA's spec tables. SA's diagrams have no numbers but are
// drawn to a scale; splits are measured off them to about ±0.5 ft, with the bellies as the body and
// the rear taper(s) as the back. A diagram is drawn for one size; other sizes scale its front and
// back taper to their own head, to the nearest half foot, and are marked estimated.
const scaled = ([front, body, back], head) => {
  const s = head / (front + body + back);
  const f = half(front * s);
  const b = half(back * s);
  // Rounded to a tenth so a head like 39.7 ft leaves no float noise in the body.
  return [f, Math.round((head - f - b) * 10) / 10, b];
};

// A line with the same head in every size: the diagram's [front, body, back] applies to all of
// them, and the running line makes up each size's total.
const sameHead = (split, size) => [...split, size.total - size.head];

// A lineup product's floating WF sizes: `ref` is the weight the diagram is drawn for;
// `colorways(head, [front, body, back], weight)` returns a size's colorways.
const floating = (split, ref, sizes, colorways) =>
  sizes.map((size) => {
    const { weight, head, total } = size;
    const taper = scaled(split, head);
    return {
      id: `wf${weight}f`,
      label: size.label,
      type: 'floating',
      weight,
      taper: [...taper, total - head],
      estimated: weight !== ref,
      lineup: size,
      colorways: colorways(head, taper, weight),
    };
  });

// Amplitude and Mastery share tapers: MPX is the same line in each, only the coating and colors
// differ. WF5 diagram: front 6.5, bellies 25, rear 4.5 on a 36 ft head. (Frequency MPX's own diagram
// measures differently; see FREQUENCY_BOOST.)
const MPX = [6.5, 25, 4.5];

// Grand Slam, Smooth and Textured share a diagram: front taper 2.5, front belly 18, rear taper 19.5.
// The diagram's head measures 40.5 ft against the 40 ft SA lists for every size; the split is scaled
// to 40.
const GRAND_SLAM = [2.5, 18, 19.5];

// Trout Expert and the Amplitude Smooth Trout it replaced share a diagram (WF5, 69 ft head):
// two front tapers (13 ft), two bellies (30.5) and a 25.5 ft rear taper.
const TROUT_EXPERT = [13, 30.5, 25.5];
const TROUT_EXPERT_LINEUP = LINEUP['sa-amplitude-smooth-trout-expert'];

// Smooth and Textured Anadro Indicator share a diagram: front taper 2.5, front belly and belly 31,
// rear taper 27.5. Its head measures 61 ft, the WF7's (WF5 and WF6 list 60). The tip color runs to the end
// of the front belly, about 7.5 ft.
const ANADRO = [2.5, 31, 27.5];
const anadro = (id, name, tip) =>
  makerProduct({
    id,
    maker: 'Scientific Anglers',
    name,
    sizes: floating(ANADRO, 7, LINEUP[id].sizes, (head) => {
      const front = half((7.5 * head) / 61);
      return [{ id: `moss-willow-${tip.id}`, name: `Moss/Willow/${tip.name}`, zones: zones([front, tip.color], [head - front, 'sa-anadro-willow'], [0, 'sa-moss']) }];
    }),
  });

// Amplitude Smooth Bonefish's diagram: two front tapers (7 ft), a front belly, a short rear taper
// into a thicker rear belly (28.5 ft together, drawn here as the body), then a 4.5 ft rear taper.
// Its 40 ft head is nearest the WF8's 39.7. The last 10 ft of the 100 ft line is a black sighter.
const BONEFISH = [7, 28.5, 4.5];
const bonefishColors = (head) => [
  { id: 'black-surf-ivory', name: 'Black/Surf/Ivory', zones: zones([head, 'sa-ivory'], [90 - head, 'sa-surf'], [0, 'sa-black']) },
];

// Magnitude Grand Slam Clear Float, Smooth and Textured, share a diagram that measures the Grand
// Slam split. Every size comes as Clear Tip: Horizon with SA's 10 ft clear tip, and a 10 ft sighter
// just behind the head that the diagram draws in the tip's clear. Some sizes also come as Full
// Clear, the same line in one color. SA's Clear swatches here are a little grayer than the Titan
// Clear Tip's; they reuse its color.
const magnitudeGrandSlam = (id, name) => {
  const lineup = LINEUP[id];
  return makerProduct({
    id,
    maker: 'Scientific Anglers',
    name,
    sizes: [...new Set(lineup.sizes.map((size) => size.weight))].map((weight) => {
      const size = lineupSize(lineup, `WF${weight}F Clear Tip`);
      const fullClear = lineup.sizes.some((s) => s.label === `WF${weight}F Full Clear`);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: sameHead(GRAND_SLAM, size),
        lineup: size,
        colorways: [
          { id: 'horizon-clear-tip', name: 'Horizon/Clear Tip', zones: zones([10, 'sa-clear'], [30, 'sa-magnitude-horizon'], [10, 'sa-clear'], [0, 'sa-magnitude-horizon']) },
          ...(fullClear ? [{ id: 'clear', name: 'Clear', zones: zones([0, 'sa-clear']) }] : []),
        ],
      };
    }),
  });
};

// Sonar Saltwater Intermediate's diagram: front taper 4.5, belly 23, rear taper 10. Its 37.5 ft head
// is the WF7–9's 38 ft; the WF10–12 (41 ft head) scale it.
const SALTWATER_INTERMEDIATE = [4.5, 23, 10];

// Frequency Full Sink's densities: Sink 6 draws as Type 5.
const FULL_SINK_RATES = {
  sink3: { rate: 3, type: 'sink3', colorway: { id: 'dark-green', name: 'Dark Green', color: 'sa-dark-green' } },
  sink6: { rate: 6, type: 'sink5', colorway: { id: 'dark-gray', name: 'Dark Gray', color: 'sa-dark-gray' } },
};

// The Sonar Titan head, shared by the Full Intermediate and 3D: 33.5 ft in every size.
const TITAN = [5.5, 24.5, 3.5];
const TITAN_3D = LINEUP['sa-sonar-titan-3d-triple-density'];
// The Tropical/Jungle Clear Tip's own diagram: front taper 5.5, two bellies to 34, a 1 ft rear taper.
// The diagram's head measures 34.75 ft against the 33.5 ft SA lists for every size; the split is
// scaled to 33.5.
const TITAN_TROPICAL = [5.5, 27, 1];
// Mastery Tropical/Jungle Titan's own diagram: front taper 5, two bellies 28.5, a 1 ft rear taper. Its
// head measures 34 ft against the 33.5 ft SA lists for every size; the split is scaled to 33.5.
const JUNGLE_TITAN = [5, 27.5, 1];
// Sonar Titan Sink Tip's diagram: front taper 5.5, two bellies 28, rear taper 10. Its head measures
// 43.5 ft against the 43 ft SA lists for every size; the split is scaled to 43. The sink tip's length
// per size is from SA's table (the diagram's tip color runs about 12 ft, the WF7's).
const TITAN_SINK_TIP = [5.5, 27.5, 10];
const TITAN_SINK_TIP_LENGTH = { 5: 8, 6: 10, 7: 12, 8: 14, 9: 16 };
const SINK_25_COLD = LINEUP['sa-sonar-sink-25-cold'];
const EURO_MONO = lineupSize(LINEUP['sa-mastery-competition-nymph'], 'Level 0-5wt (.022")');

// Amplitude Smooth Carp's diagram: front taper 7.5, belly 23.5, rear taper 15. Its head measures 46 ft
// against the 45 ft SA lists for every size; the split is scaled to 45.
const CARP = scaled([7.5, 23.5, 15], 45);

// Amplitude Smooth and Textured Infinity Salt's diagram (the same on both pages): front taper 4, belly
// 26, two rear tapers 19. Its 49 ft head is the WF8's; the other sizes scale it.
const INFINITY_SALT = [4, 26, 19];

// Amplitude Smooth Redfish's diagram, drawn for Warm and Cold alike: front taper 4, belly 21.5, rear
// taper 5.5, the 31 ft head SA lists for every size. (The Warm page's copy measured 4, 21.5 and 6, a
// 31.5 ft head; this reading matches SA's 31 ft exactly, so both use it.)
const REDFISH = [4, 21.5, 5.5];

// Amplitude Smooth Tarpon's diagram: two front tapers (7 ft), a front belly, a short rear taper into a
// thinner rear belly (22 ft together, drawn here as the body), then a 7 ft rear taper: the 36 ft head
// SA lists for every size.
const TARPON = [7, 22, 7];

// Amplitude Textured and Smooth Bonefish Plus's diagram (the same on both pages): front taper 3, belly
// 18.5, two rear tapers 29, the 50.5 ft head SA lists for every size.
const BONEFISH_PLUS = [3, 18.5, 29];

// These saltwater lines end in a black sighter over the last 10 ft of their 100 ft (on each diagram).
const sighted = (head, headColor, running, sighter) => zones([head, headColor], [90 - head, running], [0, sighter]);

// Air Cel Trout, Air Cel Kit, Air Cel WF and Wet Cel Sink Tip share a diagram: front taper 5, belly
// 31.5, rear taper 3.5 on a 40 ft head (Air Cel WF's yellow diagram measures 5.5, 31.5 and 3). The
// Air Cels' small bump in the running line, about 52 ft back, isn't drawn.
const AIR_CEL = [5, 31.5, 3.5];

// Amplitude Smooth Double Taper: SA's table gives each size's belly; the tapers at either end make up
// the rest of the 85 ft line. The DT5 diagram draws them equal (6.5 ft each, measured 6.7 and 6.2), so
// the other sizes split theirs equally too and are marked estimated. Buckskin for the first 40 ft, a
// 5 ft leather band at the middle, then mist green.
const doubleTaper = (size) => {
  const end = (size.total - size.head) / 2;
  return [end, size.head, end, 0];
};

// Amplitude Smooth Infinity Plus's diagram measures the Textured Infinity's split: front 6.5, belly
// 24, two rear tapers 18.5 on a 49 ft head (the WF5's).
const INFINITY_PLUS = [6.5, 24, 18.5];

// Amplitude Smooth Panfish's diagram: two front tapers 6.5, belly 25.5, rear taper 26. Its 58 ft head
// is the WF4–6's; the WF2 and WF3 (56 and 57 ft) scale it.
const PANFISH = [6.5, 25.5, 26];

// Amplitude Smooth Striper's diagram: front taper 5, then a belly, a short rear taper into a thicker
// rear belly (22 ft together, drawn as the body), then a 3 ft rear taper. Its head measures 30.5 ft
// against the 30 ft SA lists for every size; the split is scaled to 30.
const STRIPER = [5, 22, 3];

// Frequency Saltwater's diagram: front taper 6.5, two bellies 29, rear taper 4.5, the 40 ft head of the
// WF7–9; the WF10 (35 ft head) scales it.
const FREQUENCY_SALTWATER = [6.5, 29, 4.5];

// Magnitude Balance Clear Float's diagram (Smooth and Textured): front taper 7.5, two bellies 20.5, two
// rear tapers 16. Its head measures 44 ft against the 43.5 ft SA lists for every size; the split is
// scaled to 43.5.
const MAGNITUDE_BALANCE = scaled([7.5, 20.5, 16], 43.5);

// Mastery Expert Distance's diagram: front taper 15.5, two bellies 32.5, rear taper 24.5. Its head
// measures 72 ft, nearest the WF7's 72.5; the WF5 and WF6 scale it.
const MASTERY_EXPERT_DISTANCE = [15.5, 32.5, 24.5];

// Mastery Infinity's own diagram: front taper 6, belly 24, two rear tapers 18.5. Its 48.5 ft head is
// nearest the WF5's 49; the other sizes scale it.
const MASTERY_INFINITY = [6, 24, 18.5];

// Magnitude Smooth Trout Expert Clear Tip Float's own diagram: two front tapers (13 ft), two bellies
// (30.5) and a 25 ft rear taper, half a foot shorter than the Amplitude Trout Expert's. Its 68.5 ft
// head is nearest the WF5's 68; the other sizes scale it.
const MAGNITUDE_TROUT_EXPERT = [13, 30.5, 25];

// Frequency Magnum Glow's diagram: front taper 5, two bellies 27.5, rear taper 5.5. Its head measures
// 38.3 ft, nearest the WF7's 39; the other sizes scale it.
const MAGNUM_GLOW = [5, 27.5, 5.5];

// Sonar Stillwater Emerger Tip's diagram: three front tapers 22, belly 12.5, rear taper 10. Its head
// measures 44.5 ft against the 45 ft SA lists for every size; the split is scaled to 45.
const STILLWATER_EMERGER_TIP = scaled([22, 12.5, 10], 45);

// Mastery Grand Slam Cold's own diagram: front taper 2, front belly 19.5, rear taper 19.5. Its head
// measures 41 ft against the 40 ft SA lists for every size; the split is scaled to 40.
const MASTERY_GRAND_SLAM_COLD = scaled([2, 19.5, 19.5], 40);

// Frequency Boost's diagram: front taper 6, belly 25, rear taper 5. Its 36 ft head is the WF4–6's;
// the WF3 (32 ft) and WF7–8 (40 ft) scale it. Frequency MPX's own WF5 diagram (36 ft head) measures
// the same split, not quite the Amplitude and Mastery MPX's, and uses it too.
const FREQUENCY_BOOST = [6, 25, 5];

// Frequency Magnum's diagram: front taper 5.5, two bellies 27.5, rear taper 6. Its head measures
// 38.5–39 ft, the WF7's 39; the other sizes scale it.
const FREQUENCY_MAGNUM = [5.5, 27.5, 6];

// Sonar Stillwater Intermediate's diagram: three front tapers 22, belly 13, rear taper 10, the 45 ft
// head SA lists for every size. The textured hang markers 10 and 20 ft from the tip aren't drawn.
const SONAR_STILLWATER_INTERMEDIATE = [22, 13, 10];

// Amplitude Smooth Titan GT's diagram: front taper 5.5, two bellies 23.5, rear taper 3.5, the 32.5 ft
// head SA lists for both sizes. The last 10 ft of the 90 ft line is a black sighter.
const AMPLITUDE_TITAN_GT = [5.5, 23.5, 3.5];

// Frequency Trout GP's WF5 diagram measures the Amplitude Trout GP's split: front 6, belly 22, two
// rear tapers 22.5 on a 50.5 ft head. It draws the running line to 90 ft; the line uses the 85 ft
// SA's table lists for every size.
const FREQUENCY_TROUT_GP = [6, 22, 22.5];

// Sonar Stillwater Float's diagram: three front tapers 22.5, belly 12.5, rear taper 10, the 45 ft head
// SA lists for every size. The buckskin tip runs to the end of the first front taper, about 4 ft.
const SONAR_STILLWATER_FLOAT = [22.5, 12.5, 10];

// Frequency Intermediate's diagram: front taper 4, belly 33.5, rear taper 2.5 on a 40 ft head, longer
// than any size SA lists (34–38 ft). Every size scales it and is marked estimated.
const FREQUENCY_INTERMEDIATE = [4, 33.5, 2.5];

export const PRODUCTS = [
  // Half-size heavy. Head and total per size from SA's table; the WF6 split was measured off the
  // diagram before SA published per-size heads, and the other sizes scale it. Orange is made in
  // WF4–6, Glow (a glow-in-the-dark tip) in WF5–8.
  makerProduct({
    id: 'sa-amplitude-smooth-infinity',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Infinity',
    sizes: floating(
      [6.5, 24, 19.5],
      6,
      LINEUP['sa-amplitude-smooth-infinity'].sizes,
      (head, [front], weight) => {
        const camo = half((10 * head) / 50);
        return [
          { id: 'optic', name: 'Optic', zones: zones([front, 'sa-buckskin'], [head - front, 'sa-mist-green'], [0, 'sa-optic-green']) },
          ...(weight >= 4 && weight <= 6 ? [{ id: 'orange', name: 'Orange', zones: zones([front, 'sa-creamsicle'], [head - front, 'sa-satin-orange'], [0, 'sa-optic-green']) }] : []),
          { id: 'camo', name: 'Camo', zones: zones([camo, 'sa-camo'], [head - camo, 'sa-buckskin'], [0, 'sa-bamboo']) },
          ...(weight >= 5 ? [{ id: 'glow', name: 'Glow', zones: zones([front, 'sa-glow'], [head - front, 'sa-mist-green'], [0, 'sa-optic-green']) }] : []),
        ];
      },
    ),
  }),
  // The Smooth Infinity taper with SA's textures. Its own WF5 diagram (49 ft head): front 6.5,
  // belly 24, two rear tapers 18.5; the other sizes scale it. The camo tip runs about 10.5 ft on that
  // diagram.
  makerProduct({
    id: 'sa-amplitude-textured-infinity',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Infinity',
    sizes: floating(
      [6.5, 24, 18.5],
      5,
      LINEUP['sa-amplitude-textured-infinity'].sizes,
      (head, [front]) => {
        const camo = half((10.5 * head) / 49);
        return [
          { id: 'optic', name: 'Optic', zones: zones([front, 'sa-buckskin'], [head - front, 'sa-mist-green'], [0, 'sa-optic-green']) },
          { id: 'camo', name: 'Camo', zones: zones([camo, 'sa-camo'], [head - camo, 'sa-buckskin'], [0, 'sa-bamboo']) },
        ];
      },
    ),
  }),
  // Half-size heavy all-rounder. Buckskin tip, moss head, optic green running line.
  makerProduct({
    id: 'sa-amplitude-smooth-mpx',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth MPX',
    sizes: floating(MPX, 5, LINEUP['sa-amplitude-smooth-mpx'].sizes, (head, [front]) => [
      { id: 'optic-moss-buckskin', name: 'Optic Green/Moss/Buckskin', zones: zones([front, 'sa-buckskin'], [head - front, 'sa-moss'], [0, 'sa-optic-green']) },
    ]),
  }),
  // The Amplitude Smooth MPX taper and colors with SA's textures; its own WF5 diagram measures the
  // same split.
  makerProduct({
    id: 'sa-amplitude-textured-mpx',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured MPX',
    sizes: floating(MPX, 5, LINEUP['sa-amplitude-textured-mpx'].sizes, (head, [front]) => [
      { id: 'optic-moss-buckskin', name: 'Optic Green/Moss/Buckskin', zones: zones([front, 'sa-buckskin'], [head - front, 'sa-moss'], [0, 'sa-optic-green']) },
    ]),
  }),
  // The Amplitude Smooth MPX taper in Mastery: a one-color head on a contrasting running line.
  makerProduct({
    id: 'sa-mastery-mpx',
    maker: 'Scientific Anglers',
    name: 'SA Mastery MPX',
    sizes: floating(MPX, 5, LINEUP['sa-mastery-mpx'].sizes, (head) => [
      { id: 'amber-willow', name: 'Amber/Willow', zones: zones([head, 'sa-willow'], [0, 'sa-amber']) },
      { id: 'buckskin-optic', name: 'Buckskin/Optic Green', zones: zones([head, 'sa-optic-green'], [0, 'sa-buckskin']) },
    ]),
  }),
  // Quarter-size heavy general trout line. WF5 diagram: front 6, belly 22, two rear tapers 22.5
  // (50.5 ft head). Willow tip, sage head, butter running line.
  makerProduct({
    id: 'sa-amplitude-smooth-trout-gp',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Trout GP',
    sizes: floating(
      [6, 22, 22.5],
      5,
      LINEUP['sa-amplitude-smooth-trout-gp'].sizes,
      (head, [front]) => [
        { id: 'butter-sage-willow', name: 'Butter/Sage/Willow', zones: zones([front, 'sa-willow'], [head - front, 'sa-sage'], [0, 'sa-butter']) },
      ],
    ),
  }),
  // The Smooth Trout GP taper and colors with SA's textures; its own WF5 diagram (50.5 ft head)
  // measures the same split.
  makerProduct({
    id: 'sa-amplitude-textured-trout-gp',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Trout GP',
    sizes: floating(
      [6, 22, 22.5],
      5,
      LINEUP['sa-amplitude-textured-trout-gp'].sizes,
      (head, [front]) => [
        { id: 'butter-sage-willow', name: 'Butter/Sage/Willow', zones: zones([front, 'sa-willow'], [head - front, 'sa-sage'], [0, 'sa-butter']) },
      ],
    ),
  }),
  // True-to-weight dry-fly line with a long front taper. Buckskin tip, sage green to the end of the
  // bellies, leather rear taper and running line.
  makerProduct({
    id: 'sa-amplitude-smooth-trout-expert',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Trout Expert',
    sizes: floating(TROUT_EXPERT, 5, TROUT_EXPERT_LINEUP.sizes, (head, [front, body]) => {
      const tip = half((6.5 * head) / 69);
      return [
        { id: 'leather-sage-buckskin', name: 'Leather/Sage Green/Buckskin', zones: zones([tip, 'sa-buckskin'], [front + body - tip, 'sa-sage'], [0, 'sa-leather']) },
      ];
    }),
  }),
  // One size heavy, short head for small streams. WF5 diagram: front 11.5, belly 9.5, rear 3
  // (24 ft head), then a 6 ft handling section drawn here as running line. Willow tip, leather head,
  // moss handling and running line.
  makerProduct({
    id: 'sa-amplitude-smooth-creek-trout',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Creek Trout',
    sizes: floating(
      [11.5, 9.5, 3],
      5,
      LINEUP['sa-amplitude-smooth-creek-trout'].sizes,
      (head) => {
        const tip = half((6 * head) / 24);
        return [{ id: 'moss-leather-willow', name: 'Moss/Leather/Willow', zones: zones([tip, 'sa-willow'], [head - tip, 'sa-leather'], [0, 'sa-sonar-moss']) }];
      },
    ),
  }),
  // One and a half sizes heavy, for indicator nymphing. Orange tip, willow head, moss running line.
  anadro('sa-amplitude-smooth-anadro-indicator', 'SA Amplitude Smooth Anadro Indicator', { id: 'orange', name: 'Orange', color: 'sa-orange' }),
  // The Smooth Anadro Indicator taper with SA's textures; an optic green tip.
  anadro('sa-amplitude-anadro', 'SA Amplitude Textured Anadro Indicator', { id: 'optic', name: 'Optic Green', color: 'sa-anadro-optic-green' }),
  // Replaced by Trout GP and Trout Expert. SA's old diagram is the Trout Expert taper (69 ft head at
  // WF5; one retailer lists 68). Only that WF5 head is known, so every size borrows Trout Expert's
  // head and total length, and the sizes other than WF5 are marked estimated. Blue heron front
  // tapers, bamboo bellies, celestial blue rear.
  makerProduct({
    id: 'sa-amplitude-smooth-trout',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Trout',
    discontinued: true,
    sizes: floating(
      TROUT_EXPERT,
      5,
      LINEUP['sa-amplitude-smooth-trout'].sizes.map((size) => {
        const { head, total } = lineupSize(TROUT_EXPERT_LINEUP, size.label);
        return overriding(size, { head, total });
      }),
      (head, [front, body]) => [
        { id: 'celestial-bamboo-heron', name: 'Celestial Blue/Bamboo/Blue Heron', zones: zones([front, 'sa-blue-heron'], [body, 'sa-bamboo'], [0, 'sa-celestial-blue']) },
      ],
    ),
  }),
  // Two sizes heavy. Every size has a 43 ft head; the diagram's split applies to all of them.
  makerProduct({
    id: 'sa-amplitude-bass-bug',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Bass Bug',
    sizes: LINEUP['sa-amplitude-bass-bug'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead([5, 28, 10], size),
      lineup: size,
      colorways: [{ id: 'camo-shad-frog', name: 'Camo/Shad Blue/Frog Green', zones: zones([12.5, 'sa-bass-camo'], [30.5, 'sa-shad-blue'], [0, 'sa-frog-green']) }],
    })),
  }),
  // The Bass Bug in Mastery, WF6–9. Its own diagram measures the same split on the same 43 ft head:
  // a shad blue head on a frog green running line.
  makerProduct({
    id: 'sa-mastery-bass-bug',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Bass Bug',
    sizes: LINEUP['sa-mastery-bass-bug'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead([5, 28, 10], size),
      lineup: size,
      colorways: [{ id: 'frog-shad', name: 'Frog Green/Shad Blue', zones: zones([43, 'sa-shad-blue'], [0, 'sa-frog-green']) }],
    })),
  }),
  // Two sizes heavy, for big flies. SA's diagram: front taper 5, two bellies 28, rear taper 10, the
  // 43 ft head SA lists for every size (the Bass Bug's split). Dark olive front taper, moss head, sage
  // running line.
  makerProduct({
    id: 'sa-amplitude-smooth-titan-long',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Titan Long',
    sizes: LINEUP['sa-amplitude-smooth-titan-long'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead([5, 28, 10], size),
      lineup: size,
      colorways: [{ id: 'sage-moss-dark-olive', name: 'Sage/Moss/Dark Olive', zones: zones([5, 'sa-dark-olive'], [38, 'sa-sonar-moss'], [0, 'sa-titan-sage']) }],
    })),
  }),
  // The Titan Long in Mastery, WF5–10. Its own diagram measures the same split on the same 43 ft head:
  // a buckskin head on a moss running line.
  makerProduct({
    id: 'sa-mastery-titan-long',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Titan Long',
    sizes: LINEUP['sa-mastery-titan-long'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead([5, 28, 10], size),
      lineup: size,
      colorways: [{ id: 'moss-buckskin', name: 'Moss/Buckskin', zones: zones([43, 'sa-titan-buckskin'], [0, 'sa-moss']) }],
    })),
  }),
  // Three-quarter size heavy saltwater line. Same 40 ft head in every size. Horizon front taper, sand
  // head, pale yellow running line.
  makerProduct({
    id: 'sa-amplitude-smooth-grand-slam',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Grand Slam',
    sizes: LINEUP['sa-amplitude-smooth-grand-slam'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(GRAND_SLAM, size),
      lineup: size,
      colorways: [{ id: 'pale-yellow-sand-horizon', name: 'Pale Yellow/Sand/Horizon', zones: zones([2.5, 'sa-horizon'], [37.5, 'sa-sand'], [0, 'sa-pale-yellow']) }],
    })),
  }),
  // The Smooth Grand Slam taper and colors with SA's textures, in WF7–12.
  makerProduct({
    id: 'sa-amplitude-grand-slam',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Grand Slam',
    sizes: LINEUP['sa-amplitude-grand-slam'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(GRAND_SLAM, size),
      lineup: size,
      colorways: [{ id: 'pale-yellow-sand-horizon', name: 'Pale Yellow/Sand/Horizon', zones: zones([2.5, 'sa-horizon'], [37.5, 'sa-sand'], [0, 'sa-pale-yellow']) }],
    })),
  }),
  // True to weight. Ivory head, surf running line, black sighter.
  makerProduct({
    id: 'sa-amplitude-smooth-bonefish',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Bonefish',
    sizes: floating(BONEFISH, 8, LINEUP['sa-amplitude-smooth-bonefish'].sizes, bonefishColors),
  }),
  // The Smooth Bonefish taper and colors with SA's textures, in WF7–9; its own diagram measures the
  // same split.
  makerProduct({
    id: 'sa-amplitude-bonefish',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Bonefish',
    sizes: floating(BONEFISH, 8, LINEUP['sa-amplitude-bonefish'].sizes, bonefishColors),
  }),
  // Three-quarter size heavy clear floater. Same 40 ft head in every size.
  magnitudeGrandSlam('sa-magnitude-smooth-grand-slam-clear-tip', 'SA Magnitude Smooth Grand Slam Clear Float'),
  // The Smooth Magnitude Grand Slam with SA's textures.
  magnitudeGrandSlam('sa-magnitude-textured-grand-slam-clear-float', 'SA Magnitude Textured Grand Slam Clear Float'),
  // The Grand Slam taper with an 8 ft clear intermediate tip (1.25 ips; the diagram's clear section
  // measures about 7 ft), drawn as a sink tip; its diagram measures the Grand Slam split. Same 40 ft
  // head in every size. Clear tip, sand to the end of the head, pale yellow running line; SA's
  // swatches are close to the Grand Slam's and the Titan Clear Tip's colors, which they reuse.
  makerProduct({
    id: 'sa-sonar-grand-slam-clear-tip',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Grand Slam Clear Tip',
    sizes: LINEUP['sa-sonar-grand-slam-clear-tip'].sizes.map((size) => ({
      id: `wf${size.weight}-f-i`,
      label: size.label,
      type: 'sinktip',
      weight: size.weight,
      taper: sameHead(GRAND_SLAM, size),
      lineup: size,
      colorways: [{ id: 'pale-yellow-sand-clear', name: 'Pale Yellow/Sand/Clear', zones: zones([8, 'sa-clear'], [32, 'sa-sand'], [0, 'sa-pale-yellow']) }],
    })),
  }),
  // 1.25 ips, all clear (SA's swatch is close to the Titan Clear Tip's Clear).
  makerProduct({
    id: 'sa-sonar-saltwater-intermediate',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Saltwater Intermediate',
    sizes: LINEUP['sa-sonar-saltwater-intermediate'].sizes.map((size) => {
      const { weight, head, total } = size;
      const taper = scaled(SALTWATER_INTERMEDIATE, head);
      return {
        id: `wf${weight}i`,
        label: size.label,
        type: 'intermediate',
        weight,
        taper: [...taper, total - head],
        estimated: head !== 38,
        lineup: size,
        colorways: [{ id: 'clear', name: 'Clear', zones: zones([0, 'sa-clear']) }],
      };
    }),
  }),
  // 2 ips, two sizes heavy. Long three-part front taper; one color over the whole line. Every size
  // has the same 45 ft head.
  makerProduct({
    id: 'sa-sonar-stillwater-clear-camo',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Stillwater Clear Camo',
    sizes: LINEUP['sa-sonar-stillwater-clear-camo-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: sameHead([22.5, 13, 9.5], size),
      lineup: size,
      colorways: [{ id: 'clear-camo', name: 'Clear Camo', zones: zones([0, 'sa-clear-camo']) }],
    })),
  }),
  // Sink 3 is 2.5–4 ips, Sink 6 5–6 ips. The diagram is drawn for a 40 ft head; the WF6 split
  // (36 ft head) is scaled from it, and the other heads keep its 4 ft front and 2 ft back taper.
  makerProduct({
    id: 'sa-frequency-full-sink',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Full Sink',
    sizes: LINEUP['sa-frequency-full-sink'].sizes.map((size) => {
      const { weight, head } = size;
      const { rate, type, colorway } = FULL_SINK_RATES[size.density];
      return {
        id: `wf${weight}s${rate}`,
        label: size.label,
        type,
        weight,
        taper: [4, head - 6, 2, size.total - head],
        estimated: true,
        lineup: size,
        colorways: [{ id: colorway.id, name: colorway.name, zones: zones([0, colorway.color]) }],
      };
    }),
  }),
  // 10 ft Sink 3 tip plus a 1 ft transition, then a floating belly. Same 45 ft head in every size.
  makerProduct({
    id: 'sa-frequency-sink-tip',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Sink Tip',
    sizes: LINEUP['sa-frequency-sink-tip'].sizes.map((size) => ({
      id: `wf${size.weight}`,
      label: size.label,
      type: 'sinktip',
      weight: size.weight,
      taper: sameHead([11, 30, 4], size),
      lineup: size,
      colorways: [{ id: 'green-optic-yellow', name: 'Green/Optic Yellow', zones: zones([10, 'sa-dark-green'], [0, 'sa-optic-yellow']) }],
    })),
  }),
  // 1.25 ips. Same 33.5 ft head in every size.
  makerProduct({
    id: 'sa-sonar-titan-intermediate',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Full Intermediate',
    sizes: LINEUP['sa-sonar-titan-full-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: sameHead(TITAN, size),
      lineup: size,
      colorways: [{ id: 'pale-green-blue', name: 'Pale Green/Blue', zones: zones([33.5, 'sa-pale-green'], [0, 'sa-titan-blue']) }],
    })),
  }),
  // Two sizes heavy, three densities: head, about 20 ft of handling line, then running line, each
  // sinking slower than the one in front. Same Titan head as the Full Intermediate (33.5 ft in every
  // size); each density set has its own colors, head first.
  makerProduct({
    id: 'sa-sonar-titan-3d',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan 3D Triple Density',
    sizes: [...new Set(TITAN_3D.sizes.map((size) => size.weight))].flatMap((weight) =>
      [
        { id: 'i23', densities: 'I/2/3', name: 'Pale Green/Blue/Dark Green', colors: ['sa-sonar-dark-green', 'sa-titan-blue', 'sa-pale-green'] },
        { id: 'i35', densities: 'I/3/5', name: 'Pale Green/Olive/Charcoal', colors: ['sa-charcoal', 'sa-olive', 'sa-pale-green'] },
        { id: '357', densities: '3/5/7', name: 'Olive/Charcoal/Black', colors: ['sa-black', 'sa-charcoal', 'sa-olive'] },
      ]
        .map((set) => ({ ...set, size: TITAN_3D.sizes.find((size) => size.label === `WF${weight}S Sink ${set.densities}`) }))
        .filter(({ size }) => size)
        .map(({ id, name, colors: [head, handling, running], size }) => ({
          id: `wf${weight}-${id}`,
          label: size.label,
          type: 'sinktip',
          weight,
          taper: sameHead(TITAN, size),
          lineup: size,
          colorways: [{ id, name, zones: zones([33.5, head], [20.5, handling], [0, running]) }],
        })),
    ),
  }),
  // A floating Titan with a 15 ft clear intermediate tip (1.25 ips), drawn as a sink tip like RIO's
  // clear tips. Clear tip, horizon to the end of the head, sand running line.
  makerProduct({
    id: 'sa-sonar-titan-tropical-clear-tip',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Tropical/Jungle Clear Tip',
    sizes: LINEUP['sa-sonar-titan-tropical-clear-tip'].sizes.map((size) => ({
      id: `wf${size.weight}-f-i`,
      label: size.label,
      type: 'sinktip',
      weight: size.weight,
      taper: sameHead(TITAN_TROPICAL, size),
      lineup: size,
      colorways: [{ id: 'sand-horizon-clear', name: 'Sand/Horizon/Clear', zones: zones([15, 'sa-clear'], [18.5, 'sa-tropical-horizon'], [0, 'sa-tropical-sand']) }],
    })),
  }),
  // Two sizes heavy, on Tropi-Core. Same 33.5 ft head in every size: horizon head, tan running line.
  // SA's Horizon swatch is close to the Tropical/Jungle Clear Tip's, which it reuses.
  makerProduct({
    id: 'sa-mastery-jungle-titan',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Tropical/Jungle Titan',
    sizes: LINEUP['sa-mastery-jungle-titan'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(JUNGLE_TITAN, size),
      lineup: size,
      colorways: [{ id: 'tan-horizon', name: 'Tan/Horizon', zones: zones([33.5, 'sa-tropical-horizon'], [0, 'sa-tan']) }],
    })),
  }),
  // Two sizes heavy: a floating Titan with an intermediate, Sink 3 or Sink 6 tip, all drawn as sink
  // tips. Each density has its own tip color (SA's swatches): the tip, moss to the end of the head,
  // willow running line.
  makerProduct({
    id: 'sa-sonar-titan-sink-tip',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Sink Tip',
    sizes: [...new Set(LINEUP['sa-sonar-titan-sink-tip'].sizes.map((size) => size.weight))].flatMap((weight) =>
      [
        { id: 'i', density: 'I', tip: { id: 'pale-green', name: 'Pale Green', color: 'sa-titan-pale-green' } },
        { id: 's3', density: 'S3', tip: { id: 'dark-green', name: 'Dark Green', color: 'sa-titan-dark-green' } },
        { id: 's6', density: 'S6', tip: { id: 'black', name: 'Black', color: 'sa-titan-black' } },
      ].map(({ id, density, tip }) => {
        const size = lineupSize(LINEUP['sa-sonar-titan-sink-tip'], `WF${weight}F/${density}`);
        const length = TITAN_SINK_TIP_LENGTH[weight];
        return {
          id: `wf${weight}-f-${id}`,
          label: size.label,
          type: 'sinktip',
          weight,
          taper: sameHead(TITAN_SINK_TIP, size),
          lineup: size,
          colorways: [
            { id: `willow-moss-${tip.id}`, name: `Willow/Moss/${tip.name}`, zones: zones([length, tip.color], [size.head - length, 'sa-sonar-moss'], [0, 'sa-titan-willow']) },
          ],
        };
      }),
    ),
  }),
  // Grain-rated: the rod weight for each is our estimate (the lineup has none). Every size has a
  // 25 ft sinking head, then a floating handling line; the split inside the head is estimated. Sink 6
  // is about 6 ips.
  makerProduct({
    id: 'sa-sonar-sink-25-cold',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Sink 25 Cold',
    sizes: [
      [150, 5],
      [200, 7],
      [250, 8],
      [300, 9],
      [350, 10],
    ].flatMap(([grains, weight]) =>
      [
        { rate: 3, name: 'Dark Green/Ivory', head: 'sa-sonar-dark-green', running: 'sa-ivory' },
        { rate: 6, name: 'Charcoal/Moss', head: 'sa-charcoal', running: 'sa-sonar-moss' },
      ].map(({ rate, name, head, running }) => {
        const size = lineupSize(SINK_25_COLD, `${grains}gr F/S${rate}`);
        return {
          id: `${grains}-s${rate}`,
          label: `${grains} gr Sink ${rate}`,
          type: 'sinktip',
          weight,
          taper: sameHead([2, 22, 1], size),
          estimated: true,
          lineup: overriding(size, { weight }),
          colorways: [{ id: 'standard', name, zones: zones([25, head], [0, running]) }],
        };
      }),
    ),
  }),
  // Level euro line (0.022″) on a mono core, drawn like RIO's (see rio.js): a token 1.5 ft head on
  // SA's 80 ft total. One size for 0–5 wt rods, drawn as a 3 wt. Formerly Mastery Competition Nymph.
  makerProduct({
    id: 'sa-mastery-euro-tactical-nymph-mono',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Euro Tactical Nymph Mono',
    sizes: [
      {
        id: 'level',
        label: 'Level 0–5 wt',
        type: 'floating',
        weight: 3,
        taper: [0.5, 0.5, 0.5, EURO_MONO.total - 1.5],
        lineup: overriding(EURO_MONO, { weight: 3, head: 1.5 }),
        colorways: [{ id: 'bamboo', name: 'Bamboo', zones: zones([0, 'sa-bamboo']) }],
      },
    ],
  }),
  // One size, WF5/6. SA's diagram: front taper 5, belly 31.5, rear taper 3.5, the 40 ft head SA
  // lists; the bump about 52 ft from the tip is in the running line. All green.
  makerProduct({
    id: 'sa-aircel-trout-5-6',
    maker: 'Scientific Anglers',
    name: 'SA Air Cel Trout',
    sizes: floating(AIR_CEL, 5, LINEUP['sa-aircel-trout-5-6'].sizes, () => [{ id: 'green', name: 'Green', zones: zones([0, 'sa-green']) }]),
  }),
  // Same 45 ft head in every size. Camo front taper (the diagram's camo runs to its end), bronze to the
  // end of the head, dark grass running line.
  makerProduct({
    id: 'sa-amplitude-smooth-carp',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Carp',
    sizes: LINEUP['sa-amplitude-smooth-carp'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(CARP, size),
      lineup: size,
      colorways: [{ id: 'dark-grass-bronze-camo', name: 'Dark Grass/Bronze/Camo', zones: zones([CARP[0], 'sa-carp-camo'], [45 - CARP[0], 'sa-bronze'], [0, 'sa-dark-grass']) }],
    })),
  }),
  // Half-size heavy. Horizon head, sand running line, black sighter.
  makerProduct({
    id: 'sa-amplitude-smooth-infinity-salt',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Infinity Salt',
    sizes: floating(INFINITY_SALT, 8, LINEUP['sa-amplitude-smooth-infinity-salt'].sizes, (head) => [
      { id: 'black-sand-horizon', name: 'Black/Sand/Horizon', zones: sighted(head, 'sa-infinity-salt-horizon', 'sa-infinity-salt-sand', 'sa-titan-black') },
    ]),
  }),
  // The Cold version: horizon head, sand running line, black sighter. SA's Horizon and Black swatches
  // match the Infinity Salt's and the Titan's, which they reuse; Sand is close to the Grand Slam's.
  makerProduct({
    id: 'sa-amplitude-smooth-redfish-cold',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Redfish Cold',
    sizes: LINEUP['sa-amplitude-smooth-redfish-cold'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(REDFISH, size),
      lineup: size,
      colorways: [{ id: 'black-sand-horizon', name: 'Black/Sand/Horizon', zones: sighted(31, 'sa-infinity-salt-horizon', 'sa-sand', 'sa-titan-black') }],
    })),
  }),
  // Short head for quick shots. Surf head, sand running line, black sighter; SA's Surf swatch is the
  // Bonefish's.
  makerProduct({
    id: 'sa-amplitude-smooth-tarpon',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Tarpon',
    sizes: LINEUP['sa-amplitude-smooth-tarpon'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(TARPON, size),
      lineup: size,
      colorways: [{ id: 'black-sand-surf', name: 'Black/Sand/Surf', zones: sighted(36, 'sa-surf', 'sa-tarpon-sand', 'sa-tarpon-black') }],
    })),
  }),
  // A floating texture on the tip and a shooting texture behind it. Ivory head, pale
  // yellow running line, black sighter; SA's Ivory and Black swatches are close to the Bonefish's.
  makerProduct({
    id: 'sa-amplitude-textured-bonefish-plus',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Bonefish Plus',
    sizes: LINEUP['sa-amplitude-textured-bonefish-plus'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(BONEFISH_PLUS, size),
      lineup: size,
      colorways: [{ id: 'black-pale-yellow-ivory', name: 'Black/Pale Yellow/Ivory', zones: sighted(50.5, 'sa-ivory', 'sa-bonefish-plus-pale-yellow', 'sa-black') }],
    })),
  }),
  // Sold with leader and backing. The diagram's 40 ft head is the WF6's; the other sizes (34–44 ft
  // heads) scale it. One color.
  makerProduct({
    id: 'sa-air-cel-kit',
    maker: 'Scientific Anglers',
    name: 'SA Air Cel Kit',
    sizes: floating(AIR_CEL, 6, LINEUP['sa-air-cel-kit'].sizes, () => [{ id: 'green', name: 'Green', zones: zones([0, 'sa-green']) }]),
  }),
  // Every size has the same 40 ft head. Yellow in every size, orange in WF4–6.
  makerProduct({
    id: 'sa-air-cel-wf',
    maker: 'Scientific Anglers',
    name: 'SA Air Cel WF',
    sizes: LINEUP['sa-air-cel-wf'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(AIR_CEL, size),
      lineup: size,
      colorways: [
        { id: 'yellow', name: 'Yellow', zones: zones([0, 'sa-yellow']) },
        ...(size.weight <= 6 ? [{ id: 'orange', name: 'Orange', zones: zones([0, 'sa-air-cel-orange']) }] : []),
      ],
    })),
  }),
  // A floating Air Cel with a Sink 4 tip, drawn as a sink tip. Same 40 ft head in every size. SA's
  // table has no tip length; the diagram's charcoal tip measures about 12.5 ft, then green.
  makerProduct({
    id: 'sa-wetcel-sink-tip',
    maker: 'Scientific Anglers',
    name: 'SA Wet Cel Sink Tip',
    sizes: LINEUP['sa-wetcel-sink-tip'].sizes.map((size) => ({
      id: `wf${size.weight}-f-s4`,
      label: size.label,
      type: 'sinktip',
      weight: size.weight,
      taper: sameHead(AIR_CEL, size),
      lineup: size,
      colorways: [{ id: 'green-charcoal', name: 'Green/Charcoal', zones: zones([12.5, 'sa-wet-cel-charcoal'], [0, 'sa-wet-cel-green']) }],
    })),
  }),
  // Drawn, like Cortland's double tapers, as all head with no running line.
  makerProduct({
    id: 'sa-amplitude-smooth-double-taper',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Double Taper',
    sizes: LINEUP['sa-amplitude-smooth-double-taper'].sizes.map((size) => ({
      id: `dt${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: doubleTaper(size),
      estimated: size.weight !== 5,
      lineup: overriding(size, { head: size.total }),
      colorways: [
        { id: 'mist-green-leather-buckskin', name: 'Mist Green/Leather/Buckskin', zones: zones([40, 'sa-buckskin'], [5, 'sa-leather'], [0, 'sa-mist-green']) },
      ],
    })),
  }),
  // WF6 diagram: front 6, belly 24, two rear tapers 19 (49 ft head); the other sizes scale it. Tannic
  // front taper, bronze head, mist green running line. SA's Bronze here is lighter than the Carp's.
  makerProduct({
    id: 'sa-amplitude-smooth-infinity-warm',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Infinity Warm',
    sizes: floating([6, 24, 19], 6, LINEUP['sa-amplitude-smooth-infinity-warm'].sizes, (head, [front]) => [
      { id: 'mist-green-bronze-tannic', name: 'Mist Green/Bronze/Tannic', zones: zones([front, 'sa-tannic'], [head - front, 'sa-infinity-warm-bronze'], [0, 'sa-mist-green']) },
    ]),
  }),
  // The Warm version, on the Redfish split above: horizon head, turtle grass running line, black
  // sighter. SA's Horizon swatch matches the Infinity Salt's; Black is the Bonefish's.
  makerProduct({
    id: 'sa-amplitude-smooth-redfish-warm',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Redfish Warm',
    sizes: LINEUP['sa-amplitude-smooth-redfish-warm'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(REDFISH, size),
      lineup: size,
      colorways: [
        { id: 'black-turtle-grass-horizon', name: 'Black/Turtle Grass/Horizon', zones: sighted(31, 'sa-infinity-salt-horizon', 'sa-turtle-grass', 'sa-black') },
      ],
    })),
  }),
  // Half-size heavy: SA's Grand Slam taper with a longer head. Same 50.5 ft head in every size: ivory
  // head, pale yellow running line, black sighter. The Textured Bonefish Plus's taper and colors.
  makerProduct({
    id: 'sa-amplitude-smooth-bonefish-plus',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Bonefish Plus',
    sizes: LINEUP['sa-amplitude-smooth-bonefish-plus'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(BONEFISH_PLUS, size),
      lineup: size,
      colorways: [{ id: 'black-pale-yellow-ivory', name: 'Black/Pale Yellow/Ivory', zones: sighted(50.5, 'sa-ivory', 'sa-bonefish-plus-pale-yellow', 'sa-black') }],
    })),
  }),
  // One size heavy: SA's Infinity taper scaled up. Willow front taper, buckskin to the end of the head,
  // mist green running line.
  makerProduct({
    id: 'sa-amplitude-smooth-infinity-plus',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Infinity Plus',
    sizes: floating(INFINITY_PLUS, 5, LINEUP['sa-amplitude-smooth-infinity-plus'].sizes, (head, [front]) => [
      { id: 'mist-green-buckskin-willow', name: 'Mist Green/Buckskin/Willow', zones: zones([front, 'sa-infinity-plus-willow'], [head - front, 'sa-infinity-plus-buckskin'], [0, 'sa-mist-green']) },
    ]),
  }),
  // True to weight. SA's text says a 45 ft head, but its table and diagram agree on 56–58 ft. Leather
  // front tapers, sage green to the end of the head, pale yellow running line.
  makerProduct({
    id: 'sa-amplitude-smooth-panfish',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Panfish',
    sizes: LINEUP['sa-amplitude-smooth-panfish'].sizes.map((size) => {
      const { weight, head, total } = size;
      const taper = scaled(PANFISH, head);
      return {
        id: `wf${weight}f`,
        label: size.label,
        type: 'floating',
        weight,
        taper: [...taper, total - head],
        estimated: head !== 58,
        lineup: size,
        colorways: [
          { id: 'pale-yellow-sage-leather', name: 'Pale Yellow/Sage Green/Leather', zones: zones([taper[0], 'sa-leather'], [head - taper[0], 'sa-sage'], [0, 'sa-panfish-pale-yellow']) },
        ],
      };
    }),
  }),
  // Two sizes heavy, for big flies. Same 30 ft head in every size: sand head, grass running line, black
  // sighter. SA's Grass swatch matches the Redfish Warm's Turtle Grass, and its Black the Titan's.
  makerProduct({
    id: 'sa-amplitude-smooth-striper',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Striper',
    sizes: LINEUP['sa-amplitude-smooth-striper'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(STRIPER, size),
      lineup: size,
      colorways: [{ id: 'black-grass-sand', name: 'Black/Grass/Sand', zones: sighted(30, 'sa-sand', 'sa-turtle-grass', 'sa-titan-black') }],
    })),
  }),
  // Half-size heavy saltwater line: the Smooth Infinity Salt's taper and colors with a texture.
  makerProduct({
    id: 'sa-amplitude-textured-infinity-salt',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Infinity Salt',
    sizes: floating(INFINITY_SALT, 8, LINEUP['sa-amplitude-textured-infinity-salt'].sizes, (head) => [
      { id: 'black-sand-horizon', name: 'Black/Sand/Horizon', zones: sighted(head, 'sa-infinity-salt-horizon', 'sa-infinity-salt-sand', 'sa-titan-black') },
    ]),
  }),
  // The Smooth Trout Expert with SA's textures. Its own WF5 diagram has the same ticks and swatches as
  // SA's current Smooth Trout Expert diagram, so it draws like the Smooth.
  makerProduct({
    id: 'sa-amplitude-textured-trout-expert',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Trout Expert',
    sizes: floating(TROUT_EXPERT, 5, LINEUP['sa-amplitude-textured-trout-expert'].sizes, (head, [front, body]) => {
      const tip = half((6.5 * head) / 69);
      return [
        { id: 'leather-sage-buckskin', name: 'Leather/Sage Green/Buckskin', zones: zones([tip, 'sa-buckskin'], [front + body - tip, 'sa-sage'], [0, 'sa-leather']) },
      ];
    }),
  }),
  // The Smooth Tarpon with SA's textures. Its own diagram has the same ticks and swatches as the Smooth
  // Tarpon's, so it draws like the Smooth.
  makerProduct({
    id: 'sa-amplitude-textured-tarpon',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Tarpon',
    sizes: LINEUP['sa-amplitude-textured-tarpon'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(TARPON, size),
      lineup: size,
      colorways: [{ id: 'black-sand-surf', name: 'Black/Sand/Surf', zones: sighted(36, 'sa-surf', 'sa-tarpon-sand', 'sa-tarpon-black') }],
    })),
  }),
  // Half-size heavy budget saltwater line. One color.
  makerProduct({
    id: 'sa-frequency-saltwater',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Saltwater',
    sizes: LINEUP['sa-frequency-saltwater'].sizes.map((size) => {
      const { weight, head, total } = size;
      const taper = scaled(FREQUENCY_SALTWATER, head);
      return {
        id: `wf${weight}f`,
        label: size.label,
        type: 'floating',
        weight,
        taper: [...taper, total - head],
        estimated: head !== 40,
        lineup: size,
        colorways: [{ id: 'light-blue', name: 'Light Blue', zones: zones([0, 'sa-frequency-saltwater-light-blue']) }],
      };
    }),
  }),
  // Half-size heavy clear floater. Its diagram measures the Textured Infinity's split on the WF5's 49 ft
  // head; the other sizes scale it. Every size comes as Clear Tip (SA's 10 ft clear tip, then buckskin)
  // and as Clear Head (clear to the end of the head, then buckskin). SA's Buckskin swatch is close to
  // the Infinity's, which it reuses; Clear is the Magnitude lines' clear.
  makerProduct({
    id: 'sa-magnitude-smooth-infinity-clear-float',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Smooth Infinity Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-smooth-infinity-clear-float'].sizes.map((size) => size.weight))].map((weight) => {
      const size = lineupSize(LINEUP['sa-magnitude-smooth-infinity-clear-float'], `WF${weight}F Clear Tip`);
      const { head, total } = size;
      const taper = scaled(INFINITY_PLUS, head);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: [...taper, total - head],
        estimated: weight !== 5,
        lineup: size,
        colorways: [
          { id: 'buckskin-clear-tip', name: 'Buckskin/Clear Tip', zones: zones([10, 'sa-magnitude-clear'], [0, 'sa-buckskin']) },
          { id: 'buckskin-clear-head', name: 'Buckskin/Clear Head', zones: zones([head, 'sa-magnitude-clear'], [0, 'sa-buckskin']) },
        ],
      };
    }),
  }),
  // Clear floating saltwater line, same 43.5 ft head in every size. Clear Tip: SA's 15 ft clear tip,
  // light olive to the end of the head, a clear sighter (about 15 ft on the diagram), then light olive
  // running line. Full Clear is the same line in one color.
  makerProduct({
    id: 'sa-magnitude-textured-balance-clear-float',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Textured Balance Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-textured-balance-clear-float'].sizes.map((size) => size.weight))].map((weight) => {
      const size = lineupSize(LINEUP['sa-magnitude-textured-balance-clear-float'], `WF${weight}F Clear Tip`);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: sameHead(MAGNITUDE_BALANCE, size),
        lineup: size,
        colorways: [
          {
            id: 'light-olive-clear-tip',
            name: 'Light Olive/Clear Tip',
            zones: zones([15, 'sa-magnitude-clear'], [28.5, 'sa-magnitude-balance-light-olive'], [15, 'sa-magnitude-clear'], [0, 'sa-magnitude-balance-light-olive']),
          },
          { id: 'clear', name: 'Clear', zones: zones([0, 'sa-magnitude-clear']) },
        ],
      };
    }),
  }),
  // The Smooth Tarpon's taper as a clear floater; its own diagram measures the same split on the 36 ft
  // head SA lists for every size. Clear Tip: SA's 12 ft clear tip, sand to the end of the head, a 10 ft
  // clear sighter (on the diagram), then sand running line. Full Clear is the same line in one color.
  // SA's Sand swatch is the Grand Slam's, and its Clear the Magnitude lines' clear.
  makerProduct({
    id: 'sa-magnitude-textured-tarpon-clear-float',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Textured Tarpon Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-textured-tarpon-clear-float'].sizes.map((size) => size.weight))].map((weight) => {
      const size = lineupSize(LINEUP['sa-magnitude-textured-tarpon-clear-float'], `WF${weight}F Clear Tip`);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: sameHead(TARPON, size),
        lineup: size,
        colorways: [
          { id: 'sand-clear-tip', name: 'Sand/Clear Tip', zones: zones([12, 'sa-magnitude-clear'], [24, 'sa-sand'], [10, 'sa-magnitude-clear'], [0, 'sa-sand']) },
          { id: 'clear', name: 'Clear', zones: zones([0, 'sa-magnitude-clear']) },
        ],
      };
    }),
  }),
  // True to weight, with a long head and rear taper for distance and mending. All orange.
  makerProduct({
    id: 'sa-mastery-expert-distance',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Expert Distance',
    sizes: floating(MASTERY_EXPERT_DISTANCE, 7, LINEUP['sa-mastery-expert-distance'].sizes, () => [
      { id: 'orange', name: 'Orange', zones: zones([0, 'sa-mastery-expert-distance-orange']) },
    ]),
  }),
  // The Amplitude Smooth Panfish in Mastery; its own diagram measures the same split on the same heads
  // (SA's text says 45 ft here too). A leather head on a sage green running line; SA's swatches match
  // the Trout GP's Sage and the Creek Trout's Leather.
  makerProduct({
    id: 'sa-mastery-panfish',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Panfish',
    sizes: LINEUP['sa-mastery-panfish'].sizes.map((size) => {
      const { weight, head, total } = size;
      const taper = scaled(PANFISH, head);
      return {
        id: `wf${weight}f`,
        label: size.label,
        type: 'floating',
        weight,
        taper: [...taper, total - head],
        estimated: head !== 58,
        lineup: size,
        colorways: [{ id: 'sage-leather', name: 'Sage Green/Leather', zones: zones([head, 'sa-leather'], [0, 'sa-sage']) }],
      };
    }),
  }),
  // Two sizes heavy, warm water: a floating Titan with a 5 ft Sink 5 tip (SA's table), drawn as a sink
  // tip. Its diagram measures the Titan Sink Tip's split on the same 43 ft head, in every size.
  // Charcoal tip, shad blue to the end of the head, pale yellow running line.
  makerProduct({
    id: 'sa-sonar-titan-sink-tip-mini',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Titan Sink Tip Mini',
    sizes: LINEUP['sa-sonar-titan-sink-tip-mini'].sizes.map((size) => ({
      id: `wf${size.weight}-f-s5`,
      label: size.label,
      type: 'sinktip',
      weight: size.weight,
      taper: sameHead(TITAN_SINK_TIP, size),
      lineup: size,
      colorways: [
        {
          id: 'pale-yellow-shad-blue-charcoal',
          name: 'Pale Yellow/Shad Blue/Charcoal',
          zones: zones([5, 'sa-titan-sink-tip-mini-charcoal'], [38, 'sa-titan-sink-tip-mini-shad-blue'], [0, 'sa-titan-sink-tip-mini-pale-yellow']),
        },
      ],
    })),
  }),
  // Half-size heavy: SA's Infinity taper in Mastery. A buckskin head on a bamboo running line.
  makerProduct({
    id: 'sa-mastery-infinity',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Infinity',
    sizes: floating(MASTERY_INFINITY, 5, LINEUP['sa-mastery-infinity'].sizes, (head) => [
      { id: 'bamboo-buckskin', name: 'Bamboo/Buckskin', zones: zones([head, 'sa-buckskin'], [0, 'sa-bamboo']) },
    ]),
  }),
  // True to weight, with SA's 10 ft clear floating tip (the Magnitude clear); sage green over the rest
  // of the line.
  makerProduct({
    id: 'sa-magnitude-smooth-trout-expert-clear-tip-float',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Smooth Trout Expert Clear Tip Float',
    sizes: floating(MAGNITUDE_TROUT_EXPERT, 5, LINEUP['sa-magnitude-smooth-trout-expert-clear-tip-float'].sizes, () => [
      { id: 'sage-green-clear', name: 'Sage Green/Clear', zones: zones([10, 'sa-magnitude-clear'], [0, 'sa-sage']) },
    ]),
  }),
  // Half-size heavy: the Bonefish Plus clear floater; its diagram measures the Bonefish Plus split to
  // half a foot, on the same 50.5 ft head in every size. Every size comes as Clear Tip: ivory with SA's
  // 10 ft clear tip, and a 10 ft sighter just behind the head that the diagram draws in the tip's clear.
  // WF7–9 also come as Full Clear. SA's Ivory swatch here is lighter than the Bonefish's, and its Clear
  // is the Magnitude clear, grayer than the Titan Clear Tip's; reusing those would draw the tip and
  // the head alike.
  makerProduct({
    id: 'sa-magnitude-smooth-bonefish-plus-clear-tip',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Smooth Bonefish Plus Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-smooth-bonefish-plus-clear-tip'].sizes.map((size) => size.weight))].map((weight) => {
      const lineup = LINEUP['sa-magnitude-smooth-bonefish-plus-clear-tip'];
      const size = lineupSize(lineup, `WF${weight}F Clear Tip`);
      const fullClear = lineup.sizes.some((s) => s.label === `WF${weight}F Full Clear`);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: sameHead(BONEFISH_PLUS, size),
        lineup: size,
        colorways: [
          {
            id: 'ivory-clear-tip',
            name: 'Ivory/Clear Tip',
            zones: zones([10, 'sa-magnitude-clear'], [40.5, 'sa-magnitude-bonefish-plus-ivory'], [10, 'sa-magnitude-clear'], [0, 'sa-magnitude-bonefish-plus-ivory']),
          },
          ...(fullClear ? [{ id: 'clear', name: 'Clear', zones: zones([0, 'sa-magnitude-clear']) }] : []),
        ],
      };
    }),
  }),
  // Half-size heavy: the Infinity Salt clear floater with SA's textures; its diagram measures the
  // Infinity Salt split on the WF8's 49 ft head, and the other sizes scale it. Every size comes as Clear
  // Tip: translucent aqua with SA's 12 ft clear tip and a 10 ft sighter just behind the head that the
  // diagram draws in the tip's clear. WF8–10 also come as Full Clear. SA's Clear swatch is the
  // Magnitude clear.
  makerProduct({
    id: 'sa-magnitude-textured-infinity-salt-clear-tip',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Textured Infinity Salt Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-textured-infinity-salt-clear-tip'].sizes.map((size) => size.weight))].map((weight) => {
      const lineup = LINEUP['sa-magnitude-textured-infinity-salt-clear-tip'];
      const size = lineupSize(lineup, `WF${weight}F Clear Tip`);
      const fullClear = lineup.sizes.some((s) => s.label === `WF${weight}F Full Clear`);
      const { head, total } = size;
      const taper = scaled(INFINITY_SALT, head);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: [...taper, total - head],
        estimated: weight !== 8,
        lineup: size,
        colorways: [
          {
            id: 'translucent-aqua-clear-tip',
            name: 'Translucent Aqua/Clear Tip',
            zones: zones([12, 'sa-magnitude-clear'], [head - 12, 'sa-magnitude-infinity-salt-translucent-aqua'], [10, 'sa-magnitude-clear'], [0, 'sa-magnitude-infinity-salt-translucent-aqua']),
          },
          ...(fullClear ? [{ id: 'clear', name: 'Clear', zones: zones([0, 'sa-magnitude-clear']) }] : []),
        ],
      };
    }),
  }),
  // Overweighted, for big flies and night fishing. One color: Glow is ivory by day (SA's swatch, close
  // to the Bonefish's Ivory) and green in the dark; drawn as it looks by day.
  makerProduct({
    id: 'sa-frequency-magnum-glow',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Magnum Glow',
    sizes: floating(MAGNUM_GLOW, 7, LINEUP['sa-frequency-magnum-glow'].sizes, () => [{ id: 'glow', name: 'Glow', zones: zones([0, 'sa-ivory']) }]),
  }),
  // Two sizes heavy: a floating line with SA's 5.5 ft Sink 2 tip (2 ips), drawn as a sink tip (the
  // diagram's tip color measures about 3.5 ft). Dark green tip, willow to the end of the head, grass
  // running line. SA's Willow swatch is close to the Mastery MPX's, and its Grass matches the Redfish
  // Warm's Turtle Grass.
  makerProduct({
    id: 'sa-sonar-stillwater-emerger-tip',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Stillwater Emerger Tip',
    sizes: LINEUP['sa-sonar-stillwater-emerger-tip'].sizes.map((size) => ({
      id: `wf${size.weight}-f-s2`,
      label: size.label,
      type: 'sinktip',
      weight: size.weight,
      taper: sameHead(STILLWATER_EMERGER_TIP, size),
      lineup: size,
      colorways: [{ id: 'grass-willow-dark-green', name: 'Grass/Willow/Dark Green', zones: zones([5.5, 'sa-emerger-tip-dark-green'], [39.5, 'sa-willow'], [0, 'sa-turtle-grass']) }],
    })),
  }),
  // The Smooth Double Taper with SA's textures; its own DT5 diagram measures the same tapers and the
  // same leather band. Drawn, like it, as all head with no running line.
  makerProduct({
    id: 'sa-amplitude-textured-double-taper',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Double Taper',
    sizes: LINEUP['sa-amplitude-textured-double-taper'].sizes.map((size) => ({
      id: `dt${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: doubleTaper(size),
      estimated: size.weight !== 5,
      lineup: overriding(size, { head: size.total }),
      colorways: [
        { id: 'mist-green-leather-buckskin', name: 'Mist Green/Leather/Buckskin', zones: zones([40, 'sa-buckskin'], [5, 'sa-leather'], [0, 'sa-mist-green']) },
      ],
    })),
  }),
  // Full sinkers on the Air Cel taper: the diagram measures front 4.5, belly 31.5, rear 3.5, within half
  // a foot of the Air Cel split, on the same 40 ft head in every size. Only the Intermediate (1.25 ips,
  // clear) and Sink 6 (black, drawn as Type 5 like the Frequency Full Sink's) are drawn; Sink 2 and
  // Sink 4 have no line type yet. SA's Black swatch is the Titan's.
  makerProduct({
    id: 'sa-wetcel',
    maker: 'Scientific Anglers',
    name: 'SA Wet Cel Full Sink',
    sizes: LINEUP['sa-wetcel'].sizes
      .filter((size) => size.density === 'intermediate' || size.density === 'sink6')
      .map((size) => {
        const sink6 = size.density === 'sink6';
        return {
          id: sink6 ? `wf${size.weight}s6` : `wf${size.weight}i`,
          label: size.label,
          type: sink6 ? 'sink5' : 'intermediate',
          weight: size.weight,
          taper: sameHead(AIR_CEL, size),
          lineup: size,
          colorways: [sink6 ? { id: 'black', name: 'Black', zones: zones([0, 'sa-titan-black']) } : { id: 'clear', name: 'Clear', zones: zones([0, 'sa-clear']) }],
        };
      }),
  }),
  // Quarter-size heavy: the Amplitude Smooth Trout GP taper in Mastery. Its own WF5 diagram (50.5 ft
  // head) measures the same split. Sage head, butter running line; SA's swatches are the Smooth Trout
  // GP's.
  makerProduct({
    id: 'sa-mastery-trout-gp',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Trout GP',
    sizes: floating([6, 22, 22.5], 5, LINEUP['sa-mastery-trout-gp'].sizes, (head) => [
      { id: 'butter-sage', name: 'Butter/Sage', zones: zones([head, 'sa-sage'], [0, 'sa-butter']) },
    ]),
  }),
  // SA's cold-water version of its tropical Mastery Grand Slam. Same 40 ft head in every size: sand
  // head, pale yellow running line. SA's Pale Yellow swatch matches the Panfish's.
  makerProduct({
    id: 'sa-mastery-grand-slam-cold',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Grand Slam Cold',
    sizes: LINEUP['sa-mastery-grand-slam-cold'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(MASTERY_GRAND_SLAM_COLD, size),
      lineup: size,
      colorways: [{ id: 'pale-yellow-sand', name: 'Pale Yellow/Sand', zones: zones([40, 'sa-mastery-grand-slam-cold-sand'], [0, 'sa-panfish-pale-yellow']) }],
    })),
  }),
  // One and a half sizes heavy: the Anadro Indicator taper in Mastery. Its own diagram has the Smooth
  // Anadro's ticks. Yellow to the end of the front belly (about 7.5 ft, as on the Smooth), then green.
  makerProduct({
    id: 'sa-mastery-anadro',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Anadro Indicator',
    sizes: floating(ANADRO, 7, LINEUP['sa-mastery-anadro'].sizes, (head) => {
      const tip = half((7.5 * head) / 61);
      return [{ id: 'green-yellow', name: 'Green/Yellow', zones: zones([tip, 'sa-mastery-anadro-yellow'], [0, 'sa-mastery-anadro-green']) }];
    }),
  }),
  // Two sizes heavy, on Tropi-Core. Its own diagram measures the Sonar Titan Sink Tip's split, scaled
  // to the 43 ft head SA lists for every size. A camo tip (about 15.5 ft on the diagram; SA's camo
  // swatch is striped, drawn here as its average), dark turtle grass to the end of the head, horizon
  // running line and a 10 ft black sighter. SA's Horizon and Black swatches match the Infinity Salt's
  // and the Titan's.
  makerProduct({
    id: 'sa-amplitude-smooth-tropical-jungle-titan',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Tropical/Jungle Titan',
    sizes: LINEUP['sa-amplitude-smooth-tropical-jungle-titan'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(TITAN_SINK_TIP, size),
      lineup: size,
      colorways: [
        {
          id: 'black-horizon-dark-turtle-grass-camo',
          name: 'Black/Horizon/Dark Turtle Grass/Camo',
          zones: zones([15.5, 'sa-amplitude-tropical-titan-camo'], [27.5, 'sa-amplitude-tropical-titan-dark-turtle-grass'], [47, 'sa-infinity-salt-horizon'], [0, 'sa-titan-black']),
        },
      ],
    })),
  }),
  // Half-size heavy general-purpose floater. One color, willow; SA's swatch is the Anadro's.
  makerProduct({
    id: 'sa-frequency-boost',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Boost',
    sizes: LINEUP['sa-frequency-boost'].sizes.map((size) => {
      const { weight, head, total } = size;
      return {
        id: `wf${weight}f`,
        label: size.label,
        type: 'floating',
        weight,
        taper: [...scaled(FREQUENCY_BOOST, head), total - head],
        estimated: head !== 36,
        lineup: size,
        colorways: [{ id: 'willow', name: 'Willow', zones: zones([0, 'sa-anadro-willow']) }],
      };
    }),
  }),
  // Overweighted, for big flies. One color; SA's Optic Green here is paler than the Amplitude lines'.
  makerProduct({
    id: 'sa-frequency-magnum',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Magnum',
    sizes: floating(FREQUENCY_MAGNUM, 7, LINEUP['sa-frequency-magnum'].sizes, () => [
      { id: 'optic-green', name: 'Optic Green', zones: zones([0, 'sa-frequency-magnum-optic-green']) },
    ]),
  }),
  // 1.7 ips, two sizes heavy. Same 45 ft head in every size: olive drab head, light gray running line.
  makerProduct({
    id: 'sa-sonar-stillwater-intermediate',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Stillwater Intermediate',
    sizes: LINEUP['sa-sonar-stillwater-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: sameHead(SONAR_STILLWATER_INTERMEDIATE, size),
      lineup: size,
      colorways: [
        { id: 'light-gray-olive-drab', name: 'Light Gray/Olive Drab', zones: zones([45, 'sa-sonar-stillwater-intermediate-olive-drab'], [0, 'sa-sonar-stillwater-intermediate-light-gray']) },
      ],
    })),
  }),
  // Overweighted clear floater, a more refined taper than SA's other saltwater lines. Same 43.5 ft head
  // in every size. Clear Tip: SA's 15 ft clear tip, light olive to the end of the head, a clear sighter
  // (about 15 ft on the diagram), then light olive running line. Full Clear is the same line in one
  // color. Its own diagram measures the Textured Balance's split and swatches, so it shares
  // MAGNITUDE_BALANCE and the Textured's Light Olive and Magnitude Clear, and draws like it.
  makerProduct({
    id: 'sa-magnitude-smooth-balance-clear-float',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Smooth Balance Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-smooth-balance-clear-float'].sizes.map((size) => size.weight))].map((weight) => {
      const size = lineupSize(LINEUP['sa-magnitude-smooth-balance-clear-float'], `WF${weight}F Clear Tip`);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: sameHead(MAGNITUDE_BALANCE, size),
        lineup: size,
        colorways: [
          {
            id: 'light-olive-clear-tip',
            name: 'Light Olive/Clear Tip',
            zones: zones([15, 'sa-magnitude-clear'], [28.5, 'sa-magnitude-balance-light-olive'], [15, 'sa-magnitude-clear'], [0, 'sa-magnitude-balance-light-olive']),
          },
          { id: 'clear', name: 'Clear', zones: zones([0, 'sa-magnitude-clear']) },
        ],
      };
    }),
  }),
  // SA's table gives each size's belly; the diagram's belly measures 81.5 ft, the DT2's, between a
  // 4 ft front and a 4.5 ft rear taper on the 90 ft line. As with the Amplitude Smooth Double Taper,
  // each size splits the rest equally between its ends, and the sizes other than DT2 are marked
  // estimated. Drawn as all head with no running line. All dark willow.
  makerProduct({
    id: 'sa-mastery-double-taper',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Double Taper',
    sizes: LINEUP['sa-mastery-double-taper'].sizes.map((size) => ({
      id: `dt${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: doubleTaper(size),
      estimated: size.weight !== 2,
      lineup: overriding(size, { head: size.total }),
      colorways: [{ id: 'dark-willow', name: 'Dark Willow', zones: zones([0, 'sa-mastery-double-taper-dark-willow']) }],
    })),
  }),
  // Two sizes heavy, WF11–12. Sand head, surf running line, black sighter; SA's Sand and Black
  // swatches match the Tarpon's, and Surf is the Bonefish's.
  makerProduct({
    id: 'sa-amplitude-smooth-titan-gt',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Smooth Titan GT',
    sizes: LINEUP['sa-amplitude-smooth-titan-gt'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(AMPLITUDE_TITAN_GT, size),
      lineup: size,
      colorways: [{ id: 'black-surf-sand', name: 'Black/Surf/Sand', zones: zones([32.5, 'sa-tarpon-sand'], [47.5, 'sa-surf'], [0, 'sa-tarpon-black']) }],
    })),
  }),
  // Two sizes heavy, with a camo tip. Its diagram measures the Sonar Titan Sink Tip's split (front
  // taper 5.5, two bellies 28, rear taper 10: a 43.5 ft head against the 43 ft SA lists for every
  // size), scaled to 43 the same way. The camo runs about 15 ft from the tip (drawn at the Smooth's
  // 15.5), then dark turtle grass to the end of the head, a horizon running line and a black sighter
  // over the last 10 ft. Its swatches are the Smooth's, so it draws like the Smooth.
  makerProduct({
    id: 'sa-amplitude-tropical-titan',
    maker: 'Scientific Anglers',
    name: 'SA Amplitude Textured Tropical/Jungle Titan',
    sizes: LINEUP['sa-amplitude-tropical-titan'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(TITAN_SINK_TIP, size),
      lineup: size,
      colorways: [
        {
          id: 'black-horizon-dark-turtle-grass-camo',
          name: 'Black/Horizon/Dark Turtle Grass/Camo',
          zones: zones([15.5, 'sa-amplitude-tropical-titan-camo'], [27.5, 'sa-amplitude-tropical-titan-dark-turtle-grass'], [47, 'sa-infinity-salt-horizon'], [0, 'sa-titan-black']),
        },
      ],
    })),
  }),
  // One color over the whole line: moss in every size, orange in WF4–6. SA's Moss swatch is the
  // Sonar's.
  makerProduct({
    id: 'sa-frequency-mpx',
    maker: 'Scientific Anglers',
    name: 'SA Frequency MPX',
    sizes: floating(FREQUENCY_BOOST, 5, LINEUP['sa-frequency-mpx'].sizes, (head, taper, weight) => [
      { id: 'moss', name: 'Moss', zones: zones([0, 'sa-sonar-moss']) },
      ...(weight >= 4 && weight <= 6 ? [{ id: 'orange', name: 'Orange', zones: zones([0, 'sa-frequency-mpx-orange']) }] : []),
    ]),
  }),
  // All sage, the Amplitude Trout GP's Sage.
  makerProduct({
    id: 'sa-frequency-trout-gp',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Trout GP',
    sizes: floating(FREQUENCY_TROUT_GP, 5, LINEUP['sa-frequency-trout-gp'].sizes, () => [{ id: 'sage', name: 'Sage', zones: zones([0, 'sa-sage']) }]),
  }),
  // The Infinity Salt taper as a clear floater; its diagram measures the Amplitude Infinity Salt's
  // split on the WF8's 49 ft head, and the other sizes scale it. Every size comes as Clear Tip:
  // translucent aqua with a clear tip of about 12 ft, and a 10 ft clear sighter just behind the head.
  // WF8–11 also come as Full Clear. Clear is the Magnitude clear; it draws like the Textured.
  makerProduct({
    id: 'sa-magnitude-smooth-infinity-salt-clear-tip',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Smooth Infinity Salt Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-smooth-infinity-salt-clear-tip'].sizes.map((size) => size.weight))].map((weight) => {
      const lineup = LINEUP['sa-magnitude-smooth-infinity-salt-clear-tip'];
      const size = lineupSize(lineup, `WF${weight}F Clear Tip`);
      const { head, total } = size;
      const fullClear = lineup.sizes.some((s) => s.label === `WF${weight}F Full Clear`);
      const aqua = 'sa-magnitude-infinity-salt-translucent-aqua';
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: [...scaled(INFINITY_SALT, head), total - head],
        estimated: weight !== 8,
        lineup: size,
        colorways: [
          { id: 'translucent-aqua-clear-tip', name: 'Translucent Aqua/Clear Tip', zones: zones([12, 'sa-magnitude-clear'], [head - 12, aqua], [10, 'sa-magnitude-clear'], [0, aqua]) },
          ...(fullClear ? [{ id: 'clear', name: 'Clear', zones: zones([0, 'sa-magnitude-clear']) }] : []),
        ],
      };
    }),
  }),
  // The Bonefish Plus taper as a textured clear floater; its diagram measures the Amplitude Bonefish
  // Plus's split on the same 50.5 ft head. Every size comes as Clear Tip: ivory with a 10 ft clear tip
  // and a 10 ft clear sighter just behind the head. WF7–9 also come as Full Clear. Its swatches are the
  // Magnitude Smooth Bonefish Plus's Ivory and the Magnitude clear, so it draws like the Smooth.
  makerProduct({
    id: 'sa-magnitude-textured-bonefish-plus-clear-float',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Textured Bonefish Plus Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-textured-bonefish-plus-clear-float'].sizes.map((size) => size.weight))].map((weight) => {
      const lineup = LINEUP['sa-magnitude-textured-bonefish-plus-clear-float'];
      const size = lineupSize(lineup, `WF${weight}F Clear Tip`);
      const fullClear = lineup.sizes.some((s) => s.label === `WF${weight}F Full Clear`);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: sameHead(BONEFISH_PLUS, size),
        lineup: size,
        colorways: [
          { id: 'ivory-clear-tip', name: 'Ivory/Clear Tip', zones: zones([10, 'sa-magnitude-clear'], [40.5, 'sa-magnitude-bonefish-plus-ivory'], [10, 'sa-magnitude-clear'], [0, 'sa-magnitude-bonefish-plus-ivory']) },
          ...(fullClear ? [{ id: 'clear', name: 'Clear', zones: zones([0, 'sa-magnitude-clear']) }] : []),
        ],
      };
    }),
  }),
  // The Smooth Trout Expert Clear Tip with SA's textures; its own WF5 diagram measures the same split
  // (MAGNITUDE_TROUT_EXPERT), and its clear tip about 9.5 ft, drawn at the Smooth's 10. Sage green over
  // the rest of the line, so it draws like the Smooth.
  makerProduct({
    id: 'sa-magnitude-textured-trout-expert-clear-tip-float',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Textured Trout Expert Clear Tip Float',
    sizes: floating(MAGNITUDE_TROUT_EXPERT, 5, LINEUP['sa-magnitude-textured-trout-expert-clear-tip-float'].sizes, () => [
      { id: 'sage-green-clear', name: 'Sage Green/Clear', zones: zones([10, 'sa-magnitude-clear'], [0, 'sa-sage']) },
    ]),
  }),
  // Three-quarter size heavy, on Tropi-Core. Its own diagram has the Mastery Grand Slam Cold's ticks
  // (front taper 2, front belly 19.5, rear taper 19.5 on a 41 ft head), so it shares
  // MASTERY_GRAND_SLAM_COLD, scaled to the 40 ft head SA lists for every size. An aqua head on a light
  // blue running line; SA's Light Blue swatch is the Frequency Saltwater's.
  makerProduct({
    id: 'sa-mastery-grand-slam',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Grand Slam',
    sizes: LINEUP['sa-mastery-grand-slam'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(MASTERY_GRAND_SLAM_COLD, size),
      lineup: size,
      colorways: [{ id: 'light-blue-aqua', name: 'Light Blue/Aqua', zones: zones([40, 'sa-mastery-grand-slam-aqua'], [0, 'sa-frequency-saltwater-light-blue']) }],
    })),
  }),
  // Half-size heavy compound taper, on Tropi-Core. Its diagram measures the Sonar Saltwater
  // Intermediate's split, the 37.5 ft head of the WF7–9; the WF10 (40 ft head) scales it. A light blue
  // head on a sunrise running line; SA's Light Blue swatch is the Frequency Saltwater's.
  makerProduct({
    id: 'sa-mastery-saltwater',
    maker: 'Scientific Anglers',
    name: 'SA Mastery Saltwater',
    sizes: LINEUP['sa-mastery-saltwater'].sizes.map((size) => {
      const { weight, head, total } = size;
      return {
        id: `wf${weight}f`,
        label: size.label,
        type: 'floating',
        weight,
        taper: [...scaled(SALTWATER_INTERMEDIATE, head), total - head],
        estimated: head !== 37.5,
        lineup: size,
        colorways: [{ id: 'sunrise-light-blue', name: 'Sunrise/Light Blue', zones: zones([head, 'sa-frequency-saltwater-light-blue'], [0, 'sa-mastery-saltwater-sunrise']) }],
      };
    }),
  }),
  // Two sizes heavy, for indicators and long leaders. Same 45 ft head in every size: a buckskin tip,
  // willow to the end of the head, grass running line. SA's Willow and Grass swatches are the Emerger
  // Tip's, and its Buckskin is close to the Infinity Plus's.
  makerProduct({
    id: 'sa-sonar-stillwater-float',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Stillwater Float',
    sizes: LINEUP['sa-sonar-stillwater-float'].sizes.map((size) => ({
      id: `wf${size.weight}f`,
      label: size.label,
      type: 'floating',
      weight: size.weight,
      taper: sameHead(SONAR_STILLWATER_FLOAT, size),
      lineup: size,
      colorways: [{ id: 'grass-willow-buckskin', name: 'Grass/Willow/Buckskin', zones: zones([4, 'sa-infinity-plus-buckskin'], [41, 'sa-willow'], [0, 'sa-turtle-grass']) }],
    })),
  }),
  // 1.25 ips budget full intermediate. One color.
  makerProduct({
    id: 'sa-frequency-intermediate',
    maker: 'Scientific Anglers',
    name: 'SA Frequency Intermediate',
    sizes: LINEUP['sa-frequency-intermediate'].sizes.map((size) => {
      const { weight, head, total } = size;
      return {
        id: `wf${weight}i`,
        label: size.label,
        type: 'intermediate',
        weight,
        taper: [...scaled(FREQUENCY_INTERMEDIATE, head), total - head],
        estimated: true,
        lineup: size,
        colorways: [{ id: 'atmosphere', name: 'Atmosphere', zones: zones([0, 'sa-frequency-intermediate-atmosphere']) }],
      };
    }),
  }),
  // The Textured Tarpon Clear Float without the textures; its own diagram has the same ticks and
  // swatches. Clear Tip: SA's 12 ft clear tip, sand to the end of the head, a 10 ft clear sighter (on
  // the diagram), then sand running line. Full Clear is the same line in one color. It draws like the
  // Textured.
  makerProduct({
    id: 'sa-magnitude-smooth-tarpon-clear-tip',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Smooth Tarpon Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-smooth-tarpon-clear-tip'].sizes.map((size) => size.weight))].map((weight) => {
      const size = lineupSize(LINEUP['sa-magnitude-smooth-tarpon-clear-tip'], `WF${weight}F Clear Tip`);
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: sameHead(TARPON, size),
        lineup: size,
        colorways: [
          { id: 'sand-clear-tip', name: 'Sand/Clear Tip', zones: zones([12, 'sa-magnitude-clear'], [24, 'sa-sand'], [10, 'sa-magnitude-clear'], [0, 'sa-sand']) },
          { id: 'clear', name: 'Clear', zones: zones([0, 'sa-magnitude-clear']) },
        ],
      };
    }),
  }),
  // The Smooth Infinity Clear Float with SA's textures; its own diagram has the same ticks (the
  // Textured Infinity's split on the WF5's 49 ft head) and swatches, so it draws like the Smooth. Every
  // size comes as Clear Tip (SA's 10 ft clear tip, then buckskin) and as Clear Head.
  makerProduct({
    id: 'sa-magnitude-textured-infinity-clear-float',
    maker: 'Scientific Anglers',
    name: 'SA Magnitude Textured Infinity Clear Float',
    sizes: [...new Set(LINEUP['sa-magnitude-textured-infinity-clear-float'].sizes.map((size) => size.weight))].map((weight) => {
      const size = lineupSize(LINEUP['sa-magnitude-textured-infinity-clear-float'], `WF${weight}F Clear Tip`);
      const { head, total } = size;
      return {
        id: `wf${weight}f`,
        label: `WF${weight}F`,
        type: 'floating',
        weight,
        taper: [...scaled(INFINITY_PLUS, head), total - head],
        estimated: weight !== 5,
        lineup: size,
        colorways: [
          { id: 'buckskin-clear-tip', name: 'Buckskin/Clear Tip', zones: zones([10, 'sa-magnitude-clear'], [0, 'sa-buckskin']) },
          { id: 'buckskin-clear-head', name: 'Buckskin/Clear Head', zones: zones([head, 'sa-magnitude-clear'], [0, 'sa-buckskin']) },
        ],
      };
    }),
  }),
  // Two sizes heavy, 1.25 ips over the whole line. Its own diagram has the Amplitude Smooth Striper's
  // ticks, so it shares STRIPER on the same 30 ft head in every size. A storm grey head on a blue
  // running line.
  makerProduct({
    id: 'sa-sonar-striper-intermediate',
    maker: 'Scientific Anglers',
    name: 'SA Sonar Striper Intermediate',
    sizes: LINEUP['sa-sonar-striper-intermediate'].sizes.map((size) => ({
      id: `wf${size.weight}i`,
      label: size.label,
      type: 'intermediate',
      weight: size.weight,
      taper: sameHead(STRIPER, size),
      lineup: size,
      colorways: [{ id: 'blue-storm-grey', name: 'Blue/Storm Grey', zones: zones([30, 'sa-sonar-striper-storm-grey'], [0, 'sa-sonar-striper-blue']) }],
    })),
  }),
];
