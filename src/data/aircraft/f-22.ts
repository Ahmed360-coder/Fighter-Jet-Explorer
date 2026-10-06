import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const AF = ['usaf-f22']
const W = ['wiki-f22']

export const f22: Aircraft = {
  id: 'f-22',
  name: 'Lockheed Martin F-22 Raptor',
  shortName: 'F-22',
  specVariant: 'F-22A',
  countries: ['United States'],
  manufacturers: ['Lockheed Martin', 'Boeing'],
  roles: ['air-superiority'],
  generation: 5,
  status: 'in-service',
  summary:
    'The first operational stealth air-superiority fighter, combining low observability, supercruise and thrust vectoring. Production ended in 2011.',

  firstFlight: documented('1997-09-07', W, { checkedLive: true }),
  serviceEntry: documented('2005-12-15', W, { checkedLive: true }),
  numberBuilt: documented(195, W, { note: '8 test and 187 operational aircraft.', checkedLive: true }),

  crew: documented(1, AF),
  lengthM: documented(18.9, AF),
  wingspanM: documented(13.6, AF),
  heightM: documented(5.08, AF),
  wingAreaM2: documented(78.04, W),
  emptyWeightKg: documented(19_700, AF),
  maxTakeoffWeightKg: documented(38_000, AF),

  engineCount: 2,
  engine: documented('Pratt & Whitney F119-PW-100 with two-dimensional thrust-vectoring nozzles', AF),
  thrustPerEngineKn: documented(156, AF, { qualifier: 'about', note: '35,000 lbf class with afterburner.' }),

  maxSpeedMach: documented(2, AF, { note: 'USAF describes it as “Mach two class with supercruise capability”.', qualifier: 'about' }),
  maxSpeedKmh: unknown('Published as a Mach class only.'),
  rangeKm: unknown('The USAF publishes only a ferry range.'),
  combatRadiusKm: documented(852, W, { note: 'Reference figure; not stated by the USAF fact sheet.' }),
  ferryRangeKm: documented(2_977, AF, { qualifier: 'at-least', note: 'More than 1,850 miles with two external wing fuel tanks.' }),
  serviceCeilingM: documented(15_240, AF, { qualifier: 'at-least', note: '“Above 50,000 feet”.' }),

  hardpoints: documented(4, W, { note: 'Underwing stations, in addition to three internal weapon bays.' }),
  gun: documented('M61A2 Vulcan 20 mm rotary cannon', AF),
  missiles: [
    { missileId: 'aim-120', status: 'documented', sources: AF },
    { missileId: 'aim-9', status: 'documented', sources: AF },
  ],

  costs: [
    {
      kind: 'unit-unspecified',
      amount: 143_000_000,
      currency: 'USD',
      year: 2009,
      basis: 'F-22A, fiscal 2009 dollars, as stated by the USAF fact sheet',
      sources: AF,
      note: 'The USAF lists this as “unit cost” without defining it; it is often quoted as flyaway cost. Programme cost per aircraft, including development, is much higher.',
    },
  ],

  sources: [...AF, ...W],
}
