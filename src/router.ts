import { useEffect, useState } from 'react'

/**
 * Minimal hash router. Hash URLs work on any static host (including Vercel)
 * without rewrite rules, and keep the app free of a routing dependency.
 */

export type Route = { name: 'hangar' } | { name: 'aircraft'; id: string } | { name: 'not-found'; path: string }

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '') || '/'
  if (path === '/' || path === '/hangar') return { name: 'hangar' }
  const m = /^\/aircraft\/([a-z0-9-]+)$/.exec(path)
  if (m) return { name: 'aircraft', id: m[1] }
  return { name: 'not-found', path }
}

export const hrefFor = {
  hangar: () => '#/',
  aircraft: (id: string) => `#/aircraft/${id}`,
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
