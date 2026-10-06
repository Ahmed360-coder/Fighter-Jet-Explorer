import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-tornado']

export const tornado: Aircraft = {
  id: 'tornado',
  name: 'Panavia Tornado',
  shortName: 'Tornado',
  specVariant: 'Tornado IDS (interdictor/strike)',
  specVariantNote: 'The Tornado ADV (air defence) and ECR (electronic combat) variants differ in length, systems and weapons.',
  countries: ['United Kingdom', 'Germany', 'Italy'],
  manufacturers: ['Panavia (BAE Systems, MBB, Aeritalia)'],
  roles: ['strike', 'multirole'],
  generation: 4,
  status: 'in-service',
  summary:
    'A tri-national swing-wing strike aircraft designed to fly very low and fast; retired by the RAF in 2019 but still flown by Germany, Italy and Saudi Arabia.',

  firstFlight: documented('1974-08-14', S, { checkedLive: true }),
  serviceEntry: documented('1979', S, { checkedLive: true }),
  numberBuilt: documented(990, S, { note: '745 IDS, 194 ADV and 51 ECR.', checkedLive: true }),

  crew: documented(2, S),
  lengthM: documented(16.72, S),
  wingspanM: documented(13.91, S, { note: 'Wings fully forward (25°); 8.60 m fully swept (67°).' }),
  heightM: documented(5.95, S),
  wingAreaM2: documented(26.6, S),
  emptyWeightKg: documented(13_890, S),
  maxTakeoffWeightKg: documented(28_000, S),

  engineCount: 2,
  engine: documented('Turbo-Union RB199 afterburning turbofan', S),
  thrustPerEngineKn: documented(76.8, S),

  maxSpeedMach: documented(2.2, S, { note: 'At altitude.' }),
  maxSpeedKmh: documented(2_400, S, { note: 'At altitude.' }),
  rangeKm: unknown('No internal-fuel range has been published.'),
  combatRadiusKm: documented(1_390, S, { note: 'High-low-high profile with a typical weapons load.' }),
  ferryRangeKm: documented(3_890, S, { note: 'With four external drop tanks.' }),
  serviceCeilingM: documented(15_240, S),

  hardpoints: documented(7, S, { note: '3 under the fuselage and 4 swivelling underwing pylons.' }),
  gun: documented('2 × Mauser BK-27 27 mm revolver cannons', S),
  missiles: [
    { missileId: 'aim-9', status: 'documented', sources: S },
    { missileId: 'scalp', status: 'documented', sources: S, appliesTo: 'RAF GR4 and Italian aircraft (Storm Shadow)' },
    { missileId: 'taurus', status: 'documented', sources: S, appliesTo: 'German and Italian aircraft' },
    { missileId: 'brimstone', status: 'documented', sources: S, appliesTo: 'RAF GR4' },
    { missileId: 'alarm', status: 'documented', sources: S, appliesTo: 'RAF' },
    { missileId: 'agm-88', status: 'documented', sources: S, appliesTo: 'German and Italian aircraft, chiefly the ECR' },
    { missileId: 'kormoran', status: 'documented', sources: S, appliesTo: 'German Navy aircraft' },
  ],

  costs: [],
  costNote: 'Costs were shared between three nations in their own currencies across decades, so no comparable unit figure is shown.',

  sources: S,
}
