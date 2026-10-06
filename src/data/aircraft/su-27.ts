import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-su27']

export const su27: Aircraft = {
  id: 'su-27',
  name: 'Sukhoi Su-27',
  shortName: 'Su-27',
  nickname: 'NATO reporting name “Flanker”',
  specVariant: 'Su-27SK (export single-seat)',
  countries: ['Soviet Union', 'Russia'],
  manufacturers: ['Sukhoi'],
  roles: ['air-superiority', 'interceptor'],
  generation: 4,
  status: 'in-service',
  summary:
    'A large, long-range Soviet air-superiority fighter whose blended lifting body and agility spawned a whole family of “Flanker” derivatives.',

  firstFlight: documented('1977-05-20', S, { checkedLive: true }),
  serviceEntry: documented('1985-06-22', S, { checkedLive: true }),
  numberBuilt: documented(680, S, { checkedLive: true }),

  crew: documented(1, S, { checkedLive: true }),
  lengthM: documented(21.9, S, { checkedLive: true }),
  wingspanM: documented(14.7, S, { checkedLive: true }),
  heightM: documented(5.92, S, { checkedLive: true }),
  wingAreaM2: documented(62, S, { checkedLive: true }),
  emptyWeightKg: documented(16_380, S, { checkedLive: true }),
  maxTakeoffWeightKg: documented(33_000, S, { checkedLive: true }),

  engineCount: 2,
  engine: documented('Saturn AL-31F afterburning turbofan', S, { checkedLive: true }),
  thrustPerEngineKn: documented(122.6, S, { checkedLive: true }),

  maxSpeedMach: documented(2.35, S, { note: 'At altitude.', checkedLive: true }),
  maxSpeedKmh: documented(2_500, S, { note: 'At altitude; 1,400 km/h at sea level.', checkedLive: true }),
  rangeKm: documented(3_530, S, { checkedLive: true }),
  combatRadiusKm: unknown('Not published.'),
  ferryRangeKm: unknown('Not published.'),
  serviceCeilingM: documented(18_500, S, { checkedLive: true }),

  hardpoints: documented(10, S),
  gun: documented('GSh-30-1 30 mm cannon', S),
  missiles: [
    { missileId: 'r-27', status: 'documented', sources: S },
    { missileId: 'r-73', status: 'documented', sources: S },
    { missileId: 'r-77', status: 'documented', sources: S, appliesTo: 'Upgraded Su-27SM only' },
  ],

  costs: [],
  costNote: 'Soviet-era aircraft had no market price, and later export prices were never published in comparable form.',

  sources: S,
}
