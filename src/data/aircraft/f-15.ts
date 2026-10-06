import { disputed, documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const AF = ['usaf-f15']
const W = ['wiki-f15']

export const f15: Aircraft = {
  id: 'f-15',
  name: 'McDonnell Douglas F-15 Eagle',
  shortName: 'F-15',
  specVariant: 'F-15C',
  specVariantNote: 'The F-15E Strike Eagle and the new F-15EX are heavier two-seat multirole derivatives and are not described here.',
  countries: ['United States'],
  manufacturers: ['McDonnell Douglas', 'Boeing'],
  roles: ['air-superiority'],
  generation: 4,
  status: 'in-service',
  summary:
    'A large twin-engine air-superiority fighter designed around a powerful radar and high thrust, with a long air-combat record.',

  firstFlight: documented('1972-07-27', W, { checkedLive: true }),
  serviceEntry: documented('1976-01-09', W, { checkedLive: true }),
  numberBuilt: documented(1_198, W, { note: 'F-15A/B/C/D/J/DJ; excludes the F-15E family.', checkedLive: true }),

  crew: documented(1, AF),
  lengthM: documented(19.43, W),
  wingspanM: documented(13.05, W),
  heightM: documented(5.63, W),
  wingAreaM2: documented(56.5, W),
  emptyWeightKg: documented(12_700, W),
  maxTakeoffWeightKg: documented(30_845, AF, { note: '68,000 lb.' }),

  engineCount: 2,
  engine: documented('Pratt & Whitney F100-PW-100 or -220 afterburning turbofan', AF),
  thrustPerEngineKn: documented(104, AF, { qualifier: 'about', note: '23,450 lbf.' }),

  maxSpeedMach: disputed(2.5, W, 'Reference sources give Mach 2.5+; the USAF fact sheet says “Mach 2 class” and 1,875 mph, which do not match each other.', { qualifier: 'at-least' }),
  maxSpeedKmh: unknown('Sources give inconsistent km/h figures.'),
  rangeKm: unknown('No internal-fuel range has been published.'),
  combatRadiusKm: documented(1_967, W, { note: 'Air-superiority mission.' }),
  ferryRangeKm: documented(5_550, AF, { note: '3,450 miles with conformal fuel tanks and three external tanks.' }),
  serviceCeilingM: documented(19_812, AF, { note: '65,000 ft.' }),

  hardpoints: documented(11, W),
  gun: documented('M61A1 Vulcan 20 mm rotary cannon, 940 rounds', AF),
  missiles: [
    { missileId: 'aim-7', status: 'documented', sources: AF },
    { missileId: 'aim-9', status: 'documented', sources: AF },
    { missileId: 'aim-120', status: 'documented', sources: AF },
  ],

  costs: [
    {
      kind: 'unit-unspecified',
      amount: 29_900_000,
      currency: 'USD',
      year: 1998,
      basis: 'F-15C/D, fiscal 1998 constant dollars, as stated by the USAF fact sheet',
      sources: AF,
      note: 'The fact sheet does not say whether this is flyaway or procurement cost.',
    },
  ],

  sources: [...AF, ...W],
}
