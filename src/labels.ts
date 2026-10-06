import type { Aircraft, CostKind, MissileRole } from './data'

export const STATUS_LABEL: Record<Aircraft['status'], string> = {
  'in-service': 'In service',
  'limited-service': 'Limited service',
  retired: 'Retired',
  'in-development': 'In development',
}

export const COST_KIND: Record<CostKind, { label: string; explain: string }> = {
  flyaway: {
    label: 'Flyaway cost',
    explain: 'The price of one aircraft off the production line. It leaves out development, spares, training and support.',
  },
  'procurement-unit': {
    label: 'Procurement unit cost',
    explain: 'A procurement budget divided by the number of aircraft bought. It usually includes some spares and support items.',
  },
  'program-unit': {
    label: 'Programme unit cost',
    explain: 'The whole programme, development plus production, divided by the number of aircraft. Always higher than flyaway.',
  },
  'unit-unspecified': {
    label: 'Unit cost, basis not stated',
    explain: 'A per-aircraft figure published without saying what it includes, so treat it as indicative only.',
  },
}

export const WHY_COSTS_VARY =
  'Fighter prices move with the production lot, the year the money is counted in, exchange rates and what a deal includes. Training, spares, weapons and years of support can double a contract’s per-aircraft figure. Figures of different kinds measure different things, so this site never ranks them against each other.'

export const MISSILE_ROLE_ORDER: MissileRole[] = [
  'short-range air-to-air',
  'beyond-visual-range air-to-air',
  'long-range air-to-air',
  'air-to-surface',
  'anti-radiation',
  'anti-ship',
  'cruise',
  'nuclear stand-off',
]

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const missileRoleLabel = (r: MissileRole) => cap(r)
