// Wires the pure reducer to persistence and to React. Loads any saved game on
// mount, saves after every change, and surfaces a single quiet notice when
// storage is degraded so the player knows a refresh will lose the evening.
//
// `served-rounds` is marked on DEAL, not on finish (`technical-design.md`): an
// evening abandoned at round two must not put half-seen rounds back in the pool.
// Increment 3 deals exactly one round, so dealing here is trivial; increment 4
// grows `deal` into the real selection.

import { useCallback, useEffect, useReducer, useState } from 'react'
import { bank as loadedBank } from '@bank'
import type { Bank, Round } from '../content/types.ts'
import { gameReducer, initialState, type GameAction } from './reducer.ts'
import type { GameState, Team } from './state.ts'
import {
  clearGame,
  loadGame,
  loadServedRounds,
  saveGame,
  saveServedRounds,
} from './storage.ts'

const bank: Bank = loadedBank

/** A degraded-storage notice, or null when persistence is healthy. Shown once,
 * quietly; it never interrupts play. */
export type StorageNotice =
  | null
  | 'discarded-unparseable-game'
  | 'in-memory-only'

export type Game = {
  state: GameState
  rounds: Round[]
  dispatch: (action: GameAction) => void
  /** Deal a fresh game: pick rounds, mark them served, and start. Increment 3
   * deals the single fixture round. */
  startNewGame: (teams: Team[], timerLengthSeconds: number) => void
  /** Abandon the current game and return to setup, clearing the saved game. Does
   * not touch served-rounds: those rounds were dealt and stay served. */
  resetToSetup: () => void
  storageNotice: StorageNotice
}

/**
 * Is a parsed game structurally coherent against the CURRENT bank? A game
 * persisted by an older build, or hand-edited, can parse cleanly yet reference
 * rounds or a cursor that no longer exist — and left unchecked that lands the UI
 * on a dead "No question available." screen with no way back, which a reload
 * only re-restores. `loadGame` guarantees the JSON parsed; this guarantees it
 * makes sense here. Anything that fails is discarded to a fresh start, which is
 * the failure table's "treat as a fresh start" applied to a stale rather than an
 * absent key.
 *
 * It checks the essentials the render path dereferences, not every field: the
 * shape of teams and cursor, and that a mid-game phase's cursor resolves to a
 * real round and question in this bank. A setup-phase game needs no dealt rounds.
 */
function isCoherent(game: GameState, rounds: Round[]): boolean {
  if (!Array.isArray(game.teams) || !Array.isArray(game.roundIds) || !Array.isArray(game.results)) {
    return false
  }
  if (typeof game.cursor?.round !== 'number' || typeof game.cursor?.question !== 'number') {
    return false
  }
  if (game.phase === 'setup') {
    return true
  }
  // Every dealt round id must exist in the current bank.
  for (const id of game.roundIds) {
    if (!rounds.some((round) => round.id === id)) {
      return false
    }
  }
  const round = rounds.find((r) => r.id === game.roundIds[game.cursor.round])
  if (round === undefined) {
    return false
  }
  // The question cursor may sit one past the last question only in phases that
  // do not dereference it (round-break, final). In question and reveal it must
  // point at a real question.
  if (game.phase === 'question' || game.phase === 'reveal') {
    if (round.questions[game.cursor.question] === undefined) {
      return false
    }
  }
  return true
}

// Module-scope, so both lazy state initialisers below can read it without a ref
// touched during render. An unparseable OR incoherent game is discarded (the
// failure table's "discard that key" / "fresh start") and surfaced through the
// notice. Reads storage on each call; `loadGame` is a pure read and `clearGame`
// is idempotent, so being invoked once per initialiser is harmless.
function readInitial(): { state: GameState; notice: StorageNotice } {
  const loaded = loadGame()
  if (loaded.ok) {
    if (isCoherent(loaded.value, bank.rounds)) {
      return { state: loaded.value, notice: null }
    }
    // Parsed but stale or malformed against this bank: discard rather than brick.
    clearGame()
    return { state: initialState(bank.kind), notice: 'discarded-unparseable-game' }
  }
  if (loaded.reason === 'unparseable') {
    clearGame()
    return { state: initialState(bank.kind), notice: 'discarded-unparseable-game' }
  }
  return { state: initialState(bank.kind), notice: null }
}

export function useGame(): Game {
  const rounds = bank.rounds

  // Lazy initialisers: each runs once on first render and each calls
  // readInitial() independently. That is two reads, not one shared load, but the
  // read is deterministic given the same stored bytes and the discard it may
  // perform is idempotent, so the notice and the restored state always agree on
  // the outcome. Kept as two calls rather than a shared ref because a ref read
  // during render is its own lint and correctness hazard.
  const [notice, setNotice] = useState<StorageNotice>(() => readInitial().notice)
  const [state, rawDispatch] = useReducer(
    (current: GameState, action: GameAction) => gameReducer(current, action, rounds),
    undefined,
    () => readInitial().state,
  )

  // Persist after every change. A failed write degrades to an in-memory notice
  // rather than losing the game. The write is the effect's whole reason to
  // exist (synchronising with localStorage, which is the rule's own stated
  // exception); the setState only fires on a rare, terminal write failure, so
  // the cascading-render concern the rule guards against does not apply.
  useEffect(() => {
    const result = saveGame(state)
    if (!result.ok) {
      // eslint-disable-next-line react/set-state-in-effect -- see comment above: this synchronises with localStorage and only fires on a terminal write failure
      setNotice('in-memory-only')
    }
  }, [state])

  const startNewGame = useCallback(
    (teams: Team[], timerLengthSeconds: number) => {
      // Increment 3: one round, dealt and marked served on deal. Increment 4
      // replaces this with selection over unserved rounds.
      const dealt = rounds.slice(0, 1).map((round) => round.id)
      const served = loadServedRounds()
      const already = served.ok ? served.value : []
      const merged = Array.from(new Set([...already, ...dealt]))
      const writeResult = saveServedRounds(merged)
      if (!writeResult.ok) {
        setNotice('in-memory-only')
      }
      rawDispatch({ type: 'START_GAME', teams, roundIds: dealt, timerLengthSeconds })
    },
    [rounds],
  )

  const resetToSetup = useCallback(() => {
    clearGame()
    rawDispatch({ type: 'RESET_TO_SETUP' })
  }, [])

  return {
    state,
    rounds,
    dispatch: rawDispatch,
    startNewGame,
    resetToSetup,
    storageNotice: notice,
  }
}
