import { createContext, useContext, type ReactNode } from 'react'
import { isKnown, sources, type Fact } from '../../data'
import { formatFact, formatPartialDate, imperial } from '../../format'

/** Maps a source id to its number in the current record's source list. */
export const CitationContext = createContext<Map<string, number>>(new Map())

export function Cites({ ids }: { ids: readonly string[] }) {
  const numbers = useContext(CitationContext)
  if (ids.length === 0) return null
  return (
    <span className="cites">
      {[...new Set(ids)].map((id) => {
        const s = sources[id]
        const n = numbers.get(id)
        if (!s || n === undefined) return null
        return (
          <a
            key={id}
            className="cite"
            href={s.url}
            target="_blank"
            rel="noreferrer"
            title={`${s.title} · ${s.publisher}`}
            aria-label={`Source ${n}: ${s.title}, ${s.publisher} (opens in a new tab)`}
          >
            {n}
          </a>
        )
      })}
    </span>
  )
}

export function LiveMark() {
  return (
    <span className="live-mark" title="Re-checked against a live source on 6 October 2026">
      <span aria-hidden="true">◆</span>
      <span className="sr-only">(re-checked against a live source)</span>
    </span>
  )
}

const STATUS_EXPLAIN = {
  disputed: 'Sources disagree, or only unofficial figures exist.',
  estimated: 'An outside estimate rather than a published figure.',
} as const

function Badge({ status }: { status: 'disputed' | 'estimated' }) {
  return (
    <span className={`badge badge--${status}`} title={STATUS_EXPLAIN[status]}>
      {status}
    </span>
  )
}

interface RowProps<T> {
  label: string
  fact: Fact<T>
  /** One line of context: what the figure means or how it is measured. */
  hint?: string
  render: (value: T) => ReactNode
  secondary?: (value: T) => string | undefined
}

/** One labelled figure: value, unit, qualifier, certainty, note and sources. */
export function FactRow<T>({ label, fact, hint, render, secondary }: RowProps<T>) {
  return (
    <div className="spec" data-status={fact.status}>
      <dt>
        {label}
        {hint && <span className="spec__hint">{hint}</span>}
      </dt>
      <dd>
        {isKnown(fact) ? (
          <>
            <span className="spec__value">
              {render(fact.value)}
              {fact.checkedLive && <LiveMark />}
            </span>
            {secondary && secondary(fact.value) && <span className="spec__alt">{secondary(fact.value)}</span>}
            <span className="spec__meta">
              {fact.status !== 'documented' && <Badge status={fact.status} />}
              <Cites ids={fact.sources} />
            </span>
            {fact.note && <span className="spec__note">{fact.note}</span>}
          </>
        ) : (
          <>
            <span className="spec__value unknown">Not published</span>
            <span className="spec__note">{fact.note}</span>
          </>
        )}
      </dd>
    </div>
  )
}

export function NumberRow({
  label,
  fact,
  unit,
  hint,
  alt,
}: {
  label: string
  fact: Fact<number>
  unit: string
  hint?: string
  /** Unit key for the secondary reading; defaults to `unit`. */
  alt?: string
}) {
  return (
    <FactRow
      label={label}
      fact={fact}
      hint={hint}
      render={() => formatFact(fact, unit)}
      secondary={(v) => imperial(v, alt ?? unit)}
    />
  )
}

export function DateRow({ label, fact, hint }: { label: string; fact: Fact<string>; hint?: string }) {
  return <FactRow label={label} fact={fact} hint={hint} render={formatPartialDate} />
}

export function TextRow({ label, fact, hint }: { label: string; fact: Fact<string>; hint?: string }) {
  return <FactRow label={label} fact={fact} hint={hint} render={(v) => v} />
}

/** A plain labelled value that is not a sourced fact (e.g. a category from the record). */
export function PlainRow({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="spec">
      <dt>
        {label}
        {hint && <span className="spec__hint">{hint}</span>}
      </dt>
      <dd>
        <span className="spec__value spec__value--text">{children}</span>
      </dd>
    </div>
  )
}
