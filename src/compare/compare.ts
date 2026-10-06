import { GENERATION_LABEL, ROLE_LABEL } from '../catalog/query'
import { aircraftById, isKnown, missiles, type Aircraft, type CostFigure, type CostKind, type Fact } from '../data'
import { formatFact, formatPartialDate } from '../format'
import { MISSILE_ROLE_ORDER, STATUS_LABEL, missileRoleLabel } from '../labels'

/**
 * Side-by-side comparison rules. Pure functions, so the page stays a thin layer
 * and the honesty rules (no winner from a bound, no mixed cost figures) are tested.
 */

/** Three keeps every column readable on a phone and every colour distinguishable, including for colour-blind readers. */
export const MAX_COMPARE = 3

/**
 * A selection is up to three slots. A removed jet leaves its slot empty instead
 * of shifting the others, so each jet keeps its letter and colour.
 */
export type Slots = (string | null)[]

export function parseCompareIds(raw: string | undefined): Slots {
  if (!raw) return []
  const seen = new Set<string>()
  const slots: Slots = []
  for (const token of raw.split(',').map((s) => s.trim())) {
    if (token === '') slots.push(null)
    else if (token in aircraftById && !seen.has(token)) {
      seen.add(token)
      slots.push(token)
    }
  }
  const kept = slots.slice(0, MAX_COMPARE)
  while (kept.length && kept[kept.length - 1] === null) kept.pop()
  return kept
}

export function serializeCompareIds(slots: readonly (string | null)[]): string {
  const out = [...slots]
  while (out.length && out[out.length - 1] === null) out.pop()
  return out.map((s) => s ?? '').join(',')
}

/** Fills the first empty slot, or appends while there is room. */
export function addToSlots(slots: Slots, id: string): Slots {
  if (slots.includes(id)) return slots
  const i = slots.indexOf(null)
  if (i >= 0) return slots.map((s, j) => (j === i ? id : s))
  return slots.length < MAX_COMPARE ? [...slots, id] : slots
}

export function removeFromSlots(slots: Slots, id: string): Slots {
  const out = slots.map((s) => (s === id ? null : s))
  while (out.length && out[out.length - 1] === null) out.pop()
  return out
}

export type RowGroup = 'Service' | 'Size and weight' | 'Power' | 'Performance' | 'Armament'

interface BaseRow {
  key: string
  group: RowGroup
  label: string
  hint?: string
  /** Plain-text reading of the cell, used to tell whether a row differs. */
  text: (a: Aircraft) => string
}

export interface NumberRowDef extends BaseRow {
  type: 'number'
  fact: (a: Aircraft) => Fact<number>
  unit: string
  /** Unit key for the secondary (imperial) reading. */
  alt?: string
  /** Word for the largest value, e.g. "Longest". Neutral: largest is not always better. */
  lead: string
}

export interface FactRowDef extends BaseRow {
  type: 'date' | 'text'
  fact: (a: Aircraft) => Fact<string>
}

export interface PlainRowDef extends BaseRow {
  type: 'plain'
}

export type RowDef = NumberRowDef | FactRowDef | PlainRowDef

const num = (
  key: string,
  group: RowGroup,
  label: string,
  fact: (a: Aircraft) => Fact<number>,
  unit: string,
  lead: string,
  extra: { hint?: string; alt?: string } = {},
): NumberRowDef => ({ key, group, label, type: 'number', fact, unit, lead, text: (a) => formatFact(fact(a), unit), ...extra })

const factText = (f: Fact<string>, fmt: (v: string) => string = (v) => v) => (isKnown(f) ? fmt(f.value) : '—')

/** Documented missile roles, in the site's standard order. Reported-only missiles are left out. */
export function documentedMissileRoles(a: Aircraft): string[] {
  const roles = new Set(a.missiles.filter((m) => m.status === 'documented').map((m) => missiles[m.missileId].role))
  return MISSILE_ROLE_ORDER.filter((r) => roles.has(r)).map(missileRoleLabel)
}

