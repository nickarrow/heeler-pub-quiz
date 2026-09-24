// Persistence. Three keys are named in `technical-design.md`; increment 3 uses
// two of them (`game` and `served-rounds`), and increment 5 adds `flags`.
//
// The rule behind the whole storage-failure table: a storage problem degrades
// persistence and never interrupts play. So every read returns a value or a
// reason, and every write reports success or a reason, and nothing here throws
// into the game loop.

import type { GameState } from './state.ts'

const PREFIX = 'heeler-pub-quiz/v1'
export const GAME_KEY = `${PREFIX}/game`
export const SERVED_ROUNDS_KEY = `${PREFIX}/served-rounds`

/** Why a read did not return a stored value. `absent` is normal and not an
 * error; the other two are the degraded paths from the failure table. */
export type ReadMiss =
  | { reason: 'absent' }
  | { reason: 'unparseable' }
  | { reason: 'unavailable' }

export type ReadResult<T> = { ok: true; value: T } | ({ ok: false } & ReadMiss)

/** Whether writes are landing. `unavailable` covers private browsing and
 * disabled storage; `quota` covers a rejected write. Both mean the same thing to
 * the player: the evening lives in memory and a refresh loses it. */
export type WriteResult =
  | { ok: true }
  | { ok: false; reason: 'unavailable' | 'quota' }

/** localStorage may be absent (SSR, or a locked-down browser) or throw on mere
 * access in some privacy modes, so even getting the object is guarded. */
function storage(): Storage | undefined {
  try {
    return globalThis.localStorage ?? undefined
  } catch {
    return undefined
  }
}

function readJson<T>(key: string): ReadResult<T> {
  const store = storage()
  if (store === undefined) {
    return { ok: false, reason: 'unavailable' }
  }
  let raw: string | null
  try {
    raw = store.getItem(key)
  } catch {
    return { ok: false, reason: 'unavailable' }
  }
  if (raw === null) {
    return { ok: false, reason: 'absent' }
  }
  try {
    return { ok: true, value: JSON.parse(raw) as T }
  } catch {
    // Discard that key, carry on. The caller decides whether to announce it.
    return { ok: false, reason: 'unparseable' }
  }
}

function writeJson(key: string, value: unknown): WriteResult {
  const store = storage()
  if (store === undefined) {
    return { ok: false, reason: 'unavailable' }
  }
  try {
    store.setItem(key, JSON.stringify(value))
    return { ok: true }
  } catch (error) {
    // A quota rejection is a DOMException named QuotaExceededError (or the older
    // Firefox name). Anything else is treated as unavailable. Either way, never
    // lose a game in progress to a failed write.
    const quota =
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    return { ok: false, reason: quota ? 'quota' : 'unavailable' }
  }
}

export function loadGame(): ReadResult<GameState> {
  return readJson<GameState>(GAME_KEY)
}

export function saveGame(state: GameState): WriteResult {
  return writeJson(GAME_KEY, state)
}

export function clearGame(): void {
  const store = storage()
  if (store === undefined) {
    return
  }
  try {
    store.removeItem(GAME_KEY)
  } catch {
    // Nothing to do; a failed clear is harmless and must not interrupt play.
  }
}

export function loadServedRounds(): ReadResult<string[]> {
  return readJson<string[]>(SERVED_ROUNDS_KEY)
}

export function saveServedRounds(roundIds: string[]): WriteResult {
  return writeJson(SERVED_ROUNDS_KEY, roundIds)
}
