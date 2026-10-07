# Fighter Jet Explorer

A dark, museum-hangar website for exploring fighter jets from newest to oldest, with sourced specifications, typed cost figures and publicly documented missile compatibility.

It is a **non-commercial, independent reference project**: no ads, no paid features and no affiliation with any manufacturer, air force or government.

## What’s here

- **The hangar** (`#/`): every jet parked in its own floor bay, newest to oldest, grouped by decade. All jets are drawn at the same scale, so their real size differences show. A timeline rail across the top tracks where you are; tap a tick or drag along it to jump between jets, or move along it with the arrow keys and press Enter.
- **Search, sort, filter and group**: search by name, nickname, maker, country or role; sort by date, name, top speed, weight or wingspan; filter by era, country, manufacturer, role and generation; group by decade, era, country, generation or primary role.
- **Detail pages** (`#/aircraft/<id>`): an original top-down drawing dimensioned with the published length and wingspan, then specs grouped as quick overview, design and engineering, performance, service history, cost and armament. Every figure shows its unit, an imperial reading, its certainty and numbered links straight to its sources.
- **Compare** (`#/compare/<id>,<id>,<id>`): up to three jets side by side, with outlines overlaid to one scale, a bar per row against the largest value, and cost figures only lined up when they measure the same thing in the same currency and year.
- **How it’s made** (`#/how-its-made`): a six-stage walkthrough of how a modern fighter goes from requirement to first flight, with an animated drawing. Use the stage list, the buttons, the arrow keys or swipe the drawing.

## Run it

```bash
npm install
npm run dev        # local dev server
npm test           # data-integrity, logic, link and asset tests
npm run lint       # oxlint
npm run build      # type-check and production build (dist/)
npm run preview    # serve the production build locally
```

Requires Node 20 or newer. CI (`.github/workflows/ci.yml`) runs lint, tests and the build on every pull request.

## Deploy

The site is a static Vite build with hash URLs, so it needs no server rewrites. On Vercel, import the repository at [vercel.com/new](https://vercel.com/new) with the defaults (framework Vite, build `npm run build`, output `dist`). Every push to `main` then deploys to production, and pull requests get preview deployments.

## Project layout

| Path | Contents |
| --- | --- |
| `src/data/` | The aircraft dataset and its data model, kept separate from the UI (see below). |
| `src/catalog/` | Search, sort, filter and grouping logic for the hangar. |
| `src/compare/` | Compare rules: row definitions, leader tags and when costs may sit side by side. |
| `src/making/` | “How it’s made” stages and the assembly drawing. |
| `src/art/` | Original top-down outlines (`planforms.ts`, one per jet) and the renderer. |
| `src/pages/`, `src/components/` | Page and UI components. |
| `src/styles*.css` | Plain CSS, one file per area. |

## Data

All aircraft data lives in `src/data/`:

| File | Contents |
| --- | --- |
| `types.ts` | The data model. Every figure is a `Fact` with a status (`documented`, `disputed`, `estimated`, `unknown`), its sources and an optional note. |
| `aircraft/*.ts` | One file per aircraft (25 entries). |
| `sources.ts` | Source registry: every citation the records use (35 sources). |
| `missiles.ts` | Missile names, broad roles and origin only. |
| `index.ts` | The catalog, sorted newest to oldest by service entry (first flight for aircraft still in development). |
| `integrity.test.ts` | Checks that every known figure has a source, every disputed or missing figure has an explanation, dates and weights are consistent, and costs are typed. |

To add an aircraft, create a file in `src/data/aircraft/`, register any new sources in `sources.ts`, add it to the list in `index.ts`, and draw its outline in `src/art/planforms.ts`. The tests will tell you what is missing.

### Rules the data follows

- **One variant per record.** `specVariant` names exactly which version the figures describe (for example F-16C/D, MiG-21bis). Variants that differ materially, such as the F-35A and F-35B, are separate entries.
- **No invented figures.** When no reliable public figure exists, the field is `unknown` with a reason, and the site shows “Not published” with that reason.
- **Disputed figures are labelled.** Figures for aircraft without official specifications are marked `disputed` with an explanation.
- **Costs are typed.** Each cost says whether it is flyaway, procurement, programme or an unspecified unit figure, with currency and year. Aircraft without a comparable figure explain why instead.
- **Missiles are split** into `documented` and `reported` compatibility, with variant or operator limits where they apply. No performance, targeting or employment detail is included.

## Artwork

The aircraft drawings are original, simplified top-down outlines drawn for this site. The renderer stretches each outline to the record’s published length and wingspan. They are illustrations, not photographs or manufacturer drawings, and the site says so under each one.

## Accessibility and devices

- Layouts are tuned from 320px phones to wide desktops; the compare table reflows so each row reads across the selected jets on a phone, and the detail page’s section list becomes a sticky, swipeable strip.
- Everything works by keyboard: a skip link, visible focus rings, a single tab stop for the timeline rail (arrow keys move along it), arrow-key tabs for “How it’s made”, and focus moved to the heading when a detail, compare or “How it’s made” page opens.
- Controls are at least 44px tall on touch screens. Timeline ticks sit too close for that, so the rail can also be scrubbed by dragging, and every jet is reachable from its bay.
- Text meets WCAG AA contrast; checked with axe-core on every page at 320px, 360px and 1280px with no violations.
- With “reduce motion” turned on, jets park without the roll-in, the assembly drawing switches stages without animating, and jumps scroll instantly.

## Coverage

The catalog is a **selection of 25 aircraft**, not a complete list of fighter aircraft. It spans first service from 1949 (F-86, MiG-15) to 2022 (KF-21 first flight) and 13 countries, chosen for chronological and geographic breadth.

## Known limitations

- **Verification.** Live access to sources was limited while this dataset was built. 146 of the 500 recorded figures, and 5 of the 7 cost figures, are flagged `checkedLive` (shown with ◆ in the site) because they were confirmed against a fetched page on 6 October 2026. The rest come from the cited references without being re-checked during this build and should be treated as reference figures, not verified ones.
- **Missing and disputed figures.** 52 figures are not published or could not be found (most often combat radius, range, ferry range and a km/h top speed), and 39 are disputed, chiefly for the KF-21, Su-57, J-20, J-10 and some F-15 figures. 18 of the 25 jets have no comparable public cost figure; their pages explain why.
- **No retirement dates.** Records hold first flight and service entry but not retirement dates, so the service bar for retired jets fades out instead of ending on a date.
- **Sources.** Many records cite Wikipedia as a reference aggregator, whose figures link onward to manufacturer, government and press sources. Official pages are cited directly where they publish the figure.
- **Link check.** On 6 October 2026 all 35 source links were fetched: 29 loaded the intended page, and 6 U.S. Air Force and National Museum of the U.S. Air Force pages refused automated requests (HTTP 403), so they could not be confirmed from here. Automated tests check every link is well formed and every internal link resolves.
- **Fonts.** Barlow Condensed and IBM Plex load from Google Fonts; without them the site falls back to system fonts.
- **Non-commercial.** The site must stay non-commercial. 3D models planned for a later version are licensed CC BY-NC-SA, which requires crediting their author, no commercial use and sharing changes under the same licence.