export const ROWS: readonly RowDef[] = [
  { key: 'origin', group: 'Service', label: 'Origin', type: 'plain', text: (a) => a.countries.join(', ') },
  { key: 'role', group: 'Service', label: 'Role', type: 'plain', text: (a) => a.roles.map((r) => ROLE_LABEL[r]).join(', ') },
  { key: 'generation', group: 'Service', label: 'Generation', type: 'plain', text: (a) => GENERATION_LABEL[a.generation] },
  { key: 'status', group: 'Service', label: 'Status', type: 'plain', text: (a) => STATUS_LABEL[a.status] },
  {
    key: 'first-flight',
    group: 'Service',
    label: 'First flight',
    type: 'date',
    fact: (a) => a.firstFlight,
    text: (a) => factText(a.firstFlight, formatPartialDate),
  },
  {
    key: 'service-entry',
    group: 'Service',
    label: 'Entered service',
    type: 'date',
    fact: (a) => a.serviceEntry,
    text: (a) => factText(a.serviceEntry, formatPartialDate),
  },
  num('built', 'Service', 'Number built', (a) => a.numberBuilt, '', 'Most built'),
  num('crew', 'Service', 'Crew', (a) => a.crew, '', 'Most crew'),

  num('length', 'Size and weight', 'Length', (a) => a.lengthM, 'm', 'Longest'),
  num('wingspan', 'Size and weight', 'Wingspan', (a) => a.wingspanM, 'm', 'Widest'),
  num('height', 'Size and weight', 'Height', (a) => a.heightM, 'm', 'Tallest'),
  num('wing-area', 'Size and weight', 'Wing area', (a) => a.wingAreaM2, 'm²', 'Largest'),
  num('empty', 'Size and weight', 'Empty weight', (a) => a.emptyWeightKg, 'kg', 'Heaviest', { hint: 'Without fuel, crew or stores.' }),
  num('mtow', 'Size and weight', 'Max take-off weight', (a) => a.maxTakeoffWeightKg, 'kg', 'Heaviest'),

  {
    key: 'engine',
    group: 'Power',
    label: 'Engines',
    type: 'text',
    fact: (a) => a.engine,
    text: (a) => `${a.engineCount} × ${factText(a.engine)}`,
  },
  num('thrust', 'Power', 'Thrust per engine', (a) => a.thrustPerEngineKn, 'kN', 'Most thrust', {
    hint: 'With afterburner where fitted.',
  }),

  num('mach', 'Performance', 'Max speed', (a) => a.maxSpeedMach, 'Mach', 'Fastest', { hint: 'At high altitude.' }),
  num('ceiling', 'Performance', 'Service ceiling', (a) => a.serviceCeilingM, 'm', 'Highest', { alt: 'm-altitude' }),
  num('range', 'Performance', 'Range', (a) => a.rangeKm, 'km', 'Longest', { hint: 'Internal fuel unless noted.' }),
  num('radius', 'Performance', 'Combat radius', (a) => a.combatRadiusKm, 'km', 'Longest', {
    hint: 'Depends heavily on load and flight profile.',
  }),
  num('ferry', 'Performance', 'Ferry range', (a) => a.ferryRangeKm, 'km', 'Longest'),

  num('hardpoints', 'Armament', 'Hardpoints', (a) => a.hardpoints, '', 'Most'),
  { key: 'gun', group: 'Armament', label: 'Gun', type: 'text', fact: (a) => a.gun, text: (a) => factText(a.gun) },
  {
    key: 'missile-roles',
    group: 'Armament',
    label: 'Documented missile roles',
    hint: 'Officially documented compatibility only; general role, no performance detail.',
    type: 'plain',
    text: (a) => documentedMissileRoles(a).join(', ') || 'None documented',
  },
]

export const ROW_GROUPS: readonly RowGroup[] = ['Service', 'Size and weight', 'Power', 'Performance', 'Armament']

export interface NumericStats {
  max: number | undefined
  /** Indexes of the jets with the largest value. Empty when no honest leader exists. */
  leaders: number[]
  /** Each value as a share of the largest, for bar lengths. */
  share: (number | undefined)[]
}

