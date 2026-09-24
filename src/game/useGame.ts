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
import { dealRounds, markServed, previewRoundsPerGame, ROUNDS_PER_GAME, type Deal } from './dealing.ts'
import type { StorageNotice } from './notice.ts'
import type { GameAction } from './reducer.ts'
import { gameReducer } from './reducer.ts'
import { readInitial } from './restore.ts'
import type { GameState, Team } from './state.ts'
import { useFlags, type Flags } from './useFlags.ts'
import {
  clearGame,
  clearServedRounds,
  loadServedRounds,
  saveGame,
  saveServedRounds,
} from './storage.ts'

const bank: Bank = loadedBank

export type { StorageNotice }

/** The outcome of the last attempt to start a game: either it started, or the
 * pool was exhausted (fewer than a full game's worth of unserved rounds remain).
 * Null before any attempt this session. */
export type LastDeal = null | { ok: true } | { ok: false; unservedRemaining: number }

export type Game = {
  state: GameState
  rounds: Round[]
  dispatch: (action: GameAction) => void
  /** Deal a fresh game: choose four unserved rounds, mark them served on deal,
   * and start. If the pool cannot fill a whole game, does NOT start — sets
   * `lastDeal` to an exhausted result instead, so the UI can offer a reset. */
  startNewGame: (teams: Team[], timerLengthSeconds: number) => void
  /** Abandon the current game and return to setup, clearing the saved game. Does
   * not touch served-rounds: those rounds were dealt and stay served. */
  resetToSetup: () => void
  /** Clear the served-rounds pool so every round is dealable again. This is the
   * reset the exhaustion screen offers, and the UI puts it behind a confirmation
   * (`increments.md` §4). Also returns to setup. */
  resetServedRounds: () => void
  /** How many rounds have never been dealt, for the setup and exhaustion screens. */
  unservedRoundCount: number
  /** How many rounds a game deals from this bank: the full length for real and
   * fixtures, the whole preview bank for preview. Shown on the setup screen. */
  roundsPerGame: number
  lastDeal: LastDeal
  storageNotice: StorageNotice
  /** Dispute, void, and the derived voided-question set. See useFlags. */
  flags: Flags
}

export function useGame(): Game {
  const rounds = bank.rounds
  const flags = useFlags()
  const { clearAllFlags } = flags

  // A real or fixture game is four rounds (`design.md` §4). The preview bank is
  // the one exception: it holds fewer rounds on purpose, and the owner needs to
  // reach the questions to read them, so a preview game is as long as the
  // preview bank. This never relaxes the real game.
  const roundsPerGame =
    bank.kind === 'preview' ? previewRoundsPerGame(rounds.length) : ROUNDS_PER_GAME

  // Lazy initialisers: each runs once on first render and each calls
  // readInitial() independently. That is two reads, not one shared load, but the
  // read is deterministic given the same stored bytes and the discard it may
  // perform is idempotent, so the notice and the restored state always agree on
  // the outcome. Kept as two calls rather than a shared ref because a ref read
  // during render is its own lint and correctness hazard.
  const [notice, setNotice] = useState<StorageNotice>(() => readInitial(bank.rounds, bank.kind).notice)
  const [lastDeal, setLastDeal] = useState<LastDeal>(null)
  // The served set as React state so the setup/exhaustion screens re-render when
  // it changes. Seeded once from storage; storage stays the source of truth and
  // is written alongside every change to this.
  const [served, setServed] = useState<string[]>(() => {
    const loaded = loadServedRounds()
    return loaded.ok ? loaded.value : []
  })
  const [state, rawDispatch] = useReducer(
    (current: GameState, action: GameAction) => gameReducer(current, action, rounds),
    undefined,
    () => readInitial(bank.rounds, bank.kind).state,
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
      const deal: Deal = dealRounds(rounds, new Set(served), roundsPerGame)
      if (!deal.ok) {
        // Pool exhausted: do not start a short game. Record it so the UI can
        // offer the reset, and leave the current (setup) state untouched.
        setLastDeal({ ok: false, unservedRemaining: deal.unservedRemaining })
        return
      }
      // Mark served ON DEAL, before the game starts, so an abandoned evening does
      // not put half-seen rounds back in the pool.
      const merged = markServed(served, deal.roundIds)
      setServed(merged)
      const writeResult = saveServedRounds(merged)
      if (!writeResult.ok) {
        setNotice('in-memory-only')
      }
      setLastDeal({ ok: true })
      rawDispatch({ type: 'START_GAME', teams, roundIds: deal.roundIds, timerLengthSeconds })
    },
    [rounds, served, roundsPerGame],
  )

  const resetToSetup = useCallback(() => {
    clearGame()
    setLastDeal(null)
    rawDispatch({ type: 'RESET_TO_SETUP' })
  }, [])

  const resetServedRounds = useCallback(() => {
    clearServedRounds()
    setServed([])
    clearGame()
    setLastDeal(null)
    // A full reset starts the whole evening over, so the flags from the spent
    // pool go too. Abandoning a single game (resetToSetup) keeps them, because
    // the disputes from that game still matter to the review.
    clearAllFlags()
    rawDispatch({ type: 'RESET_TO_SETUP' })
    // Depend on the stable clearAllFlags callback, not the whole `flags` object,
    // which is a fresh literal every render and would defeat the useCallback.
  }, [clearAllFlags])

  const unservedRoundCount = rounds.filter((round) => !served.includes(round.id)).length

  // A failed flags write is the same class of degradation as a failed game or
  // served write, and it matters more than tidiness: voids affect scoring, so a
  // player whose flags are not persisting should be told a refresh will lose
  // them. Fold it into the one storage notice rather than leaving it silent. A
  // 'discarded-unparseable-game' notice is more specific, so it wins.
  const storageNotice: StorageNotice =
    notice ?? (flags.degraded ? 'in-memory-only' : null)

  return {
    state,
    rounds,
    dispatch: rawDispatch,
    startNewGame,
    resetToSetup,
    resetServedRounds,
    unservedRoundCount,
    roundsPerGame,
    lastDeal,
    storageNotice,
    flags,
  }
}
