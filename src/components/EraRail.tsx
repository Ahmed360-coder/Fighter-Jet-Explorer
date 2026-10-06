import { timelineYear } from '../catalog/query'
import type { Aircraft } from '../data'

interface Props {
  /** The visible aircraft, in display order. */
  aircraft: readonly Aircraft[]
  activeId: string | undefined
  newestFirst: boolean
  onJump: (id: string) => void
}

/**
 * A strip of years across the top of the hangar: one tick per visible jet,
 * placed by year. The tick for the bay in view lights up; tapping a tick
 * walks you to that bay.
 */
export function EraRail({ aircraft, activeId, newestFirst, onJump }: Props) {
  if (aircraft.length === 0) return null
  const years = aircraft.map(timelineYear)
  const min = Math.floor(Math.min(...years) / 10) * 10
  const max = Math.ceil((Math.max(...years) + 1) / 10) * 10
  const span = Math.max(1, max - min)
  const pos = (y: number) => {
    const t = (y - min) / span
    return `${(newestFirst ? 1 - t : t) * 100}%`
  }
  const decades: number[] = []
  for (let d = min; d <= max; d += 10) decades.push(d)

  // Jets from the same year stack instead of overlapping.
  const seen = new Map<number, number>()
  const active = aircraft.find((a) => a.id === activeId)

  return (
    <nav className="rail" aria-label="Timeline: jump to an aircraft">
      <div className="rail__track">
        {decades.map((d) => (
          <span key={d} className="rail__decade" style={{ left: pos(d) }} aria-hidden="true">
            {d}
          </span>
        ))}
        {aircraft.map((a) => {
          const y = timelineYear(a)
          const stack = seen.get(y) ?? 0
          seen.set(y, stack + 1)
          const isActive = a.id === activeId
          return (
            <button
              key={a.id}
              type="button"
              className="rail__tick"
              data-active={isActive}
              style={{ left: pos(y), ['--stack' as string]: stack }}
              aria-label={`${a.shortName}, ${y}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onJump(a.id)}
            />
          )
        })}
      </div>
      <p className="rail__now" aria-hidden="true">
        {active ? (
          <>
            <span>{timelineYear(active)}</span> {active.shortName}
          </>
        ) : (
          <>&nbsp;</>
        )}
      </p>
    </nav>
  )
}
