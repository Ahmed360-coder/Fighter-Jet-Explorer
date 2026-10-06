import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const W = ['wiki-f4']
const M = ['nmusaf-f4']

export const f4: Aircraft = {
  id: 'f-4',
  name: 'McDonnell Douglas F-4 Phantom II',
  shortName: 'F-4 Phantom II',
  specVariant: 'F-4E',
  specVariantNote: 'The F-4E added an internal cannon; earlier Navy and Air Force models lacked one.',
  countries: ['United States'],
  manufacturers: ['McDonnell Douglas'],
  roles: ['multirole', 'interceptor', 'carrier-based'],
  generation: 3,
  status: 'limited-service',
  summary:
    'A heavy two-seat fighter flown by the U.S. Navy, Marine Corps and Air Force alike, and still in limited service decades after its debut.',

  firstFlight: documented('1958-05-27', W, { checkedLive: true }),
  serviceEntry: documented('1960-12-30', W, { checkedLive: true }),
  numberBuilt: documented(5_195, W, { checkedLive: true }),

  crew: documented(2, [...W, ...M]),
  lengthM: documented(19.2, W),
  wingspanM: documented(11.7, W),
  heightM: documented(5, W),
  wingAreaM2: documented(49.2, W),
  emptyWeightKg: documented(13_757, W),
  maxTakeoffWeightKg: documented(28_030, W),

  engineCount: 2,
  engine: documented('General Electric J79-GE-17A afterburning turbojet', W),
  thrustPerEngineKn: documented(79.6, W),

  maxSpeedMach: documented(2.23, W, { note: 'At altitude.', checkedLive: true }),
  maxSpeedKmh: documented(2_370, W, { note: 'At altitude.' }),
  rangeKm: unknown('No internal-fuel range has been published for this variant.'),
  combatRadiusKm: documented(680, W),
  ferryRangeKm: documented(2_600, W),
  serviceCeilingM: documented(18_300, W),

  hardpoints: documented(9, W, { note: 'Up to 8,480 kg of weapons.', checkedLive: true }),
  gun: documented('M61A1 Vulcan 20 mm rotary cannon (F-4E)', W, { checkedLive: true }),
  missiles: [
    { missileId: 'aim-7', status: 'documented', sources: [...W, ...M] },
    { missileId: 'aim-9', status: 'documented', sources: [...W, ...M] },
    { missileId: 'agm-65', status: 'documented', sources: W },
    { missileId: 'agm-88', status: 'documented', sources: W, appliesTo: 'F-4G Wild Weasel only' },
  ],

  costs: [],
  costNote: 'Unit prices from the 1960s vary by model and contract and were not confirmed for this build.',

  sources: [...W, ...M],
}
