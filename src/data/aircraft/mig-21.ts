import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const W = ['wiki-mig21']
const M = ['nmusaf-mig21']

export const mig21: Aircraft = {
  id: 'mig-21',
  name: 'Mikoyan-Gurevich MiG-21',
  shortName: 'MiG-21',
  nickname: 'NATO reporting name “Fishbed”',
  specVariant: 'MiG-21bis',
  specVariantNote: 'Dates refer to the MiG-21 family; specifications are for the late MiG-21bis, the most capable mass-produced version.',
  countries: ['Soviet Union'],
  manufacturers: ['Mikoyan-Gurevich'],
  roles: ['interceptor', 'multirole'],
  generation: 3,
  status: 'in-service',
  summary:
    'A small, fast tailed-delta interceptor and the most-produced supersonic jet fighter in history, flown by dozens of air forces.',

  firstFlight: documented('1955-02-14', W, { note: 'Ye-2 swept-wing prototype; the delta-wing Ye-4 followed later in 1955.', checkedLive: true }),
  serviceEntry: documented('1959', W, { note: 'MiG-21F.', checkedLive: true }),
  numberBuilt: documented(11_496, W, { note: '10,645 in the USSR, 840 in India, 194 in Czechoslovakia.', checkedLive: true }),

  crew: documented(1, [...W, ...M]),
  lengthM: documented(14.7, W),
  wingspanM: documented(7.154, W),
  heightM: documented(4.1, W),
  wingAreaM2: documented(23, W),
  emptyWeightKg: documented(5_846, W),
  maxTakeoffWeightKg: documented(10_400, W),

  engineCount: 1,
  engine: documented('Tumansky R-25-300 afterburning turbojet', W),
  thrustPerEngineKn: documented(69.6, W, { note: 'Normal afterburner; a short emergency boost gives more.' }),

  maxSpeedMach: documented(2.05, W, { note: 'At altitude.' }),
  maxSpeedKmh: documented(2_175, W, { note: 'At altitude.' }),
  rangeKm: documented(1_210, W),
  combatRadiusKm: unknown('Not published for this variant.'),
  ferryRangeKm: unknown('Not published for this variant.'),
  serviceCeilingM: documented(17_800, W),

  hardpoints: documented(5, W),
  gun: documented('GSh-23L 23 mm twin-barrel cannon', W),
  missiles: [
    { missileId: 'r-3s', status: 'documented', sources: [...W, ...M] },
    { missileId: 'r-60', status: 'documented', sources: W },
  ],

  costs: [],
  costNote: 'Soviet-era aircraft had no market price, so no comparable figure exists.',

  sources: [...W, ...M],
}
