import { describe, expect, it } from 'vitest'
import { catalog, chronologyKey } from './index'
import { sources } from './sources'
import { missiles } from './missiles'
import { factEntries as factsOf } from './coverage'
import type { Aircraft } from './types'

function citedSourceIds(a: Aircraft): string[] {
  const ids = new Set<string>()
  for (const [, f] of factsOf(a)) if (f.status !== 'unknown') f.sources.forEach((s) => ids.add(s))
  a.costs.forEach((c) => c.sources.forEach((s) => ids.add(s)))
  a.missiles.forEach((m) => m.sources.forEach((s) => ids.add(s)))
  return [...ids]
}

const isValidDate = (s: string) => /^\d{4}(-\d{2}(-\d{2})?)?$/.test(s) && !Number.isNaN(Date.parse(s))

describe('catalog coverage', () => {
  it('has at least 20 aircraft', () => {
    expect(catalog.length).toBeGreaterThanOrEqual(20)
  })

  it('includes every aircraft named in the brief', () => {
    const required = [
      'f-35a', 'su-57', 'j-20', 'rafale', 'typhoon', 'f-22', 'f-15', 'f-16',
      'mig-29', 'su-27', 'tornado', 'f-4', 'mig-21',
    ]
    const ids = catalog.map((a) => a.id)
    for (const id of required) expect(ids).toContain(id)
  })

  it('uses unique kebab-case ids', () => {
    const ids = catalog.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('is ordered newest to oldest', () => {
    const keys = catalog.map(chronologyKey)
    expect([...keys].sort().reverse()).toEqual(keys)
  })

  it('spans at least five countries of origin and six decades', () => {
    const countries = new Set(catalog.flatMap((a) => a.countries))
    expect(countries.size).toBeGreaterThanOrEqual(5)
    const decades = new Set(catalog.map((a) => chronologyKey(a).slice(0, 3)))
    expect(decades.size).toBeGreaterThanOrEqual(6)
  })
})

describe.each(catalog.map((a) => [a.id, a] as const))('%s', (_id, a) => {
  it('names the variant its specifications describe', () => {
    expect(a.specVariant.trim()).not.toBe('')
  })

  it('carries visible sources, and lists every source its facts cite', () => {
    expect(a.sources.length).toBeGreaterThan(0)
    for (const id of a.sources) expect(sources[id], `unknown source ${id}`).toBeDefined()
    for (const id of citedSourceIds(a)) expect(a.sources, `${id} cited but not listed`).toContain(id)
  })

  it('gives every known fact a source and every uncertain or missing fact an explanation', () => {
    for (const [field, f] of factsOf(a)) {
      if (f.status === 'unknown') {
        expect(f.note.trim(), `${field} unknown without note`).not.toBe('')
      } else {
        expect(f.sources.length, `${field} has no source`).toBeGreaterThan(0)
        if (f.status !== 'documented') expect(f.note?.trim(), `${field} ${f.status} without note`).toBeTruthy()
      }
    }
  })

  it('keeps numeric facts positive and finite', () => {
    for (const [field, f] of factsOf(a)) {
      if (f.status !== 'unknown' && typeof f.value === 'number') {
        expect(Number.isFinite(f.value) && f.value > 0, field).toBe(true)
      }
    }
  })

  it('has valid, ordered dates', () => {
    for (const f of [a.firstFlight, a.serviceEntry]) if (f.status !== 'unknown') expect(isValidDate(f.value)).toBe(true)
    if (a.firstFlight.status !== 'unknown' && a.serviceEntry.status !== 'unknown') {
      expect(a.firstFlight.value <= a.serviceEntry.value).toBe(true)
    }
    if (a.status !== 'in-development') expect(a.serviceEntry.status).not.toBe('unknown')
  })

  it('has physically consistent weights and speeds', () => {
    if (a.emptyWeightKg.status !== 'unknown' && a.maxTakeoffWeightKg.status !== 'unknown') {
      expect(a.emptyWeightKg.value).toBeLessThan(a.maxTakeoffWeightKg.value)
    }
    if (a.maxSpeedMach.status !== 'unknown' && a.maxSpeedKmh.status !== 'unknown') {
      // km/h per Mach must fall between the speed of sound at altitude and at sea level, with margin.
      const ratio = a.maxSpeedKmh.value / a.maxSpeedMach.value
      expect(ratio).toBeGreaterThan(1000)
      expect(ratio).toBeLessThan(1260)
    }
    if (a.combatRadiusKm.status !== 'unknown' && a.ferryRangeKm.status !== 'unknown') {
      expect(a.combatRadiusKm.value).toBeLessThan(a.ferryRangeKm.value)
    }
  })

  it('lists only catalogued missiles, once each, with sources', () => {
    const ids = a.missiles.map((m) => m.missileId)
    expect(new Set(ids).size).toBe(ids.length)
    for (const m of a.missiles) {
      expect(missiles[m.missileId], `unknown missile ${m.missileId}`).toBeDefined()
      expect(m.sources.length).toBeGreaterThan(0)
    }
  })

  it('types every cost figure, or explains why there is none', () => {
    if (a.costs.length === 0) expect(a.costNote?.trim()).toBeTruthy()
    for (const c of a.costs) {
      expect(c.amount).toBeGreaterThan(0)
      expect(c.year).toBeGreaterThanOrEqual(1945)
      expect(c.year).toBeLessThanOrEqual(new Date().getFullYear())
      expect(c.basis.trim()).not.toBe('')
      expect(c.sources.length).toBeGreaterThan(0)
    }
  })
})
