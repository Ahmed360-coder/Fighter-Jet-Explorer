import { isKnown, missiles, sources, yearOf, type Aircraft, type Fact } from '../data'
import { formatFact, formatPartialDate } from '../format'
import { CoverageBar } from './CoverageBar'

function DateFact({ fact }: { fact: Fact<string> }) {
  if (!isKnown(fact)) return <span className="unknown">Not yet</span>
  return (
    <>
      {formatPartialDate(fact.value)}
      {fact.checkedLive && <LiveMark />}
    </>
  )
}

function NumberFact({ fact, unit }: { fact: Fact<number>; unit: string }) {
  if (!isKnown(fact)) return <span className="unknown" title={fact.note}>Not published</span>
  return (
    <>
      {formatFact(fact, unit)}
      {fact.status !== 'documented' && <span className="flag">{fact.status}</span>}
      {fact.checkedLive && <LiveMark />}
    </>
  )
}

function LiveMark() {
  return (
    <span className="live-mark" title="Re-checked against a live source">
      <span aria-hidden="true">◆</span>
      <span className="sr-only">(re-checked)</span>
    </span>
  )
}

const STATUS_LABEL: Record<Aircraft['status'], string> = {
  'in-service': 'In service',
  'limited-service': 'Limited service',
  retired: 'Retired',
  'in-development': 'In development',
}

export function ManifestRow({ aircraft: a, bay }: { aircraft: Aircraft; bay: number }) {
  const year = yearOf(a.serviceEntry) ?? yearOf(a.firstFlight)
  const yearLabel = isKnown(a.serviceEntry) ? 'Entered service' : 'First flight'
  const documentedMissiles = a.missiles.filter((m) => m.status === 'documented')
  const reportedMissiles = a.missiles.filter((m) => m.status === 'reported')

  return (
    <li className="row">
      <div className="row__bay" aria-hidden="true">
        {String(bay).padStart(2, '0')}
      </div>
      <div className="row__year">
        <span className="row__year-num">{year}</span>
        <span className="row__year-label">{yearLabel}</span>
      </div>
      <div className="row__ident">
        <h2>{a.name}</h2>
        <p className="row__meta">
          {a.countries.join(' · ')} <span className="dot">/</span> {STATUS_LABEL[a.status]}
        </p>
        <p className="row__variant">Figures describe: {a.specVariant}</p>
      </div>
      <CoverageBar aircraft={a} />

      <details className="row__more">
        <summary>Record &amp; sources</summary>
        <div className="row__body">
          <p className="row__summary">{a.summary}</p>
          {a.specVariantNote && <p className="note">{a.specVariantNote}</p>}

          <dl className="facts">
            <div><dt>First flight</dt><dd><DateFact fact={a.firstFlight} /></dd></div>
            <div><dt>Service entry</dt><dd><DateFact fact={a.serviceEntry} /></dd></div>
            <div><dt>Crew</dt><dd><NumberFact fact={a.crew} unit="" /></dd></div>
            <div><dt>Engines</dt><dd>{a.engineCount} × {isKnown(a.engine) ? a.engine.value : 'unknown type'}</dd></div>
            <div><dt>Max speed</dt><dd><NumberFact fact={a.maxSpeedMach} unit="Mach" /></dd></div>
            <div><dt>Max take-off weight</dt><dd><NumberFact fact={a.maxTakeoffWeightKg} unit="kg" /></dd></div>
          </dl>

          <h3>Missiles</h3>
          {a.missiles.length === 0 ? (
            <p className="note">No missile armament; this aircraft predates guided air-to-air missiles in its air force.</p>
          ) : (
            <ul className="missiles">
              {documentedMissiles.map((m) => (
                <li key={m.missileId}>
                  {missiles[m.missileId].name} <span className="muted">· {missiles[m.missileId].role}</span>
                  {m.appliesTo && <span className="muted"> · {m.appliesTo}</span>}
                </li>
              ))}
              {reportedMissiles.map((m) => (
                <li key={m.missileId} className="reported">
                  <span className="flag">reported</span> {missiles[m.missileId].name}{' '}
                  <span className="muted">· {missiles[m.missileId].role}</span>
                </li>
              ))}
            </ul>
          )}

          <h3>Cost</h3>
          {a.costs.length === 0 ? (
            <p className="note">{a.costNote}</p>
          ) : (
            a.costs.map((c, i) => (
              <p key={i}>
                {c.currency} {c.amount.toLocaleString('en-GB')} <span className="flag">{c.kind.replace('-', ' ')}</span>
                <span className="muted"> · {c.basis}</span>
                {c.note && <span className="note block">{c.note}</span>}
              </p>
            ))
          )}

          <h3>Sources</h3>
          <ul className="sources">
            {a.sources.map((id) => (
              <li key={id}>
                <a href={sources[id].url} target="_blank" rel="noreferrer">
                  {sources[id].title}
                </a>{' '}
                <span className="muted">· {sources[id].publisher}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </li>
  )
}
