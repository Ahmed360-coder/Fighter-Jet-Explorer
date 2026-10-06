import { chronologyKey, isKnown, type Aircraft, type Fact, type Generation, type Role } from '../data'

/**
 * Catalog search, filtering, sorting and grouping. Pure functions over the
 * aircraft data, so the hangar UI stays a thin layer and the rules are testable.
 */

export type EraId = 'early-jet' | 'cold-war' | 'post-cold-war' | 'current'

export interface Era {
  id: EraId
  label: string
  /** Inclusive year range. */
  from: number
  to: number
}

export const ERAS: readonly Era[] = [
  { id: 'current', label: 'Current', from: 2010, to: 9999 },
  { id: 'post-cold-war', label: 'Post–Cold War', from: 1990, to: 2009 },
  { id: 'cold-war', label: 'Cold War', from: 1960, to: 1989 },
  { id: 'early-jet', label: 'Early jet age', from: 1940, to: 1959 },
]

export const ROLE_LABEL: Record<Role, string> = {
  'air-superiority': 'Air superiority',
  multirole: 'Multirole',
  interceptor: 'Interceptor',
  strike: 'Strike',
  'carrier-based': 'Carrier-based',
  stovl: 'Short take-off / vertical landing',
  'light-combat': 'Light combat',
}

export const GENERATION_LABEL: Record<Generation, string> = {
  1: '1st generation',
  2: '2nd generation',
  3: '3rd generation',
  4: '4th generation',
  4.5: '4.5 generation',
  5: '5th generation',
}

export type SortId = 'newest' | 'oldest' | 'name' | 'fastest' | 'heaviest' | 'wingspan'

export const SORTS: readonly { id: SortId; label: string }[] = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'name', label: 'Name, A to Z' },
  { id: 'fastest', label: 'Top speed, fastest first' },
  { id: 'heaviest', label: 'Max take-off weight, heaviest first' },
  { id: 'wingspan', label: 'Wingspan, widest first' },
]

export type GroupId = 'decade' | 'era' | 'country' | 'generation' | 'role' | 'none'

export const GROUPS: readonly { id: GroupId; label: string }[] = [
  { id: 'decade', label: 'Decade' },
  { id: 'era', label: 'Era' },
  { id: 'country', label: 'Country' },
  { id: 'generation', label: 'Generation' },
  { id: 'role', label: 'Primary role' },
  { id: 'none', label: 'No grouping' },
]

export interface Query {
  text: string
  sort: SortId
  group: GroupId
  era: EraId | ''
  country: string
  manufacturer: string
  role: Role | ''
  generation: Generation | ''
}

export const DEFAULT_QUERY: Query = {
  text: '',
  sort: 'newest',
  group: 'decade',
  era: '',
  country: '',
  manufacturer: '',
  role: '',
  generation: '',
}

/** Year that places an aircraft on the timeline: service entry, else first flight. */
export function timelineYear(a: Aircraft): number {
  return Number(chronologyKey(a).slice(0, 4))
}

export function eraOf(a: Aircraft): Era {
  const y = timelineYear(a)
  return ERAS.find((e) => y >= e.from && y <= e.to) ?? ERAS[ERAS.length - 1]
}

/** Manufacturer name without parenthetical detail, so "Sukhoi (United Aircraft Corporation)" filters as "Sukhoi". */
export function manufacturerName(raw: string): string {
  return raw.replace(/\s*\(.*\)\s*$/, '').trim()
}

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

function searchText(a: Aircraft): string {
  return fold(
    [a.name, a.shortName, a.nickname ?? '', a.specVariant, ...a.countries, ...a.manufacturers, ...a.roles.map((r) => ROLE_LABEL[r])].join(' '),
  )
}

/** Every word of the query must appear somewhere in the aircraft's names, makers, countries or roles. */
export function matchesText(a: Aircraft, text: string): boolean {
  const words = fold(text).split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = searchText(a)
  // Compare without hyphens and spaces too, so "f16" finds the F-16 and "su 27" the Su-27.
  const compact = haystack.replace(/[\s-]/g, '')
  return words.every((w) => haystack.includes(w) || compact.includes(w.replace(/-/g, '')))
}

export function matches(a: Aircraft, q: Query): boolean {
  if (q.era && eraOf(a).id !== q.era) return false
  if (q.country && !a.countries.includes(q.country)) return false
  if (q.manufacturer && !a.manufacturers.some((m) => manufacturerName(m) === q.manufacturer)) return false
  if (q.role && !a.roles.includes(q.role)) return false
  if (q.generation !== '' && a.generation !== q.generation) return false
  return matchesText(a, q.text)
}

