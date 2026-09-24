/**
 * Shown whenever the loaded bank is the fixture bank. As of increment 1 that is
 * every build without exception; increment 8 is what makes the deploy workflow
 * the one build that loads the real bank instead.
 *
 * `content-pipeline.md` asks for a visible badge so that a screenshot or a demo
 * link is never mistaken for the real thing. It reads off the bank's own
 * declared kind rather than a build flag, so it cannot claim fixtures while
 * serving something else.
 */
export function FixtureBadge() {
  return (
    <p className="inline-block rounded border border-amber-500 bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
      Fixture questions — invented for testing, not from the show
    </p>
  )
}
