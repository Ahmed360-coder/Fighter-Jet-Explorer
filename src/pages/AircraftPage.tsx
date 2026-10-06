import { useEffect, useMemo, useRef, useState } from 'react'
import { BlueprintJet } from '../art/Planform'
import { GENERATION_LABEL, ROLE_LABEL, eraOf, timelineYear } from '../catalog/query'
import { CoverageBar } from '../components/CoverageBar'
import { DataLegend } from '../components/DataLegend'
import { CitationContext, Cites, DateRow, LiveMark, NumberRow, PlainRow, TextRow } from '../components/spec/Facts'
import { catalog, isKnown, missiles, sources, yearOf, type Aircraft, type MissileCompatibility } from '../data'
import { formatMoney, noBreak } from '../format'
import { COST_KIND, MISSILE_ROLE_ORDER, STATUS_LABEL, WHY_COSTS_VARY, missileRoleLabel } from '../labels'
import { hrefFor } from '../router'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'design', label: 'Design' },
  { id: 'performance', label: 'Performance' },
  { id: 'service', label: 'Service' },
  { id: 'cost', label: 'Cost' },
  { id: 'armament', label: 'Armament' },
  { id: 'sources', label: 'Sources' },
] as const

/** The year this record treats as "now" for service-history spans. */
const DATASET_YEAR = 2026

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function AircraftPage({ aircraft: a }: { aircraft: Aircraft }) {
  const index = catalog.findIndex((x) => x.id === a.id)
  const newer = catalog[index - 1]
  const older = catalog[index + 1]
  const citations = useMemo(() => new Map(a.sources.map((id, i) => [id, i + 1])), [a])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState<string>('overview')

  // Move focus to the new page's heading so keyboard and screen-reader users land on it.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [a.id])

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [a.id])

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
    el.focus({ preventScroll: true })
  }

  const year = timelineYear(a)

  return (
    <CitationContext.Provider value={citations}>
      <main id="main" tabIndex={-1} className="detail" key={a.id}>
        <div className="page">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={hrefFor.hangar()}>← Hangar</a>
            <span aria-hidden="true">/</span>
            <span>{eraOf(a).label}</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{a.shortName}</span>
          </nav>

          <header className="detail__head">
            <p className="eyebrow">
              Bay {String(index + 1).padStart(2, '0')} · {isKnown(a.serviceEntry) ? 'Entered service' : 'First flew'} {year}
            </p>
            <h1 ref={headingRef} tabIndex={-1}>
              {noBreak(a.name)}
            </h1>
            {a.nickname && <p className="detail__nick">{a.nickname}</p>}
            <p className="detail__variant">
              Figures describe the <strong>{a.specVariant}</strong>
              {a.specVariantNote && <span className="spec__note">{a.specVariantNote}</span>}
            </p>
          </header>
        </div>

        <div className="detail__art">
          <div className="page">
            <BlueprintJet aircraft={a} />
          </div>
        </div>

        <div className="page detail__body">
          <nav className="toc" aria-label="Sections">
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button type="button" aria-current={active === s.id ? 'true' : undefined} onClick={() => goTo(s.id)}>
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="detail__sections">
            <Section id="overview" title="Quick overview">
              <p className="detail__summary">{a.summary}</p>
              <dl className="specs specs--overview">
                <PlainRow label="Origin">{a.countries.join(', ')}</PlainRow>
                <PlainRow label="Manufacturer">{a.manufacturers.join(', ')}</PlainRow>
                <PlainRow label="Role">{a.roles.map((r) => ROLE_LABEL[r]).join(', ')}</PlainRow>
                <PlainRow label="Generation" hint="An informal grouping by design era and technology.">
                  {GENERATION_LABEL[a.generation]}
                </PlainRow>
                <PlainRow label="Status">{STATUS_LABEL[a.status]}</PlainRow>
                <NumberRow label="Crew" fact={a.crew} unit="" />
                <NumberRow label="Top speed" fact={a.maxSpeedMach} unit="Mach" hint="At high altitude." />
                <DateRow label="First flight" fact={a.firstFlight} />
              </dl>
              <div className="quality">
                <h3>How complete this record is</h3>
                <CoverageBar aircraft={a} />
                <DataLegend />
              </div>
            </Section>

            <Section id="design" title="Design and engineering">
              <dl className="specs">
                <NumberRow label="Length" fact={a.lengthM} unit="m" />
                <NumberRow label="Wingspan" fact={a.wingspanM} unit="m" />
                <NumberRow label="Height" fact={a.heightM} unit="m" />
                <NumberRow label="Wing area" fact={a.wingAreaM2} unit="m²" hint="Total lifting surface; bigger means lower wing loading." />
                <NumberRow label="Empty weight" fact={a.emptyWeightKg} unit="kg" hint="Without fuel, crew or stores." />
                <NumberRow label="Max take-off weight" fact={a.maxTakeoffWeightKg} unit="kg" hint="Heaviest permitted weight, fully fuelled and loaded." />
                <TextRow label={a.engineCount === 1 ? 'Engine' : `Engines (${a.engineCount})`} fact={a.engine} />
                <NumberRow
                  label="Thrust per engine"
                  fact={a.thrustPerEngineKn}
                  unit="kN"
                  hint="With afterburner where fitted."
                />
              </dl>
            </Section>

            <Section id="performance" title="Performance">
              <dl className="specs">
                <NumberRow label="Max speed" fact={a.maxSpeedMach} unit="Mach" hint="Mach 1 is the speed of sound, about 1,060 km/h at high altitude." />
                <NumberRow label="Max speed" fact={a.maxSpeedKmh} unit="km/h" hint="As published in km/h, usually at altitude." />
                <NumberRow label="Range" fact={a.rangeKm} unit="km" hint="On internal fuel unless the note says otherwise." />
                <NumberRow label="Combat radius" fact={a.combatRadiusKm} unit="km" hint="Out, operate and back. Depends heavily on load and profile." />
                <NumberRow label="Ferry range" fact={a.ferryRangeKm} unit="km" hint="One-way delivery flight, usually with external tanks." />
                <NumberRow label="Service ceiling" fact={a.serviceCeilingM} unit="m" alt="m-altitude" hint="Highest practical operating altitude." />
              </dl>
            </Section>

            <Section id="service" title="Service history">
              <ServiceTimeline aircraft={a} />
              <dl className="specs">
                <DateRow label="First flight" fact={a.firstFlight} hint="Of the first prototype or the type." />
                <DateRow label="Entered service" fact={a.serviceEntry} />
                <NumberRow label="Number built" fact={a.numberBuilt} unit="" />
                <PlainRow label="Status">{STATUS_LABEL[a.status]}</PlainRow>
              </dl>
            </Section>

            <Section id="cost" title="Cost">
              <CostSection aircraft={a} />
            </Section>

            <Section id="armament" title="Armament">
              <ArmamentSection aircraft={a} />
            </Section>

            <Section id="sources" title="Sources">
              <ol className="sourcelist">
                {a.sources.map((id) => {
                  const s = sources[id]
                  return (
                    <li key={id}>
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                      <span className="muted"> · {s.publisher}</span>
                      <span className={`kind kind--${s.kind}`}>{s.kind}</span>
                    </li>
                  )
                })}
              </ol>
              <p className="note">
                Numbers next to each figure link straight to the source that supports it. Reference works such as Wikipedia
                are used as aggregators; follow their footnotes to the manufacturer, government or press source.
              </p>
            </Section>
          </div>
        </div>

        <nav className="page pager" aria-label="Neighbouring aircraft">
          {newer ? (
            <a href={hrefFor.aircraft(newer.id)} className="pager__link">
              <span className="pager__dir">← Newer</span>
              <span className="pager__name">{newer.shortName}</span>
              <span className="pager__year">{timelineYear(newer)}</span>
            </a>
          ) : (
            <span className="pager__link pager__link--end">
              <span className="pager__dir">Newest in the hangar</span>
            </span>
          )}
          {older ? (
            <a href={hrefFor.aircraft(older.id)} className="pager__link pager__link--older">
              <span className="pager__dir">Older →</span>
              <span className="pager__name">{older.shortName}</span>
              <span className="pager__year">{timelineYear(older)}</span>
            </a>
          ) : (
            <span className="pager__link pager__link--older pager__link--end">
              <span className="pager__dir">Oldest in the hangar</span>
            </span>
          )}
        </nav>
      </main>
    </CitationContext.Provider>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="section" tabIndex={-1} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  )
}

