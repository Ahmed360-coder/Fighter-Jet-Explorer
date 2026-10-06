import { documented, unknown } from '../fact'
import type { Aircraft } from '../types'

const W = ['wiki-rafale']
const D = ['dassault-rafale']

export const rafale: Aircraft = {
  id: 'rafale',
  name: 'Dassault Rafale',
  shortName: 'Rafale',
  specVariant: 'Rafale C (single-seat, air force)',
  specVariantNote: 'The carrier-based Rafale M is heavier with a strengthened undercarriage; the two-seat Rafale B is a full combat aircraft.',
  countries: ['France'],
  manufacturers: ['Dassault Aviation'],
  roles: ['multirole', 'carrier-based'],
  generation: 4.5,
  status: 'in-service',
  summary:
    'France’s “omnirole” twin-engine canard-delta fighter, flown from land bases and aircraft carriers and exported widely.',

  firstFlight: documented('1991-05-19', W, { note: 'First flight of the Rafale C; the Rafale A demonstrator flew on 4 July 1986.', checkedLive: true }),
  serviceEntry: documented('2001-05-18', W, { note: 'French Navy service; the French Air Force followed in 2006.', checkedLive: true }),
  numberBuilt: documented(316, W, { note: 'Of 647 ordered.', checkedLive: true }),

  crew: documented(1, W),
  lengthM: documented(15.27, W),
  wingspanM: documented(10.9, W),
  heightM: documented(5.34, W),
  wingAreaM2: documented(45.7, W),
  emptyWeightKg: documented(10_300, W),
  maxTakeoffWeightKg: documented(24_500, W),

  engineCount: 2,
  engine: documented('Snecma M88-2 afterburning turbofan', [...W, ...D]),
  thrustPerEngineKn: documented(75, W),

  maxSpeedMach: documented(1.8, W, { note: 'At high altitude.' }),
  maxSpeedKmh: documented(1_912, W, { note: 'At high altitude.' }),
  rangeKm: unknown('No internal-fuel range has been published.'),
  combatRadiusKm: documented(1_850, W, { note: 'Penetration mission with external fuel.' }),
  ferryRangeKm: documented(3_700, W, { note: 'With external fuel tanks.' }),
  serviceCeilingM: documented(15_835, W),

  hardpoints: documented(14, W, { note: 'Rafale C; the Rafale M has 13.' }),
  gun: documented('GIAT 30/M791 30 mm revolver cannon', W),
  missiles: [
    { missileId: 'mica', status: 'documented', sources: [...W, ...D] },
    { missileId: 'meteor', status: 'documented', sources: [...W, ...D] },
    { missileId: 'scalp', status: 'documented', sources: [...W, ...D] },
    { missileId: 'exocet', status: 'documented', sources: [...W, ...D] },
    { missileId: 'asmp-a', status: 'documented', sources: W, appliesTo: 'French forces only' },
  ],

  costs: [
    {
      kind: 'unit-unspecified',
      amount: 101_100_000,
      currency: 'EUR',
      year: 2010,
      basis: 'Rafale F3+ standard, as quoted by the reference source',
      sources: W,
      checkedLive: true,
      note: 'Whether this includes development or support is not stated, so it should not be compared directly with flyaway figures.',
    },
  ],

  sources: [...W, ...D],
}
