import type { Fact, KnownFact } from './data'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Formats 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD' without inventing precision. */
export function formatPartialDate(value: string): string {
  const [y, m, d] = value.split('-')
  if (!m) return y
  const month = MONTHS[Number(m) - 1]
  return d ? `${Number(d)} ${month} ${y}` : `${month} ${y}`
}

const QUALIFIER_PREFIX = { 'at-least': '≥ ', about: '≈ ', 'up-to': '≤ ' } as const

export function formatNumber(n: number, maximumFractionDigits = 2): string {
  return n.toLocaleString('en-GB', { maximumFractionDigits })
}

/** Renders a numeric fact with its unit and qualifier, or a dash when unknown. */
export function formatFact(fact: Fact<number>, unit: string): string {
  if (fact.status === 'unknown') return '—'
  const prefix = fact.qualifier ? QUALIFIER_PREFIX[fact.qualifier] : ''
  if (unit === 'Mach') return `${prefix}Mach ${formatNumber(fact.value)}`
  return `${prefix}${formatNumber(fact.value)}${unit ? ` ${unit}` : ''}`
}

export function factLabel(fact: KnownFact<unknown>): string {
  if (fact.status === 'documented') return 'Documented'
  return fact.status === 'disputed' ? 'Disputed' : 'Estimated'
}