function ServiceTimeline({ aircraft: a }: { aircraft: Aircraft }) {
  const first = yearOf(a.firstFlight)
  const entry = yearOf(a.serviceEntry)
  if (first === undefined) return null
  const end = DATASET_YEAR
  const span = Math.max(1, end - first)
  const pct = (y: number) => `${((y - first) / span) * 100}%`
  const gap = entry !== undefined ? entry - first : undefined

  return (
    <figure className="lifeline">
      <div className="lifeline__bar" aria-hidden="true">
        <span className="lifeline__dev" style={{ width: entry !== undefined ? pct(entry) : '100%' }} />
        {entry !== undefined && <span className="lifeline__svc" style={{ left: pct(entry), width: `calc(100% - ${pct(entry)})` }} />}
        <span className="lifeline__mark" style={{ left: '0%' }}>
          <b>{first}</b> first flight
        </span>
        {entry !== undefined && (
          <span className="lifeline__mark lifeline__mark--svc" style={{ left: pct(entry) }}>
            <b>{entry}</b> service
          </span>
        )}
        <span className="lifeline__mark lifeline__mark--end" style={{ left: '100%' }}>
          <b>{end}</b>
        </span>
      </div>
      <figcaption>
        {gap !== undefined ? (
          <>
            {gap === 0 ? 'Entered service the same year it first flew' : `${gap} ${gap === 1 ? 'year' : 'years'} from first flight to service`}
            , then {end - entry!} years{' '}
            {a.status === 'retired' ? 'until the dataset’s reference year (now retired)' : `to ${end}`}. Derived from the dates below.
          </>
        ) : (
          <>Not yet in service: {end - first} years since first flight. Derived from the dates below.</>
        )}
      </figcaption>
    </figure>
  )
}

