import { documented, unknown } from '../fact'
import type { Aircraft, MissileCompatibility } from '../types'

const W = ['wiki-f35']
const LM = ['lm-f35']
const AF = ['usaf-f35a']

const COST_NOTE =
  'Lockheed Martin and the U.S. government quote flyaway cost per lot; it excludes development, spares, training and sustainment, which make lifetime cost far higher.'

const sharedMissiles = (src: string[]): MissileCompatibility[] => [
  { missileId: 'aim-120', status: 'documented', sources: src },
  { missileId: 'aim-9', status: 'documented', sources: src, note: 'AIM-9X, carried externally.' },
  { missileId: 'agm-158', status: 'documented', sources: src, appliesTo: 'External carriage; integration phased by software block.' },
]

export const f35a: Aircraft = {
  id: 'f-35a',
  name: 'Lockheed Martin F-35A Lightning II',
  shortName: 'F-35A',
  specVariant: 'F-35A (conventional take-off and landing)',
  specVariantNote: 'The F-35A, F-35B and F-35C differ materially in weight, fuel, range and gun installation, so they are separate entries.',
  countries: ['United States'],
  manufacturers: ['Lockheed Martin'],
  roles: ['multirole'],
  generation: 5,
  status: 'in-service',
  summary:
    'The conventional-runway version of the F-35, a single-engine stealth fighter built for many air forces and designed around sensor fusion.',

  firstFlight: documented('2006-12-15', W, { checkedLive: true }),
  serviceEntry: documented('2016-08-02', W, { note: 'U.S. Air Force initial operating capability.', checkedLive: true }),
  numberBuilt: documented(1345, W, { qualifier: 'at-least', note: 'All F-35 variants combined, as of August 2026.', checkedLive: true }),

  crew: documented(1, AF),
  lengthM: documented(15.7, LM),
  wingspanM: documented(10.7, LM),
  heightM: documented(4.38, LM),
  wingAreaM2: documented(42.7, LM),
  emptyWeightKg: documented(13_290, LM),
  maxTakeoffWeightKg: documented(31_800, LM, { note: 'Published as a 70,000 lb class.', qualifier: 'about' }),

  engineCount: 1,
  engine: documented('Pratt & Whitney F135-PW-100', LM),
  thrustPerEngineKn: documented(191, LM, { note: '43,000 lbf class with afterburner.', qualifier: 'about' }),

  maxSpeedMach: documented(1.6, LM),
  maxSpeedKmh: unknown('Published as a Mach figure only.'),
  rangeKm: documented(2_220, LM, { qualifier: 'at-least', note: 'Manufacturer figure: more than 1,200 nmi on internal fuel.' }),
  combatRadiusKm: documented(1_093, LM, { qualifier: 'at-least', note: 'Manufacturer figure: more than 590 nmi on internal fuel.' }),
  ferryRangeKm: unknown('Not published for the F-35.'),
  serviceCeilingM: documented(15_240, W, { note: '50,000 ft.' }),

  hardpoints: documented(10, W, { note: '4 internal stations plus 6 external.' }),
  gun: documented('GAU-22/A 25 mm four-barrel cannon (internal)', AF),
  missiles: [...sharedMissiles([...W, ...LM]), { missileId: 'agm-88', status: 'documented', sources: W, appliesTo: 'AGM-88G AARGM-ER, integration under way.' }],

  costs: [
    {
      kind: 'flyaway',
      amount: 82_500_000,
      currency: 'USD',
      year: 2024,
      basis: 'F-35A, then-year dollars, recent production lots',
      sources: W,
      checkedLive: true,
      note: COST_NOTE,
    },
  ],

  sources: [...W, ...LM, ...AF],
}

export const f35b: Aircraft = {
  id: 'f-35b',
  name: 'Lockheed Martin F-35B Lightning II',
  shortName: 'F-35B',
  specVariant: 'F-35B (short take-off and vertical landing)',
  specVariantNote: 'The lift fan behind the cockpit takes internal space, so the F-35B carries less fuel and has no internal gun.',
  countries: ['United States'],
  manufacturers: ['Lockheed Martin'],
  roles: ['multirole', 'stovl'],
  generation: 5,
  status: 'in-service',
  summary:
    'The short take-off, vertical-landing F-35, able to operate from amphibious ships and short runways using a shaft-driven lift fan.',

  firstFlight: documented('2008-06-11', W),
  serviceEntry: documented('2015-07-31', W, { note: 'U.S. Marine Corps initial operating capability.', checkedLive: true }),
  numberBuilt: unknown('Production totals are commonly published for all F-35 variants combined; see the F-35A entry.'),

  crew: documented(1, LM),
  lengthM: documented(15.6, LM),
  wingspanM: documented(10.7, LM),
  heightM: documented(4.36, LM),
  wingAreaM2: documented(42.7, LM),
  emptyWeightKg: documented(14_588, LM),
  maxTakeoffWeightKg: documented(27_200, LM, { note: 'Published as a 60,000 lb class.', qualifier: 'about' }),

  engineCount: 1,
  engine: documented('Pratt & Whitney F135-PW-600 with Rolls-Royce LiftSystem', LM),
  thrustPerEngineKn: documented(191, LM, { note: '43,000 lbf class with afterburner.', qualifier: 'about' }),

  maxSpeedMach: documented(1.6, LM),
  maxSpeedKmh: unknown('Published as a Mach figure only.'),
  rangeKm: documented(1_667, LM, { qualifier: 'at-least', note: 'Manufacturer figure: more than 900 nmi on internal fuel.' }),
  combatRadiusKm: documented(833, LM, { qualifier: 'at-least', note: 'Manufacturer figure: more than 450 nmi on internal fuel.' }),
  ferryRangeKm: unknown('Not published for the F-35.'),
  serviceCeilingM: documented(15_240, W, { note: '50,000 ft.' }),

  hardpoints: documented(10, W, { note: '4 internal stations plus 6 external; the centreline station can carry a gun pod.' }),
  gun: documented('GAU-22/A 25 mm cannon in an external pod', W),
  missiles: sharedMissiles([...W, ...LM]),

  costs: [
    {
      kind: 'flyaway',
      amount: 109_000_000,
      currency: 'USD',
      year: 2024,
      basis: 'F-35B, then-year dollars, recent production lots',
      sources: W,
      checkedLive: true,
      note: COST_NOTE,
    },
  ],

  sources: [...W, ...LM],
}
