import { disputed, documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-j10']
const CN_NOTE = 'China has not published official specifications; this is a reference-source estimate.'

export const j10: Aircraft = {
  id: 'j-10',
  name: 'Chengdu J-10',
  shortName: 'J-10',
  nickname: 'Vigorous Dragon',
  specVariant: 'J-10C (WS-10B engine)',
  specVariantNote: 'Earlier J-10A/B aircraft use the Russian AL-31FN engine and older avionics.',
  countries: ['China'],
  manufacturers: ['Chengdu Aircraft Corporation'],
  roles: ['multirole'],
  generation: 4.5,
  status: 'in-service',
  summary:
    'A single-engine canard-delta multirole fighter that became the workhorse of China’s air force; the J-10C adds an AESA radar and a Chinese engine.',

  firstFlight: documented('1998-03-23', S, { checkedLive: true }),
  serviceEntry: documented('2004', S, { checkedLive: true }),
  numberBuilt: disputed(600, S, 'Reference estimate (“600+ as of 2024”), all variants.', { qualifier: 'at-least', checkedLive: true }),

  crew: documented(1, S, { checkedLive: true }),
  lengthM: disputed(16.9, S, CN_NOTE, { checkedLive: true }),
  wingspanM: disputed(9.8, S, CN_NOTE, { checkedLive: true }),
  heightM: disputed(5.7, S, CN_NOTE, { checkedLive: true }),
  wingAreaM2: disputed(37, S, CN_NOTE, { checkedLive: true }),
  emptyWeightKg: unknown('Not published; the reference source gives only a 14,000 kg gross weight.'),
  maxTakeoffWeightKg: unknown('Not published; the reference source gives only a 14,000 kg gross weight.'),

  engineCount: 1,
  engine: documented('Shenyang WS-10B afterburning turbofan', S, { checkedLive: true }),
  thrustPerEngineKn: unknown('No reliable public figure for the WS-10B.'),

  maxSpeedMach: disputed(1.8, S, CN_NOTE, { checkedLive: true }),
  maxSpeedKmh: unknown('Published as a Mach figure only.'),
  rangeKm: disputed(1_850, S, CN_NOTE, { checkedLive: true }),
  combatRadiusKm: disputed(1_240, S, `${CN_NOTE} The source labels this “combat range”.`, { checkedLive: true }),
  ferryRangeKm: disputed(2_950, S, CN_NOTE, { checkedLive: true }),
  serviceCeilingM: unknown('Not published.'),

  hardpoints: documented(11, S, { note: '6 underwing, 2 under the intake and 3 under the fuselage.', checkedLive: true }),
  gun: documented('GSh-23 23 mm twin-barrel cannon', S, { checkedLive: true }),
  missiles: [
    { missileId: 'pl-15', status: 'reported', sources: S, note: 'Shown in official imagery; export J-10CE reported with PL-15E.' },
    { missileId: 'pl-10', status: 'reported', sources: S },
    { missileId: 'pl-12', status: 'reported', sources: S },
  ],

  costs: [],
  costNote: 'China does not publish unit costs; export prices for the J-10CE are undisclosed.',

  sources: S,
}
