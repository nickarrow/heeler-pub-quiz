// The game state shape and the pure functions over it. No React here on
// purpose: dealing, scoring and totals are logic that needs no browser, so they
// live where Vitest can reach them directly. `technical-design.md` names these
// as separate test groups.
//
// The load-bearing constraint, stated in `technical-design.md` and paid for
// twice if got wrong: scoring stores PER-QUESTION results and DERIVES totals. It
// does not accumulate a running per-team number. Increment 5 voids a question
// after the fact, and a running total cannot retroactively drop one. So
// `teamTotals` below takes the set of voided ids as input and is the only way
// totals are ever computed.

import type { BankKind, Question, Round } from '../content/types.ts'

/** A team's stable id, assigned at setup. Separate from the display name so a
 * rename or a duplicate name cannot corrupt scoring, and so increment 6 has a
 * stable handle for each scoring control's accessible name. */
export type TeamId = string

export type Team = { id: TeamId; name: string }

/** The six phases from `design.md` §4, in order. */
export type Phase = 'setup' | 'round-intro' | 'question' | 'reveal' | 'round-break' | 'final'

/** One scored question. `awarded` holds the points each team earned on this
 * question, already resolved from whatever answer shape it was. A list-with-cap
 * and a contested question both reduce to an integer per team here, so totals
 * and void stay uniform across shapes. */
export type QuestionResult = {
  questionId: string
  awarded: Record<TeamId, number>
}

export type GameState = {
  /** Which bank produced this game. Reads from the loaded bank's own `kind`, so
   * it cannot claim fixtures while serving real questions. Increment 5's flag
   * export uses the same marker to keep fixture-era disputes — and, since 7a,
   * preview disputes — out of the real error-rate sample. */
  bankKind: BankKind
  teams: Team[]
  /** The dealt rounds, in order. Increment 3 deals one; increment 4 deals four. */
  roundIds: string[]
  phase: Phase
  /** Where we are: which dealt round, and which question within it. */
  cursor: { round: number; question: number }
  /** One entry per scored question. Totals derive by summing; nothing here is a
   * running total. */
  results: QuestionResult[]
  timerLengthSeconds: number
}

export const DEFAULT_TIMER_SECONDS = 45
/** The setup screen and the reducer both clamp the timer to this range. Five
 * seconds is a floor that still lets a fast group move; ten minutes is a ceiling
 * past which the countdown stops being a countdown. Named here, not left as
 * literals in the setup form, so the reducer can enforce the same bounds a
 * restored game must obey. */
export const MIN_TIMER_SECONDS = 5
export const MAX_TIMER_SECONDS = 600

/** Teams need names, two to four of them. Empty names are rejected at setup. */
export const MIN_TEAMS = 2
export const MAX_TEAMS = 4

/**
 * A team id that is unique without depending on a module-level counter. The
 * first version used an incrementing counter, but that counter reset to zero on
 * every page load while the ids it had minted lived on inside the persisted
 * game — so a reload followed by a new game could mint an id that collided with
 * one already sitting in a restored game's results. The whole point of a team id
 * being separate from its name is that it is stable and cannot be confused with
 * another team's, and a counter outside the persistence boundary broke that.
 *
 * `crypto.randomUUID` is available in every secure context (Pages is one) and in
 * happy-dom; the fallback keeps a non-secure or old environment working rather
 * than throwing during setup.
 */
export function nextTeamId(): TeamId {
  const uuid = globalThis.crypto?.randomUUID?.()
  if (uuid !== undefined) {
    return `team-${uuid}`
  }
  return `team-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Clamp a raw points value to 0..max, flooring fractions and treating a
 * non-finite value as zero. The single home for this rule: the reducer's write
 * path and the scoring UI both call it, so a restored or fat-fingered value
 * cannot poison a total with NaN or an out-of-range number. */
export function clampPoints(value: number, max: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.max(0, Math.min(max, Math.floor(value)))
}

/** Clamp a timer length to the allowed range, treating a non-finite value as the
 * default. Enforced in the reducer so a restored game with a broken length
 * cannot start an interval that never terminates. */
export function clampTimerSeconds(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_TIMER_SECONDS
  }
  return Math.max(MIN_TIMER_SECONDS, Math.min(MAX_TIMER_SECONDS, Math.floor(value)))
}

/**
 * The one function that computes totals, taking the set of voided question ids
 * so a void drops a question for every team at once. Increment 3 always passes
 * an empty set; increment 5 passes the real one. Building it this way now is the
 * whole point of the scoring constraint.
 */
export function teamTotals(
  state: GameState,
  voidedQuestionIds: ReadonlySet<string> = new Set(),
): Record<TeamId, number> {
  const totals: Record<TeamId, number> = {}
  for (const team of state.teams) {
    totals[team.id] = 0
  }
  for (const result of state.results) {
    if (voidedQuestionIds.has(result.questionId)) {
      continue
    }
    for (const team of state.teams) {
      totals[team.id] += result.awarded[team.id] ?? 0
    }
  }
  return totals
}

/** Teams sorted high to low by total, for the podium and round breaks. Ties keep
 * setup order, which is stable and good enough; tiebreaks are an open question in
 * `design.md` §9 and nothing here assumes an answer. */
export function standings(
  state: GameState,
  voidedQuestionIds: ReadonlySet<string> = new Set(),
): { team: Team; total: number }[] {
  const totals = teamTotals(state, voidedQuestionIds)
  return state.teams
    .map((team) => ({ team, total: totals[team.id] ?? 0 }))
    .sort((a, b) => b.total - a.total)
}

/** The question the cursor points at, or undefined if the cursor is out of range. */
export function currentQuestion(state: GameState, rounds: Round[]): Question | undefined {
  const round = currentRound(state, rounds)
  return round?.questions[state.cursor.question]
}

/** The round the cursor points at, resolved from the dealt round ids. */
export function currentRound(state: GameState, rounds: Round[]): Round | undefined {
  const roundId = state.roundIds[state.cursor.round]
  if (roundId === undefined) {
    return undefined
  }
  return rounds.find((round) => round.id === roundId)
}
