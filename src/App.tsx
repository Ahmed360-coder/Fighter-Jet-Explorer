import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DEFAULT_QUERY, type Query } from './catalog/query'
import { aircraftById } from './data'
import { AircraftPage } from './pages/AircraftPage'
import { ComparePage } from './pages/ComparePage'
import { HowItsMadePage } from './pages/HowItsMadePage'
import { HangarPage } from './pages/HangarPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { hrefFor, useRoute } from './router'

export default function App() {
  const route = useRoute()
  // Search and filter state lives here so it survives a visit to a detail page.
  const [query, setQuery] = useState<Query>(DEFAULT_QUERY)
  const hangarScroll = useRef(0)
  const lastRoute = useRef(route.name)

  const aircraft = route.name === 'aircraft' ? aircraftById[route.id] : undefined

  // Return to where the visitor was in the hangar; start other pages at the top.
  useLayoutEffect(() => {
    const prev = lastRoute.current
    lastRoute.current = route.name
    if (route.name === 'hangar') {
      if (prev !== 'hangar') window.scrollTo(0, hangarScroll.current)
    } else {
      window.scrollTo(0, 0)
    }
  }, [route])

  useEffect(() => {
    if (route.name !== 'hangar') return
    const onScroll = () => {
      hangarScroll.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [route.name])

  useEffect(() => {
    const page = aircraft ? aircraft.shortName : route.name === 'compare' ? 'Compare' : route.name === 'making' ? 'How it’s made' : undefined
    document.title = page ? `${page} · Fighter Jet Explorer` : 'Fighter Jet Explorer'
  }, [aircraft, route.name])

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => {
        e.preventDefault()
        document.getElementById('main')?.focus()
      }}>
        Skip to content
      </a>
      <header className="topbar">
        <a className="wordmark" href={hrefFor.hangar()}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="wordmark__mark">
            <path d="M12 2 13.6 9.5 22 14v2l-8.2-2.2L13.2 19l2.8 2v1l-4-1-4 1v-1l2.8-2-.6-5.2L2 16v-2l8.4-4.5z" />
          </svg>
          <span>Fighter Jet Explorer</span>
        </a>
        <nav aria-label="Main">
          <a href={hrefFor.hangar()} aria-current={route.name === 'hangar' ? 'page' : undefined}>
            Hangar
          </a>
          <a href={hrefFor.compare()} aria-current={route.name === 'compare' ? 'page' : undefined}>
            Compare
          </a>
          <a href={hrefFor.making()} aria-current={route.name === 'making' ? 'page' : undefined}>
            How it’s made
          </a>
        </nav>
      </header>

      {route.name === 'hangar' && <HangarPage query={query} onQueryChange={setQuery} />}
      {route.name === 'aircraft' && (aircraft ? <AircraftPage aircraft={aircraft} /> : <NotFoundPage what={`an aircraft called “${route.id}”`} />)}
      {route.name === 'compare' && <ComparePage selection={route.ids} />}
      {route.name === 'making' && <HowItsMadePage />}
      {route.name === 'not-found' && <NotFoundPage what="that page" />}

      <footer className="colophon">
        <p>
          Figures marked <span className="live-mark" aria-hidden="true">◆</span>
          <span className="sr-only">with a diamond</span> were re-checked against a live source on 6 October 2026. The rest come from
          the cited references and were not re-checked during this build; treat them as reference figures, not verified
          ones. This catalog is a selection, not a complete list of fighter aircraft. Aircraft drawings are original
          illustrations, not photographs.
        </p>
      </footer>
    </>
  )
}
