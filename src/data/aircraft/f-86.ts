import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-f86']

export const f86: Aircraft = {
  id: 'f-86',
  name: 'North American F-86 Sabre',
  shortName: 'F-86 Sabre',
  specVariant: 'F-86F',
  countries: ['United States'],
  manufacturers: ['North American Aviation'],
  roles: ['air-superiority'],
  generation: 1,
  status: 'retired',
  summary:
    'America’s first swept-wing jet fighter, famous for its duels with the MiG-15 over Korea. The last operator retired it in 1994.',

  firstFlight: documented('1947-10-01', S, { checkedLive: true }),
  serviceEntry: documented('1949', S, { note: 'Last operator (Bolivia) retired it in 1994.', checkedLive: true }),
  numberBuilt: documented(9_860, S, { checkedLive: true }),

  crew: documented(1, S, { checkedLive: true }),
  lengthM: documented(11.3, S, { checkedLive: true }),
  wingspanM: documented(11.91, S, { checkedLive: true }),
  heightM: documented(4.29, S, { checkedLive: true }),
  wingAreaM2: documented(29.12, S, { checkedLive: true }),
  emptyWeightKg: documented(5_046, S),
  maxTakeoffWeightKg: documented(8_234, S),

  engineCount: 1,
  engine: documented('General Electric J47-GE-27 turbojet (no afterburner)', S, { checkedLive: true }),
  thrustPerEngineKn: documented(26.3, S),

  maxSpeedMach: unknown('Usually quoted in km/h; transonic in a dive.'),
  maxSpeedKmh: documented(1_106, S, { note: 'At sea level.', checkedLive: true }),
  rangeKm: unknown('Range figures depend on drop tanks and were not confirmed for this build.'),
  combatRadiusKm: unknown('Not confirmed for this build.'),
  ferryRangeKm: unknown('Not confirmed for this build.'),
  serviceCeilingM: documented(15_100, S, { note: 'At combat weight.', checkedLive: true }),

  hardpoints: documented(4, S, { checkedLive: true }),
  gun: documented('6 × 0.50 in (12.7 mm) M3 Browning machine guns, 1,800 rounds', S, { checkedLive: true }),
  missiles: [
    {
      missileId: 'aim-9',
      status: 'documented',
      sources: S,
      appliesTo: 'Republic of China Air Force F-86Fs, 1958 (first combat use of the Sidewinder)',
    },
  ],

  costs: [
    {
      kind: 'flyaway',
      amount: 211_111,
      currency: 'USD',
      year: 1950,
      basis: 'F-86F, 1950 dollars',
      sources: S,
      checkedLive: true,
      note: 'Not adjusted for inflation. Comparing 1950 dollars with modern prices without adjustment is misleading.',
    },
  ],

  sources: S,
}
