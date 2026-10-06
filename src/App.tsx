import { catalog } from './data'
import { DataLegend } from './components/DataLegend'
import { ManifestRow } from './components/ManifestRow'

export default function App() {
  const newest = catalog[0]
  const oldest = catalog[catalog.length - 1]

  return (
    <div className="page">
      <header className="masthead">
        <p className="eyebrow">Fighter Jet Explorer · Hangar manifest</p>
        <h1>
          {catalog.length} fighters, <span className="nowrap">newest to oldest</span>
        </h1>
        <p className="lede">
          From the {newest.shortName} back to the {oldest.shortName}. Every record names the
          variant its figures describe, lists its sources, and says plainly when a number is disputed or unknown.
        </p>
        <DataLegend />
      </header>

      <main>
        <ol className="manifest" aria-label="Aircraft, newest to oldest">
          {catalog.map((a, i) => (
            <ManifestRow key={a.id} aircraft={a} bay={i + 1} />
          ))}
        </ol>
      </main>

      <footer className="colophon">
        <p>
          Figures marked <span className="live-mark" aria-hidden="true">◆</span>
          <span className="sr-only">with a diamond</span> were re-checked against a live source on 6 October 2026. The rest come from
          the cited references and were not re-checked during this build; treat them as reference figures, not verified
          ones. This catalog is a selection, not a complete list of fighter aircraft.
        </p>
      </footer>
    </div>
  )
}
