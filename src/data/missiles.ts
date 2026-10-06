import type { Missile } from './types'

/**
 * Missile catalog: name, broad role and origin only. The site describes which
 * aircraft are publicly documented as carrying each missile; it gives no
 * performance, targeting or employment detail.
 */
const list: Missile[] = [
  // United States
  { id: 'aim-9', name: 'AIM-9 Sidewinder', role: 'short-range air-to-air', origin: 'United States' },
  { id: 'aim-7', name: 'AIM-7 Sparrow', role: 'beyond-visual-range air-to-air', origin: 'United States' },
  { id: 'aim-120', name: 'AIM-120 AMRAAM', role: 'beyond-visual-range air-to-air', origin: 'United States' },
  { id: 'aim-54', name: 'AIM-54 Phoenix', role: 'long-range air-to-air', origin: 'United States' },
  { id: 'agm-65', name: 'AGM-65 Maverick', role: 'air-to-surface', origin: 'United States' },
  { id: 'agm-88', name: 'AGM-88 HARM / AARGM', role: 'anti-radiation', origin: 'United States' },
  { id: 'agm-84', name: 'AGM-84 Harpoon', role: 'anti-ship', origin: 'United States' },
  { id: 'agm-158', name: 'AGM-158 JASSM', role: 'cruise', origin: 'United States' },
  { id: 'agm-158c', name: 'AGM-158C LRASM', role: 'anti-ship', origin: 'United States' },

  // Europe
  { id: 'meteor', name: 'MBDA Meteor', role: 'beyond-visual-range air-to-air', origin: 'Europe (MBDA)' },
  { id: 'mica', name: 'MBDA MICA', role: 'beyond-visual-range air-to-air', origin: 'France' },
  { id: 'magic-2', name: 'Matra R.550 Magic 2', role: 'short-range air-to-air', origin: 'France' },
  { id: 'super-530', name: 'Matra Super 530D', role: 'beyond-visual-range air-to-air', origin: 'France' },
  { id: 'iris-t', name: 'IRIS-T', role: 'short-range air-to-air', origin: 'Germany-led European' },
  { id: 'asraam', name: 'ASRAAM (AIM-132)', role: 'short-range air-to-air', origin: 'United Kingdom' },
  { id: 'scalp', name: 'Storm Shadow / SCALP EG', role: 'cruise', origin: 'United Kingdom / France' },
  { id: 'taurus', name: 'Taurus KEPD 350', role: 'cruise', origin: 'Germany / Sweden' },
  { id: 'exocet', name: 'AM39 Exocet', role: 'anti-ship', origin: 'France' },
  { id: 'asmp-a', name: 'ASMP-A', role: 'nuclear stand-off', origin: 'France' },
  { id: 'brimstone', name: 'Brimstone', role: 'air-to-surface', origin: 'United Kingdom' },
  { id: 'alarm', name: 'ALARM', role: 'anti-radiation', origin: 'United Kingdom' },
  { id: 'kormoran', name: 'AS.34 Kormoran', role: 'anti-ship', origin: 'Germany' },
  { id: 'rbs-15', name: 'RBS 15', role: 'anti-ship', origin: 'Sweden' },

  // Soviet Union / Russia
  { id: 'r-3s', name: 'R-3S (K-13)', role: 'short-range air-to-air', origin: 'Soviet Union' },
  { id: 'r-60', name: 'R-60', role: 'short-range air-to-air', origin: 'Soviet Union' },
  { id: 'r-73', name: 'R-73', role: 'short-range air-to-air', origin: 'Soviet Union / Russia' },
  { id: 'r-27', name: 'R-27', role: 'beyond-visual-range air-to-air', origin: 'Soviet Union / Russia' },
  { id: 'r-77', name: 'R-77', role: 'beyond-visual-range air-to-air', origin: 'Russia' },
  { id: 'r-37m', name: 'R-37M', role: 'long-range air-to-air', origin: 'Russia' },
  { id: 'kh-31', name: 'Kh-31', role: 'anti-radiation', origin: 'Russia' },
  { id: 'kh-59', name: 'Kh-59', role: 'cruise', origin: 'Russia' },
  { id: 'kh-69', name: 'Kh-69', role: 'cruise', origin: 'Russia' },

  // China / Pakistan
  { id: 'pl-5', name: 'PL-5E II', role: 'short-range air-to-air', origin: 'China' },
  { id: 'pl-10', name: 'PL-10', role: 'short-range air-to-air', origin: 'China' },
  { id: 'pl-12', name: 'PL-12 / SD-10', role: 'beyond-visual-range air-to-air', origin: 'China' },
  { id: 'pl-15', name: 'PL-15', role: 'beyond-visual-range air-to-air', origin: 'China' },
  { id: 'c-802', name: 'C-802AK', role: 'anti-ship', origin: 'China' },

  // India / Israel
  { id: 'astra', name: 'Astra Mk 1', role: 'beyond-visual-range air-to-air', origin: 'India' },
  { id: 'brahmos-a', name: 'BrahMos-A', role: 'cruise', origin: 'India / Russia' },
  { id: 'python-5', name: 'Python-5', role: 'short-range air-to-air', origin: 'Israel' },
  { id: 'derby', name: 'Derby', role: 'beyond-visual-range air-to-air', origin: 'Israel' },
]

export const missiles: Record<string, Missile> = Object.fromEntries(list.map((m) => [m.id, m]))
export const missileList = list
