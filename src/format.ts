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

/** A secondary, imperial or nautical reading of a metric value, for context. */
export function imperial(value: number, unit: string): string | undefined {
  const r = (n: number) => formatNumber(Math.round(n))
  switch (unit) {
    case 'm': {
      const totalIn = value * 39.3701
      const ft = Math.floor(totalIn / 12)
      const inch = Math.round(totalIn - ft * 12)
      return inch === 12 ? `${ft + 1} ft` : `${ft} ft ${inch} in`
    }
    case 'm-altitude':
      return `${r(value * 3.28084)} ft`
    case 'm²':
      return `${r(value * 10.7639)} sq ft`
    case 'kg':
      return `${r(value * 2.20462)} lb`
    case 'kN':
      return `${r(value * 224.809)} lbf`
    case 'km/h':
      return `${r(value / 1.852)} kn · ${r(value * 0.621371)} mph`
    case 'km':
      return `${r(value / 1.852)} nmi`
    default:
      return undefined
  }
}

const CURRENCY_SYMBOL: Record<string, string> = { USD: 'US$', EUR: '€', GBP: '£', INR: '₹', KRW: '₩' }

/** "US$82.5 million", "₹4,630 million": large sums in millions or billions, with the currency in front. */
export function formatMoney(amount: number, currency: string): string {
  const sym = CURRENCY_SYMBOL[currency] ?? `${currency} `
  if (amount >= 1e9) return `${sym}${formatNumber(amount / 1e9, 2)} billion`
  if (amount >= 1e6) return `${sym}${formatNumber(amount / 1e6, 1)} million`
  return `${sym}${formatNumber(amount, 0)}`
}

/** Swaps hyphens inside model designations for non-breaking ones, so "F-35B" never wraps as "F-" / "35B". */
export function noBreak(name: string): string {
  return name.replace(/(\w)-(\w)/g, '$1\u2011$2')
}
