import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-su30mki']

export const su30mki: Aircraft = {
  id: 'su-30mki',
  name: 'Sukhoi Su-30MKI',
  shortName: 'Su-30MKI',
  nickname: 'NATO reporting name “Flanker-H”',
  specVariant: 'Su-30MKI (Indian Air Force)',
  specVariantNote: 'India-specific variant with thrust vectoring, canards and mixed Russian, Indian, French and Israeli systems.',
  countries: ['Russia', 'India'],
  manufacturers: ['Sukhoi', 'Hindustan Aeronautics Limited'],
  roles: ['multirole', 'air-superiority'],
  generation: 4.5,
  status: 'in-service',
  summary:
    'A heavy two-seat Flanker developed for India, licence-built by HAL and the most numerous fighter in the Indian Air Force.',

  firstFlight: documented('1997-07-01', S, { note: 'First flight of the Su-30MK development aircraft; the Su-30MKI configuration flew in 2000.', checkedLive: true }),
  serviceEntry: documented('2002-09-27', S, { checkedLive: true }),
  numberBuilt: documented(272, S, { note: 'As of March 2020.', checkedLive: true }),

  crew: documented(2, S, { checkedLive: true }),
  lengthM: documented(21.935, S, { checkedLive: true }),
  wingspanM: documented(14.7, S, { checkedLive: true }),
  heightM: documented(6.36, S, { checkedLive: true }),
  wingAreaM2: documented(62, S, { checkedLive: true }),
  emptyWeightKg: documented(18_400, S, { checkedLive: true }),
  maxTakeoffWeightKg: documented(38_800, S, { checkedLive: true }),

  engineCount: 2,
  engine: documented('Lyulka AL-31FP afterburning turbofan with thrust vectoring', S, { checkedLive: true }),
  thrustPerEngineKn: documented(123, S, { checkedLive: true }),

  maxSpeedMach: documented(2, S, { note: 'At high altitude.', checkedLive: true }),
  maxSpeedKmh: documented(2_120, S, { note: 'At high altitude.', checkedLive: true }),
  rangeKm: documented(3_000, S, { note: 'At high altitude.', checkedLive: true }),
  combatRadiusKm: unknown('Not published.'),
  ferryRangeKm: documented(8_000, S, { note: 'With two in-flight refuellings, so not comparable with unrefuelled ferry ranges.', checkedLive: true }),
  serviceCeilingM: documented(17_300, S, { checkedLive: true }),

  hardpoints: documented(12, S),
  gun: documented('GSh-30-1 30 mm cannon', S),
  missiles: [
    { missileId: 'r-73', status: 'documented', sources: S },
    { missileId: 'r-27', status: 'documented', sources: S },
    { missileId: 'r-77', status: 'documented', sources: S, note: 'Export RVV-AE version.' },
    { missileId: 'astra', status: 'documented', sources: S },
    { missileId: 'brahmos-a', status: 'documented', sources: S, appliesTo: 'Modified aircraft only' },
    { missileId: 'kh-31', status: 'documented', sources: S },
    { missileId: 'kh-59', status: 'documented', sources: S },
  ],

  costs: [],
  costNote: 'Indian purchases combine imported, kit-assembled and licence-built aircraft at different prices, so no single unit cost is shown.',

  sources: S,
}
