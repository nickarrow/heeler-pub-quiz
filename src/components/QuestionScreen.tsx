// The question and reveal phases. On question, the room sees the prompt, the
// round and question number, and a pausable countdown. On reveal, the answer,
// its episode, any note, the contested scoring rule where relevant, and the
// per-team scoring controls.
//
// Scoring is held as a local draft and committed with SCORE_QUESTION when the
// driver advances, so a misclick can be corrected before it lands. The draft
// seeds from any existing result for this question, so going back and forward
// does not lose a score.

import { useEffect, useMemo, useState, type ReactElement } from 'react'
import type { Question, Round } from '../content/types.ts'
import { maxPointsFor } from '../game/scoring.ts'
import { clampPoints, type Team, type TeamId } from '../game/state.ts'
import { useCountdown } from '../game/useCountdown.ts'
import { useKeyboard } from '../game/useKeyboard.ts'
import { AnswerText } from './AnswerText.tsx'
import { ScoringControls } from './ScoringControls.tsx'

const EXTEND_SECONDS = 15

export function QuestionScreen({
  round,
  roundNumber,
  question,
  questionNumber,
  questionCount,
  teams,
  revealed,
  existingAwarded,
  timerLengthSeconds,
  onReveal,
  onScoreAndNext,
  onBack,
}: {
  round: Round
  roundNumber: number
  question: Question
  questionNumber: number
  questionCount: number
  teams: Team[]
  revealed: boolean
  existingAwarded: Record<TeamId, number> | undefined
  timerLengthSeconds: number
  onReveal: () => void
  onScoreAndNext: (awarded: Record<TeamId, number>) => void
  onBack: () => void
}): ReactElement {
  const countdown = useCountdown(timerLengthSeconds)
  const [draft, setDraft] = useState<Record<TeamId, number>>(existingAwarded ?? {})

  // A new question resets the timer and the scoring draft. Keyed on the question
  // id so revisiting a scored question restores its draft rather than blanking.
  useEffect(() => {
    countdown.reset(timerLengthSeconds)
    setDraft(existingAwarded ?? {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  const max = maxPointsFor(question.answer)

  function setTeamScore(teamId: TeamId, points: number): void {
    setDraft((current) => ({ ...current, [teamId]: clampPoints(points, max) }))
  }

  function toggleTeamByIndex(oneBased: number): void {
    const team = teams[oneBased - 1]
    if (team === undefined) {
      return
    }
    // For a toggle shape, flip 0<->1. For a list, a digit press bumps by one up
    // to the cap then wraps to zero, so a remote can still reach every value.
    const current = draft[team.id] ?? 0
    const next = current >= max ? 0 : current + 1
    setTeamScore(team.id, next)
  }

  const handlers = useMemo(
    () =>
      revealed
        ? {
            onAdvance: () => onScoreAndNext(draft),
            onScoreTeam: toggleTeamByIndex,
          }
        : {
            onAdvance: onReveal,
            onBack,
            onTogglePause: () => (countdown.running ? countdown.pause() : countdown.resume()),
            onExtend: () => countdown.extend(EXTEND_SECONDS),
            onSkip: onReveal,
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [revealed, draft, countdown.running],
  )
  useKeyboard(handlers)

  return (
    <section className="flex flex-col gap-6" aria-labelledby="question-heading">
      <p className="text-sm uppercase tracking-wide text-neutral-500">
        Round {roundNumber}: {round.title} — question {questionNumber} of {questionCount}
      </p>

      <h2 id="question-heading" className="text-2xl font-medium">
        {question.prompt}
      </h2>

      {!revealed ? (
        <div className="flex items-center gap-4">
          <span aria-label={`${countdown.remaining} seconds remaining`} className="text-3xl font-semibold tabular-nums">
            {countdown.remaining}s
          </span>
          <button
            type="button"
            className="rounded border border-neutral-400 px-4 py-2"
            onClick={() => (countdown.running ? countdown.pause() : countdown.resume())}
          >
            {countdown.running ? 'Pause' : 'Resume'}
          </button>
          <button
            type="button"
            className="rounded border border-neutral-400 px-4 py-2"
            onClick={() => countdown.extend(EXTEND_SECONDS)}
          >
            Extend {EXTEND_SECONDS}s
          </button>
          <button
            type="button"
            className="rounded bg-blue-700 px-4 py-2 font-medium text-white"
            onClick={onReveal}
          >
            Reveal
          </button>
        </div>
      ) : null}

      {!revealed ? (
        // A minimal on-screen hint so the keyboard map is discoverable at all;
        // the full accessibility and keyboard treatment is increment 6.
        <p className="text-sm text-neutral-500">
          Keys: Space or right arrow reveals, P pauses, E extends, S skips.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-lg border border-neutral-300 p-4">
            <p>
              <span className="font-semibold">Answer: </span>
              <AnswerText answer={question.answer} />
            </p>
            {question.answer.kind === 'contested' ? (
              <p className="text-sm text-neutral-600">
                Scoring: {question.answer.scores === 'either' ? 'either answer scores' : 'all answers required'}
              </p>
            ) : null}
            <p className="text-sm text-neutral-600">
              {question.source.episode} (series {question.source.series}, episode{' '}
              {question.source.episodeInSeries})
            </p>
            {question.note !== undefined ? (
              <p className="text-sm italic text-neutral-600">{question.note}</p>
            ) : null}
          </div>

          <ScoringControls answer={question.answer} teams={teams} awarded={draft} onChange={setTeamScore} />

          <button
            type="button"
            className="self-start rounded bg-blue-700 px-4 py-2 font-medium text-white"
            onClick={() => onScoreAndNext(draft)}
          >
            Save scores and continue
          </button>
          <p className="text-sm text-neutral-500">
            Keys: number keys 1 to {teams.length} score each team, Space or right arrow saves and
            continues.
          </p>
        </div>
      )}
    </section>
  )
}
