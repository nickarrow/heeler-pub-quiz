// The scoring interaction on the reveal screen, one control per team. The shape
// of the control follows the answer shape:
//   single / contested -> a toggle (got it, or not)
//   list               -> a stepper, 0..maxPoints
//
// Each control carries its team's name as its accessible name rather than a
// position (`technical-design.md`). The full spin-control announcement and the
// 44x44 target work land in increment 6; the shapes are correct here so that
// increment adds attributes rather than rebuilding.

import type { ReactElement } from 'react'
import type { AnswerShape } from '../content/types.ts'
import { maxPointsFor } from '../game/scoring.ts'
import type { Team, TeamId } from '../game/state.ts'

export function ScoringControls({
  answer,
  teams,
  awarded,
  onChange,
}: {
  answer: AnswerShape
  teams: Team[]
  awarded: Record<TeamId, number>
  onChange: (teamId: TeamId, points: number) => void
}): ReactElement {
  const max = maxPointsFor(answer)
  const isList = answer.kind === 'list'

  return (
    <ul className="flex flex-col gap-2" aria-label="Score this question">
      {teams.map((team) => {
        const points = awarded[team.id] ?? 0
        return (
          <li key={team.id} className="flex items-center justify-between gap-4">
            <span className="font-medium">{team.name}</span>
            {isList ? (
              <ListStepper team={team} points={points} max={max} onChange={onChange} />
            ) : (
              <ToggleScore team={team} got={points > 0} onChange={onChange} />
            )}
          </li>
        )
      })}
    </ul>
  )
}

function ToggleScore({
  team,
  got,
  onChange,
}: {
  team: Team
  got: boolean
  onChange: (teamId: TeamId, points: number) => void
}): ReactElement {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={got}
      aria-label={`${team.name} scored`}
      className={`rounded border px-4 py-2 font-medium ${
        got ? 'border-green-700 bg-green-100 text-green-900' : 'border-neutral-400'
      }`}
      onClick={() => onChange(team.id, got ? 0 : 1)}
    >
      {got ? 'Got it (1)' : 'No point'}
    </button>
  )
}

function ListStepper({
  team,
  points,
  max,
  onChange,
}: {
  team: Team
  points: number
  max: number
  onChange: (teamId: TeamId, points: number) => void
}): ReactElement {
  return (
    <div
      role="spinbutton"
      aria-label={`${team.name} points`}
      aria-valuenow={points}
      aria-valuemin={0}
      aria-valuemax={max}
      className="flex items-center gap-2"
    >
      <button
        type="button"
        className="rounded border border-neutral-400 px-3 py-2"
        aria-label={`Fewer points for ${team.name}`}
        onClick={() => onChange(team.id, Math.max(0, points - 1))}
        disabled={points <= 0}
      >
        -
      </button>
      <span className="w-12 text-center font-medium">
        {points} / {max}
      </span>
      <button
        type="button"
        className="rounded border border-neutral-400 px-3 py-2"
        aria-label={`More points for ${team.name}`}
        onClick={() => onChange(team.id, Math.min(max, points + 1))}
        disabled={points >= max}
      >
        +
      </button>
    </div>
  )
}
