import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { timelineYear } from '../catalog/query'
import type { Aircraft } from '../data'

interface Props {
  /** The visible aircraft, in display order. */
  aircraft: readonly Aircraft[]
  activeId: string | undefined
  newestFirst: boolean
  onJump: (id: string, opts?: { instant?: boolean; focus?: boolean }) => void
}

/** Index of the position (0 to 1 along the track) nearest to `t`. */
function nearest(positions: readonly number[], t: number): number {
  let best = 0
  positions.forEach((p, i) => {
    if (Math.abs(p - t) < Math.abs(positions[best] - t)) best = i
  })
  return best
}

/**
 * A strip of years across the top of the hangar: one tick per visible jet,
 * placed by year. The tick for the bay in view lights up; tapping a tick
 * walks you to that bay, and dragging along the strip scrubs through them.
 * The strip is a single tab stop: arrow keys move between ticks.
 */
export function EraRail({ aircraft, activeId, newestFirst, onJump }: Props) {
  const ticks = useRef<(HTMLButtonElement | null)[]>([])
  const scrub = useRef<{ x: number; left: number; width: number; moved: boolean; last: number; ended?: boolean } | null>(null)
  const [focusId, setFocusId] = useState<string>()
  if (aircraft.length === 0) return null

  const years = aircraft.map(timelineYear)
  const min = Math.floor(Math.min(...years) / 10) * 10
  const max = Math.ceil((Math.max(...years) + 1) / 10) * 10
  const span = Math.max(1, max - min)
  const frac = (y: number) => {
    const t = (y - min) / span
    return newestFirst ? 1 - t : t
  }
  const pos = (y: number) => `${frac(y) * 100}%`
  const positions = years.map(frac)
  const decades: number[] = []
  for (let d = min; d <= max; d += 10) decades.push(d)

  // Jets from the same year stack instead of overlapping.
  const seen = new Map<number, number>()
  const activeIndex = aircraft.findIndex((a) => a.id === activeId)
  const active = aircraft[activeIndex]
  const focusIndex = aircraft.findIndex((a) => a.id === focusId)
  const tabIndexAt = focusIndex >= 0 ? focusIndex : Math.max(activeIndex, 0)

  // Ticks sit left to right on screen; arrow keys follow what the eye sees.
  const order = aircraft
    .map((a, i) => ({ i, y: timelineYear(a) }))
    .sort((p, q) => (newestFirst ? q.y - p.y : p.y - q.y) || p.i - q.i)
    .map((p) => p.i)

  const onKeyDown = (e: KeyboardEvent) => {
    scrub.current = null
    if (e.altKey || e.ctrlKey || e.metaKey) return
    const at = order.indexOf(tabIndexAt)
    let next: number | undefined
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = order[Math.min(order.length - 1, at + 1)]
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = order[Math.max(0, at - 1)]
    else if (e.key === 'Home') next = order[0]
    else if (e.key === 'End') next = order[order.length - 1]
    if (next === undefined) return
    e.preventDefault()
    setFocusId(aircraft[next].id)
    ticks.current[next]?.focus()
  }

  // Touch and mouse: drag along the strip to scrub from bay to bay.
  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return
    const r = e.currentTarget.getBoundingClientRect()
    scrub.current = { x: e.clientX, left: r.left, width: r.width, moved: false, last: -1 }
  }
  const onPointerMove = (e: PointerEvent) => {
    const s = scrub.current
    if (!s || s.ended) return
    if (!s.moved && Math.abs(e.clientX - s.x) < 8) return
    if (!s.moved) {
      s.moved = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    const i = nearest(positions, (e.clientX - s.left) / s.width)
    if (i !== s.last) {
      s.last = i
      onJump(aircraft[i].id, { instant: true, focus: false })
    }
  }
  const endScrub = () => {
    const s = scrub.current
    // Keep a finished drag around for one click, so letting go over a tick doesn't count as a tap.
    scrub.current = s?.moved ? { ...s, ended: true } : null
  }

  return (
    <nav className="rail" aria-label="Timeline: jump to an aircraft">
      <div
        className="rail__track"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endScrub}
        onPointerCancel={endScrub}
        onClickCapture={(e) => {
          // A drag that ended over a tick is not a tap on it.
          // detail is 0 for clicks made with Enter or Space, which are never the end of a drag.
          if (scrub.current?.ended && e.detail !== 0) {
            e.preventDefault()
            e.stopPropagation()
          }
          scrub.current = null
        }}
      >
        {decades.map((d) => (
          <span key={d} className="rail__decade" style={{ left: pos(d) }} aria-hidden="true">
            {d}
          </span>
        ))}
        {aircraft.map((a, i) => {
          const y = timelineYear(a)
          const stack = seen.get(y) ?? 0
          seen.set(y, stack + 1)
          const isActive = a.id === activeId
          return (
            <button
              key={a.id}
              ref={(el) => {
                ticks.current[i] = el
              }}
              type="button"
              className="rail__tick"
              data-active={isActive}
              tabIndex={i === tabIndexAt ? 0 : -1}
              style={{ left: pos(y), ['--stack' as string]: stack }}
              aria-label={`${a.shortName}, ${y}`}
              aria-current={isActive ? 'true' : undefined}
              onFocus={() => setFocusId(a.id)}
              onBlur={() => setFocusId(undefined)}
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
