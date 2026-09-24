// The flags half of the store, kept out of useGame so each stays one concern.
// Holds the flags state, seeds it from storage, persists on change, and exposes
// dispute/void plus the derived voided-question set that scoring consumes.
//
// Persistence follows the same rules as the rest: a failed write degrades to a
// notice and never interrupts play. A malformed stored value is discarded to
// empty (validated in `loadFlags`), the lesson from the served-rounds bug.

import { useCallback, useEffect, useState } from 'react'
import {
  addDispute,
  emptyFlags,
  toggleVoid as toggleVoidPure,
  voidedQuestionIds as voidedIdsPure,
  type Flag,
  type FlagsState,
} from './flags.ts'
import { loadFlags, saveFlags, clearFlags } from './storage.ts'

export type Flags = {
  flags: Flag[]
  /** The set of currently voided question ids, for feeding scoring. */
  voidedQuestionIds: Set<string>
  /** Toggle a void on a question. Reversible; a second call un-voids. */
  toggleVoid: (questionId: string, bankKind: Flag['bankKind']) => void
  /** Record a dispute with a note. Interrupts nothing. */
  dispute: (questionId: string, bankKind: Flag['bankKind'], note: string) => void
  /** Clear all flags, for a fresh evening. */
  clearAllFlags: () => void
  /** True when a flags write failed and the flags live only in memory. */
  degraded: boolean
}

export function useFlags(): Flags {
  const [flags, setFlags] = useState<FlagsState>(() => {
    const loaded = loadFlags()
    return loaded.ok ? loaded.value : emptyFlags
  })
  const [degraded, setDegraded] = useState(false)

  useEffect(() => {
    const result = saveFlags(flags)
    if (!result.ok) {
      // eslint-disable-next-line react/set-state-in-effect -- synchronises with localStorage; fires only on a terminal write failure
      setDegraded(true)
    }
  }, [flags])

  const toggleVoid = useCallback((questionId: string, bankKind: Flag['bankKind']) => {
    setFlags((current) => toggleVoidPure(current, questionId, bankKind))
  }, [])

  const dispute = useCallback((questionId: string, bankKind: Flag['bankKind'], note: string) => {
    setFlags((current) => addDispute(current, questionId, bankKind, note))
  }, [])

  const clearAllFlags = useCallback(() => {
    clearFlags()
    setFlags(emptyFlags)
  }, [])

  return {
    flags: flags.flags,
    voidedQuestionIds: voidedIdsPure(flags),
    toggleVoid,
    dispute,
    clearAllFlags,
    degraded,
  }
}
