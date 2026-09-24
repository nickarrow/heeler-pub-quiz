// Flags: the error-discovery mechanism from `content-pipeline.md` §4 and
// `design.md` §4. A dispute records a question and a note without interrupting
// play; a void drops a question from scoring for every team. Both are pure data
// here; the effect on scoring happens through `voidedQuestionIds` feeding
// `teamTotals`, which was built to take that set from the very first increment.
//
// The bank marker is load-bearing and was flagged as this increment's problem by
// the increment-1 review. Every flag records which bank produced it, so the
// export can be filtered to the real bank only and fixture-era disputes from
// increments 3 to 6 never pollute increment 9's error-rate sample.

export type FlagKind = 'dispute' | 'void'

export type Flag = {
  questionId: string
  /** Which bank the flagged question came from. The export filters on this. */
  bankKind: 'fixtures' | 'real'
  kind: FlagKind
  /** A dispute carries a note; a void need not. */
  note?: string
  /** ISO timestamp, for ordering the review list and the export. */
  at: string
}

/** The whole flags store: a flat list, newest last. */
export type FlagsState = { flags: Flag[] }

export const emptyFlags: FlagsState = { flags: [] }

/** The set of question ids currently voided, for feeding `teamTotals` and
 * `standings`. A question is voided if it has any void flag; a later un-void
 * removes the void flag (see `toggleVoid`), so this reflects the current state
 * rather than the history. */
export function voidedQuestionIds(state: FlagsState): Set<string> {
  const ids = new Set<string>()
  for (const flag of state.flags) {
    if (flag.kind === 'void') {
      ids.add(flag.questionId)
    }
  }
  return ids
}

/** Is this question currently voided? */
export function isVoided(state: FlagsState, questionId: string): boolean {
  return state.flags.some((flag) => flag.kind === 'void' && flag.questionId === questionId)
}

/**
 * Toggle a void on a question. Void is non-destructive and reversible: a stored
 * result stays put, and totals derive around the void, so un-voiding simply
 * restores the question to scoring. Voiding twice is idempotent; un-voiding
 * removes the void flag.
 */
export function toggleVoid(
  state: FlagsState,
  questionId: string,
  bankKind: Flag['bankKind'],
  now: () => string = () => new Date().toISOString(),
): FlagsState {
  if (isVoided(state, questionId)) {
    return { flags: state.flags.filter((flag) => !(flag.kind === 'void' && flag.questionId === questionId)) }
  }
  return { flags: [...state.flags, { questionId, bankKind, kind: 'void', at: now() }] }
}

/**
 * Record a dispute with a note. Disputes accumulate — a question can be disputed
 * more than once across an evening, and each is its own record, because the
 * review after play reads every dispute. Interrupts nothing; the caller stays on
 * the reveal.
 */
export function addDispute(
  state: FlagsState,
  questionId: string,
  bankKind: Flag['bankKind'],
  note: string,
  now: () => string = () => new Date().toISOString(),
): FlagsState {
  return { flags: [...state.flags, { questionId, bankKind, kind: 'dispute', note, at: now() }] }
}

/** Validate a parsed value as a FlagsState. Learned from the increment-4
 * blocking bug: never trust a JSON cast from storage. A wrong shape is discarded
 * to empty rather than allowed to crash a render. */
export function isFlagsState(value: unknown): value is FlagsState {
  if (typeof value !== 'object' || value === null || !('flags' in value)) {
    return false
  }
  const flags = (value as { flags: unknown }).flags
  if (!Array.isArray(flags)) {
    return false
  }
  return flags.every((flag) => {
    if (typeof flag !== 'object' || flag === null) {
      return false
    }
    const f = flag as Record<string, unknown>
    return (
      typeof f.questionId === 'string' &&
      (f.bankKind === 'fixtures' || f.bankKind === 'real') &&
      (f.kind === 'dispute' || f.kind === 'void') &&
      (f.note === undefined || typeof f.note === 'string') &&
      typeof f.at === 'string'
    )
  })
}
