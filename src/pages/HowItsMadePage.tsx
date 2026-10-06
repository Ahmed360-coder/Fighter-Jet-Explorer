import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { AssemblyFigure } from '../making/AssemblyFigure'
import { STAGES, stepFromKey } from '../making/stages'
import { hrefFor } from '../router'

const SWIPE_PX = 40

export function HowItsMadePage() {
  const [index, setIndex] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const stage = STAGES[index]
  const last = STAGES.length - 1

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const select = (i: number, focus = false) => {
    setIndex(i)
    if (focus) tabs.current[i]?.focus()
  }

  const onTabKey = (e: KeyboardEvent) => {
    const next = stepFromKey(index, e.key, STAGES.length)
    if (next === undefined) return
    e.preventDefault()
    select(next, true)
  }

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: PointerEvent) => {
    const start = swipe.current
    swipe.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return
    select(dx < 0 ? Math.min(last, index + 1) : Math.max(0, index - 1))
  }

  return (
    <main id="main" tabIndex={-1} className="making">
      <div className="page">
        <header className="making__head">
          <p className="eyebrow">How it’s made</p>
          <h1 ref={headingRef} tabIndex={-1}>
            From drawing to first flight
          </h1>
          <p className="lede">
            Six broad stages take a fighter from an air force’s wish list to a jet in the sky. This is a general,
            public overview of how modern fighters are produced, not the process of any one aircraft or factory.
          </p>
        </header>

        <div className="stepper">
          <div className="stepper__rail" role="tablist" aria-label="Production stages" aria-orientation="horizontal" onKeyDown={onTabKey}>
            {STAGES.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={i === index}
                aria-controls="stage-panel"
                tabIndex={i === index ? 0 : -1}
                className="stepper__tab"
                data-state={i < index ? 'done' : i === index ? 'current' : 'todo'}
                onClick={() => select(i)}
              >
                <span className="stepper__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="stepper__name">{s.title}</span>
              </button>
            ))}
          </div>

          <div className="stepper__body">
            <figure
              className="stepper__figure"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipe.current = null)}
            >
              <AssemblyFigure stage={stage.id} description={stage.figure} />
              <figcaption>
                <span className="stepper__count" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
                </span>
                {stage.figure}
                {stage.id === 'integration' && (
                  <ul className="syskey">
                    <li><span className="syskey__swatch syskey__swatch--wire" />Wiring</li>
                    <li><span className="syskey__swatch syskey__swatch--hyd" />Hydraulics</li>
                    <li><span className="syskey__swatch syskey__swatch--fuel" />Fuel tanks</li>
                    <li><span className="syskey__swatch syskey__swatch--kit" />Cockpit, radar, avionics, engine</li>
                  </ul>
                )}
              </figcaption>
            </figure>

            <div id="stage-panel" role="tabpanel" aria-labelledby={`tab-${stage.id}`} className="stepper__panel" key={stage.id}>
              <p className="stepper__kicker">{stage.kicker}</p>
              <h2>{stage.title}</h2>
              <p className="stepper__summary">{stage.summary}</p>
              <ul className="stepper__points">
                {stage.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              <div className="stepper__nav">
                <button type="button" className="button button--ghost" onClick={() => select(index - 1)} disabled={index === 0}>
                  ← Previous
                </button>
                {index < last ? (
                  <button type="button" className="button" onClick={() => select(index + 1)}>
                    Next: {STAGES[index + 1].title}
                  </button>
                ) : (
                  <a className="button" href={hrefFor.hangar()}>
                    Back to the hangar
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="note making__foot">
          The illustration is an original simplified drawing based on the site’s F-35A outline; the stages it shows apply
          to fighter production in general. Use the arrow keys on the stage list, the buttons, or swipe the drawing to
          move between stages.
        </p>
      </div>
    </main>
  )
}
