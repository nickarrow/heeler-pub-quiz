import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './useCountdown.ts'

// The countdown is load-bearing for a WCAG claim (2.2.2, pausable) and it is the
// one piece with a real interval, so it gets fake timers rather than trust. The
// review found it untested; this closes that.

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

function advance(seconds: number): void {
  act(() => {
    vi.advanceTimersByTime(seconds * 1000)
  })
}

describe('useCountdown', () => {
  it('counts down one second at a time', () => {
    const { result } = renderHook(() => useCountdown(10))
    expect(result.current.remaining).toBe(10)
    advance(3)
    expect(result.current.remaining).toBe(7)
  })

  it('stops at zero and never goes negative', () => {
    const { result } = renderHook(() => useCountdown(2))
    advance(5)
    expect(result.current.remaining).toBe(0)
  })

  it('pause holds the value; resume continues', () => {
    const { result } = renderHook(() => useCountdown(10))
    advance(2)
    expect(result.current.remaining).toBe(8)
    act(() => result.current.pause())
    advance(5)
    // Paused: no ticks consumed.
    expect(result.current.remaining).toBe(8)
    expect(result.current.running).toBe(false)
    act(() => result.current.resume())
    advance(3)
    expect(result.current.remaining).toBe(5)
  })

  it('extend adds seconds back on', () => {
    const { result } = renderHook(() => useCountdown(10))
    advance(4)
    expect(result.current.remaining).toBe(6)
    act(() => result.current.extend(15))
    expect(result.current.remaining).toBe(21)
  })

  it('reset restarts at a new length and runs', () => {
    const { result } = renderHook(() => useCountdown(10))
    advance(4)
    act(() => result.current.pause())
    act(() => result.current.reset(30))
    expect(result.current.remaining).toBe(30)
    expect(result.current.running).toBe(true)
    advance(2)
    expect(result.current.remaining).toBe(28)
  })
})
