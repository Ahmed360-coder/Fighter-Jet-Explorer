import { describe, expect, it } from 'vitest'
import { aircraftById, catalog, type Aircraft, type CostFigure } from '../data'
import { documented, unknown } from '../data/fact'
import { MAX_COMPARE, ROWS, addToSlots, compareCosts, removeFromSlots, numericRowStats, parseCompareIds, rowDiffers, serializeCompareIds } from './compare'

const jet = (id: string) => aircraftById[id]

const cost = (over: Partial<CostFigure>): CostFigure => ({
  kind: 'flyaway',
  amount: 50e6,
  currency: 'USD',
  year: 2020,
  basis: 'test lot',
  sources: ['x'],
  ...over,
})

const withCosts = (base: Aircraft, id: string, costs: CostFigure[]): Aircraft => ({ ...base, id, shortName: id, costs })

describe('parseCompareIds', () => {
  it('reads known ids in order', () => {
    expect(parseCompareIds('f-22,su-57')).toEqual(['f-22', 'su-57'])
  })

  it('drops unknown ids and duplicates', () => {
    expect(parseCompareIds('f-22,nope,f-22,j-20')).toEqual(['f-22', 'j-20'])
  })

  it(`keeps at most ${MAX_COMPARE}`, () => {
    expect(parseCompareIds('f-22,su-57,j-20,f-16,mig-29')).toHaveLength(MAX_COMPARE)
  })

  it('handles an empty selection', () => {
    expect(parseCompareIds('')).toEqual([])
    expect(parseCompareIds(undefined)).toEqual([])
  })

  it('round-trips with serializeCompareIds', () => {
    expect(parseCompareIds(serializeCompareIds(['tejas', 'jf-17']))).toEqual(['tejas', 'jf-17'])
    expect(parseCompareIds(serializeCompareIds(['tejas', null, 'jf-17']))).toEqual(['tejas', null, 'jf-17'])
  })

  it('keeps empty slots in the middle but trims them at the end', () => {
    expect(parseCompareIds('f-22,,j-20')).toEqual(['f-22', null, 'j-20'])
    expect(parseCompareIds('f-22,,')).toEqual(['f-22'])
  })
})

describe('slots', () => {
  it('removing a jet leaves its slot empty so the others keep their letter', () => {
    expect(removeFromSlots(['a', 'b', 'c'], 'a')).toEqual([null, 'b', 'c'])
    expect(removeFromSlots(['a', 'b'], 'b')).toEqual(['a'])
  })

  it('adding fills the first gap, then appends, then stops at the limit', () => {
    expect(addToSlots([null, 'b'], 'x')).toEqual(['x', 'b'])
    expect(addToSlots(['a'], 'x')).toEqual(['a', 'x'])
    expect(addToSlots(['a', 'b', 'c'], 'x')).toEqual(['a', 'b', 'c'])
    expect(addToSlots(['a'], 'a')).toEqual(['a'])
  })
})

describe('numericRowStats', () => {
  it('finds the largest known value and scales bars to it', () => {
    const s = numericRowStats([documented(10, ['a']), documented(20, ['a']), unknown('n/a')])
    expect(s.max).toBe(20)
    expect(s.leaders).toEqual([1])
    expect(s.share).toEqual([0.5, 1, undefined])
  })

  it('names no leader when fewer than two values are known', () => {
    const s = numericRowStats([documented(10, ['a']), unknown('n/a')])
    expect(s.leaders).toEqual([])
  })

  it('names no leader when all known values are equal', () => {
    const s = numericRowStats([documented(1, ['a']), documented(1, ['a'])])
    expect(s.leaders).toEqual([])
  })

  it('names every jet that ties for the top', () => {
    const s = numericRowStats([documented(2, ['a']), documented(2, ['a']), documented(1, ['a'])])
    expect(s.leaders).toEqual([0, 1])
  })

  it('names no leader when the top value is only a bound', () => {
    // "up to 2" might be lower than the other jet's 1.9, so no honest winner.
    const s = numericRowStats([documented(2, ['a'], { qualifier: 'up-to' }), documented(1.9, ['a'])])
    expect(s.leaders).toEqual([])
  })

  it('names no leader when a smaller value is only a lower bound', () => {
    // "at least 1,667" might really be more than 2,220.
    const s = numericRowStats([documented(2220, ['a'], { qualifier: 'at-least' }), documented(1667, ['a'], { qualifier: 'at-least' })])
    expect(s.leaders).toEqual([])
  })

  it('keeps a leader whose own value is a lower bound when the rest are exact', () => {
    const s = numericRowStats([documented(2220, ['a'], { qualifier: 'at-least' }), documented(1667, ['a'])])
    expect(s.leaders).toEqual([0])
  })

  it('works with no jets known at all', () => {
    const s = numericRowStats([unknown('a'), unknown('b')])
    expect(s.max).toBeUndefined()
    expect(s.share).toEqual([undefined, undefined])
  })
})

