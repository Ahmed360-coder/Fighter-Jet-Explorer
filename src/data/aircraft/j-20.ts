import { disputed, documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-j20']
const CN_NOTE =
  'China has not published official specifications; this is an outside estimate compiled by reference sources and may change.'

export const j20: Aircraft = {
  id: 'j-20',
  name: 'Chengdu J-20',
  shortName: 'J-20',
  nickname: 'Mighty Dragon',
  specVariant: 'J-20 (WS-10C engines)',
  specVariantNote: 'The J-20A and two-seat J-20S were publicly introduced in September 2025 and are not described here.',
  countries: ['China'],
  manufacturers: ['Chengdu Aircraft Corporation'],
  roles: ['air-superiority', 'multirole'],
  generation: 5,
  status: 'in-service',
  summary:
    'China’s large, long-bodied stealth fighter with canards and internal weapon bays, built in greater numbers than any non-U.S. stealth fighter.',

  firstFlight: documented('2011-01-11', S, { checkedLive: true }),
  serviceEntry: documented('2017-03-08', S, { checkedLive: true }),
  numberBuilt: disputed(300, S, 'Reference estimate (“300+ as of September 2025”); no official count.', { qualifier: 'at-least', checkedLive: true }),

  crew: documented(1, S, { checkedLive: true }),
  lengthM: disputed(21.2, S, CN_NOTE, { checkedLive: true }),
  wingspanM: disputed(13.01, S, CN_NOTE, { checkedLive: true }),
  heightM: disputed(4.69, S, CN_NOTE, { checkedLive: true }),
  wingAreaM2: disputed(73, S, CN_NOTE, { checkedLive: true }),
  emptyWeightKg: disputed(17_000, S, CN_NOTE, { checkedLive: true }),
  maxTakeoffWeightKg: disputed(37_000, S, CN_NOTE, { checkedLive: true }),

  engineCount: 2,
  engine: documented('Shenyang WS-10C afterburning turbofan', S, {
    note: 'Later aircraft are reported to use the WS-15.',
    checkedLive: true,
  }),
  thrustPerEngineKn: disputed(142, S, `${CN_NOTE} Sources give 142–147 kN.`, { qualifier: 'about', checkedLive: true }),

  maxSpeedMach: disputed(2, S, CN_NOTE, { checkedLive: true }),
  maxSpeedKmh: disputed(2_130, S, CN_NOTE, { checkedLive: true }),
  rangeKm: disputed(5_500, S, `${CN_NOTE} Stated with two external fuel tanks, not internal fuel.`, { checkedLive: true }),
  combatRadiusKm: disputed(2_000, S, `${CN_NOTE} The source labels this “combat range”.`, { checkedLive: true }),
  ferryRangeKm: unknown('Not published.'),
  serviceCeilingM: disputed(20_000, S, CN_NOTE, { checkedLive: true }),

  hardpoints: disputed(4, S, 'Four underwing stations are commonly cited in addition to internal bays; not officially confirmed.'),
  gun: unknown('No internal gun has been confirmed publicly.'),
  missiles: [
    { missileId: 'pl-15', status: 'reported', sources: S, note: 'Shown publicly in the main weapon bay; no official compatibility list exists.' },
    { missileId: 'pl-10', status: 'reported', sources: S, note: 'Shown publicly in the side weapon bays; no official compatibility list exists.' },
  ],

  costs: [],
  costNote: 'China does not publish fighter unit costs, and outside estimates are not reliable enough to show.',

  sources: S,
}
