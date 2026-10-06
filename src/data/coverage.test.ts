import { describe, expect, it } from 'vitest'
import { coverageOf } from './coverage'
import { aircraftById } from './index'

describe('coverageOf', () => {
  it('counts every fact field exactly once', () => {
    const c = coverageOf(aircraftById['f-16'])
    expect(c.documented + c.disputed + c.estimated + c.unknown).toBe(c.total)
    expect(c.total).toBe(20)
  })

  it('reports disputed figures for aircraft without official specifications', () => {
    expect(coverageOf(aircraftById['j-20']).disputed).toBeGreaterThan(5)
  })

  it('counts live-checked facts only among known facts', () => {
    const c = coverageOf(aircraftById['f-16'])
    expect(c.checkedLive).toBeGreaterThan(0)
    expect(c.checkedLive).toBeLessThanOrEqual(c.total - c.unknown)
  })
})
