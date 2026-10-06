import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-mirage2000']

export const mirage2000: Aircraft = {
  id: 'mirage-2000',
  name: 'Dassault Mirage 2000',
  shortName: 'Mirage 2000',
  specVariant: 'Mirage 2000C (single-seat interceptor)',
  specVariantNote: 'Later 2000-5 and 2000D/N variants differ in radar, avionics and weapons.',
  countries: ['France'],
  manufacturers: ['Dassault Aviation'],
  roles: ['multirole', 'interceptor'],
  generation: 4,
  status: 'in-service',
  summary:
    'A tailless delta brought back to life by fly-by-wire controls, giving the classic Mirage layout far better low-speed handling.',

  firstFlight: documented('1978-03-10', S, { checkedLive: true }),
  serviceEntry: documented('1984-07', S, { checkedLive: true }),
  numberBuilt: documented(601, S, { checkedLive: true }),

  crew: documented(1, S),
  lengthM: documented(14.36, S),
  wingspanM: documented(9.13, S),
  heightM: documented(5.2, S),
  wingAreaM2: documented(41, S),
  emptyWeightKg: documented(7_500, S),
  maxTakeoffWeightKg: documented(17_000, S),

  engineCount: 1,
  engine: documented('SNECMA M53-P2 afterburning turbofan', S),
  thrustPerEngineKn: documented(95.1, S),

  maxSpeedMach: documented(2.2, S, { note: 'At altitude.' }),
  maxSpeedKmh: documented(2_336, S, { note: 'At altitude.' }),
  rangeKm: documented(1_550, S, { note: 'With drop tanks.' }),
  combatRadiusKm: unknown('Not published for this variant.'),
  ferryRangeKm: documented(3_335, S),
  serviceCeilingM: documented(17_060, S),

  hardpoints: documented(9, S),
  gun: documented('2 × DEFA 554 30 mm revolver cannons', S),
  missiles: [
    { missileId: 'magic-2', status: 'documented', sources: S },
    { missileId: 'super-530', status: 'documented', sources: S },
    { missileId: 'mica', status: 'documented', sources: S, appliesTo: 'Mirage 2000-5 and later' },
    { missileId: 'exocet', status: 'documented', sources: S, appliesTo: 'Some export operators' },
    { missileId: 'scalp', status: 'documented', sources: S, appliesTo: 'Mirage 2000D, 2000-9 and some export aircraft' },
  ],

  costs: [],
  costNote: 'Prices from the 1980s were negotiated per export package and in francs, so no comparable figure is shown.',

  sources: S,
}