const numeric = (f: Fact<number>) => (isKnown(f) ? f.value : undefined)

/** Descending by a numeric fact; aircraft without the figure go last. */
function byFact(pick: (a: Aircraft) => Fact<number>) {
  return (a: Aircraft, b: Aircraft) => {
    const x = numeric(pick(a))
    const y = numeric(pick(b))
    if (x === undefined && y === undefined) return 0
    if (x === undefined) return 1
    if (y === undefined) return -1
    return y - x
  }
}

const SORTERS: Record<SortId, (a: Aircraft, b: Aircraft) => number> = {
  newest: (a, b) => chronologyKey(b).localeCompare(chronologyKey(a)),
  oldest: (a, b) => chronologyKey(a).localeCompare(chronologyKey(b)),
  name: (a, b) => a.name.localeCompare(b.name, 'en'),
  fastest: byFact((a) => a.maxSpeedMach),
  heaviest: byFact((a) => a.maxTakeoffWeightKg),
  wingspan: byFact((a) => a.wingspanM),
}

export function isChronological(sort: SortId): boolean {
  return sort === 'newest' || sort === 'oldest'
}

/** Filters and sorts. The sort is stable, so ties keep catalog (newest-first) order. */
export function runQuery(list: readonly Aircraft[], q: Query): Aircraft[] {
  return list.filter((a) => matches(a, q)).sort(SORTERS[q.sort])
}

export interface Group {
  key: string
  label: string
  /** Short secondary label, e.g. the year span of an era. */
  detail?: string
  items: Aircraft[]
}

function groupKey(a: Aircraft, group: GroupId): { key: string; label: string; detail?: string } {
  switch (group) {
    case 'decade': {
      const d = Math.floor(timelineYear(a) / 10) * 10
      return { key: String(d), label: `${d}s` }
    }
    case 'era': {
      const e = eraOf(a)
      return { key: e.id, label: e.label, detail: e.to === 9999 ? `${e.from} onward` : `${e.from}–${e.to}` }
    }
    case 'country':
      return { key: a.countries.join('|'), label: a.countries.join(' · ') }
    case 'generation':
      return { key: String(a.generation), label: GENERATION_LABEL[a.generation] }
    case 'role':
      return { key: a.roles[0], label: ROLE_LABEL[a.roles[0]] }
    case 'none':
      return { key: 'all', label: '' }
  }
}

/** Splits an already sorted list into groups, in order of first appearance. */
export function groupResults(list: readonly Aircraft[], group: GroupId): Group[] {
  const groups = new Map<string, Group>()
  for (const a of list) {
    const k = groupKey(a, group)
    let g = groups.get(k.key)
    if (!g) {
      g = { key: k.key, label: k.label, detail: k.detail, items: [] }
      groups.set(k.key, g)
    }
    g.items.push(a)
  }
  return [...groups.values()]
}

export interface Facets {
  countries: string[]
  manufacturers: string[]
  roles: Role[]
  generations: Generation[]
  eras: Era[]
}

/** The filter options the data supports, so no filter can offer an empty choice. */
export function facetsOf(list: readonly Aircraft[]): Facets {
  const countries = new Set<string>()
  const manufacturers = new Set<string>()
  const roles = new Set<Role>()
  const generations = new Set<Generation>()
  const eras = new Set<EraId>()
  for (const a of list) {
    a.countries.forEach((c) => countries.add(c))
    a.manufacturers.forEach((m) => manufacturers.add(manufacturerName(m)))
    a.roles.forEach((r) => roles.add(r))
    generations.add(a.generation)
    eras.add(eraOf(a).id)
  }
  const alpha = (x: string, y: string) => x.localeCompare(y, 'en')
  return {
    countries: [...countries].sort(alpha),
    manufacturers: [...manufacturers].sort(alpha),
    roles: (Object.keys(ROLE_LABEL) as Role[]).filter((r) => roles.has(r)),
    generations: [...generations].sort((x, y) => y - x),
    eras: ERAS.filter((e) => eras.has(e.id)),
  }
}

/** Number of narrowing controls in use (search text and filters, not sort or grouping). */
export function activeFilterCount(q: Query): number {
  return [q.text.trim(), q.era, q.country, q.manufacturer, q.role, q.generation].filter((v) => v !== '').length
}
