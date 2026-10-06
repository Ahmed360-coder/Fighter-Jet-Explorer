import { HangarJet } from '../art/Planform'
import { GENERATION_LABEL, ROLE_LABEL, timelineYear } from '../catalog/query'
import { isKnown, type Aircraft, type Fact } from '../data'
import { formatFact, noBreak } from '../format'
import { STATUS_LABEL } from '../labels'
import { hrefFor } from '../router'

/** Shared floor size in metres: every jet is drawn at the same scale. */
export const BAY_FRAME = { width: 23.5, height: 20.5 }

function Figure({ label, fact, unit }: { label: string; fact: Fact<number>; unit: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {isKnown(fact) ? formatFact(fact, unit) : <span className="unknown">Not published</span>}
        {isKnown(fact) && fact.status !== 'documented' && <span className="flag">{fact.status}</span>}
      </dd>
    </div>
  )
}

export function HangarBay({ aircraft: a, bay }: { aircraft: Aircraft; bay: number }) {
  const year = timelineYear(a)
  const yearLabel = isKnown(a.serviceEntry) ? 'Entered service' : 'First flew'
  const headingId = `bay-title-${a.id}`

  return (
    <li className="bay" id={`bay-${a.id}`} data-id={a.id} aria-labelledby={headingId}>
      <div className="bay__year" aria-hidden="true">
        <span className="bay__year-num">{year}</span>
        <span className="bay__year-label">{yearLabel}</span>
      </div>

      <div className="bay__floor">
        <span className="bay__stencil" aria-hidden="true">
          Bay {String(bay).padStart(2, '0')}
        </span>
        <HangarJet aircraft={a} frame={BAY_FRAME} />
      </div>

      <div className="bay__info">
        <h3 id={headingId}>
          <a className="bay__link" href={hrefFor.aircraft(a.id)}>
            {noBreak(a.name)}
          </a>
        </h3>
        {a.nickname && <p className="bay__nick">{a.nickname}</p>}
        <p className="bay__meta">
          <span className="sr-only">{yearLabel} {year}. </span>
          {a.countries.join(' · ')} <span className="dot">/</span> {GENERATION_LABEL[a.generation]}{' '}
          <span className="dot">/</span> {STATUS_LABEL[a.status]}
        </p>
        <ul className="chips" aria-label="Roles">
          {a.roles.map((r) => (
            <li key={r}>{ROLE_LABEL[r]}</li>
          ))}
        </ul>
        <dl className="bay__figures">
          <Figure label="Top speed" fact={a.maxSpeedMach} unit="Mach" />
          <Figure label="Wingspan" fact={a.wingspanM} unit="m" />
          <Figure label="Max take-off" fact={a.maxTakeoffWeightKg} unit="kg" />
        </dl>
        <span className="bay__cta" aria-hidden="true">
          Open record <span className="arrow">→</span>
        </span>
      </div>
    </li>
  )
}
