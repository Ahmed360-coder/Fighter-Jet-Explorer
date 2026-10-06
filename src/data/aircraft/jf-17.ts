import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-jf17']

export const jf17: Aircraft = {
  id: 'jf-17',
  name: 'PAC JF-17 Thunder',
  shortName: 'JF-17',
  nickname: 'FC-1 Xiaolong in China',
  specVariant: 'JF-17 Block II',
  specVariantNote: 'Block III adds a new radar and newer missiles and is not described here.',
  countries: ['Pakistan', 'China'],
  manufacturers: ['Pakistan Aeronautical Complex', 'Chengdu Aircraft Corporation'],
  roles: ['light-combat', 'multirole'],
  generation: 4,
  status: 'in-service',
  summary:
    'A lightweight single-engine fighter developed jointly by Pakistan and China as an affordable multirole aircraft, now the backbone of Pakistan’s air force.',

  firstFlight: documented('2003-08-25', S),
  serviceEntry: documented('2007-03', S, { note: 'Induction into the Pakistan Air Force.' }),
  numberBuilt: unknown('Production totals are not officially published.'),

  crew: documented(1, S, { note: 'A two-seat JF-17B also exists.' }),
  lengthM: documented(14.93, S),
  wingspanM: documented(9.45, S),
  heightM: documented(4.72, S),
  wingAreaM2: documented(24.4, S),
  emptyWeightKg: documented(6_586, S),
  maxTakeoffWeightKg: documented(12_474, S),

  engineCount: 1,
  engine: documented('Klimov RD-93 afterburning turbofan', S),
  thrustPerEngineKn: documented(84.4, S),

  maxSpeedMach: documented(1.6, S),
  maxSpeedKmh: unknown('Published as a Mach figure only.'),
  rangeKm: unknown('Not published for internal fuel only.'),
  combatRadiusKm: documented(1_352, S),
  ferryRangeKm: documented(3_482, S),
  serviceCeilingM: documented(16_920, S),

  hardpoints: documented(7, S),
  gun: documented('GSh-23-2 23 mm twin-barrel cannon', S),
  missiles: [
    { missileId: 'pl-5', status: 'documented', sources: S },
    { missileId: 'pl-12', status: 'documented', sources: S, note: 'Export SD-10 version.' },
    { missileId: 'c-802', status: 'documented', sources: S },
    { missileId: 'pl-15', status: 'reported', sources: S, appliesTo: 'Block III (export PL-15E)' },
  ],

  costs: [],
  costNote: 'Unit prices quoted in the press come from export negotiations with undisclosed contents, so none is shown.',

  sources: S,
}
