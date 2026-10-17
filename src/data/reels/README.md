# Reel data

One JSON file per maker. `src/data/catalog.js` loads every `*.json` here, so adding a maker means adding a
file, and adding a model or size means editing one. Files load in name order (`generic.json` first), and
the Model menu groups models by maker, A–Z, with Generic last.

```jsonc
{
  "maker": "Lamson",                     // leave out for generic reels
  "finishes": [                          // maker colors not in REEL_COLORS' base palette
    { "id": "smoke", "name": "Smoke", "hex": "#7f8184", "notes": "optional" }
  ],
  "models": [
    {
      "id": "lamson-liquid-s",           // kebab-case, maker-prefixed
      "name": "Lamson Liquid S",         // shown in the Model menu
      "design": "liquid-s",              // frame drawing in src/assets/reels; unknown designs draw as generic
      "colors": ["smoke", "day-break"],  // finish ids; leave out to offer the generic colors
      "notes": "Where the numbers came from and which are estimates.",
      "sizes": [                         // small to large
        {
          "id": "lamson-liquid-s-5",     // stored in saved setups and links: never rename one
          "size": "5+",                  // the maker's size label
          "name": "…",                   // optional; defaults to "<model name> <size>"
          "weights": [5, 6],             // line weights it suits, lightest to heaviest
          "rim": 3.65,                   // inches
          "spool": 3.41,                 // capacity diameter, inches
          "width": 1.0,                  // inside spool width, inches
          "arbor": 2.1,                  // inches; or leave out and give "rated"
          "rated": { "weight": 6, "yards": 100, "pounds": 20 }  // rated line + backing; the arbor is solved from it
        }
      ]
    }
  ]
}
```

A finish id can be shared across makers (black, silver, gunmetal are in the base palette). Mark
estimates in `notes`, and keep docs/spec.md's reel table in step.
