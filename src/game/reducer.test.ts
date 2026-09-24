import { describe, expect, it } from 'vitest'
import type { Round } from '../content/types.ts'
import { gameReducer, initialState, type GameAction } from './reducer.ts'
import type { GameState, Team } from './state.ts'

// A two-question, one-round fixture is enough to exercise every phase boundary
// without depending on the real fixture bank.
const rounds: Round[] = [
  {
    id: 'r1',
    theme: 'Test',
    title: 'Round One',
    blurb: 'Testing the reducer.',
    questions: [
      {
        id: 'q1',
        prompt: 'First?',
        tier: 1,
        answer: { kind: 'single', answer: 'A' },
        source: { episode: 'E', series: 1, episodeInSeries: 1 },
      },
      {
        id: 'q2',
        prompt: 'Second?',
        tier: 1,
        answer: { kind: 'list', answers: ['A', 'B', 'C'], maxPoints: 2 },
        source: { episode: 'E', series: 1, episodeInSeries: 2 },
      },
    ],
  },
]

const teams: Team[] = [
  { id: 'team-1', name: 'Alpha' },
  { id: 'team-2', name: 'Bravo' },
]

function run(actions: GameAction[]): GameState {
  let state = initialState('fixtures')
  for (const action of actions) {
    state = gameReducer(state, action, rounds)
  }
  return state
}

const start: GameAction = { type: 'START_GAME', teams, roundIds: ['r1'], timerLengthSeconds: 45 }

describe('phase progression', () => {
  it('starts at setup', () => {
    expect(initialState('fixtures').phase).toBe('setup')
  })

  it('setup -> round-intro on START_GAME', () => {
    expect(run([start]).phase).toBe('round-intro')
  })

  it('round-intro -> question on BEGIN_ROUND', () => {
    expect(run([start, { type: 'BEGIN_ROUND' }]).phase).toBe('question')
  })

  it('question -> reveal on REVEAL', () => {
    expect(run([start, { type: 'BEGIN_ROUND' }, { type: 'REVEAL' }]).phase).toBe('reveal')
  })

  it('reveal -> question for the next question, not round-break, mid-round', () => {
    const state = run([start, { type: 'BEGIN_ROUND' }, { type: 'REVEAL' }, { type: 'NEXT_QUESTION' }])
    expect(state.phase).toBe('question')
    expect(state.cursor.question).toBe(1)
  })

  it('reveal on the last question -> round-break', () => {
    const state = run([
      start,
      { type: 'BEGIN_ROUND' },
      { type: 'REVEAL' },
      { type: 'NEXT_QUESTION' },
      { type: 'REVEAL' },
      { type: 'NEXT_QUESTION' },
    ])
    expect(state.phase).toBe('round-break')
  })

  it('round-break on the last dealt round -> final', () => {
    const state = run([
      start,
      { type: 'BEGIN_ROUND' },
      { type: 'REVEAL' },
      { type: 'NEXT_QUESTION' },
      { type: 'REVEAL' },
      { type: 'NEXT_QUESTION' },
      { type: 'NEXT_ROUND' },
    ])
    expect(state.phase).toBe('final')
  })
})

describe('nothing auto-advances and illegal transitions are ignored', () => {
  it('ignores REVEAL from round-intro', () => {
    const state = run([start, { type: 'REVEAL' }])
    expect(state.phase).toBe('round-intro')
  })
  it('ignores NEXT_QUESTION from question phase', () => {
    const state = run([start, { type: 'BEGIN_ROUND' }, { type: 'NEXT_QUESTION' }])
    expect(state.phase).toBe('question')
  })
})

describe('scoring stores per-question results', () => {
  it('records awarded points against the current question id', () => {
    const state = run([
      start,
      { type: 'BEGIN_ROUND' },
      { type: 'REVEAL' },
      { type: 'SCORE_QUESTION', awarded: { 'team-1': 1, 'team-2': 0 } },
    ])
    expect(state.results).toEqual([{ questionId: 'q1', awarded: { 'team-1': 1, 'team-2': 0 } }])
  })

  it('overwrites a prior result for the same question rather than duplicating', () => {
    const state = run([
      start,
      { type: 'BEGIN_ROUND' },
      { type: 'REVEAL' },
      { type: 'SCORE_QUESTION', awarded: { 'team-1': 1, 'team-2': 0 } },
      { type: 'SCORE_QUESTION', awarded: { 'team-1': 0, 'team-2': 1 } },
    ])
    expect(state.results).toHaveLength(1)
    expect(state.results[0]?.awarded).toEqual({ 'team-1': 0, 'team-2': 1 })
  })

  it('clamps awarded points to the answer shape cap', () => {
    // q2 is a list with maxPoints 2; an over-range award is clamped.
    const state = run([
      start,
      { type: 'BEGIN_ROUND' },
      { type: 'REVEAL' },
      { type: 'NEXT_QUESTION' },
      { type: 'REVEAL' },
      { type: 'SCORE_QUESTION', awarded: { 'team-1': 9, 'team-2': 1 } },
    ])
    expect(state.results.find((r) => r.questionId === 'q2')?.awarded).toEqual({ 'team-1': 2, 'team-2': 1 })
  })
})

describe('reset and back', () => {
  it('RESET_TO_SETUP returns to setup and clears teams and results', () => {
    const state = run([
      start,
      { type: 'BEGIN_ROUND' },
      { type: 'REVEAL' },
      { type: 'SCORE_QUESTION', awarded: { 'team-1': 1, 'team-2': 0 } },
      { type: 'RESET_TO_SETUP' },
    ])
    expect(state.phase).toBe('setup')
    expect(state.teams).toEqual([])
    expect(state.results).toEqual([])
  })

  it('BACK_TO_INTRO returns from a question to its round intro', () => {
    const state = run([start, { type: 'BEGIN_ROUND' }, { type: 'BACK_TO_INTRO' }])
    expect(state.phase).toBe('round-intro')
  })

  it('cannot un-reveal: BACK_TO_INTRO is ignored from reveal', () => {
    const state = run([start, { type: 'BEGIN_ROUND' }, { type: 'REVEAL' }, { type: 'BACK_TO_INTRO' }])
    expect(state.phase).toBe('reveal')
  })
})
