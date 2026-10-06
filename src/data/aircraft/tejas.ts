import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-tejas']

export const tejas: Aircraft = {
  id: 'tejas',
  name: 'HAL Tejas',
  shortName: 'Tejas',
  specVariant: 'Tejas Mk1',
  specVariantNote: 'The improved Tejas Mk1A is in production and is not described here.',
  countries: ['India'],
  manufacturers: ['Hindustan Aeronautics Limited'],
  roles: ['light-combat', 'multirole'],
  generation: 4.5,
  status: 'in-service',
  summary:
    'India’s compact single-engine delta fighter, one of the smallest supersonic combat jets in service, with extensive composite structure.',

  firstFlight: documented('2001-01-04', S, { checkedLive: true }),
  serviceEntry: documented('2015-01-17', S, { checkedLive: true }),
  numberBuilt: documented(45, S, { note: 'Production aircraft, plus 17 prototypes.', checkedLive: true }),

  crew: documented(1, S, { note: 'A two-seat trainer also exists.' }),
  lengthM: documented(13.2, S),
  wingspanM: documented(8.2, S),
  heightM: documented(4.4, S),
  wingAreaM2: documented(38.4, S),
  emptyWeightKg: documented(6_560, S),
  maxTakeoffWeightKg: documented(13_500, S),

  engineCount: 1,
  engine: documented('General Electric F404-GE-IN20', S),
  thrustPerEngineKn: documented(84, S, { qualifier: 'about' }),

  maxSpeedMach: documented(1.6, S),
  maxSpeedKmh: unknown('Published as a Mach figure only.'),
  rangeKm: unknown('No consistent internal-fuel range has been published.'),
  combatRadiusKm: documented(500, S),
  ferryRangeKm: documented(3_000, S),
  serviceCeilingM: documented(15_240, S, { note: '50,000 ft.' }),

  hardpoints: documented(8, S),
  gun: documented('GSh-23 23 mm twin-barrel cannon', S),
  missiles: [
    { missileId: 'r-73', status: 'documented', sources: S },
    { missileId: 'python-5', status: 'documented', sources: S },
    { missileId: 'derby', status: 'documented', sources: S },
    { missileId: 'astra', status: 'documented', sources: S, note: 'Test-fired from the Tejas; integration continuing on the Mk1A.' },
  ],

  costs: [],
  costNote:
    'Indian contracts mix aircraft, support and infrastructure, and per-batch figures differ, so no single like-for-like unit cost is shown.',

  sources: S,
}
