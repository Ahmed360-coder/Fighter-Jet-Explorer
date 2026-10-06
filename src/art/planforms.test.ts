import { describe, expect, it } from 'vitest'
import { catalog } from '../data'
import { geometryOf } from './geometry'
import { planforms } from './planforms'

describe('planform artwork', () => {
  it('exists for every aircraft in the catalog', () => {
    for (const a of catalog) expect(planforms[a.id], a.id).toBeDefined()
  })

  it('has no artwork for aircraft that are not in the catalog', () => {
    const ids = new Set(catalog.map((a) => a.id))
    for (const id of Object.keys(planforms)) expect(ids.has(id), id).toBe(true)
  })

  it('starts at the nose on the centreline and keeps x on the right of it', () => {
    for (const [id, p] of Object.entries(planforms)) {
      expect(p.outline[0], id).toEqual([0, 0])
      expect(p.outline[p.outline.length - 1][0], id).toBe(0)
      for (const [x] of p.outline) expect(x, id).toBeGreaterThanOrEqual(0)
    }
  })

  it('is stretched to the published length and wingspan', () => {
    for (const a of catalog) {
      const g = geometryOf(a)!
      const xs = g.shape.outline.map((p) => g.map(p))
      const length = Math.max(...xs.map(([x]) => x))
      const halfSpan = Math.max(...xs.map(([, y]) => y))
      if (a.lengthM.status !== 'unknown') expect(length).toBeCloseTo(a.lengthM.value, 5)
      if (a.wingspanM.status !== 'unknown') expect(halfSpan * 2).toBeCloseTo(a.wingspanM.value, 5)
    }
  })
})
