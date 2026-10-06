import { describe, expect, it } from 'vitest'
import { hrefFor, parseRoute } from './router'

describe('parseRoute', () => {
  it('treats an empty hash and #/ as the hangar', () => {
    expect(parseRoute('')).toEqual({ name: 'hangar' })
    expect(parseRoute('#/')).toEqual({ name: 'hangar' })
    expect(parseRoute('#/hangar/')).toEqual({ name: 'hangar' })
  })

  it('reads aircraft ids', () => {
    expect(parseRoute('#/aircraft/f-35a')).toEqual({ name: 'aircraft', id: 'f-35a' })
    expect(parseRoute(hrefFor.aircraft('su-30mki'))).toEqual({ name: 'aircraft', id: 'su-30mki' })
  })

  it('reports anything else as not found', () => {
    expect(parseRoute('#/nowhere')).toEqual({ name: 'not-found', path: '/nowhere' })
    expect(parseRoute('#/aircraft/')).toEqual({ name: 'not-found', path: '/aircraft' })
  })
})
