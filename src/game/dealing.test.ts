import { describe, expect, it } from 'vitest'
import type { Round } from '../content/types.ts'
import { dealRounds, markServed, ROUNDS_PER_GAME } from './dealing.ts'

// The no-repeats proof at the logic level. `increments.md` §4: three full games
// must not repeat a round, and the pool must exhaust rather than recycle. The
// browser proof is in the Playwright pass; this is the fast, deterministic one.

/** A pool of `n` trivial rounds, ids round-1..round-n. Question content does not
 * matter to dealing, so each round carries one placeholder question. */
function pool(n: number): Round[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `round-${i + 1}`,
    theme: 'Test',
    title: `Round ${i + 1}`,
    blurb: 'Testing dealing.',
    questions: [
      {
        id: `q-${i + 1}`,
        prompt: 'x?',
        tier: 1 as const,
        answer: { kind: 'single' as const, answer: 'x' },
        source: { episode: 'E', series: 1 as const, episodeInSeries: 1 },
      },
    ],
  }))
}

describe('dealRounds', () => {
  it('deals a full game of unserved rounds', () => {
    const deal = dealRounds(pool(12), new Set())
    expect(deal.ok).toBe(true)
    if (deal.ok) {
      expect(deal.roundIds).toHaveLength(ROUNDS_PER_GAME)
      expect(deal.roundIds).toEqual(['round-1', 'round-2', 'round-3', 'round-4'])
    }
  })

  it('never deals a round already served', () => {
    const served = new Set(['round-1', 'round-2', 'round-3', 'round-4'])
    const deal = dealRounds(pool(12), served)
    expect(deal.ok).toBe(true)
    if (deal.ok) {
      for (const id of deal.roundIds) {
        expect(served.has(id)).toBe(false)
      }
    }
  })

  it('reports exhaustion rather than dealing a short game', () => {
    // Twelve rounds, eight already served: only four remain, which is exactly a
    // game. Serving nine leaves three, which is not enough.
    const nineServed = new Set(pool(12).slice(0, 9).map((r) => r.id))
    const deal = dealRounds(pool(12), nineServed)
    expect(deal.ok).toBe(false)
    if (!deal.ok) {
      expect(deal.reason).toBe('exhausted')
      expect(deal.unservedRemaining).toBe(3)
    }
  })
})

describe('three games back to back never repeat a round', () => {
  it('deals twelve distinct rounds across three games, then exhausts', () => {
    const rounds = pool(12)
    let served: string[] = []
    const dealtAcrossGames: string[] = []

    for (let game = 0; game < 3; game++) {
      const deal = dealRounds(rounds, new Set(served))
      expect(deal.ok).toBe(true)
      if (deal.ok) {
        dealtAcrossGames.push(...deal.roundIds)
        served = markServed(served, deal.roundIds)
      }
    }

    // Every dealt round across the three games is distinct.
    expect(new Set(dealtAcrossGames).size).toBe(dealtAcrossGames.length)
    expect(dealtAcrossGames).toHaveLength(3 * ROUNDS_PER_GAME)
    // All twelve rounds were used exactly once.
    expect(new Set(dealtAcrossGames)).toEqual(new Set(rounds.map((r) => r.id)))

    // A fourth game cannot be dealt: the pool is spent.
    const fourth = dealRounds(rounds, new Set(served))
    expect(fourth.ok).toBe(false)
    if (!fourth.ok) {
      expect(fourth.unservedRemaining).toBe(0)
    }
  })
})

describe('markServed', () => {
  it('adds dealt rounds without duplicating', () => {
    expect(markServed(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c'])
  })
  it('is stable from an empty start', () => {
    expect(markServed([], ['x', 'y'])).toEqual(['x', 'y'])
  })
})
