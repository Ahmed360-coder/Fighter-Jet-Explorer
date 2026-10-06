import { useId, useState } from 'react'
import {
  DEFAULT_QUERY,
  GENERATION_LABEL,
  GROUPS,
  ROLE_LABEL,
  SORTS,
  activeFilterCount,
  type Facets,
  type Query,
} from '../catalog/query'
import type { Generation } from '../data'

interface Props {
  query: Query
  onChange: (q: Query) => void
  facets: Facets
  shown: number
  total: number
}

export function CatalogControls({ query, onChange, facets, shown, total }: Props) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const filters = activeFilterCount(query)
  const panelFilters = filters - (query.text.trim() ? 1 : 0)
  const set = <K extends keyof Query>(key: K, value: Query[K]) => onChange({ ...query, [key]: value })
  const clear = () => onChange({ ...DEFAULT_QUERY, sort: query.sort, group: query.group })

  return (
    <form className="controls" role="search" aria-label="Search and filter the hangar" onSubmit={(e) => e.preventDefault()}>
      <div className="controls__top">
        <label className="search">
          <span className="sr-only">Search aircraft</span>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="m13 13 4.5 4.5" />
          </svg>
          <input
            type="search"
            value={query.text}
            onChange={(e) => set('text', e.target.value)}
            placeholder="Search by name, maker, country or role"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <button
          type="button"
          className="controls__toggle"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
        >
          Filters{panelFilters > 0 && ` (${panelFilters})`}
        </button>
      </div>

      <div id={`${id}-panel`} className="controls__panel" data-open={open}>
        <Select label="Sort" value={query.sort} onChange={(v) => set('sort', v as Query['sort'])}>
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </Select>
        <Select label="Group by" value={query.group} onChange={(v) => set('group', v as Query['group'])}>
          {GROUPS.map((g) => (
            <option key={g.id} value={g.id}>{g.label}</option>
          ))}
        </Select>
        <Select label="Era" value={query.era} onChange={(v) => set('era', v as Query['era'])}>
          <option value="">All eras</option>
          {facets.eras.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label} ({e.to === 9999 ? `${e.from}+` : `${e.from}–${e.to}`})
            </option>
          ))}
        </Select>
        <Select label="Country" value={query.country} onChange={(v) => set('country', v)}>
          <option value="">All countries</option>
          {facets.countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select label="Manufacturer" value={query.manufacturer} onChange={(v) => set('manufacturer', v)}>
          <option value="">All manufacturers</option>
          {facets.manufacturers.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </Select>
        <Select label="Role" value={query.role} onChange={(v) => set('role', v as Query['role'])}>
          <option value="">All roles</option>
          {facets.roles.map((r) => (
            <option key={r} value={r}>{ROLE_LABEL[r]}</option>
          ))}
        </Select>
        <Select
          label="Generation"
          value={String(query.generation)}
          onChange={(v) => set('generation', v === '' ? '' : (Number(v) as Generation))}
        >
          <option value="">All generations</option>
          {facets.generations.map((g) => (
            <option key={g} value={g}>{GENERATION_LABEL[g]}</option>
          ))}
        </Select>
      </div>

      <div className="controls__status">
        <p aria-live="polite">
          Showing <strong>{shown}</strong> of {total} aircraft
        </p>
        {filters > 0 && (
          <button type="button" className="linkbutton" onClick={clear}>
            Clear search and filters
          </button>
        )}
      </div>
    </form>
  )
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  )
}
