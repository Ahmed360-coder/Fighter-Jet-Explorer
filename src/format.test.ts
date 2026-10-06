import { describe, expect, it } from 'vitest'
import { formatFact, formatPartialDate } from './format'

describe('formatPartialDate', () => {
  it('keeps only the precision the data has', () => {
    expect(formatPartialDate('1959')).toBe('1959')
    expect(formatPartialDate('1983-08')).toBe('Aug 1983')
    expect(formatPartialDate('2017-03-08')).toBe('8 Mar 2017')
  })
})

describe('formatFact', () => {
  it('shows a dash for unknown values', () => {
    expect(formatFact({ status: 'unknown', note: 'n/a' }, 'km')).toBe('—')
  })

  it('shows qualifiers and units', () => {
    expect(formatFact({ status: 'documented', value: 15240, qualifier: 'at-least', sources: ['x'] }, 'm')).toBe('≥ 15,240 m')
    expect(formatFact({ status: 'documented', value: 2, qualifier: 'about', sources: ['x'] }, 'Mach')).toBe('≈ Mach 2')
  })
})
