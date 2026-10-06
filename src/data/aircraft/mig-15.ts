import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-mig15']

export const mig15: Aircraft = {
  id: 'mig-15',
  name: 'Mikoyan-Gurevich MiG-15',
  shortName: 'MiG-15',
  nickname: 'NATO reporting name “Fagot”',
  specVariant: 'MiG-15bis',
  countries: ['Soviet Union'],
  manufacturers: ['Mikoyan-Gurevich'],
  roles: ['air-superiority', 'interceptor'],
  generation: 1,
  status: 'limited-service',
  summary:
    'The swept-wing Soviet fighter that shocked Western air forces over Korea, armed with heavy cannon for attacking bombers.',

  firstFlight: documented('1947-12-30', S, { checkedLive: true }),
  serviceEntry: documented('1949', S, { checkedLive: true }),
  numberBuilt: documented(13_130, S, { note: 'Built in the USSR; at least 4,180 more were built under licence.', checkedLive: true }),

  crew: documented(1, S),
  lengthM: documented(10.11, S),
  wingspanM: documented(10.08, S),
  heightM: documented(3.7, S),
  wingAreaM2: documented(20.6, S),
  emptyWeightKg: documented(3_580, S),
  maxTakeoffWeightKg: documented(6_105, S),

  engineCount: 1,
  engine: documented('Klimov VK-1 centrifugal-flow turbojet (no afterburner)', S),
  thrustPerEngineKn: documented(26.5, S),

  maxSpeedMach: unknown('Usually quoted in km/h; subsonic in level flight.'),
  maxSpeedKmh: documented(1_076, S),
  rangeKm: documented(1_240, S, { note: 'With drop tanks.' }),
  combatRadiusKm: unknown('Not published.'),
  ferryRangeKm: unknown('Not published.'),
  serviceCeilingM: documented(15_500, S),

  hardpoints: documented(2, S, { note: 'Underwing, for drop tanks or bombs.' }),
  gun: documented('1 × N-37 37 mm cannon and 2 × NR-23 23 mm cannons', S),
  missiles: [],

  costs: [],
  costNote: 'Soviet-era aircraft had no market price, so no comparable figure exists.',

  sources: S,
}
