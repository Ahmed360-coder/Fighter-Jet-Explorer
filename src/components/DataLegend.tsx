export function DataLegend() {
  return (
    <ul className="legend" aria-label="How to read the data bars">
      <li>
        <span className="tick tick--documented" aria-hidden="true" /> Documented
      </li>
      <li>
        <span className="tick tick--disputed" aria-hidden="true" /> Disputed or estimated
      </li>
      <li>
        <span className="tick tick--unknown" aria-hidden="true" /> Not published
      </li>
    </ul>
  )
}
