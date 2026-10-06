import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const W = ['wiki-mig29']
const M = ['nmusaf-mig29']

export const mig29: Aircraft = {
  id: 'mig-29',
  name: 'Mikoyan MiG-29',
  shortName: 'MiG-29',
  nickname: 'NATO reporting name “Fulcrum”',
  specVariant: 'MiG-29 (9.12, early production)',
  specVariantNote: 'Later MiG-29SMT, MiG-29K and MiG-35 versions differ substantially.',
  countries: ['Soviet Union', 'Russia'],
  manufacturers: ['Mikoyan'],
  roles: ['air-superiority', 'multirole'],
  generation: 4,
  status: 'in-service',
  summary:
    'A twin-engine Soviet fighter built for short-range agility, with intake doors that close on the ground to protect the engines on rough airfields.',

  firstFlight: documented('1977-10-06', W, { checkedLive: true }),
  serviceEntry: documented('1983-08', W, { checkedLive: true }),
  numberBuilt: documented(1_600, W, { qualifier: 'at-least', checkedLive: true }),

  crew: documented(1, W),
  lengthM: documented(17.32, W),
  wingspanM: documented(11.36, W),
  heightM: documented(4.73, W),
  wingAreaM2: documented(38, W),
  emptyWeightKg: documented(11_000, W),
  maxTakeoffWeightKg: documented(18_000, W),

  engineCount: 2,
  engine: documented('Klimov RD-33 afterburning turbofan', [...W, ...M]),
  thrustPerEngineKn: documented(81.4, W),

  maxSpeedMach: documented(2.25, W, { note: 'At altitude.' }),
  maxSpeedKmh: documented(2_400, W, { note: 'At altitude.' }),
  rangeKm: documented(1_430, W),
  combatRadiusKm: unknown('Not published for this variant.'),
  ferryRangeKm: documented(2_100, W, { note: 'With one drop tank.' }),
  serviceCeilingM: documented(18_013, W),

  hardpoints: documented(7, W),
  gun: documented('GSh-30-1 30 mm cannon', W),
  missiles: [
    { missileId: 'r-27', status: 'documented', sources: W },
    { missileId: 'r-73', status: 'documented', sources: W },
    { missileId: 'r-60', status: 'documented', sources: W },
    { missileId: 'r-77', status: 'documented', sources: W, appliesTo: 'Upgraded variants only' },
  ],

  costs: [],
  costNote: 'Soviet-era aircraft had no market price, and export deals bundled aircraft with support, so none is shown.',

  sources: [...W, ...M],
}
