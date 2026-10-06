/// <reference types="node" />
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SUGGESTIONS, parseCompareIds, readCompareLink } from './compare/compare'
import { aircraftById, catalog, sources } from './data'
import { hrefFor, parseRoute } from './router'

const root = join(import.meta.dirname, '..')

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? filesUnder(path) : [path]
  })
}

describe('links and assets', () => {
  it('every source URL is a well-formed https link with no placeholder host', () => {
    for (const s of Object.values(sources)) {
      const url = new URL(s.url)
      expect(url.protocol, s.id).toBe('https:')
      expect(url.hostname, s.id).not.toMatch(/example\.|localhost|placeholder/)
    }
  })

  it('no two source ids point at different titles for the same URL', () => {
    const byUrl = new Map<string, string>()
    for (const s of Object.values(sources)) {
      const prev = byUrl.get(s.url)
      if (prev) expect(prev, s.url).toBe(s.title)
      byUrl.set(s.url, s.title)
    }
  })

  it('every internal link the app builds resolves to a real page', () => {
    for (const a of catalog) {
      const r = parseRoute(hrefFor.aircraft(a.id))
      expect(r.name === 'aircraft' && aircraftById[r.id], a.id).toBeTruthy()
      expect(parseRoute(hrefFor.compare(a.id)).name).toBe('compare')
    }
    expect(parseRoute(hrefFor.hangar()).name).toBe('hangar')
    expect(parseRoute(hrefFor.making()).name).toBe('making')
  })

  it('every suggested pairing names real jets', () => {
    for (const s of SUGGESTIONS) {
      expect(readCompareLink(s.ids).unknown, s.label).toEqual([])
      expect(parseCompareIds(s.ids).length, s.label).toBe(s.ids.split(',').length)
    }
  })

  it('reports compare ids it had to drop', () => {
    expect(readCompareLink('f-16,nope,,nope,su-57').unknown).toEqual(['nope'])
    expect(readCompareLink('').unknown).toEqual([])
    // Inherited object keys are not jets.
    expect(readCompareLink('constructor,tostring').unknown).toEqual(['constructor', 'tostring'])
    expect(readCompareLink('constructor').slots).toEqual([])
    expect(readCompareLink('f-16,mig-29,su-57,f-22').overflow).toEqual(['f-22'])
    expect(readCompareLink('f-16,f-16,su-57').overflow).toEqual([])
  })

  it('every local asset index.html references exists', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8')
    for (const [, ref] of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
      const onDisk = existsSync(join(root, 'public', ref)) || existsSync(join(root, ref))
      expect(onDisk, ref).toBe(true)
    }
  })

  it('ships no placeholder text in the UI or data', () => {
    const pattern = /\b(lorem|ipsum)\b|coming soon|next milestone/i
    const markers = /\b(TODO|FIXME|TBD|XXX)\b/
    for (const file of filesUnder(join(root, 'src')).filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith('.test.ts'))) {
      const text = readFileSync(file, 'utf8')
      expect(text, file).not.toMatch(pattern)
      expect(text, file).not.toMatch(markers)
    }
  })
})
