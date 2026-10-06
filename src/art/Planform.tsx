import { useId } from 'react'
import type { Aircraft } from '../data'
import { formatNumber, imperial } from '../format'
import { geometryOf, pts, silhouette, type Geometry } from './geometry'
import type { Pt } from './planforms'

/**
 * Renders an aircraft's planform, nose to the left, in metres. The hand-drawn
 * outline is stretched to the record's published length and wingspan, so two
 * drawings at the same `frame` are at true relative scale.
 */

export type Finish = 'stealth' | 'grey' | 'light' | 'blue' | 'metal'

const FINISH: Record<string, Finish> = {
  'f-35a': 'stealth', 'f-35b': 'stealth', 'j-20': 'stealth', 'f-22': 'grey', 'su-57': 'blue', 'kf-21': 'grey',
  typhoon: 'light', rafale: 'grey', gripen: 'grey', 'j-10': 'light', 'jf-17': 'grey', tejas: 'light',
  'super-hornet': 'grey', 'su-27': 'blue', 'su-30mki': 'blue', 'mirage-2000': 'blue', 'mig-29': 'grey',
  'f-16': 'grey', tornado: 'grey', 'f-15': 'grey', 'f-14': 'light', 'f-4': 'grey', 'mig-21': 'metal',
  'f-86': 'metal', 'mig-15': 'metal',
}

const PALETTE: Record<Finish, [edge: string, mid: string, spine: string]> = {
  stealth: ['#262c33', '#3d454e', '#59636d'],
  grey: ['#3b4550', '#66727e', '#8f9aa5'],
  light: ['#4a5560', '#7d8994', '#aab4bd'],
  blue: ['#33465a', '#5b738a', '#8ba2b6'],
  metal: ['#4d555c', '#9aa3ab', '#d5dbe0'],
}


function mirrored(g: Geometry, poly: readonly Pt[]): string[] {
  const out = [pts(poly.map((p) => g.map(p)))]
  if (poly.some(([x]) => x !== 0)) out.push(pts(poly.map((p) => g.map(p, true))))
  return out
}

export function Body({ g, uid, finish }: { g: Geometry; uid: string; finish: Finish }) {
  const [edge, mid, spine] = PALETTE[finish]
  const half = g.spanM / 2
  const { shape } = g
  const outline = silhouette(g)

  const fins = shape.fins.flatMap((f) => {
    if (f.x === 0) {
      const t = 0.42 / g.sx
      const poly: Pt[] = [[0, f.root[0]], [t, (f.root[0] + f.root[1]) / 2], [t * 0.4, f.tip[1]], [-t * 0.4, f.tip[1]], [-t, (f.root[0] + f.root[1]) / 2]]
      return [pts(poly.map(([x, y]) => [y * g.sy, x * g.sx]))]
    }
    return mirrored(g, [[f.x, f.root[0]], [f.x, f.root[1]], [f.tipX, f.tip[1]], [f.tipX, f.tip[0]]])
  })

  const canopy = {
    cx: ((shape.canopy.y0 + shape.canopy.y1) / 2) * g.sy,
    rx: ((shape.canopy.y1 - shape.canopy.y0) / 2) * g.sy,
    ry: (shape.canopy.width / 2) * g.sx,
  }

  return (
    <>
      <defs>
        <linearGradient id={`${uid}-skin`} gradientUnits="userSpaceOnUse" x1="0" y1={-half} x2="0" y2={half}>
          <stop offset="0" stopColor={edge} />
          <stop offset="0.4" stopColor={mid} />
          <stop offset="0.5" stopColor={spine} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={edge} />
        </linearGradient>
        <linearGradient id={`${uid}-sheen`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={g.lengthM} y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b4a57" />
          <stop offset="0.35" stopColor="#141b22" />
          <stop offset="1" stopColor="#06090c" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#e8a33d" stopOpacity="0.45" />
          <stop offset="1" stopColor="#e8a33d" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="jet__exhaust" aria-hidden="true">
        {shape.nozzles.flatMap((n) => {
          const ys = n.x === 0 ? [0] : [n.x * g.sx, -n.x * g.sx]
          return ys.map((cy) => (
            <ellipse key={cy} cx={n.y * g.sy + 0.5} cy={cy} rx={1.6} ry={(n.width * g.sx) / 1.4} fill={`url(#${uid}-glow)`} />
          ))
        })}
      </g>

      <polygon points={outline} fill={`url(#${uid}-skin)`} />
      <polygon points={outline} fill={`url(#${uid}-sheen)`} stroke="rgb(255 255 255 / 0.22)" strokeWidth="0.045" strokeLinejoin="round" />

      {shape.lines?.flatMap((l, i) =>
        mirrored(g, l).map((p, j) => <polyline key={`${i}-${j}`} points={p} fill="none" stroke="rgb(0 0 0 / 0.38)" strokeWidth="0.05" />),
      )}
      <line x1={canopy.cx + canopy.rx} y1="0" x2={g.lengthM * 0.97} y2="0" stroke="rgb(255 255 255 / 0.08)" strokeWidth="0.08" />

      {shape.intakes?.flatMap((p, i) => mirrored(g, p).map((d, j) => <polygon key={`${i}-${j}`} points={d} fill="#07090c" opacity="0.9" />))}

      {shape.nozzles.flatMap((n) => {
        const ys = n.x === 0 ? [0] : [n.x * g.sx, -n.x * g.sx]
        const w = n.width * g.sx
        return ys.map((cy) => (
          <rect
            key={cy}
            x={(n.y - n.length) * g.sy}
            y={cy - w / 2}
            width={n.length * g.sy}
            height={w}
            rx={w * 0.22}
            fill="#14181d"
            stroke="rgb(255 255 255 / 0.16)"
            strokeWidth="0.04"
          />
        ))
      })}

      {fins.map((p, i) => (
        <polygon key={i} points={p} fill={spine} fillOpacity="0.92" stroke="rgb(0 0 0 / 0.45)" strokeWidth="0.05" strokeLinejoin="round" />
      ))}

      <ellipse cx={canopy.cx} cy="0" rx={canopy.rx} ry={canopy.ry} fill={`url(#${uid}-glass)`} stroke="rgb(0 0 0 / 0.6)" strokeWidth="0.05" />
      <ellipse cx={canopy.cx - canopy.rx * 0.25} cy={-canopy.ry * 0.35} rx={canopy.rx * 0.5} ry={canopy.ry * 0.18} fill="#fff" opacity="0.22" />
    </>
  )
}

export function useUid(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9]/g, '')
}

