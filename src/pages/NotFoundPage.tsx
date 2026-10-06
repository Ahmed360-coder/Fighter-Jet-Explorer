import { hrefFor } from '../router'

export function NotFoundPage({ what }: { what: string }) {
  return (
    <main id="main" tabIndex={-1} className="page notfound">
      <p className="eyebrow">Empty bay</p>
      <h1>Nothing parked here</h1>
      <p className="lede">We couldn’t find {what}. It may have been renamed, or the link may be mistyped.</p>
      <a className="button" href={hrefFor.hangar()}>
        Back to the hangar
      </a>
    </main>
  )
}
