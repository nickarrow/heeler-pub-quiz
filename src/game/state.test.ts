import { describe, expect, it } from 'vitest'
import { DEFAULT_TIMER_SECONDS, standings, teamTotals, type GameState } from './state.ts'

// The scoring constraint made concrete: totals derive from per-question results,
// and a voided question drops for every team at once. This is the test that
// increment 5 leans on — void changes what set is passed here, not how totals
// are computed.

function gameWith(results: GameState['results']): GameState {
  return {
    bankKind: 'fixtures',
    teams: [
      { id: 'team-1', name: 'Alpha' },
      { id: 'team-2', name: 'Bravo' },
    ],
    roundIds: ['fixture-1'],
    phase: 'reveal',
    cursor: { round: 0, question: 0 },
    results,
    timerLengthSeconds: DEFAULT_TIMER_SECONDS,
  }
}

describe('teamTotals derives from per-question results', () => {
  const state = gameWith([
    { questionId: 'q1', awarded: { 'team-1': 1, 'team-2': 0 } },
    { questionId: 'q2', awarded: { 'team-1': 2, 'team-2': 1 } },
    { questionId: 'q3', awarded: { 'team-1': 0, 'team-2': 1 } },
  ])

  it('sums each team across all results', () => {
    expect(teamTotals(state)).toEqual({ 'team-1': 3, 'team-2': 2 })
  })

  it('drops a voided question for every team, not only the disputing one', () => {
    const voided = new Set(['q2'])
    expect(teamTotals(state, voided)).toEqual({ 'team-1': 1, 'team-2': 1 })
  })

  it('gives every team zero when there are no results', () => {
    expect(teamTotals(gameWith([]))).toEqual({ 'team-1': 0, 'team-2': 0 })
  })

  it('treats a missing team entry on a result as zero', () => {
    const partial = gameWith([{ questionId: 'q1', awarded: { 'team-1': 1 } }])
    expect(teamTotals(partial)).toEqual({ 'team-1': 1, 'team-2': 0 })
  })
})

describe('standings order high to low', () => {
  it('sorts by total descending and carries the team', () => {
    const state = gameWith([{ questionId: 'q1', awarded: { 'team-1': 0, 'team-2': 3 } }])
    const table = standings(state)
    expect(table[0]?.team.name).toBe('Bravo')
    expect(table[0]?.total).toBe(3)
    expect(table[1]?.team.name).toBe('Alpha')
  })

  it('reflects a void in the order', () => {
    const state = gameWith([
      { questionId: 'q1', awarded: { 'team-1': 0, 'team-2': 5 } },
      { questionId: 'q2', awarded: { 'team-1': 2, 'team-2': 0 } },
    ])
    const table = standings(state, new Set(['q1']))
    expect(table[0]?.team.name).toBe('Alpha')
  })
})
