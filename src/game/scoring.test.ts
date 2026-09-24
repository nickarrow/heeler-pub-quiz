import { describe, expect, it } from 'vitest'
import { maxPointsFor, scoreBoolean, scoreList } from './scoring.ts'

describe('maxPointsFor', () => {
  it('is one for a single answer', () => {
    expect(maxPointsFor({ kind: 'single', answer: 'x' })).toBe(1)
  })
  it('is one for a contested answer', () => {
    expect(maxPointsFor({ kind: 'contested', options: [{ answer: 'a', why: 'b' }], scores: 'either' })).toBe(1)
  })
  it('is the cap for a list answer', () => {
    expect(maxPointsFor({ kind: 'list', answers: ['a', 'b', 'c'], maxPoints: 2 })).toBe(2)
  })
})

describe('scoreList clamps to the cap', () => {
  const answer = { maxPoints: 2 }
  it('passes a value within range', () => {
    expect(scoreList(1, answer)).toBe(1)
  })
  it('caps a value above the maximum', () => {
    expect(scoreList(5, answer)).toBe(2)
  })
  it('floors a negative to zero', () => {
    expect(scoreList(-3, answer)).toBe(0)
  })
  it('truncates a fractional count', () => {
    expect(scoreList(1.9, answer)).toBe(1)
  })
  it('treats a non-finite count as zero', () => {
    expect(scoreList(Number.NaN, answer)).toBe(0)
  })
})

describe('scoreBoolean', () => {
  it('is one when the team got it', () => {
    expect(scoreBoolean(true)).toBe(1)
  })
  it('is zero otherwise', () => {
    expect(scoreBoolean(false)).toBe(0)
  })
})
