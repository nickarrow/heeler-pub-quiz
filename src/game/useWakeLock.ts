// Screen wake lock, so the television does not sleep during a long discussion.
// `technical-design.md`: it needs a secure context (Pages provides one, and so
// does localhost), the lock releases whenever the document loses visibility, so
// it must be reacquired on `visibilitychange`, and it must feature-detect and
// degrade silently.
//
// This is best-effort throughout: every call is guarded, and a browser without
// the API (or one that refuses the request) simply does not keep the screen
// awake, with no error surfaced. Nothing in the game depends on it.

import { useEffect, useRef } from 'react'

// The Screen Wake Lock API is not in this project's DOM lib types, so a minimal
// local shape rather than pulling in a lib change for one feature.
type WakeLockSentinelLike = { release: () => Promise<void> }
type WakeLockLike = { request: (type: 'screen') => Promise<WakeLockSentinelLike> }

function wakeLock(): WakeLockLike | undefined {
  const nav = navigator as unknown as { wakeLock?: WakeLockLike }
  return nav.wakeLock
}

/**
 * Hold a screen wake lock while `active` is true and reacquire it whenever the
 * document becomes visible again (the lock is dropped automatically on hide).
 * Releases when `active` goes false or the component unmounts. Silent on any
 * failure.
 *
 * `active` lets the caller hold the lock only while a game is in progress rather
 * than on the setup screen, though holding it always would be harmless too.
 */
export function useWakeLock(active: boolean): void {
  const sentinelRef = useRef<WakeLockSentinelLike | undefined>(undefined)

  useEffect(() => {
    const api = wakeLock()
    // The API needs a secure context (Pages and localhost both are). A non-secure
    // context makes request('screen') reject, which the catch below would swallow
    // silently anyway, but checking explicitly makes the requirement legible and
    // avoids a pointless rejected promise.
    if (api === undefined || !active || !globalThis.isSecureContext) {
      return
    }
    let cancelled = false

    async function acquire(): Promise<void> {
      // Only request when the document is visible; requesting while hidden
      // rejects, and the visibilitychange handler will acquire on return.
      if (document.visibilityState !== 'visible') {
        return
      }
      try {
        const sentinel = await api!.request('screen')
        if (cancelled) {
          // The effect was torn down while awaiting; release immediately.
          void sentinel.release()
          return
        }
        sentinelRef.current = sentinel
      } catch {
        // Feature present but request refused (permissions, battery saver, a
        // non-secure context). Degrade silently.
      }
    }

    function onVisibilityChange(): void {
      if (document.visibilityState === 'visible') {
        void acquire()
      }
    }

    void acquire()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      const sentinel = sentinelRef.current
      sentinelRef.current = undefined
      if (sentinel !== undefined) {
        void sentinel.release()
      }
    }
  }, [active])
}
