// The keyboard map, phase-aware. `technical-design.md` names Space, arrows and
// P; the owner approved the fuller map: digits 1-4 toggle a team's score on the
// reveal, E extends and S skips on the question phase. Someone is driving this
// from a sofa, possibly with a remote pretending to be a keyboard.
//
// Visible focus and the full accessibility pass are increment 6. This hook is
// the wiring; it deliberately does nothing when focus is in a text input, so
// typing a team name at setup does not trigger game shortcuts.

import { useEffect } from 'react'

export type KeyHandlers = {
  /** Space, and ArrowRight: the primary "next thing" for the current phase. */
  onAdvance?: () => void
  /** ArrowLeft: go back where it is safe. Never bound to un-reveal an answer. */
  onBack?: () => void
  /** P: pause or resume the countdown (question phase only). */
  onTogglePause?: () => void
  /** E: extend the countdown (question phase only). */
  onExtend?: () => void
  /** S: skip to the reveal without scoring (question phase only). */
  onSkip?: () => void
  /** Digits 1-4: toggle the score for team n on the reveal. One-based. */
  onScoreTeam?: (index: number) => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function useKeyboard(handlers: KeyHandlers): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (isTypingTarget(event.target)) {
        return
      }
      switch (event.key) {
        case ' ':
        case 'ArrowRight':
          if (handlers.onAdvance) {
            event.preventDefault()
            handlers.onAdvance()
          }
          return
        case 'ArrowLeft':
          if (handlers.onBack) {
            event.preventDefault()
            handlers.onBack()
          }
          return
        case 'p':
        case 'P':
          if (handlers.onTogglePause) {
            event.preventDefault()
            handlers.onTogglePause()
          }
          return
        case 'e':
        case 'E':
          if (handlers.onExtend) {
            event.preventDefault()
            handlers.onExtend()
          }
          return
        case 's':
        case 'S':
          if (handlers.onSkip) {
            event.preventDefault()
            handlers.onSkip()
          }
          return
        default:
          // 1-4 only: at most four teams (MAX_TEAMS). The handler also guards an
          // index with no team, so a fifth digit would be inert anyway, but
          // matching the real range keeps intent clear.
          if (/^[1-4]$/.test(event.key) && handlers.onScoreTeam) {
            event.preventDefault()
            handlers.onScoreTeam(Number(event.key))
          }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handlers])
}
