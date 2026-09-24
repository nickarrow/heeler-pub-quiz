// A single quiet notice when persistence is degraded. `technical-design.md`'s
// storage-failure table: a storage problem degrades persistence and never
// interrupts play, but the player should know once that a refresh will lose the
// evening. Null when storage is healthy, which is the common case.

import type { ReactElement } from 'react'
import type { StorageNotice as Notice } from '../game/useGame.ts'

export function StorageNotice({ notice }: { notice: Notice }): ReactElement | null {
  if (notice === null) {
    return null
  }
  const message =
    notice === 'discarded-unparseable-game'
      ? 'A saved game could not be read and was discarded. Starting fresh.'
      : 'Storage is unavailable, so this evening lives in memory only. A refresh will lose it.'
  return (
    <p
      role="status"
      className="rounded-lg border-2 border-orange-600 bg-orange-50 px-3 py-2 text-fluid-sm font-semibold text-orange-700"
    >
      {message}
    </p>
  )
}
