import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { geometryOf, silhouette } from '../art/geometry'
import { ERAS, eraOf, timelineYear } from '../catalog/query'
import {
  APART_REASON,
  SUGGESTIONS,
  MAX_COMPARE,
  ROWS,
  ROW_GROUPS,
  addToSlots,
  compareCosts,
  documentedMissileRoles,
  numericRowStats,
  readCompareLink,
  removeFromSlots,
  rowDiffers,
  serializeCompareIds,
  type NumberRowDef,
  type RowDef,
  type Slots,
} from '../compare/compare'
import { CitationContext, Cites, LiveMark } from '../components/spec/Facts'
import { aircraftById, catalog, isKnown, type Aircraft, type Fact } from '../data'
import { formatFact, formatMoney, formatNumber, formatPartialDate, imperial, noBreak } from '../format'
import { COST_KIND, WHY_COSTS_VARY } from '../labels'
import { hrefFor } from '../router'

const SLOT_LETTERS = ['A', 'B', 'C'] as const


interface Pick {
  aircraft: Aircraft
  slot: number
}

export function ComparePage({ selection }: { selection: string }) {
  const link = useMemo(() => readCompareLink(selection), [selection])
  const { slots, unknown, overflow } = link
  const picks: Pick[] = slots.flatMap((id, slot) => (id ? [{ aircraft: aircraftById[id], slot }] : []))
  const [onlyDiff, setOnlyDiff] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const go = (next: Slots) => window.location.replace(hrefFor.compare(serializeCompareIds(next)))

  return (
    <main id="main" tabIndex={-1} className="compare">
      <div className="page">
        <header className="compare__head">
          <p className="eyebrow">Compare · up to {MAX_COMPARE} jets</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Side by side
          </h1>
          <p className="lede">
            Pick jets to line up their published figures. Bars show each value against the largest in its row, so
            gaps are easy to spot. Disputed and estimated figures keep their labels, and cost figures only sit side by
            side when they measure the same thing.
          </p>
        </header>

        {unknown.length > 0 && (
          <p className="note compare__unknown" role="status">
            {unknown.length === 1 ? 'There is no jet' : 'There are no jets'} called {unknown.map((id) => `“${id}”`).join(', ')} in
            the hangar, so {unknown.length === 1 ? 'it was' : 'they were'} left out. The link may be mistyped or out of date.
          </p>
        )}
        {overflow.length > 0 && (
          <p className="note compare__unknown" role="status">
            Compare holds {MAX_COMPARE} jets at a time, so {overflow.map((id) => aircraftById[id].shortName).join(', ')}{' '}
            {overflow.length === 1 ? 'was' : 'were'} left out. Remove one to swap {overflow.length === 1 ? 'it' : 'them'} in.
          </p>
        )}

        <SlotPicker slots={slots} picks={picks} onAdd={(id) => go(addToSlots(slots, id))} onRemove={(id) => go(removeFromSlots(slots, id))} />

        {picks.length === 0 ? (
          <section className="compare__empty" aria-labelledby="try-title">
            <h2 id="try-title">Try a pairing</h2>
            <ul className="suggest">
              {SUGGESTIONS.map((s) => (
                <li key={s.ids}>
                  <a className="button" href={hrefFor.compare(s.ids)}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <>
            <ScaleOverlay picks={picks} />
            {picks.length === 1 && <p className="note compare__solo">Add another jet above to see the differences.</p>}

            <div className="compare__toolbar">
              <label className="toggle">
                <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} disabled={picks.length < 2} />
                <span>Only rows that differ</span>
              </label>
            </div>

            <SpecTable picks={picks} onlyDiff={onlyDiff && picks.length > 1} />
            <CostCompare picks={picks} />

            <p className="note">
              Missile rows list documented compatibility by general role only, with no performance, targeting or
              employment detail. Open a jet’s page for its full, cited armament list.
            </p>
          </>
        )}
      </div>
    </main>
  )
}

function Tag({ slot }: { slot: number }) {
  return (
    <span className={`slot-tag slot-tag--${slot}`} aria-hidden="true">
      {SLOT_LETTERS[slot]}
    </span>
  )
}

function SlotPicker({
  slots,
  picks,
  onAdd,
  onRemove,
}: {
  slots: Slots
  picks: Pick[]
  onAdd: (id: string) => void
  onRemove: (id: string) => void
}) {
  const full = picks.length >= MAX_COMPARE
  const chosen = new Set(slots.filter(Boolean))
  const nextSlot = slots.indexOf(null) >= 0 ? slots.indexOf(null) : slots.length

  return (
    <section className="slots" aria-label="Selected jets">
      <ul className="slots__list">
        {picks.map(({ aircraft: a, slot }) => (
          <li key={a.id} className={`slot slot--${slot}`}>
            <Tag slot={slot} />
            <a className="slot__name" href={hrefFor.aircraft(a.id)}>
              {noBreak(a.shortName)}
              <span className="slot__year">{timelineYear(a)}</span>
            </a>
            <button type="button" className="slot__remove" onClick={() => onRemove(a.id)} aria-label={`Remove ${a.shortName} from the comparison`}>
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          </li>
        ))}
        {!full && (
          <li className={`slot slot--add slot--${nextSlot}`}>
            <Tag slot={nextSlot} />
            <label className="sr-only" htmlFor="add-jet">
              Add a jet to compare
            </label>
            <select
              id="add-jet"
              value=""
              onChange={(e) => {
                if (e.target.value) onAdd(e.target.value)
              }}
            >
              <option value="">{picks.length === 0 ? 'Choose a jet…' : 'Add a jet…'}</option>
              {ERAS.map((era) => {
                const items = catalog.filter((a) => eraOf(a).id === era.id && !chosen.has(a.id))
                if (items.length === 0) return null
                return (
                  <optgroup key={era.id} label={era.label}>
                    {items.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.shortName} ({timelineYear(a)})
                      </option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </li>
        )}
      </ul>
      {full && <p className="note slots__full">Three is the limit. Remove one to swap in another jet.</p>}
    </section>
  )
}

/* ---------- To-scale overlay ---------- */

function ScaleOverlay({ picks }: { picks: Pick[] }) {
  const drawn = picks.flatMap((p) => {
    const g = geometryOf(p.aircraft)
    return g ? [{ ...p, g }] : []
  })
  if (drawn.length === 0) return null
  const pad = 1.5
  const maxL = Math.max(...drawn.map((d) => d.g.lengthM))
  const maxS = Math.max(...drawn.map((d) => d.g.spanM))
  const w = maxL + pad * 2
  const h = maxS + pad * 2
  const notToScale = drawn.filter((d) => !d.g.toScale)

  return (
    <figure className="overlay">
      <svg
        viewBox={`${-pad} ${-maxS / 2 - pad} ${w} ${h}`}
        role="img"
        aria-label={`Top-down outlines drawn to the same scale, noses aligned: ${drawn
          .map((d) => `${d.aircraft.shortName}, ${formatNumber(d.g.lengthM)} metres long and ${formatNumber(d.g.spanM)} metres across`)
          .join('; ')}.`}
      >
        <g className="overlay__grid" aria-hidden="true">
          {Array.from({ length: Math.floor(maxL / 5) + 1 }, (_, i) => (
            <line key={i} x1={i * 5} x2={i * 5} y1={-maxS / 2 - pad} y2={maxS / 2 + pad} />
          ))}
          <line className="overlay__axis" x1={-pad} x2={maxL + pad} y1="0" y2="0" />
        </g>
        {/* Largest first, so smaller outlines sit on top and stay visible. */}
        {[...drawn]
          .sort((a, b) => b.g.lengthM * b.g.spanM - a.g.lengthM * a.g.spanM)
          .map((d) => (
            <polygon key={d.aircraft.id} className={`overlay__jet overlay__jet--${d.slot}`} points={silhouette(d.g)} />
          ))}
        <g className="overlay__scale" transform={`translate(0 ${maxS / 2 + pad * 0.55})`}>
          <line x1="0" x2="5" y1="0" y2="0" />
          <line x1="0" x2="0" y1="-0.2" y2="0.2" />
          <line x1="5" x2="5" y1="-0.2" y2="0.2" />
          <text x="5.4" y="0.3">5 m</text>
        </g>
      </svg>
      <figcaption>
        <ul className="overlay__legend">
          {drawn.map((d) => (
            <li key={d.aircraft.id}>
              <Tag slot={d.slot} />
              <span className="overlay__swatch" data-slot={d.slot} aria-hidden="true" />
              <strong>{noBreak(d.aircraft.shortName)}</strong>
              <span className="muted">
                {formatNumber(d.g.lengthM)} m long · {formatNumber(d.g.spanM)} m span
              </span>
            </li>
          ))}
        </ul>
        Original outlines, noses aligned on the centreline and drawn to one scale from each record’s published length
        and wingspan.
        {notToScale.length > 0 && <> {notToScale.map((d) => d.aircraft.shortName).join(', ')}: not to scale, a dimension is missing.</>}
      </figcaption>
    </figure>
  )
}

/* ---------- Spec table ---------- */

/** Notes repeat across rows for thinly documented jets, so they stay one tap away instead of filling the table. */
function Note({ text }: { text: string }) {
  return (
    <details className="cv__note">
      <summary>Why</summary>
      <p>{text}</p>
    </details>
  )
}

function FactCell({ fact, children }: { fact: Fact<unknown>; children: ReactNode }) {
  if (!isKnown(fact)) {
    return (
      <>
        <span className="cv__value unknown">Not published</span>
        <Note text={fact.note} />
      </>
    )
  }
  return (
    <>
      <span className="cv__value">
        {children}
        {fact.checkedLive && <LiveMark />}
      </span>
      <span className="cv__meta">
        {fact.status !== 'documented' && (
          <span className={`badge badge--${fact.status}`} title={fact.note}>
            {fact.status}
          </span>
        )}
        <Cites ids={fact.sources} />
      </span>
      {fact.status !== 'documented' && fact.note && <Note text={fact.note} />}
    </>
  )
}

function NumberCell({ row, a, share, lead }: { row: NumberRowDef; a: Aircraft; share?: number; lead: boolean }) {
  const fact = row.fact(a)
  const alt = isKnown(fact) ? imperial(fact.value, row.alt ?? row.unit) : undefined
  return (
    <FactCell fact={fact}>
      {formatFact(fact, row.unit)}
      {alt && <span className="cv__alt">{alt}</span>}
      {share !== undefined && (
        <span className="cv__bar" aria-hidden="true">
          <span style={{ width: `${Math.max(share * 100, 1.5)}%` }} />
        </span>
      )}
      {lead && <span className="cv__lead">{row.lead}</span>}
    </FactCell>
  )
}

function Cell({ row, a, share, lead }: { row: RowDef; a: Aircraft; share?: number; lead: boolean }) {
  switch (row.type) {
    case 'number':
      return <NumberCell row={row} a={a} share={share} lead={lead} />
    case 'date': {
      const f = row.fact(a)
      return <FactCell fact={f}>{isKnown(f) && formatPartialDate(f.value)}</FactCell>
    }
    case 'text': {
      const f = row.fact(a)
      return (
        <FactCell fact={f}>
          {row.key === 'engine' && a.engineCount > 1 && <>{a.engineCount} × </>}
          {isKnown(f) ? f.value : null}
        </FactCell>
      )
    }
    case 'plain':
      if (row.key === 'missile-roles') {
        const roles = documentedMissileRoles(a)
        return roles.length ? (
          <ul className="cv__list">
            {roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : (
          <span className="cv__value unknown">None documented</span>
        )
      }
      return <span className="cv__value cv__value--text">{row.text(a)}</span>
  }
}

function SpecTable({ picks, onlyDiff }: { picks: Pick[]; onlyDiff: boolean }) {
  const aircraft = picks.map((p) => p.aircraft)
  const citeMaps = useMemo(() => picks.map((p) => new Map(p.aircraft.sources.map((id, i) => [id, i + 1]))), [picks])
  const visible = ROWS.filter((r) => !onlyDiff || rowDiffers(r, aircraft))
  const hidden = ROWS.length - visible.length

  return (
    <div className="ctable-wrap">
      <table className="ctable" style={{ '--cols': picks.length } as React.CSSProperties}>
        <caption className="sr-only">Specifications side by side</caption>
        <thead>
          <tr>
            <td className="ctable__corner" />
            {picks.map((p) => (
              <th key={p.aircraft.id} scope="col" className={`ctable__jet ctable__jet--${p.slot}`}>
                <Tag slot={p.slot} />
                <span>{noBreak(p.aircraft.shortName)}</span>
                <span className="ctable__variant">{p.aircraft.specVariant}</span>
              </th>
            ))}
          </tr>
        </thead>
        {ROW_GROUPS.map((group) => {
          const rows = visible.filter((r) => r.group === group)
          if (rows.length === 0) return null
          return (
            <tbody key={group}>
              <tr className="ctable__group">
                <th scope="colgroup" colSpan={picks.length + 1}>
                  {group}
                </th>
              </tr>
              {rows.map((row) => {
                const stats = row.type === 'number' ? numericRowStats(aircraft.map((a) => row.fact(a))) : undefined
                return (
                  <tr key={row.key} className={rowDiffers(row, aircraft) ? 'is-diff' : undefined}>
                    <th scope="row">
                      {row.label}
                      {row.hint && <span className="spec__hint">{row.hint}</span>}
                    </th>
                    {picks.map((p, i) => (
                      <td key={p.aircraft.id} className={`cv cv--${p.slot}`} data-lead={stats?.leaders.includes(i) || undefined}>
                        <span className="cv__who" aria-hidden="true">
                          <Tag slot={p.slot} /> {p.aircraft.shortName}
                        </span>
                        <CitationContext.Provider value={citeMaps[i]}>
                          <Cell row={row} a={p.aircraft} share={picks.length > 1 ? stats?.share[i] : undefined} lead={!!stats?.leaders.includes(i)} />
                        </CitationContext.Provider>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          )
        })}
      </table>
      {onlyDiff && hidden > 0 && (
        <p className="note">
          {hidden} {hidden === 1 ? 'row is' : 'rows are'} hidden because every selected jet reads the same.
        </p>
      )}
      <p className="note">
        Source numbers match each jet’s own page. A “longest” or “fastest” tag only appears when at least two figures
        are published and the top one is not just an upper bound; it says nothing about which jet is better.
      </p>
    </div>
  )
}

/* ---------- Costs ---------- */

function CostCompare({ picks }: { picks: Pick[] }) {
  const aircraft = picks.map((p) => p.aircraft)
  const { groups, apart, missing } = compareCosts(aircraft)
  const slotOf = (id: string) => picks.find((p) => p.aircraft.id === id)!.slot
  const citeFor = (a: Aircraft) => new Map(a.sources.map((id, i) => [id, i + 1]))

  return (
    <section className="ccost" aria-labelledby="ccost-title">
      <h2 id="ccost-title">Cost</h2>

      {groups.map((g) => {
        const max = Math.max(...g.entries.map((e) => e.figure.amount))
        return (
          <div key={`${g.kind}${g.currency}${g.year}`} className="ccost__group">
            <h3>
              {COST_KIND[g.kind].label} · {g.currency}, {g.year} money
            </h3>
            <p className="note">Same kind of figure, same currency, same year: these can be read against each other.</p>
            <ul className="ccost__bars">
              {g.entries.map((e, i) => (
                <li key={i} className={`ccost__row cv--${slotOf(e.aircraft.id)}`}>
                  <span className="ccost__who">
                    <Tag slot={slotOf(e.aircraft.id)} /> {noBreak(e.aircraft.shortName)}
                  </span>
                  <span className="cv__bar ccost__bar" aria-hidden="true">
                    <span style={{ width: `${(e.figure.amount / max) * 100}%` }} />
                  </span>
                  <span className="ccost__amount">
                    {formatMoney(e.figure.amount, e.figure.currency)}
                    {e.figure.checkedLive && <LiveMark />}
                  </span>
                  <span className="ccost__basis">
                    {e.figure.basis}{' '}
                    <CitationContext.Provider value={citeFor(e.aircraft)}>
                      <Cites ids={e.figure.sources} />
                    </CitationContext.Provider>
                  </span>
                </li>
              ))}
            </ul>
            <p className="cost__explain">{COST_KIND[g.kind].explain}</p>
          </div>
        )
      })}

      {apart.length > 0 && (
        <div className="ccost__apart">
          <h3>{groups.length ? 'Shown apart' : 'Shown apart: no like-for-like figures'}</h3>
          <ul className="costs">
            {apart.map((e, i) => (
              <li key={i} className="cost">
                <p className="cost__kind">
                  <Tag slot={slotOf(e.aircraft.id)} /> {noBreak(e.aircraft.shortName)} · {COST_KIND[e.figure.kind].label}
                </p>
                <p className="cost__amount">
                  {formatMoney(e.figure.amount, e.figure.currency)}
                  {e.figure.checkedLive && <LiveMark />}
                </p>
                <p className="cost__meta">
                  {e.figure.currency}, {e.figure.year} money · {e.figure.basis}{' '}
                  <CitationContext.Provider value={citeFor(e.aircraft)}>
                    <Cites ids={e.figure.sources} />
                  </CitationContext.Provider>
                </p>
                <p className="ccost__why">
                  <span className="flag">Not compared</span>
                  {APART_REASON[e.reason]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {missing.length > 0 && (
        <ul className="ccost__missing">
          {missing.map((a) => (
            <li key={a.id}>
              <Tag slot={slotOf(a.id)} /> <strong>{noBreak(a.shortName)}</strong>: no comparable figure.{' '}
              <span className="muted">{a.costNote ?? 'No reliable public cost figure was found.'}</span>
            </li>
          ))}
        </ul>
      )}

      <details className="why">
        <summary>Why fighter costs vary</summary>
        <p>{WHY_COSTS_VARY}</p>
      </details>
    </section>
  )
}