export function numericRowStats(facts: readonly Fact<number>[]): NumericStats {
  const values = facts.map((f) => (isKnown(f) ? f.value : undefined))
  const known = values.filter((v): v is number => v !== undefined)
  if (known.length === 0) return { max: undefined, leaders: [], share: values.map(() => undefined) }
  const max = Math.max(...known)
  const share = values.map((v) => (v === undefined || max <= 0 ? undefined : v / max))
  const top = values.flatMap((v, i) => (v === max ? [i] : []))
  // A leader needs at least two figures, a real gap, a top value that is not just an upper bound,
  // and no runner-up stated only as a lower bound (its true value could be higher).
  const qualifier = (i: number) => {
    const f = facts[i]
    return isKnown(f) ? f.qualifier : undefined
  }
  const uncertain =
    top.some((i) => qualifier(i) === 'up-to') || values.some((v, i) => v !== undefined && v !== max && qualifier(i) === 'at-least')
  const leaders = known.length >= 2 && top.length < known.length && !uncertain ? top : []
  return { max, leaders, share }
}

/** True when the selected jets do not all read the same in this row. */
export function rowDiffers(row: RowDef, picks: readonly Aircraft[]): boolean {
  return new Set(picks.map((a) => row.text(a))).size > 1
}

/* ---------- Costs ---------- */

export interface CostEntry {
  aircraft: Aircraft
  figure: CostFigure
}

export interface CostGroup {
  kind: Exclude<CostKind, 'unit-unspecified'>
  currency: string
  year: number
  entries: CostEntry[]
}

/**
 * Why a figure cannot sit beside another one:
 * `unspecified` its basis is not stated, so it matches nothing;
 * `kind` the others measure something different (flyaway vs programme, …);
 * `currency` same kind but a different currency;
 * `year` same kind and currency but counted in a different year's money;
 * `alone` no other selected jet has a figure at all.
 */
export type ApartReason = 'unspecified' | 'kind' | 'currency' | 'year' | 'alone'

export interface ApartEntry extends CostEntry {
  reason: ApartReason
}

export interface CostComparison {
  groups: CostGroup[]
  apart: ApartEntry[]
  /** Selected aircraft with no cost figure at all. */
  missing: Aircraft[]
}

/**
 * Only figures of the same defined kind, in the same currency and the same
 * year's money, from at least two different aircraft, are shown side by side.
 * Everything else is listed apart with the reason, so unlike figures are never
 * placed on one scale.
 */
export function compareCosts(picks: readonly Aircraft[]): CostComparison {
  const entries: CostEntry[] = picks.flatMap((aircraft) => aircraft.costs.map((figure) => ({ aircraft, figure })))
  const buckets = new Map<string, CostEntry[]>()
  for (const e of entries) {
    if (e.figure.kind === 'unit-unspecified') continue
    const key = `${e.figure.kind}|${e.figure.currency}|${e.figure.year}`
    buckets.set(key, [...(buckets.get(key) ?? []), e])
  }

  const groups: CostGroup[] = []
  const grouped = new Set<CostEntry>()
  for (const list of buckets.values()) {
    if (new Set(list.map((e) => e.aircraft.id)).size < 2) continue
    const f = list[0].figure
    groups.push({ kind: f.kind as CostGroup['kind'], currency: f.currency, year: f.year, entries: list })
    list.forEach((e) => grouped.add(e))
  }

  const others = (e: CostEntry) => entries.filter((o) => o.aircraft.id !== e.aircraft.id)
  const reasonFor = (e: CostEntry): ApartReason => {
    if (e.figure.kind === 'unit-unspecified') return 'unspecified'
    if (others(e).length === 0) return 'alone'
    const sameKind = others(e).filter((o) => o.figure.kind === e.figure.kind)
    if (sameKind.length === 0) return 'kind'
    const sameCurrency = sameKind.filter((o) => o.figure.currency === e.figure.currency)
    if (sameCurrency.length === 0) return 'currency'
    return 'year'
  }

  const apart = entries.filter((e) => !grouped.has(e)).map((e) => ({ ...e, reason: reasonFor(e) }))
  return { groups, apart, missing: picks.filter((a) => a.costs.length === 0) }
}

export const APART_REASON: Record<ApartReason, string> = {
  unspecified: 'Published without saying what it includes, so it is not set against any other figure.',
  kind: 'The other selected jets only have a different kind of cost figure, which measures something else.',
  currency: 'The only figure of the same kind is in another currency. Exchange rates would add their own distortion.',
  year: 'The only figure of the same kind is counted in a different year’s money. This site does not adjust for inflation.',
  alone: 'No other selected jet has a published cost figure to set it beside.',
}
