import { disputed, documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-kf21']

export const kf21: Aircraft = {
  id: 'kf-21',
  name: 'KAI KF-21 Boramae',
  shortName: 'KF-21',
  specVariant: 'KF-21 Block I (single-seat)',
  specVariantNote: 'Block I is the initial air-to-air focused standard; later blocks add air-to-ground capability.',
  countries: ['South Korea'],
  manufacturers: ['Korea Aerospace Industries'],
  roles: ['multirole'],
  generation: 4.5,
  status: 'in-development',
  summary:
    'South Korea’s first indigenous supersonic fighter, a twin-engine design with stealth-influenced shaping but external weapons in its first block.',

  firstFlight: documented('2022-07-19', S, { checkedLive: true }),
  serviceEntry: unknown(
    'First deliveries to the Republic of Korea Air Force were planned for the second half of 2026; delivery had not been confirmed when this dataset was compiled.',
  ),
  numberBuilt: documented(6, S, { note: 'Prototypes; 40 production aircraft ordered.', checkedLive: true }),

  crew: documented(1, S, { note: 'A two-seat KF-21B also exists.' }),
  lengthM: documented(16.9, S),
  wingspanM: documented(11.2, S),
  heightM: documented(4.7, S),
  wingAreaM2: unknown('Not published by the manufacturer.'),
  emptyWeightKg: disputed(11_800, S, 'Reported figure; the manufacturer has not published an official empty weight.'),
  maxTakeoffWeightKg: documented(25_600, S),

  engineCount: 2,
  engine: documented('General Electric F414-GE-400K (licence-built by Hanwha Aerospace)', S),
  thrustPerEngineKn: documented(98, S),

  maxSpeedMach: documented(1.81, S),
  maxSpeedKmh: unknown('Only a Mach figure has been published.'),
  rangeKm: disputed(2_900, S, 'Manufacturer-reported figure; fuel and payload assumptions not stated.'),
  combatRadiusKm: unknown('Not published.'),
  ferryRangeKm: unknown('Not published.'),
  serviceCeilingM: documented(16_800, S),

  hardpoints: documented(10, S),
  gun: documented('M61A2 Vulcan 20 mm rotary cannon', S),
  missiles: [
    { missileId: 'meteor', status: 'reported', sources: S, note: 'Integration announced; operational clearance not confirmed here.' },
    { missileId: 'iris-t', status: 'reported', sources: S, note: 'Integration announced; operational clearance not confirmed here.' },
  ],

  costs: [],
  costNote:
    'No official unit price has been published. Press reports compare it with other fighters only in relative terms, which cannot be shown as a figure.',

  sources: S,
}
