import type { Aircraft, Fact, FactStatus } from './types'

const FACT_STATUSES: ReadonlySet<string> = new Set<FactStatus>(['documented', 'disputed', 'estimated', 'unknown'])

/** All `Fact` fields of an aircraft, keyed by field name. */
export function factEntries(a: Aircraft): [keyof Aircraft, Fact<unknown>][] {
  return (Object.entries(a) as [keyof Aircraft, unknown][]).filter(
    (entry): entry is [keyof Aircraft, Fact<unknown>] =>
      typeof entry[1] === 'object' && entry[1] !== null && FACT_STATUSES.has((entry[1] as Fact<unknown>).status),
  )
}

export interface Coverage {
  total: number
  documented: number
  disputed: number
  estimated: number
  unknown: number
  /** Known facts confirmed against a live source while the dataset was built. */
  checkedLive: number
}

/** How complete and how certain an aircraft's record is. */
export function coverageOf(a: Aircraft): Coverage {
  const c: Coverage = { total: 0, documented: 0, disputed: 0, estimated: 0, unknown: 0, checkedLive: 0 }
  for (const [, f] of factEntries(a)) {
    c.total++
    c[f.status]++
    if (f.status !== 'unknown' && f.checkedLive) c.checkedLive++
  }
  return c
}
