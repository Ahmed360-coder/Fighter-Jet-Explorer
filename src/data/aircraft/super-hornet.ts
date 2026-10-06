import { documented } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-super-hornet']

export const superHornet: Aircraft = {
  id: 'super-hornet',
  name: 'Boeing F/A-18E/F Super Hornet',
  shortName: 'Super Hornet',
  specVariant: 'F/A-18E (single-seat)',
  specVariantNote: 'The two-seat F/A-18F shares the airframe; the EA-18G Growler is a separate electronic-attack aircraft.',
  countries: ['United States'],
  manufacturers: ['Boeing'],
  roles: ['multirole', 'carrier-based'],
  generation: 4.5,
  status: 'in-service',
  summary:
    'A larger, longer-ranged redesign of the original Hornet that became the U.S. Navy’s main carrier fighter, recognisable by its rectangular intakes.',

  firstFlight: documented('1995-11-29', S, { checkedLive: true }),
  serviceEntry: documented('1999', S, { note: 'Initial operating capability followed in 2001.', checkedLive: true }),
  numberBuilt: documented(632, S, { qualifier: 'at-least', note: 'As of April 2020.', checkedLive: true }),

  crew: documented(1, S, { note: 'F/A-18F: two.' }),
  lengthM: documented(18.31, S),
  wingspanM: documented(13.62, S),
  heightM: documented(4.88, S),
  wingAreaM2: documented(46.45, S),
  emptyWeightKg: documented(14_552, S),
  maxTakeoffWeightKg: documented(29_937, S),

  engineCount: 2,
  engine: documented('General Electric F414-GE-400 afterburning turbofan', S),
  thrustPerEngineKn: documented(98, S),

  maxSpeedMach: documented(1.8, S, { note: 'At 40,000 ft.' }),
  maxSpeedKmh: documented(1_915, S, { note: 'At 40,000 ft.' }),
  rangeKm: documented(2_346, S, { note: 'Clean, plus two AIM-9 missiles.' }),
  combatRadiusKm: documented(722, S, { note: 'Interdiction mission.' }),
  ferryRangeKm: documented(3_054, S),
  serviceCeilingM: documented(15_000, S, { qualifier: 'at-least' }),

  hardpoints: documented(11, S),
  gun: documented('M61A2 Vulcan 20 mm rotary cannon', S),
  missiles: [
    { missileId: 'aim-9', status: 'documented', sources: S },
    { missileId: 'aim-120', status: 'documented', sources: S },
    { missileId: 'aim-7', status: 'documented', sources: S },
    { missileId: 'agm-65', status: 'documented', sources: S },
    { missileId: 'agm-88', status: 'documented', sources: S },
    { missileId: 'agm-84', status: 'documented', sources: S },
    { missileId: 'agm-158c', status: 'documented', sources: S },
  ],

  costs: [],
  costNote:
    'U.S. Navy budget documents price Super Hornets per lot with differing support content, and no single verified figure was confirmed for this build.',

  sources: S,
}
