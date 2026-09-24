import { describe, expect, it } from 'vitest'
import {
  addDispute,
  emptyFlags,
  isFlagsState,
  isVoided,
  toggleVoid,
  voidedQuestionIds,
} from './flags.ts'

const at = () => '2026-09-24T00:00:00.000Z'

describe('void is a reversible flag', () => {
  it('toggles a question into and out of the voided set', () => {
    let state = emptyFlags
    state = toggleVoid(state, 'q1', 'fixtures', at)
    expect(isVoided(state, 'q1')).toBe(true)
    expect([...voidedQuestionIds(state)]).toEqual(['q1'])

    state = toggleVoid(state, 'q1', 'fixtures', at)
    expect(isVoided(state, 'q1')).toBe(false)
    expect(voidedQuestionIds(state).size).toBe(0)
  })

  it('records the bank marker on the void flag', () => {
    const state = toggleVoid(emptyFlags, 'q1', 'real', at)
    expect(state.flags[0]?.bankKind).toBe('real')
    expect(state.flags[0]?.kind).toBe('void')
  })
})

describe('dispute accumulates without interrupting', () => {
  it('adds a dispute with a note and a bank marker', () => {
    const state = addDispute(emptyFlags, 'q2', 'fixtures', 'The answer is wrong', at)
    expect(state.flags).toHaveLength(1)
    expect(state.flags[0]).toMatchObject({
      questionId: 'q2',
      bankKind: 'fixtures',
      kind: 'dispute',
      note: 'The answer is wrong',
    })
  })

  it('keeps multiple disputes on the same question', () => {
    let state = addDispute(emptyFlags, 'q2', 'fixtures', 'first', at)
    state = addDispute(state, 'q2', 'fixtures', 'second', at)
    expect(state.flags).toHaveLength(2)
  })

  it('a dispute does not void', () => {
    const state = addDispute(emptyFlags, 'q2', 'fixtures', 'note', at)
    expect(isVoided(state, 'q2')).toBe(false)
  })
})

describe('isFlagsState rejects malformed shapes', () => {
  it('accepts a well-formed state', () => {
    expect(isFlagsState({ flags: [] })).toBe(true)
    expect(
      isFlagsState({
        flags: [{ questionId: 'q', bankKind: 'fixtures', kind: 'void', at: 'x' }],
      }),
    ).toBe(true)
  })

  it('rejects non-objects and missing flags', () => {
    expect(isFlagsState(null)).toBe(false)
    expect(isFlagsState(42)).toBe(false)
    expect(isFlagsState({})).toBe(false)
    expect(isFlagsState({ flags: 'nope' })).toBe(false)
  })

  it('rejects a flag with a bad bankKind or kind', () => {
    expect(isFlagsState({ flags: [{ questionId: 'q', bankKind: 'other', kind: 'void', at: 'x' }] })).toBe(false)
    expect(isFlagsState({ flags: [{ questionId: 'q', bankKind: 'real', kind: 'delete', at: 'x' }] })).toBe(false)
  })
})
