import { describe, expect, it } from 'vitest'
import { formatFact, formatMoney, formatPartialDate, imperial, noBreak } from './format'

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

describe('imperial', () => {
  it('converts lengths to feet and inches', () => {
    expect(imperial(15.7, 'm')).toBe('51 ft 6 in')
    expect(imperial(0.3048, 'm')).toBe('1 ft 0 in')
  })

  it('converts weights, thrust, speed, distance and altitude', () => {
    expect(imperial(1000, 'kg')).toBe('2,205 lb')
    expect(imperial(191, 'kN')).toBe('42,939 lbf')
    expect(imperial(1852, 'km/h')).toBe('1,000 kn · 1,151 mph')
    expect(imperial(1852, 'km')).toBe('1,000 nmi')
    expect(imperial(15240, 'm-altitude')).toBe('50,000 ft')
  })

  it('has no conversion for unitless values', () => {
    expect(imperial(2, '')).toBeUndefined()
  })
})

describe('formatMoney', () => {
  it('uses millions and billions with the currency in front', () => {
    expect(formatMoney(82_500_000, 'USD')).toBe('US$82.5 million')
    expect(formatMoney(1_250_000_000, 'EUR')).toBe('€1.25 billion')
    expect(formatMoney(5_000, 'GBP')).toBe('£5,000')
  })
})

describe('noBreak', () => {
  it('replaces hyphens between letters and digits only', () => {
    expect(noBreak('F-35B Lightning II')).toBe('F‑35B Lightning II')
    expect(noBreak('Post - war')).toBe('Post - war')
  })
})
