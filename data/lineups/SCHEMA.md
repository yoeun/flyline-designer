# Lineup JSON schema (one file per brand: <brand>.json)

The research each maker's line guide and line menu are built from. The file name is the kebab-case
brand (`scientific-anglers.json`); `scripts/gen-line-guide.mjs` turns every file here into
`src/data/guide/<brand>.json`, and the menu lines in `src/data/lines/<brand>.js` read their per-size
weight, head and total length from it. See README.md for the workflow.

{
  "brand": "Scientific Anglers",
  "source_urls": ["..."],
  "retrieved": "2026-10-16",
  "how_the_lineup_is_organized": "3-8 sentences in plain English explaining the brand's series/tiers (e.g. SA: Amplitude vs Mastery vs Air Cel vs Frequency; Smooth vs Textured vs MPX vs Infinity), what actually differs between them (coating, core, taper, price), and how a buyer should choose. Cite facts from maker pages; mark your own inference as such.",
  "products": [
    {
      "id": "sa-amplitude-smooth-mpx",          // kebab-case, brand-prefixed
      "name": "Amplitude Smooth MPX",           // without brand prefix
      "series": "Amplitude",                    // brand's tier/series
      "category": "trout|nymph|streamer|lake|bass|salt|spey|shooting",
      "status": "current|discontinued",         // discontinued = no longer on maker site but sold in recent years
      "popularity_rank": 3,                      // rank in the best source you found, null if unknown
      "popularity_source": "Trident best-selling, page 1",
      "price_usd": 129.95,
      "primary_use": "Dry / Dry Dropper",        // maker's own use tags if published, else a short phrase
      "secondary_use": "...",
      "weight_label": "1/2 size heavy",          // maker's own heaviness/taper label if published
      "summary": "One plain sentence: what it's for and how it differs from siblings.",
      "variants": [
        {"label": "WF5F", "weight": 5, "density": "floating|intermediate|hover|sink1..sink8|sinktip|multi", "sink_ips": null,
         "head_ft": 41, "total_ft": 90, "grains_30ft": 155, "head_grains": 190,
         "taper_ft": {"front": 6, "body": 20, "back": 15, "running": 49} or null,
         "taper_source": "maker diagram|maker table|null",
         "colors": ["Willow/Buckskin"]}
      ],
      "url": "https://..."
    }
  ]
}

Optional fields some researchers added. Leave them out when you have nothing to put there.

Product:
- "price_note": where the price came from or why it is odd ("list price; site shows $79.95/$99.95").
- "data_notes": anything a later reader must know about the numbers: maker tables that contradict
  their diagram, swapped units, merged listings, rows that were discarded.
- "url_alt": a second maker page for the same line (e.g. another color sold as its own listing).
- "taper_source": how the maker's taper segments were mapped to front/body/back/running, when it is
  the same for every variant (a variant's own "taper_source" says it per size).

Variant:
- "density_label": the maker's own wording for the density when "density" alone loses it
  ("Float/1 ips/2 ips", "Float/6 ft intermediate tip"); shown in the guide next to the size.
- "sink_ips": a number, or a range as text ("6-7") when the maker gives one.
- "grains_40ft": weight of the first 40 ft in grains, when the maker rates by 40 ft instead of 30 ft.
- "line_grains": weight of the whole line in grains, for level (euro nymph) lines with no head.
- "taper_segments": the maker's own taper diagram segments, tip first, as [{"name": "FRONT TAPER",
  "ft": 8}, ...]; "taper_ft" is these folded into front/body/back/running.

Rules:
- Single-hand lines only in "products" detail; list two-hand/Spey heads & shooting lines in a separate "omitted": ["name", ...] array.
- Include ALL current single-hand fly lines from the maker site, plus discontinued lines that were popular in the last ~5 years (mark status "discontinued").
- Only record numbers you actually read from a source. Never invent; use null.
- Raw downloads (maker pages, store JSON) are not committed; keep them in a scratch folder while researching.