/** A jet parked in a hangar bay, at the shared hangar scale (metres). */
export function HangarJet({ aircraft, frame }: { aircraft: Aircraft; frame: { width: number; height: number } }) {
  const uid = useUid('hj')
  const g = geometryOf(aircraft)
  if (!g) return null
  const x0 = (frame.width - g.lengthM) / 2
  const outline = silhouette(g)
  return (
    <svg className="jet" viewBox={`0 ${-frame.height / 2} ${frame.width} ${frame.height}`} aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${uid}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>
      <g transform={`translate(${x0} 0)`}>
        <g className="jet__shadow">
          <polygon points={outline} transform="translate(0.7 0.9)" fill="#000" opacity="0.55" filter={`url(#${uid}-blur)`} />
        </g>
        <g className="jet__body">
          <Body g={g} uid={uid} finish={FINISH[aircraft.id] ?? 'grey'} />
        </g>
      </g>
    </svg>
  )
}

/** Detail-page drawing on a blueprint grid, with published length and wingspan dimensioned. */
export function BlueprintJet({ aircraft }: { aircraft: Aircraft }) {
  const uid = useUid('bp')
  const g = geometryOf(aircraft)
  if (!g) return null
  const pad = 2.2
  const half = g.spanM / 2
  const w = g.lengthM + pad * 2 + 1.6
  const h = g.spanM + pad * 2 + 1.2
  const dimY = half + 1.3
  const dimX = g.lengthM + 1.3
  const fs = Math.max(0.5, g.spanM / 22)
  const label = (m: number) => `${formatNumber(m)} m · ${imperial(m, 'm')}`

  return (
    <figure className="blueprint">
      <svg
        viewBox={`${-pad} ${-half - pad} ${w} ${h}`}
        role="img"
        aria-label={`Original top-down illustration of the ${aircraft.shortName}, drawn to its published length of ${formatNumber(g.lengthM)} metres and wingspan of ${formatNumber(g.spanM)} metres.`}
      >
        <defs>
          <pattern id={`${uid}-grid`} width="1" height="1" patternUnits="userSpaceOnUse" x="0" y="0">
            <path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgb(111 142 168 / 0.13)" strokeWidth="0.03" />
          </pattern>
          <pattern id={`${uid}-grid5`} width="5" height="5" patternUnits="userSpaceOnUse" x="0" y="0">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgb(111 142 168 / 0.28)" strokeWidth="0.04" />
          </pattern>
        </defs>
        <rect x={-pad} y={-half - pad} width={w} height={h} fill={`url(#${uid}-grid)`} />
        <rect x={-pad} y={-half - pad} width={w} height={h} fill={`url(#${uid}-grid5)`} />

        <g className="jet__body">
          <Body g={g} uid={uid} finish={FINISH[aircraft.id] ?? 'grey'} />
        </g>

        <g className="dim" fontSize={fs}>
          <line x1="0" y1={dimY} x2={g.lengthM} y2={dimY} />
          <line x1="0" y1={dimY - 0.4} x2="0" y2={dimY + 0.4} />
          <line x1={g.lengthM} y1={dimY - 0.4} x2={g.lengthM} y2={dimY + 0.4} />
          <text x={g.lengthM / 2} y={dimY + fs * 1.5} textAnchor="middle">
            Length {label(g.lengthM)}
          </text>

          <line x1={dimX} y1={-half} x2={dimX} y2={half} />
          <line x1={dimX - 0.4} y1={-half} x2={dimX + 0.4} y2={-half} />
          <line x1={dimX - 0.4} y1={half} x2={dimX + 0.4} y2={half} />
          <text transform={`translate(${dimX + fs * 1.3} 0) rotate(90)`} textAnchor="middle">
            Span {label(g.spanM)}
          </text>

          <g transform={`translate(0 ${-half - pad + 0.9})`}>
            <line x1="0" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-0.25" x2="0" y2="0.25" />
            <line x1="5" y1="-0.25" x2="5" y2="0.25" />
            <text x="5.4" y={fs * 0.35}>5 m</text>
          </g>
        </g>
      </svg>
      <figcaption>
        Original illustration, drawn for this site from the published length and wingspan of the {aircraft.specVariant}.
        Shapes are simplified; this is not a photograph or a manufacturer drawing.
        {g.shape.pose && <> {g.shape.pose}</>}
        {!g.toScale && <> Not to scale: a published dimension is missing.</>}
      </figcaption>
    </figure>
  )
}