describe('rowDiffers', () => {
  const span = ROWS.find((r) => r.key === 'wingspan')!
  it('is false when every jet shows the same thing', () => {
    expect(rowDiffers(span, [jet('f-35a'), jet('f-35a')])).toBe(false)
  })
  it('is true when values differ', () => {
    expect(rowDiffers(span, [jet('f-22'), jet('f-16')])).toBe(true)
  })
  it('treats a known value against an unknown one as a difference', () => {
    const a = { ...jet('f-16'), wingspanM: unknown('n/a') }
    expect(rowDiffers(span, [a, jet('f-16')])).toBe(true)
  })
})

describe('ROWS', () => {
  it('renders every row for every aircraft without throwing', () => {
    for (const row of ROWS) for (const a of catalog) expect(() => row.text(a)).not.toThrow()
  })
  it('have unique keys', () => {
    expect(new Set(ROWS.map((r) => r.key)).size).toBe(ROWS.length)
  })
})

describe('compareCosts', () => {
  const base = jet('f-16')

  it('puts same-kind, same-currency, same-year figures side by side', () => {
    const r = compareCosts([jet('f-35a'), jet('f-35b')])
    expect(r.groups).toHaveLength(1)
    expect(r.groups[0].kind).toBe('flyaway')
    expect(r.groups[0].entries.map((e) => e.aircraft.id)).toEqual(['f-35a', 'f-35b'])
    expect(r.apart).toEqual([])
  })

  it('never groups figures of different kinds', () => {
    const a = withCosts(base, 'a', [cost({ kind: 'flyaway' })])
    const b = withCosts(base, 'b', [cost({ kind: 'program-unit' })])
    const r = compareCosts([a, b])
    expect(r.groups).toEqual([])
    expect(r.apart.map((x) => x.reason)).toEqual(['kind', 'kind'])
  })

  it('never groups figures counted in different currencies', () => {
    const r = compareCosts([withCosts(base, 'a', [cost({})]), withCosts(base, 'b', [cost({ currency: 'EUR' })])])
    expect(r.groups).toEqual([])
    expect(r.apart.every((x) => x.reason === 'currency')).toBe(true)
  })

  it('never groups figures in different years’ money', () => {
    const r = compareCosts([jet('f-35a'), jet('f-86')])
    expect(r.groups).toEqual([])
    expect(r.apart.map((x) => x.reason)).toEqual(['year', 'year'])
  })

  it('never groups figures whose basis is not stated, even with each other', () => {
    const r = compareCosts([jet('f-16'), jet('f-15')])
    expect(r.groups).toEqual([])
    expect(r.apart.map((x) => x.reason)).toEqual(['unspecified', 'unspecified'])
  })

  it('needs two different aircraft to form a group', () => {
    const a = withCosts(base, 'a', [cost({ basis: 'lot 1' }), cost({ basis: 'lot 2' })])
    const r = compareCosts([a, withCosts(base, 'b', [])])
    expect(r.groups).toEqual([])
    expect(r.apart.map((x) => x.reason)).toEqual(['alone', 'alone'])
  })

  it('lists aircraft with no figure separately, with their note', () => {
    const r = compareCosts([jet('su-57'), jet('f-35a')])
    expect(r.missing.map((a) => a.id)).toEqual(['su-57'])
    expect(r.apart.map((x) => x.reason)).toEqual(['alone'])
  })

  it('places every figure exactly once', () => {
    const picks = [jet('f-35a'), jet('f-35b'), jet('f-86')]
    const r = compareCosts(picks)
    const placed = r.groups.flatMap((g) => g.entries).length + r.apart.length
    expect(placed).toBe(picks.reduce((n, a) => n + a.costs.length, 0))
  })
})
