// Restoring a persisted game on load, and deciding whether it is safe to trust.
// Lifted out of useGame.ts so that hook stays about wiring the reducer to React,
// and this stays about the one hard question of restore: is a parsed game
// coherent against the CURRENT bank?

import type { BankKind, Round } from '../content/types.ts'
import { initialState } from './reducer.ts'
import type { GameState } from './state.ts'
import { clearGame, loadGame } from './storage.ts'
import type { StorageNotice } from './notice.ts'

/**
 * Is a parsed game structurally coherent against the current bank? A game
 * persisted by an older build, or hand-edited, can parse cleanly yet reference
 * rounds or a cursor that no longer exist — and left unchecked that lands the UI
 * on a dead "No question available." screen with no way back, which a reload
 * only re-restores. `loadGame` guarantees the JSON parsed; this guarantees it
 * makes sense here. Anything that fails is discarded to a fresh start.
 *
 * It checks the essentials the render path dereferences, not every field: the
 * shape of teams and cursor, and that a mid-game phase's cursor resolves to a
 * real round and question in this bank. A setup-phase game needs no dealt rounds.
 *
 * It also checks the game was played on the bank now loaded. Since increment 7a
 * there are three banks a session can run against, and a game saved under one
 * must never restore under another — scores and flags belong to the bank that
 * produced them, and a preview game reappearing in a fixture session (or the
 * reverse) would be a quiet correctness bug. Disjoint round ids would catch most
 * of it, but the bank marker catches all of it and says why.
 */
export function isCoherent(game: GameState, rounds: Round[], bankKind: BankKind): boolean {
  if (game.bankKind !== bankKind) {
    return false
  }
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

/**
 * Read and validate the saved game once. An unparseable OR incoherent game is
 * discarded (the failure table's "discard that key" / "fresh start") and
 * surfaced through the notice. `loadGame` is a pure read and `clearGame` is
 * idempotent, so calling this once per lazy initialiser in the hook is harmless.
 */
export function readInitial(
  rounds: Round[],
  bankKind: GameState['bankKind'],
): { state: GameState; notice: StorageNotice } {
  const loaded = loadGame()
  if (loaded.ok) {
    if (isCoherent(loaded.value, rounds, bankKind)) {
      return { state: loaded.value, notice: null }
    }
    // Parsed but stale or malformed against this bank: discard rather than brick.
    clearGame()
    return { state: initialState(bankKind), notice: 'discarded-unparseable-game' }
  }
  if (loaded.reason === 'unparseable') {
    clearGame()
    return { state: initialState(bankKind), notice: 'discarded-unparseable-game' }
  }
  return { state: initialState(bankKind), notice: null }
}
