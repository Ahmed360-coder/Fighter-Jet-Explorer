import type { Fact, KnownFact, Qualifier } from './types'

interface Opts {
  qualifier?: Qualifier
  note?: string
  checkedLive?: boolean
}

/** A value stated by the cited sources. */
export function documented<T>(value: T, sources: string[], opts: Opts = {}): KnownFact<T> {
  return { status: 'documented', value, sources, ...opts }
}

/** A value sources disagree on, or that comes only from unofficial estimates. `note` explains why. */
export function disputed<T>(value: T, sources: string[], note: string, opts: Omit<Opts, 'note'> = {}): KnownFact<T> {
  return { status: 'disputed', value, sources, note, ...opts }
}

/** A value that is an outside estimate rather than a published figure. `note` explains whose. */
export function estimated<T>(value: T, sources: string[], note: string, opts: Omit<Opts, 'note'> = {}): KnownFact<T> {
  return { status: 'estimated', value, sources, note, ...opts }
}

/** No reliable public figure. `note` says why. */
export function unknown(note: string): Fact<never> {
  return { status: 'unknown', note }
}

export function isKnown<T>(fact: Fact<T>): fact is KnownFact<T> {
  return fact.status !== 'unknown'
}

/** The year a partial ISO date refers to, or undefined. */
export function yearOf(fact: Fact<string>): number | undefined {
  return isKnown(fact) ? Number(fact.value.slice(0, 4)) : undefined
}
