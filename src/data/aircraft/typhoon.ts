import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const W = ['wiki-typhoon']
const EF = ['eurofighter']

export const typhoon: Aircraft = {
  id: 'typhoon',
  name: 'Eurofighter Typhoon',
  shortName: 'Typhoon',
  specVariant: 'Typhoon single-seat (Tranche 2/3)',
  countries: ['United Kingdom', 'Germany', 'Italy', 'Spain'],
  manufacturers: ['Airbus', 'BAE Systems', 'Leonardo'],
  roles: ['multirole', 'air-superiority'],
  generation: 4.5,
  status: 'in-service',
  summary:
    'A four-nation canard-delta fighter with very high thrust-to-weight ratio, developed for agility first and later grown into a full multirole aircraft.',

  firstFlight: documented('1994-03-27', W, { checkedLive: true }),
  serviceEntry: documented('2003-08-04', W, { checkedLive: true }),
  numberBuilt: documented(609, W, { note: 'Plus 7 prototypes, as of January 2025.', checkedLive: true }),

  crew: documented(1, W, { note: 'Two-seat trainers also exist.' }),
  lengthM: documented(15.96, W),
  wingspanM: documented(10.95, W),
  heightM: documented(5.28, W),
  wingAreaM2: documented(51.2, W),
  emptyWeightKg: documented(11_000, W),
  maxTakeoffWeightKg: documented(23_500, W),

  engineCount: 2,
  engine: documented('Eurojet EJ200 afterburning turbofan', [...W, ...EF]),
  thrustPerEngineKn: documented(90, W),

  maxSpeedMach: documented(2, W),
  maxSpeedKmh: unknown('Sources disagree on the km/h equivalent.'),
  rangeKm: unknown('No internal-fuel range has been published.'),
  combatRadiusKm: documented(1_389, W, { note: 'Ground attack, high-low-high profile.' }),
  ferryRangeKm: documented(3_790, W, { note: 'With three external drop tanks.' }),
  serviceCeilingM: documented(19_812, W, { note: '65,000 ft.' }),

  hardpoints: documented(13, W),
  gun: documented('Mauser BK-27 27 mm revolver cannon', W),
  missiles: [
    { missileId: 'aim-120', status: 'documented', sources: W },
    { missileId: 'meteor', status: 'documented', sources: W },
    { missileId: 'asraam', status: 'documented', sources: W, appliesTo: 'Royal Air Force' },
    { missileId: 'iris-t', status: 'documented', sources: W, appliesTo: 'German, Italian, Spanish and Austrian aircraft' },
    { missileId: 'aim-9', status: 'documented', sources: W, appliesTo: 'Some operators' },
    { missileId: 'scalp', status: 'documented', sources: W, appliesTo: 'Royal Air Force, Italy and Saudi Arabia (Storm Shadow)' },
    { missileId: 'taurus', status: 'documented', sources: W, appliesTo: 'Germany and Spain' },
    { missileId: 'brimstone', status: 'documented', sources: W, appliesTo: 'Royal Air Force' },
  ],

  costs: [],
  costNote:
    'Each partner nation bought in different tranches with different support packages, and published figures mix programme and unit costs, so none is shown.',

  sources: [...W, ...EF],
}
