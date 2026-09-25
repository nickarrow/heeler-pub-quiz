// The setup phase. `design.md` §4: names two to four teams and a timer length,
// then starts. Type-scale and contrast are increment 6; this stays plain.

import { useState, type ReactElement } from 'react'
import { Button, TARGET_SIZE } from './Button.tsx'
import { Card } from './Card.tsx'
import { ROUNDS_PER_GAME } from '../game/dealing.ts'
import {
  clampTimerSeconds,
  DEFAULT_TIMER_SECONDS,
  MAX_TEAMS,
  MAX_TIMER_SECONDS,
  MIN_TEAMS,
  MIN_TIMER_SECONDS,
  nextTeamId,
  type Team,
} from '../game/state.ts'
import type { LastDeal } from '../game/useGame.ts'

export function SetupScreen({
  onStart,
  lastDeal,
  unservedRoundCount,
  onResetServedRounds,
  roundsPerGame = ROUNDS_PER_GAME,
}: {
  onStart: (teams: Team[], timerLengthSeconds: number) => void
  lastDeal: LastDeal
  unservedRoundCount: number
  onResetServedRounds: () => void
  /** How many rounds a game deals. The real and fixture banks play the full
   * ROUNDS_PER_GAME; the preview bank plays as many rounds as it has. Defaulted
   * so the common case reads unchanged. */
  roundsPerGame?: number
}): ReactElement {
  const [names, setNames] = useState<string[]>(['', ''])
  const [timer, setTimer] = useState<number>(DEFAULT_TIMER_SECONDS)
  const [confirmingReset, setConfirmingReset] = useState(false)

  // The pool is exhausted when the last deal attempt failed for want of enough
  // unserved rounds. When that has happened, the setup form is replaced by the
  // exhaustion panel: playing on would recycle rounds, which no-repeats forbids.
  const exhausted = lastDeal !== null && lastDeal.ok === false

  const trimmed = names.map((name) => name.trim())
  const filled = trimmed.filter((name) => name.length > 0)
  const enoughTeams = filled.length >= MIN_TEAMS
  const noBlanks = trimmed.every((name) => name.length > 0)
  const canStart = enoughTeams && noBlanks

  function setName(index: number, value: string): void {
    setNames((current) => current.map((name, i) => (i === index ? value : name)))
  }

  function addTeam(): void {
    setNames((current) => (current.length >= MAX_TEAMS ? current : [...current, '']))
  }

  function removeTeam(index: number): void {
    setNames((current) => (current.length <= MIN_TEAMS ? current : current.filter((_, i) => i !== index)))
  }

  function start(): void {
    if (!canStart) {
      return
    }
    const teams: Team[] = trimmed.map((name) => ({ id: nextTeamId(), name }))
    onStart(teams, timer)
  }

  if (exhausted) {
    return (
      <Card aria-labelledby="exhausted-heading" className="flex flex-col gap-4">
        <h2 id="exhausted-heading" className="text-fluid-xl font-bold">
          Out of fresh rounds
        </h2>
        <p role="status" className="text-fluid-base">
          There are not enough unplayed rounds left for a full game of {roundsPerGame}. Only{' '}
          {unservedRoundCount} unplayed{' '}
          {unservedRoundCount === 1 ? 'round remains' : 'rounds remain'}. Rather than repeat rounds
          you have already played, you can reset and make every round available again.
        </p>
        {confirmingReset ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-fluid-base">
              Reset so every round can be played again? This clears any game in progress.
            </span>
            <Button variant="primary" onClick={onResetServedRounds}>
              Yes, reset the rounds
            </Button>
            <Button onClick={() => setConfirmingReset(false)}>Cancel</Button>
          </div>
        ) : (
          <Button variant="primary" className="self-start" onClick={() => setConfirmingReset(true)}>
            Reset the rounds
          </Button>
        )}
      </Card>
    )
  }

  return (
    <Card aria-labelledby="setup-heading" className="flex flex-col gap-6">
      <h2 id="setup-heading" className="text-fluid-xl font-bold">
        Set up the game
      </h2>
      <p className="text-fluid-sm text-ink/70">
        {unservedRoundCount} unplayed{' '}
        {unservedRoundCount === 1 ? 'round' : 'rounds'} available. A game plays {roundsPerGame}.
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          start()
        }}
      >
        <fieldset className="flex flex-col gap-3">
          <legend className="text-fluid-base font-semibold">
            Teams ({MIN_TEAMS} to {MAX_TEAMS})
          </legend>
          {names.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <label className="flex flex-1 items-center gap-2">
                <span className="w-20 text-fluid-sm text-ink/70">Team {index + 1}</span>
                <input
                  className={`${TARGET_SIZE} flex-1 rounded-2xl border-[3px] border-ink/25 bg-white px-4 py-2 text-fluid-base`}
                  type="text"
                  value={name}
                  onChange={(event) => setName(index, event.target.value)}
                  placeholder={`Team ${index + 1} name`}
                  aria-label={`Team ${index + 1} name`}
                />
              </label>
              {names.length > MIN_TEAMS ? (
                <Button onClick={() => removeTeam(index)}>Remove</Button>
              ) : null}
            </div>
          ))}
          {names.length < MAX_TEAMS ? (
            <Button className="self-start" onClick={addTeam}>
              Add a team
            </Button>
          ) : null}
        </fieldset>

        <label className="flex flex-col gap-1">
          <span className="text-fluid-base font-semibold">Timer length (seconds)</span>
          <input
            className={`${TARGET_SIZE} w-32 rounded-2xl border-[3px] border-ink/25 bg-white px-4 py-2 text-fluid-base`}
            type="number"
            min={MIN_TIMER_SECONDS}
            max={MAX_TIMER_SECONDS}
            value={timer}
            onChange={(event) => setTimer(clampTimerSeconds(Number(event.target.value)))}
          />
          <span className="text-fluid-sm text-ink/70">
            Between {MIN_TIMER_SECONDS} and {MAX_TIMER_SECONDS} seconds. The timer counts down but
            never locks anyone out.
          </span>
        </label>

        <Button variant="primary" type="submit" className="self-start" disabled={!canStart}>
          Start game
        </Button>
        {!canStart ? (
          <p className="text-fluid-sm text-ink/70">
            Pop in a name for at least {MIN_TEAMS} teams to get started. Blank names are not allowed.
          </p>
        ) : null}
      </form>
    </Card>
  )
}
