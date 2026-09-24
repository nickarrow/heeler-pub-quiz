// The game state machine. Pure: every action maps a state to a new state, so it
// is tested without a browser. `design.md` §4 says nothing auto-advances, so
// every phase transition below is an explicit action a keypress or a click
// dispatches.
//
// The scoring constraint from state.ts is honoured here: SCORE_QUESTION writes a
// QuestionResult (per-question), and totals are never touched. Voiding lives in
// increment 5 and drops a result at derivation time, not here.

import type { Round } from '../content/types.ts'
import { maxPointsFor } from './scoring.ts'
import {
  clampPoints,
  clampTimerSeconds,
  currentQuestion,
  currentRound,
  DEFAULT_TIMER_SECONDS,
  type GameState,
  type Team,
  type TeamId,
} from './state.ts'

export type GameAction =
  /** Leave setup for the first round intro, with the chosen teams, the dealt
   * rounds, and the timer length. Dealing which rounds is the caller's job
   * (increment 4); increment 3 hands in one round id. */
  | { type: 'START_GAME'; teams: Team[]; roundIds: string[]; timerLengthSeconds: number }
  /** Round intro -> first question of that round. */
  | { type: 'BEGIN_ROUND' }
  /** Question -> reveal. */
  | { type: 'REVEAL' }
  /** Record the points each team earned on the current question, then it is safe
   * to advance. Overwrites any prior result for the same question id so a driver
   * can correct a misclick before moving on. */
  | { type: 'SCORE_QUESTION'; awarded: Record<TeamId, number> }
  /** Reveal -> next question, or -> round break if the round is done. */
  | { type: 'NEXT_QUESTION' }
  /** Round break -> next round intro, or -> final if all dealt rounds are done. */
  | { type: 'NEXT_ROUND' }
  /** Go back from a question to its round intro. Deliberately cannot un-reveal a
   * seen answer: there is no action from reveal back to question. */
  | { type: 'BACK_TO_INTRO' }
  /** Abandon the current game and return to the setup screen. Keeps the timer
   * length as a convenience; clears teams, dealt rounds and results. */
  | { type: 'RESET_TO_SETUP' }

/** The initial, pre-game state. `served-rounds` and the persisted game are
 * handled by the store; this is what a fresh reducer starts from. */
export function initialState(bankKind: GameState['bankKind']): GameState {
  return {
    bankKind,
    teams: [],
    roundIds: [],
    phase: 'setup',
    cursor: { round: 0, question: 0 },
    results: [],
    timerLengthSeconds: DEFAULT_TIMER_SECONDS,
  }
}

/** Is the cursor on the last question of its round? */
function onLastQuestionOfRound(state: GameState, rounds: Round[]): boolean {
  const round = currentRound(state, rounds)
  if (round === undefined) {
    return true
  }
  return state.cursor.question >= round.questions.length - 1
}

/** Is the cursor on the last dealt round? */
function onLastRound(state: GameState): boolean {
  return state.cursor.round >= state.roundIds.length - 1
}

/**
 * The reducer needs the dealt rounds to know where round and game boundaries
 * are, so it takes them as a second argument rather than reaching for a module
 * import. That keeps it a pure function of (state, action, rounds).
 */
export function gameReducer(state: GameState, action: GameAction, rounds: Round[]): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        teams: action.teams,
        roundIds: action.roundIds,
        phase: 'round-intro',
        cursor: { round: 0, question: 0 },
        results: [],
        // Clamp here so the length that lands in persisted state is always in
        // range, whatever the caller passed.
        timerLengthSeconds: clampTimerSeconds(action.timerLengthSeconds),
      }

    case 'BEGIN_ROUND':
      if (state.phase !== 'round-intro') {
        return state
      }
      return { ...state, phase: 'question', cursor: { ...state.cursor, question: 0 } }

    case 'REVEAL':
      if (state.phase !== 'question') {
        return state
      }
      return { ...state, phase: 'reveal' }

    case 'SCORE_QUESTION': {
      const question = currentQuestion(state, rounds)
      if (question === undefined) {
        return state
      }
      const max = maxPointsFor(question.answer)
      // Clamp every awarded value to the shape's cap through the shared helper,
      // defensively. The UI should never exceed it, but a restored game must not
      // be trusted to have obeyed, and the shared clamp guards against NaN too.
      const clamped: Record<TeamId, number> = {}
      for (const team of state.teams) {
        clamped[team.id] = clampPoints(action.awarded[team.id] ?? 0, max)
      }
      const others = state.results.filter((result) => result.questionId !== question.id)
      return { ...state, results: [...others, { questionId: question.id, awarded: clamped }] }
    }

    case 'NEXT_QUESTION':
      if (state.phase !== 'reveal') {
        return state
      }
      if (onLastQuestionOfRound(state, rounds)) {
        return { ...state, phase: 'round-break' }
      }
      return {
        ...state,
        phase: 'question',
        cursor: { ...state.cursor, question: state.cursor.question + 1 },
      }

    case 'NEXT_ROUND':
      if (state.phase !== 'round-break') {
        return state
      }
      if (onLastRound(state)) {
        return { ...state, phase: 'final' }
      }
      return {
        ...state,
        phase: 'round-intro',
        cursor: { round: state.cursor.round + 1, question: 0 },
      }

    case 'BACK_TO_INTRO':
      if (state.phase !== 'question') {
        return state
      }
      return { ...state, phase: 'round-intro' }

    case 'RESET_TO_SETUP':
      return {
        ...state,
        teams: [],
        roundIds: [],
        phase: 'setup',
        cursor: { round: 0, question: 0 },
        results: [],
      }

    default:
      return state
  }
}
