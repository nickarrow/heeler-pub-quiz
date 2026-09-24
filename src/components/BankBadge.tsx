import type { ReactElement } from 'react'
import type { BankKind } from '../content/types.ts'

/**
 * The on-screen badge that says which bank is loaded, so a session is never
 * mistaken for something it is not. `content-pipeline.md` asks for a visible
 * badge on the fixture bank; increment 7a adds a second, distinct one for the
 * preview bank, because a preview session shows real-quality questions and must
 * not be confused with either fixtures or the shipped game.
 *
 * It reads off the loaded bank's own declared `kind` (threaded through the game
 * state), not a build flag, so it cannot claim one thing while serving another.
 *
 * The real bank shows no badge: on the live site the real game is the real
 * thing, and there is nothing to warn anyone away from.
 */
export function BankBadge({ kind }: { kind: BankKind }): ReactElement | null {
  if (kind === 'fixtures') {
    return (
      <p className="inline-block rounded-lg border-2 border-orange-600 bg-orange-100 px-3 py-1 text-fluid-sm font-semibold text-orange-700">
        Fixture questions — invented for testing, not from the show
      </p>
    )
  }
  if (kind === 'preview') {
    return (
      <p className="inline-block rounded-lg border-2 border-blue-700 bg-blue-100 px-3 py-1 text-fluid-sm font-semibold text-blue-800">
        Preview questions — real quality, for review only, never shipped
      </p>
    )
  }
  return null
}
