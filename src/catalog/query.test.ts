import { describe, expect, it } from 'vitest'
import { catalog } from '../data'
import {
  DEFAULT_QUERY,
  activeFilterCount,
  eraOf,
  facetsOf,
  groupResults,
  manufacturerName,
  matchesText,
  runQuery,
  type Query,
} from './query'

const q = (over: Partial<Query>): Query => ({ ...DEFAULT_QUERY, ...over })
const ids = (list: { id: string }[]) => list.map((a) => a.id)
const byId = (id: string) => catalog.find((a) => a.id === id)!

describe('runQuery', () => {
  it('returns the whole catalog newest first by default', () => {
    expect(ids(runQuery(catalog, DEFAULT_QUERY))).toEqual(ids([...catalog]))
  })

  it('reverses for oldest first', () => {
    const oldest = runQuery(catalog, q({ sort: 'oldest' }))
    expect(oldest[0].id).toMatch(/mig-15|f-86/)
    expect(oldest[oldest.length - 1].id).toBe('kf-21')
  })

  it('sorts by name', () => {
    const names = runQuery(catalog, q({ sort: 'name' })).map((a) => a.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')))
  })

  it('sorts by a numeric figure, largest first, with unknowns last', () => {
    const list = runQuery(catalog, q({ sort: 'wingspan' }))
    expect(list[0].id).toBe('f-14')
    const speeds = runQuery(catalog, q({ sort: 'fastest' })).map((a) => (a.maxSpeedMach.status === 'unknown' ? -1 : a.maxSpeedMach.value))
    const known = speeds.filter((s) => s >= 0)
    expect(known).toEqual([...known].sort((a, b) => b - a))
    expect(speeds.slice(known.length).every((s) => s === -1)).toBe(true)
  })

  it('filters by country, manufacturer, role, generation and era', () => {
    expect(runQuery(catalog, q({ country: 'France' })).every((a) => a.countries.includes('France'))).toBe(true)
    expect(ids(runQuery(catalog, q({ manufacturer: 'Sukhoi' })))).toEqual(expect.arrayContaining(['su-57', 'su-27', 'su-30mki']))
    expect(runQuery(catalog, q({ role: 'carrier-based' })).every((a) => a.roles.includes('carrier-based'))).toBe(true)
    expect(ids(runQuery(catalog, q({ generation: 5 })))).toEqual(expect.arrayContaining(['f-22', 'f-35a', 'j-20', 'su-57']))
    expect(runQuery(catalog, q({ era: 'early-jet' })).every((a) => eraOf(a).id === 'early-jet')).toBe(true)
  })

  it('combines filters', () => {
    const list = runQuery(catalog, q({ country: 'United States', generation: 5 }))
    expect(ids(list).sort()).toEqual(['f-22', 'f-35a', 'f-35b'])
  })

  it('returns nothing, without throwing, when filters exclude everything', () => {
    expect(runQuery(catalog, q({ country: 'Sweden', generation: 1 }))).toEqual([])
    expect(runQuery(catalog, q({ text: 'zeppelin' }))).toEqual([])
  })
})

describe('matchesText', () => {
  it('ignores case, hyphens and accents', () => {
    expect(matchesText(byId('f-16'), 'f16')).toBe(true)
    expect(matchesText(byId('su-27'), 'SU 27')).toBe(true)
    expect(matchesText(byId('f-16'), 'viper')).toBe(true)
  })

  it('searches makers, countries and nicknames', () => {
    expect(matchesText(byId('rafale'), 'dassault')).toBe(true)
    expect(matchesText(byId('mig-29'), 'fulcrum')).toBe(true)
    expect(matchesText(byId('gripen'), 'sweden')).toBe(true)
  })

  it('requires every word to match', () => {
    expect(matchesText(byId('f-15'), 'mcdonnell eagle zzz')).toBe(false)
  })
})

describe('grouping', () => {
  it('groups chronologically by decade in result order', () => {
    const groups = groupResults(runQuery(catalog, DEFAULT_QUERY), 'decade')
    expect(groups[0].label).toBe('2020s')
    expect(groups[groups.length - 1].label).toBe('1940s')
    expect(groups.flatMap((g) => g.items).length).toBe(catalog.length)
  })

  it('puts everything in one group for no grouping', () => {
    expect(groupResults(catalog, 'none')).toHaveLength(1)
  })
})

describe('facets', () => {
  it('offers only options that match at least one aircraft', () => {
    const f = facetsOf(catalog)
    for (const c of f.countries) expect(runQuery(catalog, q({ country: c })).length).toBeGreaterThan(0)
    for (const m of f.manufacturers) expect(runQuery(catalog, q({ manufacturer: m })).length).toBeGreaterThan(0)
    for (const r of f.roles) expect(runQuery(catalog, q({ role: r })).length).toBeGreaterThan(0)
    for (const g of f.generations) expect(runQuery(catalog, q({ generation: g })).length).toBeGreaterThan(0)
    for (const e of f.eras) expect(runQuery(catalog, q({ era: e.id })).length).toBeGreaterThan(0)
  })

  it('strips parenthetical detail from manufacturer names', () => {
    expect(manufacturerName('Sukhoi (United Aircraft Corporation)')).toBe('Sukhoi')
    expect(manufacturerName('Saab')).toBe('Saab')
  })
})

describe('activeFilterCount', () => {
  it('counts search and filters but not sort or grouping', () => {
    expect(activeFilterCount(DEFAULT_QUERY)).toBe(0)
    expect(activeFilterCount(q({ sort: 'name', group: 'none' }))).toBe(0)
    expect(activeFilterCount(q({ text: ' f ', country: 'France', generation: 4 }))).toBe(3)
  })
})
