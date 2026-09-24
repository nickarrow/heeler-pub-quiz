import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  GAME_KEY,
  loadGame,
  loadServedRounds,
  saveGame,
  saveServedRounds,
  SERVED_ROUNDS_KEY,
} from './storage.ts'
import { initialState } from './reducer.ts'

// Every row of the storage-failure table from `technical-design.md`. The rule
// under all four: a storage problem degrades persistence and never throws into
// the game loop, so each of these returns a result object rather than raising.

beforeEach(() => {
  localStorage.clear()
})
afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('the game key round-trips', () => {
  it('saves and loads a game', () => {
    const state = initialState('fixtures')
    expect(saveGame(state).ok).toBe(true)
    const loaded = loadGame()
    expect(loaded.ok).toBe(true)
    if (loaded.ok) {
      expect(loaded.value.bankKind).toBe('fixtures')
    }
  })
})

describe('storage-failure table', () => {
  it('absent key reads as a fresh start, not an error', () => {
    const loaded = loadGame()
    expect(loaded).toEqual({ ok: false, reason: 'absent' })
  })

  it('unparseable value is discarded with a reason', () => {
    localStorage.setItem(GAME_KEY, '{not json')
    const loaded = loadGame()
    expect(loaded).toEqual({ ok: false, reason: 'unparseable' })
  })

  it('a quota rejection on write reports quota, not a throw', () => {
    const spy = vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    const result = saveGame(initialState('fixtures'))
    expect(result).toEqual({ ok: false, reason: 'quota' })
    spy.mockRestore()
  })

  it('a non-quota write error reports unavailable', () => {
    const spy = vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('nope')
    })
    const result = saveGame(initialState('fixtures'))
    expect(result).toEqual({ ok: false, reason: 'unavailable' })
    spy.mockRestore()
  })

  it('a read that throws reports unavailable', () => {
    const spy = vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const loaded = loadGame()
    expect(loaded).toEqual({ ok: false, reason: 'unavailable' })
    spy.mockRestore()
  })
})

describe('served-rounds key', () => {
  it('round-trips a list of round ids', () => {
    expect(saveServedRounds(['a', 'b']).ok).toBe(true)
    const loaded = loadServedRounds()
    expect(loaded.ok).toBe(true)
    if (loaded.ok) {
      expect(loaded.value).toEqual(['a', 'b'])
    }
  })

  it('is absent before anything is dealt', () => {
    expect(loadServedRounds()).toEqual({ ok: false, reason: 'absent' })
    expect(localStorage.getItem(SERVED_ROUNDS_KEY)).toBeNull()
  })

  // Valid JSON of the wrong shape must be rejected, not trusted. Left unchecked,
  // a stored object or null reaches `served.includes(...)` in the hook and throws
  // on every render, bricking the app the way an incoherent game key would.
  it('rejects a stored value that is not an array of strings', () => {
    for (const bad of ['{}', 'null', '42', '"fixture-1"', '[1,2,3]', '["a",2]']) {
      localStorage.setItem(SERVED_ROUNDS_KEY, bad)
      expect(loadServedRounds()).toEqual({ ok: false, reason: 'unparseable' })
    }
  })

  it('accepts a well-formed array of round ids', () => {
    localStorage.setItem(SERVED_ROUNDS_KEY, JSON.stringify(['fixture-1', 'fixture-2']))
    const loaded = loadServedRounds()
    expect(loaded.ok).toBe(true)
    if (loaded.ok) {
      expect(loaded.value).toEqual(['fixture-1', 'fixture-2'])
    }
  })
})
