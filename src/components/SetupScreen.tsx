// The setup phase. `design.md` §4: names two to four teams and a timer length,
// then starts. Type-scale and contrast are increment 6; this stays plain.

import { useState, type ReactElement } from 'react'
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
}: {
  onStart: (teams: Team[], timerLengthSeconds: number) => void
  lastDeal: LastDeal
  unservedRoundCount: number
  onResetServedRounds: () => void
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
      <section className="flex flex-col gap-4" aria-labelledby="exhausted-heading">
        <h2 id="exhausted-heading" className="text-2xl font-medium">
          Out of fresh rounds
        </h2>
        <p role="status" className="text-neutral-700">
          There are not enough unplayed rounds left for a full game of {ROUNDS_PER_GAME}. Only{' '}
          {unservedRoundCount} unplayed{' '}
          {unservedRoundCount === 1 ? 'round remains' : 'rounds remain'}. Rather than repeat rounds
          you have already played, you can reset and make every round available again.
        </p>
        {confirmingReset ? (
          <div className="flex items-center gap-3">
            <span>Reset so every round can be played again? This clears any game in progress.</span>
            <button
              type="button"
              className="rounded bg-blue-700 px-4 py-2 font-medium text-white"
              onClick={onResetServedRounds}
            >
              Yes, reset the rounds
            </button>
            <button
              type="button"
              className="rounded border border-neutral-400 px-4 py-2"
              onClick={() => setConfirmingReset(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="self-start rounded bg-blue-700 px-4 py-2 font-medium text-white"
            onClick={() => setConfirmingReset(true)}
          >
            Reset the rounds
          </button>
        )}
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6" aria-labelledby="setup-heading">
      <h2 id="setup-heading" className="text-2xl font-medium">
        Set up the game
      </h2>
      <p className="text-sm text-neutral-600">
        {unservedRoundCount} unplayed{' '}
        {unservedRoundCount === 1 ? 'round' : 'rounds'} available. A game plays {ROUNDS_PER_GAME}.
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          start()
        }}
      >
        <fieldset className="flex flex-col gap-3">
          <legend className="font-medium">Teams ({MIN_TEAMS} to {MAX_TEAMS})</legend>
          {names.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <label className="flex flex-1 items-center gap-2">
                <span className="w-16 text-sm text-neutral-600">Team {index + 1}</span>
                <input
                  className="flex-1 rounded border border-neutral-400 px-3 py-2"
                  type="text"
                  value={name}
                  onChange={(event) => setName(index, event.target.value)}
                  placeholder={`Team ${index + 1} name`}
                  aria-label={`Team ${index + 1} name`}
                />
              </label>
              {names.length > MIN_TEAMS ? (
                <button
                  type="button"
                  className="rounded border border-neutral-400 px-3 py-2"
                  onClick={() => removeTeam(index)}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
          {names.length < MAX_TEAMS ? (
            <button
              type="button"
              className="self-start rounded border border-neutral-400 px-3 py-2"
              onClick={addTeam}
            >
              Add a team
            </button>
          ) : null}
        </fieldset>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Timer length (seconds)</span>
          <input
            className="w-32 rounded border border-neutral-400 px-3 py-2"
            type="number"
            min={MIN_TIMER_SECONDS}
            max={MAX_TIMER_SECONDS}
            value={timer}
            onChange={(event) => setTimer(clampTimerSeconds(Number(event.target.value)))}
          />
          <span className="text-sm text-neutral-600">
            Between {MIN_TIMER_SECONDS} and {MAX_TIMER_SECONDS} seconds. The timer counts down but
            never locks anyone out.
          </span>
        </label>

        <button
          type="submit"
          className="self-start rounded bg-blue-700 px-4 py-2 font-medium text-white disabled:opacity-50"
          disabled={!canStart}
        >
          Start game
        </button>
        {!canStart ? (
          <p className="text-sm text-neutral-600">
            Enter a name for at least {MIN_TEAMS} teams. Blank names are not allowed.
          </p>
        ) : null}
      </form>
    </section>
  )
}
