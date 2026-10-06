import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-f14']

export const f14: Aircraft = {
  id: 'f-14',
  name: 'Grumman F-14 Tomcat',
  shortName: 'F-14',
  specVariant: 'F-14D Super Tomcat',
  specVariantNote: 'The original F-14A used TF30 engines with less thrust; Iran still flies F-14As.',
  countries: ['United States'],
  manufacturers: ['Grumman'],
  roles: ['air-superiority', 'interceptor', 'carrier-based'],
  generation: 4,
  status: 'limited-service',
  summary:
    'A two-seat, variable-sweep carrier fighter built to defend fleets at long range. Retired by the U.S. Navy in 2006; Iran still operates it.',

  firstFlight: documented('1970-12-21', S, { checkedLive: true }),
  serviceEntry: documented('1974-09-22', S, { note: 'U.S. Navy retirement: 22 September 2006.', checkedLive: true }),
  numberBuilt: documented(712, S, { checkedLive: true }),

  crew: documented(2, S, { note: 'Pilot and radar intercept officer.' }),
  lengthM: documented(19.1, S),
  wingspanM: documented(19.55, S, { note: 'Wings spread; 11.58 m swept.' }),
  heightM: documented(4.88, S),
  wingAreaM2: documented(52.5, S),
  emptyWeightKg: documented(19_838, S),
  maxTakeoffWeightKg: documented(33_724, S),

  engineCount: 2,
  engine: documented('General Electric F110-GE-400 afterburning turbofan', S),
  thrustPerEngineKn: documented(124.7, S),

  maxSpeedMach: documented(2.34, S, { note: 'At altitude.' }),
  maxSpeedKmh: documented(2_485, S, { note: 'At altitude.' }),
  rangeKm: unknown('No internal-fuel range has been published.'),
  combatRadiusKm: documented(926, S),
  ferryRangeKm: documented(2_960, S),
  serviceCeilingM: documented(16_150, S),

  hardpoints: documented(10, S),
  gun: documented('M61A1 Vulcan 20 mm rotary cannon', S),
  missiles: [
    { missileId: 'aim-54', status: 'documented', sources: S },
    { missileId: 'aim-7', status: 'documented', sources: S },
    { missileId: 'aim-9', status: 'documented', sources: S },
  ],

  costs: [],
  costNote: 'Published figures range from 1970s contract prices to later averages, with no consistent basis, so none is shown.',

  sources: S,
}
