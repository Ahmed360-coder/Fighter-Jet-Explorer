import { isKnown, type Aircraft } from '../data'
import { planforms, type Planform as Shape, type Pt } from './planforms'

export interface Geometry {
  shape: Shape
  lengthM: number
  spanM: number
  /** False when a published dimension was missing and a default proportion was used. */
  toScale: boolean
  /** Maps a shape point (right half) to metres: [along length, across span]. */
  map: (p: Pt, mirror?: boolean) => [number, number]
  sx: number
  sy: number
}

export function geometryOf(a: Aircraft): Geometry | undefined {
  const shape = planforms[a.id]
  if (!shape) return undefined
  const maxX = Math.max(...shape.outline.map((p) => p[0]))
  const maxY = Math.max(...shape.outline.map((p) => p[1]))
  const toScale = isKnown(a.lengthM) && isKnown(a.wingspanM)
  const lengthM = isKnown(a.lengthM) ? a.lengthM.value : 15
  const spanM = isKnown(a.wingspanM) ? a.wingspanM.value : (lengthM * maxX * 2) / maxY
  const sx = spanM / 2 / maxX
  const sy = lengthM / maxY
  return {
    shape,
    lengthM,
    spanM,
    toScale,
    sx,
    sy,
    map: ([x, y], mirror = false) => [y * sy, (mirror ? -x : x) * sx],
  }
}