function CostSection({ aircraft: a }: { aircraft: Aircraft }) {
  return (
    <>
      {a.costs.length === 0 ? (
        <div className="callout">
          <h3>No comparable figure</h3>
          <p>{a.costNote ?? 'No reliable public cost figure was found for this aircraft.'}</p>
        </div>
      ) : (
        <ul className="costs">
          {a.costs.map((c, i) => (
            <li key={i} className="cost">
              <p className="cost__kind">
                {COST_KIND[c.kind].label}
                {c.checkedLive && <LiveMark />}
              </p>
              <p className="cost__amount">{formatMoney(c.amount, c.currency)}</p>
              <p className="cost__meta">
                {c.currency}, {c.year} money · {c.basis} <Cites ids={c.sources} />
              </p>
              <p className="cost__explain">{COST_KIND[c.kind].explain}</p>
              {c.note && <p className="spec__note">{c.note}</p>}
            </li>
          ))}
        </ul>
      )}
      <details className="why">
        <summary>Why fighter costs vary</summary>
        <p>{WHY_COSTS_VARY}</p>
      </details>
    </>
  )
}

function MissileItem({ m }: { m: MissileCompatibility }) {
  const info = missiles[m.missileId]
  return (
    <li className="missile">
      <span className="missile__name">{info.name}</span>
      <span className="missile__origin">{info.origin}</span>
      {m.appliesTo && <span className="spec__note">{m.appliesTo}</span>}
      {m.note && <span className="spec__note">{m.note}</span>}
      <Cites ids={m.sources} />
    </li>
  )
}

function ArmamentSection({ aircraft: a }: { aircraft: Aircraft }) {
  const documented = a.missiles.filter((m) => m.status === 'documented')
  const reported = a.missiles.filter((m) => m.status === 'reported')
  const byRole = MISSILE_ROLE_ORDER.map((role) => ({
    role,
    items: documented.filter((m) => missiles[m.missileId].role === role),
  })).filter((g) => g.items.length > 0)

  return (
    <>
      <dl className="specs">
        <NumberRow label="Hardpoints" fact={a.hardpoints} unit="" hint="Stations for weapons, fuel tanks or pods." />
        <TextRow label="Gun" fact={a.gun} />
      </dl>

      <h3 className="subhead">Documented missile compatibility</h3>
      {documented.length === 0 ? (
        <p className="note">
          {a.missiles.length === 0
            ? 'No guided missiles are documented for this aircraft; it predates guided air-to-air missiles in its air force.'
            : 'No missile is confirmed by an official source; see the reported list below.'}
        </p>
      ) : (
        <div className="missile-groups">
          {byRole.map((g) => (
            <div key={g.role} className="missile-group">
              <h4>{missileRoleLabel(g.role)}</h4>
              <ul>
                {g.items.map((m) => (
                  <MissileItem key={m.missileId} m={m} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {reported.length > 0 && (
        <div className="reported-box">
          <h3 className="subhead">
            Reported, not confirmed <span className="badge badge--disputed">reported</span>
          </h3>
          <p className="note">
            Shown in public imagery, claimed by officials or the press, or under development, but not confirmed by an
            official source. Treat these as unverified.
          </p>
          <ul>
            {reported.map((m) => (
              <li key={m.missileId} className="missile">
                <span className="missile__name">{missiles[m.missileId].name}</span>
                <span className="missile__origin">{missileRoleLabel(missiles[m.missileId].role)}</span>
                {m.appliesTo && <span className="spec__note">{m.appliesTo}</span>}
                {m.note && <span className="spec__note">{m.note}</span>}
                <Cites ids={m.sources} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="note">
        This site lists which missiles are publicly documented for each aircraft and their general role only. It gives no
        performance, targeting or employment detail.
      </p>
    </>
  )
}
