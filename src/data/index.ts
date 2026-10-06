import { f14 } from './aircraft/f-14'
import { f15 } from './aircraft/f-15'
import { f16 } from './aircraft/f-16'
import { f22 } from './aircraft/f-22'
import { f35a, f35b } from './aircraft/f-35'
import { f4 } from './aircraft/f-4'
import { f86 } from './aircraft/f-86'
import { gripen } from './aircraft/gripen'
import { j10 } from './aircraft/j-10'
import { j20 } from './aircraft/j-20'
import { jf17 } from './aircraft/jf-17'
import { kf21 } from './aircraft/kf-21'
import { mig15 } from './aircraft/mig-15'
import { mig21 } from './aircraft/mig-21'
import { mig29 } from './aircraft/mig-29'
import { mirage2000 } from './aircraft/mirage-2000'
import { rafale } from './aircraft/rafale'
import { su27 } from './aircraft/su-27'
import { su30mki } from './aircraft/su-30mki'
import { su57 } from './aircraft/su-57'
import { superHornet } from './aircraft/super-hornet'
import { tejas } from './aircraft/tejas'
import { tornado } from './aircraft/tornado'
import { typhoon } from './aircraft/typhoon'
import { isKnown } from './fact'
import type { Aircraft } from './types'

export type * from './types'
export { sources, sourceList } from './sources'
export { missiles, missileList } from './missiles'
export { isKnown, yearOf } from './fact'

/**
 * The date used to place an aircraft on the newest-to-oldest timeline:
 * service entry when known, otherwise first flight (for aircraft still in development).
 */
export function chronologyKey(a: Aircraft): string {
  const date = isKnown(a.serviceEntry) ? a.serviceEntry.value : isKnown(a.firstFlight) ? a.firstFlight.value : '0000'
  return date
}

const all: Aircraft[] = [
  kf21, su57, j20, f35a, f35b, tejas, jf17, f22, j10, typhoon, su30mki, rafale, superHornet,
  gripen, su27, mirage2000, mig29, f16, tornado, f15, f14, f4, mig21, f86, mig15,
]

/** Every aircraft, newest to oldest. Ties keep the order above. */
export const catalog: readonly Aircraft[] = [...all].sort((a, b) =>
  chronologyKey(b).localeCompare(chronologyKey(a)),
)

export const aircraftById: Record<string, Aircraft> = Object.fromEntries(catalog.map((a) => [a.id, a]))
