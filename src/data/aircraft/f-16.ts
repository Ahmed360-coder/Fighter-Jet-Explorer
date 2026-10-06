import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const AF = ['usaf-f16']
const W = ['wiki-f16']

export const f16: Aircraft = {
  id: 'f-16',
  name: 'General Dynamics F-16 Fighting Falcon',
  shortName: 'F-16',
  nickname: 'Viper',
  specVariant: 'F-16C/D',
  specVariantNote: 'Engines differ by block (Pratt & Whitney F100 or General Electric F110); the USAF fact sheet covers both.',
  countries: ['United States'],
  manufacturers: ['General Dynamics', 'Lockheed Martin'],
  roles: ['multirole'],
  generation: 4,
  status: 'in-service',
  summary:
    'The lightweight fighter that pioneered fly-by-wire controls and a reclined seat under a frameless canopy, and became one of the most widely operated jets ever built.',

  firstFlight: documented('1974-01-20', W, { note: 'Unplanned first flight during a taxi test; the official first flight was on 2 February 1974.' }),
  serviceEntry: documented('1979-01', AF, { note: 'F-16A initial operating capability.', checkedLive: true }),
  numberBuilt: documented(4_600, W, { qualifier: 'at-least' }),

  crew: documented(1, AF, { note: 'F-16D: one or two.', checkedLive: true }),
  lengthM: documented(14.8, AF, { checkedLive: true }),
  wingspanM: documented(9.8, AF, { checkedLive: true }),
  heightM: documented(4.8, AF, { checkedLive: true }),
  wingAreaM2: documented(27.87, W),
  emptyWeightKg: documented(8_936, AF, { note: '19,700 lb without fuel.', checkedLive: true }),
  maxTakeoffWeightKg: documented(17_010, AF, {
    note: 'The fact sheet gives 37,500 lb but converts it to 16,875 kg; 37,500 lb is 17,010 kg, which is shown here.',
    checkedLive: true,
  }),

  engineCount: 1,
  engine: documented('Pratt & Whitney F100-PW-200/220/229 or General Electric F110-GE-100/129', AF, { checkedLive: true }),
  thrustPerEngineKn: documented(120, AF, { note: '27,000 lbf.', checkedLive: true }),

  maxSpeedMach: documented(2, AF, { note: 'At altitude.', checkedLive: true }),
  maxSpeedKmh: documented(2_414, AF, { note: 'The fact sheet gives 1,500 mph.', checkedLive: true }),
  rangeKm: unknown('The USAF publishes only a ferry range.'),
  combatRadiusKm: unknown('Depends heavily on load and profile; not published by the USAF.'),
  ferryRangeKm: documented(3_222, AF, { qualifier: 'at-least', note: '“More than 2,002 miles” (1,740 nmi).', checkedLive: true }),
  serviceCeilingM: documented(15_240, AF, { qualifier: 'at-least', note: '“Above 50,000 feet”.', checkedLive: true }),

  hardpoints: documented(11, W),
  gun: documented('M61A1 Vulcan 20 mm rotary cannon, 500 rounds', AF, { checkedLive: true }),
  missiles: [
    { missileId: 'aim-9', status: 'documented', sources: AF },
    { missileId: 'aim-120', status: 'documented', sources: AF },
    { missileId: 'agm-65', status: 'documented', sources: W },
    { missileId: 'agm-88', status: 'documented', sources: W, appliesTo: 'Block 50/52 suppression-of-air-defence role' },
    { missileId: 'agm-84', status: 'documented', sources: W, appliesTo: 'Some export operators' },
  ],

  costs: [
    {
      kind: 'unit-unspecified',
      amount: 18_800_000,
      currency: 'USD',
      year: 1998,
      basis: 'F-16C/D, fiscal 1998 constant dollars, as stated by the USAF fact sheet',
      sources: AF,
      checkedLive: true,
      note: 'The fact sheet does not say whether this is flyaway or procurement cost. New-build F-16 Block 70 export deals are far higher because they include support.',
    },
  ],

  sources: [...AF, ...W],
}
