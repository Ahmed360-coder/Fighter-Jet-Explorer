import { disputed, documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const S = ['wiki-su57']
const RU_NOTE = 'Russia has published little official data; this is a reference-source figure that varies between publications.'

export const su57: Aircraft = {
  id: 'su-57',
  name: 'Sukhoi Su-57',
  shortName: 'Su-57',
  nickname: 'NATO reporting name “Felon”',
  specVariant: 'Su-57 (production, AL-41F1 engines)',
  countries: ['Russia'],
  manufacturers: ['Sukhoi (United Aircraft Corporation)'],
  roles: ['multirole', 'air-superiority'],
  generation: 5,
  status: 'in-service',
  summary:
    'Russia’s twin-engine stealth fighter, built around internal weapon bays, thrust-vectoring engines and a large, blended airframe.',

  firstFlight: documented('2010-01-29', S, { checkedLive: true }),
  serviceEntry: documented('2020-12', S, { note: 'First serial aircraft delivered in December 2020.', checkedLive: true }),
  numberBuilt: disputed(44, S, 'Reference estimate (“44+ as of 2026”, including 10 test aircraft); no official count.', { qualifier: 'at-least', checkedLive: true }),

  crew: documented(1, S),
  lengthM: disputed(20.1, S, RU_NOTE),
  wingspanM: disputed(14.1, S, RU_NOTE),
  heightM: disputed(4.6, S, RU_NOTE),
  wingAreaM2: disputed(78.8, S, RU_NOTE),
  emptyWeightKg: disputed(18_000, S, RU_NOTE),
  maxTakeoffWeightKg: disputed(35_000, S, RU_NOTE),

  engineCount: 2,
  engine: documented('Saturn AL-41F1 (izdeliye 117) afterburning turbofan', S, {
    note: 'A new engine, izdeliye 30 (AL-51F1), is being developed for later aircraft.',
  }),
  thrustPerEngineKn: disputed(142.2, S, RU_NOTE),

  maxSpeedMach: disputed(2, S, RU_NOTE),
  maxSpeedKmh: unknown('Sources disagree; no consistent official km/h figure.'),
  rangeKm: disputed(3_500, S, `${RU_NOTE} Stated for subsonic cruise.`),
  combatRadiusKm: unknown('Not published.'),
  ferryRangeKm: disputed(4_500, S, RU_NOTE),
  serviceCeilingM: disputed(20_000, S, RU_NOTE),

  hardpoints: disputed(12, S, 'Commonly given as 6 external plus internal bay stations; exact count varies between sources.'),
  gun: documented('GSh-30-1 30 mm cannon', S),
  missiles: [
    { missileId: 'r-73', status: 'reported', sources: S, note: 'Reported in the R-74M2 development for the side bays.' },
    { missileId: 'r-77', status: 'reported', sources: S, note: 'Reported in the R-77M development for the main bays.' },
    { missileId: 'r-37m', status: 'reported', sources: S },
    { missileId: 'kh-59', status: 'reported', sources: S, note: 'Kh-59MK2 variant reported for internal carriage.' },
    { missileId: 'kh-69', status: 'reported', sources: S, note: 'Reported in combat use over Ukraine.' },
  ],

  costs: [],
  costNote:
    'No official unit cost has been published; widely quoted figures are press estimates with unclear bases, so none is shown.',

  sources: S,
}
