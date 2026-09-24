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
          className="flex items-center justify-between gap-4 rounded-2xl border-[3px] border-ink/12 bg-white px-4 py-3"
        >
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full bg-mustard text-fluid-base font-black text-ink"
            >
              {index + 1}
            </span>
            <span className="text-fluid-lg font-semibold">{row.team.name}</span>
          </span>
          <span
            aria-label={`${row.team.name} total ${row.total}`}
            className="text-fluid-lg font-bold tabular-nums text-blue-700"
          >
            {row.total}
          </span>
        </li>
      ))}
    </ol>
  )
}
