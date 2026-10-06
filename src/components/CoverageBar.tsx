import type { Aircraft } from '../data'
import { factEntries } from '../data/coverage'

/** One tick per specification field, showing how certain each value is. */
export function CoverageBar({ aircraft }: { aircraft: Aircraft }) {
  const facts = factEntries(aircraft)
  const counts = { documented: 0, uncertain: 0, unknown: 0 }
  for (const [, f] of facts) {
    if (f.status === 'documented') counts.documented++
    else if (f.status === 'unknown') counts.unknown++
    else counts.uncertain++
  }
  const label = `${counts.documented} documented, ${counts.uncertain} disputed or estimated, ${counts.unknown} not published, of ${facts.length} fields`

  return (
    <div className="coverage" role="img" aria-label={label} title={label}>
      {facts.map(([field, f]) => (
        <span
          key={field}
          className={`tick tick--${f.status === 'estimated' ? 'disputed' : f.status}`}
        />
      ))}
    </div>
  )
}
