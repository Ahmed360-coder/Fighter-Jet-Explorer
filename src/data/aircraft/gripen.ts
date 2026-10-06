import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const W = ['wiki-gripen']
const SAAB = ['saab-gripen']

export const gripen: Aircraft = {
  id: 'gripen',
  name: 'Saab JAS 39 Gripen',
  shortName: 'Gripen',
  specVariant: 'JAS 39C (single-seat)',
  specVariantNote: 'The JAS 39E/F Gripen E is a substantially redesigned aircraft with a larger engine and is not described here.',
  countries: ['Sweden'],
  manufacturers: ['Saab'],
  roles: ['multirole', 'light-combat'],
  generation: 4.5,
  status: 'in-service',
  summary:
    'A small, single-engine canard-delta fighter designed to operate from dispersed road bases with minimal ground crew.',

  firstFlight: documented('1988-12-09', W, { checkedLive: true }),
  serviceEntry: documented('1996-06-09', W, { checkedLive: true }),
  numberBuilt: documented(300, W, { qualifier: 'about', note: 'All variants, as of 2023.', checkedLive: true }),

  crew: documented(1, W, { note: 'JAS 39D: two.' }),
  lengthM: documented(14.1, W),
  wingspanM: documented(8.4, W),
  heightM: documented(4.5, W),
  wingAreaM2: documented(30, W),
  emptyWeightKg: documented(6_800, W),
  maxTakeoffWeightKg: documented(14_000, W),

  engineCount: 1,
  engine: documented('Volvo Aero RM12 afterburning turbofan (derived from the GE F404)', [...W, ...SAAB]),
  thrustPerEngineKn: documented(80.5, W),

  maxSpeedMach: documented(2, W, { note: 'At altitude.' }),
  maxSpeedKmh: unknown('Published as a Mach figure only.'),
  rangeKm: unknown('No internal-fuel range has been published.'),
  combatRadiusKm: documented(800, W),
  ferryRangeKm: documented(3_200, W, { note: 'With external drop tanks.' }),
  serviceCeilingM: documented(15_240, W, { note: '50,000 ft.' }),

  hardpoints: documented(8, W),
  gun: documented('Mauser BK-27 27 mm revolver cannon', W, { note: 'Single-seat aircraft only.' }),
  missiles: [
    { missileId: 'aim-9', status: 'documented', sources: W },
    { missileId: 'iris-t', status: 'documented', sources: W },
    { missileId: 'aim-120', status: 'documented', sources: W },
    { missileId: 'meteor', status: 'documented', sources: [...W, ...SAAB] },
    { missileId: 'rbs-15', status: 'documented', sources: W },
    { missileId: 'agm-65', status: 'documented', sources: W, note: 'Swedish designation Rb 75.' },
  ],

  costs: [],
  costNote: 'Gripen sales are usually leases or packages bundling training and support, so per-aircraft prices are not comparable.',

  sources: [...W, ...SAAB],
}
