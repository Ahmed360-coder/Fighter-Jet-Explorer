# Fighter Jet Explorer

A dark, museum-hangar website for exploring fighter jets from newest to oldest, with sourced specifications, typed cost figures and publicly documented missile compatibility.

## What’s here

- **The hangar** (`#/`): every jet parked in its own floor bay, newest to oldest, grouped by decade. All jets are drawn at the same scale, so their real size differences show. A timeline rail across the top tracks where you are and jumps to any jet.
- **Search, sort, filter and group**: search by name, nickname, maker, country or role; sort by date, name, top speed, weight or wingspan; filter by era, country, manufacturer, role and generation; group by decade, era, country, generation or primary role.
- **Detail pages** (`#/aircraft/<id>`): an original top-down drawing dimensioned with the published length and wingspan, then specs grouped as quick overview, design and engineering, performance, service history, cost and armament. Every figure shows its unit, an imperial reading, its certainty and numbered links straight to its sources.

Comparison and “How it’s made” come in the next milestone.

## Run it

```bash
npm install
npm run dev        # local dev server
npm test           # data-integrity and unit tests
npm run build      # type-check and production build (dist/)
```

Requires Node 20 or newer.

## Data

All aircraft data lives in `src/data/`, separate from the UI:

| File | Contents |
| --- | --- |
| `types.ts` | The data model. Every figure is a `Fact` with a status (`documented`, `disputed`, `estimated`, `unknown`), its sources and an optional note. |
| `aircraft/*.ts` | One file per aircraft (25 entries). |
| `sources.ts` | Source registry: every citation the records use. |
| `missiles.ts` | Missile names, broad roles and origin only. |
| `index.ts` | The catalog, sorted newest to oldest by service entry (first flight for aircraft still in development). |
| `integrity.test.ts` | Checks that every known figure has a source, every disputed or missing figure has an explanation, dates and weights are consistent, and costs are typed. |

To add an aircraft, create a file in `src/data/aircraft/`, register any new sources in `sources.ts`, add it to the list in `index.ts`, and draw its outline in `src/art/planforms.ts`. The tests will tell you what is missing.

## Artwork

The aircraft drawings are original, simplified top-down outlines drawn for this site (`src/art/planforms.ts`). The renderer stretches each outline to the record’s published length and wingspan. They are illustrations, not photographs or manufacturer drawings, and the site says so under each one.

### Rules the data follows

- **One variant per record.** `specVariant` names exactly which version the figures describe (for example F-16C/D, MiG-21bis). Variants that differ materially, such as the F-35A and F-35B, are separate entries.
- **No invented figures.** When no reliable public figure exists, the field is `unknown` with a reason.
- **Disputed figures are labelled.** Figures for aircraft without official specifications (J-20, J-10, Su-57) are marked `disputed` with an explanation.
- **Costs are typed.** Each cost says whether it is flyaway, procurement, programme or an unspecified unit figure, with currency and year. Aircraft without a comparable figure explain why instead.
- **Missiles are split** into `documented` and `reported` compatibility, with variant or operator limits where they apply. No performance or employment detail is included.

## Limitations

- **Verification.** Live access to sources was limited while this dataset was built. Values flagged `checkedLive` (shown with ◆ in the site) were confirmed against a fetched page on 6 October 2026, chiefly service dates, production counts, several full specification sets (J-20, J-10, Su-27, Su-30MKI, F-16) and the F-35, F-16, F-86 and Rafale cost figures. Other values come from the cited references without being re-checked during this build and should be treated as reference figures.
- **Sources.** Many records cite Wikipedia as a reference aggregator, whose figures link onward to manufacturer, government and press sources. Official pages are cited directly where they publish the figure.
- **Coverage.** The catalog is a selection of 25 aircraft spanning 1949 to 2022 and more than ten countries, not a complete list of fighter aircraft.
