import { useState, type ReactElement } from 'react'
import { FixtureBadge } from './components/FixtureBadge.tsx'
import { FooterNotice } from './components/FooterNotice.tsx'
import { QuestionScreen } from './components/QuestionScreen.tsx'
import { ReviewScreen } from './components/ReviewScreen.tsx'
import { SetupScreen } from './components/SetupScreen.tsx'
import { Standings } from './components/Standings.tsx'
import { StorageNotice } from './components/StorageNotice.tsx'
import type { Flag } from './game/flags.ts'
import { currentQuestion, currentRound } from './game/state.ts'
import { useGame, type Game } from './game/useGame.ts'
import { useKeyboard } from './game/useKeyboard.ts'

// The whole game loop on fixtures. Six phases held in state, no router
// (`technical-design.md`), nothing auto-advancing (`design.md` §4). Increment 4
// adds dealing over unserved rounds and the exhaustion path. The bank is imported
// once through the alias inside useGame, never named here.
export default function App(): ReactElement {
  const game = useGame()

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <main className="flex flex-1 flex-col items-start gap-6 px-6 py-8">
        <h1 className="text-3xl font-semibold">Heeler Pub Quiz</h1>
        {game.state.bankKind === 'fixtures' ? <FixtureBadge /> : null}
        <StorageNotice notice={game.storageNotice} />

        <Phases game={game} />
      </main>

      <FooterNotice />
    </div>
  )
}

function Phases({ game }: { game: Game }): ReactElement {
  const { state, rounds, dispatch } = game
  const round = currentRound(state, rounds)
  const question = currentQuestion(state, rounds)

  switch (state.phase) {
    case 'setup':
      return (
        <SetupScreen
          onStart={game.startNewGame}
          lastDeal={game.lastDeal}
          unservedRoundCount={game.unservedRoundCount}
          onResetServedRounds={game.resetServedRounds}
        />
      )

    case 'round-intro':
      return (
        <RoundIntro
          title={round?.title ?? 'Round'}
          blurb={round?.blurb ?? ''}
          roundNumber={state.cursor.round + 1}
          onBegin={() => dispatch({ type: 'BEGIN_ROUND' })}
        />
      )

    case 'question':
    case 'reveal':
      if (round === undefined || question === undefined) {
        return <p>No question available.</p>
      }
      return (
        <QuestionScreen
          round={round}
          roundNumber={state.cursor.round + 1}
          question={question}
          questionNumber={state.cursor.question + 1}
          questionCount={round.questions.length}
          teams={state.teams}
          revealed={state.phase === 'reveal'}
          existingAwarded={state.results.find((r) => r.questionId === question.id)?.awarded}
          timerLengthSeconds={state.timerLengthSeconds}
          voided={game.flags.voidedQuestionIds.has(question.id)}
          onToggleVoid={() => game.flags.toggleVoid(question.id, state.bankKind)}
          onDispute={(note) => game.flags.dispute(question.id, state.bankKind, note)}
          onReveal={() => dispatch({ type: 'REVEAL' })}
          onScoreAndNext={(awarded) => {
            dispatch({ type: 'SCORE_QUESTION', awarded })
            dispatch({ type: 'NEXT_QUESTION' })
          }}
          onBack={() => dispatch({ type: 'BACK_TO_INTRO' })}
        />
      )

    case 'round-break':
      return (
        <RoundBreak
          state={state}
          roundNumber={state.cursor.round + 1}
          roundCount={state.roundIds.length}
          voidedQuestionIds={game.flags.voidedQuestionIds}
          onNext={() => dispatch({ type: 'NEXT_ROUND' })}
        />
      )

    case 'final':
      return (
        <FinalScreen
          state={state}
          flags={game.flags.flags}
          voidedQuestionIds={game.flags.voidedQuestionIds}
          onNewGame={game.resetToSetup}
        />
      )
  }
}

function RoundIntro({
  title,
  blurb,
  roundNumber,
  onBegin,
}: {
  title: string
  blurb: string
  roundNumber: number
  onBegin: () => void
}): ReactElement {
  useKeyboard({ onAdvance: onBegin })
  return (
    <section className="flex flex-col gap-4" aria-labelledby="intro-heading">
      <p className="text-sm uppercase tracking-wide text-neutral-500">Round {roundNumber}</p>
      <h2 id="intro-heading" className="text-2xl font-medium">
        {title}
      </h2>
      <p className="text-neutral-700">{blurb}</p>
      <button
        type="button"
        className="self-start rounded bg-blue-700 px-4 py-2 font-medium text-white"
        onClick={onBegin}
      >
        Begin round
      </button>
    </section>
  )
}

function RoundBreak({
  state,
  roundNumber,
  roundCount,
  voidedQuestionIds,
  onNext,
}: {
  state: Game['state']
  roundNumber: number
  roundCount: number
  voidedQuestionIds: ReadonlySet<string>
  onNext: () => void
}): ReactElement {
  useKeyboard({ onAdvance: onNext })
  const lastRound = roundNumber >= roundCount
  return (
    <section className="flex flex-col gap-4" aria-labelledby="break-heading">
      <h2 id="break-heading" className="text-2xl font-medium">
        Standings after round {roundNumber} of {roundCount}
      </h2>
      <Standings state={state} voidedQuestionIds={voidedQuestionIds} />
      <button
        type="button"
        className="self-start rounded bg-blue-700 px-4 py-2 font-medium text-white"
        onClick={onNext}
      >
        {lastRound ? 'See the final standings' : 'Continue to the next round'}
      </button>
    </section>
  )
}

function FinalScreen({
  state,
  flags,
  voidedQuestionIds,
  onNewGame,
}: {
  state: Game['state']
  flags: Flag[]
  voidedQuestionIds: ReadonlySet<string>
  onNewGame: () => void
}): ReactElement {
  const [confirming, setConfirming] = useState(false)
  const [reviewing, setReviewing] = useState(false)

  if (reviewing) {
    return <ReviewScreen flags={flags} onBack={() => setReviewing(false)} />
  }

  // Deliberately no onAdvance here: on the podium, Space used to start a new
  // game, so one stray keypress wiped the final standings with no undo. A cold
  // read caught it. New game now takes a deliberate two-step confirm instead.
  return (
    <section className="flex flex-col gap-4" aria-labelledby="final-heading">
      <h2 id="final-heading" className="text-2xl font-medium">
        Final standings
      </h2>
      <Standings state={state} voidedQuestionIds={voidedQuestionIds} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded border border-neutral-400 px-4 py-2"
          onClick={() => setReviewing(true)}
        >
          Review flagged questions{flags.length > 0 ? ` (${flags.length})` : ''}
        </button>
      </div>
      {confirming ? (
        <div className="flex items-center gap-3">
          <span>Start a new game and clear these standings?</span>
          <button
            type="button"
            className="rounded bg-blue-700 px-4 py-2 font-medium text-white"
            onClick={onNewGame}
          >
            Yes, new game
          </button>
          <button
            type="button"
            className="rounded border border-neutral-400 px-4 py-2"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="self-start rounded bg-blue-700 px-4 py-2 font-medium text-white"
          onClick={() => setConfirming(true)}
        >
          New game
        </button>
      )}
    </section>
  )
}
