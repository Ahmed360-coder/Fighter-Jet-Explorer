/**
 * Aircraft data model.
 *
 * Every factual value is wrapped in a `Fact`, which records whether the value is
 * documented, disputed, estimated or unknown, which sources support it, and
 * whether it was re-checked against a live source while this dataset was built.
 * Presentation code must never assume a value exists: check `status` first.
 */

export type ISODateLike = string // 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'

export type FactStatus = 'documented' | 'disputed' | 'estimated' | 'unknown'

/** How a number relates to the true value, when the source states a bound. */
export type Qualifier = 'at-least' | 'about' | 'up-to'

export interface KnownFact<T> {
  status: 'documented' | 'disputed' | 'estimated'
  value: T
  qualifier?: Qualifier
  /** Ids into the source registry. At least one is required. */
  sources: string[]
  /** Required for disputed and estimated values: why, and what differs. */
  note?: string
  /** True only when the value was confirmed against a fetched source during this build. */
  checkedLive?: boolean
}

export interface UnknownFact {
  status: 'unknown'
  /** Why the value is missing (not published, classified, not found, …). */
  note: string
}

export type Fact<T> = KnownFact<T> | UnknownFact

export type SourceKind = 'government' | 'manufacturer' | 'museum' | 'reference'

export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  kind: SourceKind
}

export type Role =
  | 'air-superiority'
  | 'multirole'
  | 'interceptor'
  | 'strike'
  | 'carrier-based'
  | 'stovl'
  | 'light-combat'

/** Commonly used, informal jet-fighter generations. */
export type Generation = 1 | 2 | 3 | 4 | 4.5 | 5

export type ServiceStatus = 'in-service' | 'limited-service' | 'retired' | 'in-development'

export type CostKind =
  /** Cost of one airframe off the line, excluding development, spares, support. */
  | 'flyaway'
  /** Procurement budget divided by units bought; usually includes some support items. */
  | 'procurement-unit'
  /** Whole programme (development + procurement) divided by units. */
  | 'program-unit'
  /** A unit figure published without a stated basis. */
  | 'unit-unspecified'

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'KRW'

export interface CostFigure {
  kind: CostKind
  amount: number
  currency: Currency
  /** Year the money is expressed in (fiscal or calendar, see `basis`). */
  year: number
  /** Which variant or lot the figure applies to, and fiscal-year basis. */
  basis: string
  sources: string[]
  checkedLive?: boolean
  note?: string
}

export type MissileRole =
  | 'short-range air-to-air'
  | 'beyond-visual-range air-to-air'
  | 'long-range air-to-air'
  | 'air-to-surface'
  | 'anti-ship'
  | 'anti-radiation'
  | 'cruise'
  | 'nuclear stand-off'

export interface Missile {
  id: string
  name: string
  role: MissileRole
  origin: string
}

/**
 * `documented`: confirmed by an operator, manufacturer or reliable reference.
 * `reported`: claimed or shown publicly but not confirmed by an official source.
 */
export interface MissileCompatibility {
  missileId: string
  status: 'documented' | 'reported'
  sources: string[]
  /** Set when compatibility applies only to some variants, operators or upgrades. */
  appliesTo?: string
  note?: string
}

export interface Aircraft {
  id: string
  name: string
  /** Compact name for tight layouts, e.g. 'F-16'. */
  shortName: string
  nickname?: string
  /** The exact variant every specification below describes. */
  specVariant: string
  specVariantNote?: string
  countries: string[]
  manufacturers: string[]
  roles: Role[]
  generation: Generation
  status: ServiceStatus
  summary: string

  firstFlight: Fact<ISODateLike>
  serviceEntry: Fact<ISODateLike>
  numberBuilt: Fact<number>

  crew: Fact<number>
  lengthM: Fact<number>
  wingspanM: Fact<number>
  heightM: Fact<number>
  wingAreaM2: Fact<number>
  emptyWeightKg: Fact<number>
  maxTakeoffWeightKg: Fact<number>

  engineCount: number
  engine: Fact<string>
  /** Afterburning (or maximum, for non-afterburning engines) thrust per engine. */
  thrustPerEngineKn: Fact<number>

  maxSpeedMach: Fact<number>
  maxSpeedKmh: Fact<number>
  /** Range on internal fuel unless the note says otherwise. */
  rangeKm: Fact<number>
  combatRadiusKm: Fact<number>
  ferryRangeKm: Fact<number>
  serviceCeilingM: Fact<number>

  hardpoints: Fact<number>
  gun: Fact<string>
  missiles: MissileCompatibility[]

  costs: CostFigure[]
  /** Explains why no cost is shown, when `costs` is empty. */
  costNote?: string

  /** Every source used by this record, for the visible "Sources" list. */
  sources: string[]
}
