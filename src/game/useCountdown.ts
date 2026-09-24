// A pausable countdown. The pause is not a nicety: `technical-design.md` reads
// WCAG 2.2.2 (Pause Stop Hide) as applying here precisely because this timer
// enforces nothing, so the "essential" exception cannot be claimed. Pause is one
// state flag.
//
// The timer also enforces nothing by design (`design.md` §4): it counts down and
// stops at zero. Nothing in the game reads "time is up" as a signal. It is
// visible information for the room, and that is all.

import { useCallback, useEffect, useRef, useState } from 'react'

export type Countdown = {
  /** Whole seconds remaining, never below zero. */
  remaining: number
  running: boolean
  pause: () => void
  resume: () => void
  /** Add seconds back on, for the driver's extend control. */
  extend: (seconds: number) => void
  /** Restart at a given length, used when a new question is shown. */
  reset: (seconds: number) => void
}

export function useCountdown(initialSeconds: number): Countdown {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const clear = useCallback(() => {
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [])

  useEffect(() => {
    if (!running) {
      clear()
      return
    }
    if (remaining <= 0) {
      clear()
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining((value) => (value <= 0 ? 0 : value - 1))
    }, 1000)
    return clear
  }, [running, remaining, clear])

  const pause = useCallback(() => setRunning(false), [])
  const resume = useCallback(() => setRunning(true), [])

  const extend = useCallback((seconds: number) => {
    setRemaining((value) => value + seconds)
  }, [])

  const reset = useCallback((seconds: number) => {
    setRemaining(seconds)
    setRunning(true)
  }, [])

  return { remaining, running, pause, resume, extend, reset }
}
