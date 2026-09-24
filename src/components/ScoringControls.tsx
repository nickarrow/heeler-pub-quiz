// The scoring interaction on the reveal screen, one control per team. The shape
// of the control follows the answer shape:
//   single / contested -> a toggle (got it, or not)
//   list               -> a stepper, 0..maxPoints
//
// Each control carries its team's name as its accessible name rather than a
// position (`technical-design.md`), and every tap target is at least 44 by 44
// CSS pixels (2.5.8 asks for 24; 44 is the comfortable target design.md sets for
// the most-used control). Correct/incorrect is never signalled by colour alone
// (1.4.1): the toggle also changes its text and its aria-checked state, and the
// stepper shows a number. A score change is announced through the live region in
// QuestionScreen, which is how the stepper's value change reaches assistive tech.

import type { ReactElement } from 'react'
import type { AnswerShape } from '../content/types.ts'
import { maxPointsFor } from '../game/scoring.ts'
import type { Team, TeamId } from '../game/state.ts'
import { TARGET_SIZE as TARGET } from './Button.tsx'

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
    <ul className="flex flex-col gap-3" aria-label="Score this question">
      {teams.map((team) => {
        const points = awarded[team.id] ?? 0
        return (
          <li key={team.id} className="flex items-center justify-between gap-4">
            <span className="min-w-0 break-words text-fluid-base font-semibold">{team.name}</span>
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
      className={`${TARGET} rounded-full border-[3px] px-5 py-2 text-fluid-base font-bold active:translate-y-[2px] ${
        got
          ? 'border-green-800 bg-green-100 text-green-800'
          : 'border-ink/25 bg-white text-ink'
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
      aria-valuetext={`${points} of ${max} points`}
      className="flex items-center gap-3"
    >
      <button
        type="button"
        className={`${TARGET} rounded-full border-[3px] border-ink/25 bg-white text-fluid-lg font-bold text-ink disabled:opacity-60 active:translate-y-[2px]`}
        aria-label={`Fewer points for ${team.name}`}
        onClick={() => onChange(team.id, Math.max(0, points - 1))}
        disabled={points <= 0}
      >
        -
      </button>
      <span className="w-16 text-center text-fluid-base font-bold tabular-nums">
        {points} / {max}
      </span>
      <button
        type="button"
        className={`${TARGET} rounded-full border-[3px] border-ink/25 bg-white text-fluid-lg font-bold text-ink disabled:opacity-60 active:translate-y-[2px]`}
        aria-label={`More points for ${team.name}`}
        onClick={() => onChange(team.id, Math.min(max, points + 1))}
        disabled={points >= max}
      >
        +
      </button>
    </div>
  )
}
