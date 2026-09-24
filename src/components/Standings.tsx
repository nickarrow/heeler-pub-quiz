// Standings, shown at each round break and on the final podium. Derives totals
// through `standings()`, which is the only path to a total in the whole app, so
// a voided question (increment 5) drops out here for free.

import type { ReactElement } from 'react'
import { standings, type GameState } from '../game/state.ts'

export function Standings({
  state,
  voidedQuestionIds,
}: {
  state: GameState
  voidedQuestionIds?: ReadonlySet<string>
}): ReactElement {
  const table = standings(state, voidedQuestionIds)

  return (
    <ol className="flex flex-col gap-2" aria-label="Standings">
      {table.map((row, index) => (
        <li
          key={row.team.id}
          className="flex items-center justify-between gap-4 rounded border border-neutral-300 px-4 py-3"
        >
          <span className="flex items-center gap-3">
            <span className="w-6 text-neutral-500">{index + 1}</span>
            <span className="font-medium">{row.team.name}</span>
          </span>
          <span aria-label={`${row.team.name} total ${row.total}`} className="font-semibold">
            {row.total}
          </span>
        </li>
      ))}
    </ol>
  )
}
