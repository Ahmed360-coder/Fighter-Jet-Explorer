import { useEffect, useMemo, useRef, useState } from 'react'
import { CatalogControls } from '../components/CatalogControls'
import { EraRail } from '../components/EraRail'
import { HangarBay } from '../components/HangarBay'
import { DEFAULT_QUERY, facetsOf, groupResults, isChronological, runQuery, timelineYear, type Query } from '../catalog/query'
import { catalog } from '../data'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function HangarPage({ query, onQueryChange }: { query: Query; onQueryChange: (q: Query) => void }) {
  const facets = useMemo(() => facetsOf(catalog), [])
  const results = useMemo(() => runQuery(catalog, query), [query])
  const groups = useMemo(() => groupResults(results, query.group), [results, query.group])
  const bayNumber = useMemo(() => new Map(catalog.map((a, i) => [a.id, i + 1])), [])
  const [activeId, setActiveId] = useState<string>()
  const listRef = useRef<HTMLDivElement>(null)

  const years = catalog.map(timelineYear)
  const countryCount = facets.countries.length

  // Reveal bays as they roll into view, and track which one is centred for the rail.
  useEffect(() => {
    const root = listRef.current
    if (!root) return
    const bays = [...root.querySelectorAll<HTMLElement>('.bay')]
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            reveal.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    const centre = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveId((e.target as HTMLElement).dataset.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    bays.forEach((b) => {
      reveal.observe(b)
      centre.observe(b)
    })
    return () => {
      reveal.disconnect()
      centre.disconnect()
    }
  }, [groups])

  const jumpTo = (id: string) => {
    const bay = document.getElementById(`bay-${id}`)
    if (!bay) return
    bay.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' })
    bay.querySelector<HTMLAnchorElement>('.bay__link')?.focus({ preventScroll: true })
  }

  return (
    <main id="main" tabIndex={-1} className="hangar">
      <section className="hero page">
        <p className="eyebrow">The hangar · {Math.min(...years)} to {Math.max(...years)}</p>
        <h1>
          Walk the line, <span className="nowrap">newest to oldest</span>
        </h1>
        <p className="lede">
          {catalog.length} fighters from {countryCount} countries, parked in date order and drawn at the same scale, so a
          MiG-15 looks as small beside a Su-30MKI as it really is. Open any bay for the full, sourced record.
        </p>
      </section>

      <div className="hangar__tools">
        <div className="page">
          <CatalogControls query={query} onChange={onQueryChange} facets={facets} shown={results.length} total={catalog.length} />
        </div>
      </div>
      {isChronological(query.sort) && results.length > 0 && (
        <div className="rail-wrap">
          <div className="page">
            <EraRail aircraft={results} activeId={activeId} newestFirst={query.sort === 'newest'} onJump={jumpTo} />
          </div>
        </div>
      )}

      <div className="page" ref={listRef}>
        {results.length === 0 ? (
          <EmptyHangar query={query} onReset={() => onQueryChange({ ...DEFAULT_QUERY, sort: query.sort, group: query.group })} />
        ) : (
          groups.map((g) => (
            <section key={g.key} className="group" aria-labelledby={g.label ? `group-${g.key}` : undefined}>
              {g.label && (
                <h2 className="group__head" id={`group-${g.key}`}>
                  <span className="group__label">{g.label}</span>
                  {g.detail && <span className="group__detail">{g.detail}</span>}
                  <span className="group__count">
                    {g.items.length} aircraft
                  </span>
                </h2>
              )}
              <ol className="bays">
                {g.items.map((a) => (
                  <HangarBay key={a.id} aircraft={a} bay={bayNumber.get(a.id)!} />
                ))}
              </ol>
            </section>
          ))
        )}
      </div>
    </main>
  )
}

function EmptyHangar({ query, onReset }: { query: Query; onReset: () => void }) {
  return (
    <div className="empty" role="status">
      <svg viewBox="0 0 120 60" aria-hidden="true" className="empty__art">
        <path d="M6 54h108M14 54V20L60 6l46 14v34" />
        <path d="M30 54V30h60v24" strokeDasharray="3 3" />
      </svg>
      <h2>No aircraft match</h2>
      <p>
        {query.text.trim() ? (
          <>
            Nothing in the hangar matches “{query.text.trim()}”
            {query.country || query.manufacturer || query.role || query.era || query.generation !== '' ? ' with these filters' : ''}.
          </>
        ) : (
          <>No aircraft fit this combination of filters.</>
        )}{' '}
        Try a shorter search, such as a maker (“Dassault”) or a country, or loosen a filter.
      </p>
      <button type="button" className="button" onClick={onReset}>
        Show all {catalog.length} aircraft
      </button>
    </div>
  )
}
