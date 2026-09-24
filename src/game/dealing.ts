// Dealing rounds for a new game, and the served-rounds bookkeeping around it.
// Pure functions, tested without a browser: this is the no-repeats logic that
// `technical-design.md` and `increments.md` §4 care most about.
//
// The rules:
//   - A game is four rounds (`design.md` §4: four rounds of ten). This is the
//     game length, not a configurable.
//   - Deal only rounds not already in `served-rounds`. Round-level tracking,
//     matching themed rounds (`design.md` §8 ruled out question-level).
//   - Mark served ON DEAL, not on finish, so an evening abandoned at round two
//     does not put half-seen rounds back in the pool.
//   - When fewer than four unserved rounds remain, the pool is EXHAUSTED. Do not
//     deal a short game: `design.md` §5 says a round short of ten makes scores
//     across rounds incomparable, and the same logic says a game short of four
//     rounds is not the same game. Say so and offer the reset instead of
//     silently recycling.

import type { Round } from '../content/types.ts'

/** How many rounds a single game plays. `design.md` §4. This is the length of
 * a real game and does not change; the preview bank is the one exception, and it
 * passes a smaller target explicitly (see `previewRoundsPerGame`). */
export const ROUNDS_PER_GAME = 4

/**
 * How many rounds a PREVIEW game plays: the whole preview bank, capped at the
 * normal game length. The preview bank exists for the owner to READ a handful of
 * real-quality questions (increment 7a), and it deliberately holds fewer than
 * four rounds. Refusing to deal it — the fixture/real behaviour — would leave the
 * owner unable to reach the very questions the gate asks them to read. So a
 * preview game is as long as the preview bank, no shorter-than-ten or
 * shorter-than-four concern applies, because a preview game's scores are never
 * compared to anything and never sampled.
 *
 * This does NOT relax the real game. `design.md` §5 still forbids a short real
 * game, and fixtures still play the full four. Only the preview bank passes this.
 */
export function previewRoundsPerGame(totalRounds: number): number {
  return Math.max(1, Math.min(ROUNDS_PER_GAME, totalRounds))
}

/** The result of trying to deal a game from the current pool. */
export type Deal =
  | { ok: true; roundIds: string[] }
  | { ok: false; reason: 'exhausted'; unservedRemaining: number }

/**
 * Choose the rounds for a new game from those not yet served. Deals the first
 * `roundsPerGame` unserved rounds in bank order — deterministic, which is what
 * makes the no-repeats behaviour testable and predictable. Order within the bank
 * is the author's; there is no shuffle, and `design.md` does not ask for one.
 *
 * `roundsPerGame` defaults to the real game length; the preview bank passes a
 * smaller target. Returns an exhausted result rather than a short deal when the
 * pool cannot fill a game of that length.
 */
export function dealRounds(
  rounds: Round[],
  served: ReadonlySet<string>,
  roundsPerGame: number = ROUNDS_PER_GAME,
): Deal {
  const unserved = rounds.filter((round) => !served.has(round.id))
  if (unserved.length < roundsPerGame) {
    return { ok: false, reason: 'exhausted', unservedRemaining: unserved.length }
  }
  return { ok: true, roundIds: unserved.slice(0, roundsPerGame).map((round) => round.id) }
}

/** Add newly dealt rounds to the served set, de-duplicated and order-stable. The
 * caller persists the result; this is the pure merge. */
export function markServed(served: readonly string[], dealt: readonly string[]): string[] {
  return Array.from(new Set([...served, ...dealt]))
}
