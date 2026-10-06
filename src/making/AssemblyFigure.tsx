import { Body, useUid } from '../art/Planform'
import { geometryOf, pts, silhouette } from '../art/geometry'
import { aircraftById } from '../data'
import type { StageId } from './stages'

/**
 * An exploded-view illustration built from the site's original F-35A planform.
 * The drawing is cut into its major sections with clip paths; CSS moves the
 * sections apart and back together depending on `data-stage`, so every stage
 * change is a transition the browser can skip under reduced motion.
 */

type V = [number, number]

interface Part {
  id: string
  label: string
  /** Clip region (right half for mirrored parts), metres: x along length, y across span. */
  clip: V[]
  /** Section offset when fully exploded. */
  offset: V
}

const FAR = 9

function partsFor(L: number): Part[] {
  const nose = 0.2 * L
  const fwd = 0.42 * L
  const aft = 0.72 * L
  const tail = 0.785 * L
  const body = 1.6
  const aftBody = 2
  const rect = (x0: number, x1: number, y0: number, y1: number): V[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const wing: V[] = [[fwd, body], [aft, body], [aft, aftBody], [tail, aftBody], [tail, FAR], [fwd, FAR]]
  const tailR = rect(tail, L + 4, aftBody, FAR)
  const mirror = (p: V[]): V[] => p.map(([x, y]) => [x, -y])
  return [
    { id: 'nose', label: 'Nose', clip: rect(-2, nose, -FAR, FAR), offset: [-3.2, 0] },
    { id: 'forward', label: 'Forward fuselage', clip: rect(nose, fwd, -FAR, FAR), offset: [-1.6, 0] },
    { id: 'centre', label: 'Centre fuselage', clip: rect(fwd, aft, -body, body), offset: [0, 0] },
    { id: 'aft', label: 'Aft fuselage', clip: rect(aft, L + 4, -aftBody, aftBody), offset: [2.6, 0] },
    { id: 'wing-r', label: 'Wing', clip: wing, offset: [0.4, 2.5] },
    { id: 'wing-l', label: 'Wing', clip: mirror(wing), offset: [0.4, -2.5] },
    { id: 'tail-r', label: 'Tailplane', clip: tailR, offset: [3.6, 2.1] },
    { id: 'tail-l', label: 'Tailplane', clip: mirror(tailR), offset: [3.6, -2.1] },
  ]
}

const LABEL_AT: Record<string, V> = {
  nose: [1.4, -2.2],
  forward: [4.9, -3.2],
  centre: [9, 2.75],
  aft: [13.8, -2.7],
  'wing-r': [9.2, 5.6],
  'tail-r': [14.4, 4.8],
}

/** Systems drawn inside each section; visible while the sections are open. */
function Systems({ part, L }: { part: string; L: number }) {
  switch (part) {
    case 'nose':
      return (
        <g className="sys">
          <path className="sys__radar" d="M 1.75 -0.8 Q 1.1 0 1.75 0.8" />
          <line className="sys__wire" x1="1.8" y1="0" x2={0.2 * L} y2="0" />
        </g>
      )
    case 'forward':
      return (
        <g className="sys">
          <rect className="sys__seat" x="3.7" y="-0.35" width="1.3" height="0.7" rx="0.2" />
          <rect className="sys__avionics" x="5.3" y="-0.55" width="1" height="1.1" rx="0.1" />
          <line className="sys__wire" x1={0.2 * L} y1="0" x2="3.7" y2="0" />
          <line className="sys__wire" x1="5" y1="0" x2="5.3" y2="0" />
          <line className="sys__wire" x1="6.3" y1="0" x2={0.42 * L} y2="0" />
        </g>
      )
    case 'centre':
      return (
        <g className="sys">
          <rect className="sys__fuel" x="7" y="-1.25" width="4" height="0.95" rx="0.25" />
          <rect className="sys__fuel" x="7" y="0.3" width="4" height="0.95" rx="0.25" />
          <line className="sys__wire" x1={0.42 * L} y1="0" x2={0.72 * L} y2="0" />
          <polyline className="sys__hyd" points="7.6,1.45 10.8,1.45" />
          <polyline className="sys__hyd" points="7.6,-1.45 10.8,-1.45" />
        </g>
      )
    case 'aft':
      return (
        <g className="sys">
          <rect className="sys__engine" x="11.6" y="-0.75" width={L - 11.4} height="1.5" rx="0.5" />
          {[12.4, 13.2, 14, 14.8].map((x) => (
            <line key={x} className="sys__engine-rib" x1={x} y1="-0.7" x2={x} y2="0.7" />
          ))}
          <polyline className="sys__hyd" points="11.6,1.6 14.6,1.6" />
          <polyline className="sys__hyd" points="11.6,-1.6 14.6,-1.6" />
        </g>
      )
    case 'wing-r':
    case 'wing-l': {
      const s = part === 'wing-r' ? 1 : -1
      return (
        <g className="sys">
          <polygon className="sys__fuel" points={pts([[7.4, 1.9 * s], [10.6, 1.9 * s], [10.6, 3.6 * s], [9.6, 3.6 * s]])} />
          <polyline className="sys__hyd" points={pts([[7.2, 1.7 * s], [11.4, 1.7 * s], [11.4, 4.3 * s]])} />
        </g>
      )
    }
    default:
      return null
  }
}

const FLOW_YS = [-6.6, -4.8, -3, -1.5, 1.5, 3, 4.8, 6.6]

export function AssemblyFigure({ stage, description }: { stage: StageId; description: string }) {
  const uid = useUid('mk')
  const g = geometryOf(aircraftById['f-35a'])!
  const L = g.lengthM
  const parts = partsFor(L)
  const outline = silhouette(g)
  const x0 = -5.2
  const y0 = -9
  const w = L + 12
  const h = 18

  return (
    <svg
      className="assembly"
      data-stage={stage}
      viewBox={`${x0} ${y0} ${w} ${h}`}
      role="img"
      aria-label={description}
    >
      <defs>
        {parts.map((p) => (
          <clipPath key={p.id} id={`${uid}-${p.id}`}>
            <polygon points={pts(p.clip)} />
          </clipPath>
        ))}
        <clipPath id={`${uid}-outline`}>
          <polygon points={outline} />
        </clipPath>
        <pattern id={`${uid}-grid`} width="1" height="1" patternUnits="userSpaceOnUse">
          <path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgb(111 142 168 / 0.12)" strokeWidth="0.025" />
        </pattern>
      </defs>

      <rect className="assembly__grid" x={x0 - 2} y={y0} width={w + 4} height={h} fill={`url(#${uid}-grid)`} />

      {/* Flight: speed streaks behind the aircraft. */}
      <g className="streaks" aria-hidden="true">
        {FLOW_YS.map((y, i) => (
          <line key={y} x1={L + 1} x2={L + 6.5} y1={y * 0.7} y2={y * 0.7} style={{ animationDelay: `${i * -0.23}s` }} />
        ))}
      </g>

      {/* Design: airflow lines passing over a wireframe. */}
      <g className="flow" aria-hidden="true">
        {FLOW_YS.map((y) => {
          const bend = Math.sign(y) * Math.max(0, 1.6 - Math.abs(y) * 0.18)
          return (
            <path
              key={y}
              d={`M ${x0} ${y} C ${L * 0.2} ${y}, ${L * 0.35} ${y + bend}, ${L * 0.6} ${y + bend} S ${L + 2} ${y}, ${x0 + w} ${y}`}
            />
          )
        })}
      </g>
      <polygon className="wire" points={outline} pathLength={1} />

      <g className="airframe">
        {parts.map((p) => (
          <g key={p.id} className={`part part--${p.id}`} style={{ '--dx': `${p.offset[0]}px`, '--dy': `${p.offset[1]}px` } as React.CSSProperties}>
            <g clipPath={`url(#${uid}-${p.id})`}>
              <Body g={g} uid={`${uid}${p.id.replace('-', '')}`} finish="stealth" />
            </g>
            {/* The section's own outline plus its cut lines, each clipped to the other shape. */}
            <g className="part__edge">
              <polygon points={outline} clipPath={`url(#${uid}-${p.id})`} />
              <polygon points={pts(p.clip)} clipPath={`url(#${uid}-outline)`} />
            </g>
            <Systems part={p.id} L={L} />
            {LABEL_AT[p.id] && (
              <text className="part__label" x={LABEL_AT[p.id][0]} y={LABEL_AT[p.id][1]} textAnchor="middle">
                {p.label}
              </text>
            )}
          </g>
        ))}

        {/* Assembly: the joins light up as the sections meet. */}
        <g className="joins" aria-hidden="true">
          <line x1={0.2 * L} x2={0.2 * L} y1="-1.3" y2="1.3" />
          <line x1={0.42 * L} x2={0.42 * L} y1="-2.6" y2="2.6" />
          <line x1={0.72 * L} x2={0.72 * L} y1="-1.6" y2="1.6" />
          <line x1={0.42 * L} x2={0.72 * L} y1="1.6" y2="1.6" />
          <line x1={0.42 * L} x2={0.72 * L} y1="-1.6" y2="-1.6" />
        </g>

        {/* Ground testing: test points around the airframe. */}
        <g className="checks" aria-hidden="true">
          {(
            [
              [1.5, 0],
              [4.4, 0],
              [9, 3.2],
              [9, -3.2],
              [13.4, 0],
              [14.6, 3.2],
            ] as V[]
          ).map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`} style={{ animationDelay: `${i * 0.35}s` }}>
              <circle className="checks__ring" r="0.55" style={{ animationDelay: `${i * 0.35}s` }} />
              <circle className="checks__dot" r="0.16" />
            </g>
          ))}
        </g>

        {/* Flight: telemetry going back to the ground. */}
        <g className="telemetry" aria-hidden="true" transform={`translate(${0.5 * L} 0)`}>
          {[0, 1, 2].map((i) => (
            <circle key={i} r="1" style={{ animationDelay: `${i * 0.8}s` }} />
          ))}
        </g>
      </g>
    </svg>
  )
}
