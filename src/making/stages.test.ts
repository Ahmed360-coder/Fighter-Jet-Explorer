import { describe, expect, it } from 'vitest'
import { STAGES, stepFromKey } from './stages'

describe('STAGES', () => {
  it('covers the six stages in production order', () => {
    expect(STAGES.map((s) => s.id)).toEqual(['design', 'fabrication', 'integration', 'assembly', 'ground', 'flight'])
  })

  it('gives every stage a title, summary and points', () => {
    for (const s of STAGES) {
      expect(s.title.length).toBeGreaterThan(3)
      expect(s.summary.length).toBeGreaterThan(40)
      expect(s.points.length).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('stepFromKey', () => {
  it('moves with arrow keys and stops at the ends', () => {
    expect(stepFromKey(0, 'ArrowRight', 6)).toBe(1)
    expect(stepFromKey(0, 'ArrowDown', 6)).toBe(1)
    expect(stepFromKey(5, 'ArrowRight', 6)).toBe(5)
    expect(stepFromKey(3, 'ArrowLeft', 6)).toBe(2)
    expect(stepFromKey(0, 'ArrowUp', 6)).toBe(0)
  })

  it('jumps with Home and End', () => {
    expect(stepFromKey(3, 'Home', 6)).toBe(0)
    expect(stepFromKey(1, 'End', 6)).toBe(5)
  })

  it('ignores other keys', () => {
    expect(stepFromKey(2, 'a', 6)).toBeUndefined()
    expect(stepFromKey(2, 'Enter', 6)).toBeUndefined()
  })
})
