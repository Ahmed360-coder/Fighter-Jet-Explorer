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

  it('reads compare selections and the making page', () => {
    expect(parseRoute('#/compare')).toEqual({ name: 'compare', ids: '' })
    expect(parseRoute('#/compare/f-22,su-57')).toEqual({ name: 'compare', ids: 'f-22,su-57' })
    expect(parseRoute(hrefFor.compare('f-16,mig-29'))).toEqual({ name: 'compare', ids: 'f-16,mig-29' })
    expect(parseRoute('#/how-its-made')).toEqual({ name: 'making' })
  })

  it('reports anything else as not found', () => {
    expect(parseRoute('#/nowhere')).toEqual({ name: 'not-found', path: '/nowhere' })
    expect(parseRoute('#/aircraft/')).toEqual({ name: 'not-found', path: '/aircraft' })
  })
})
