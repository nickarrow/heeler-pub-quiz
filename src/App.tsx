import { useState, type ReactElement } from 'react'
import { Button } from './components/Button.tsx'
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
import { useWakeLock } from './game/useWakeLock.ts'

// The whole game loop on fixtures. Six phases held in state, no router
// (`technical-design.md`), nothing auto-advancing (`design.md` §4). Increment 4
// adds dealing over unserved rounds and the exhaustion path; increment 6 the
// room — type scale, contrast, live region, wake lock, visible focus. The bank
// is imported once through the alias inside useGame, never named here.
export default function App(): ReactElement {
  const game = useGame()
  // Keep the screen awake while a game is running, so a long discussion does not
  // let the television sleep. Held off the setup and final screens, where there
  // is nothing to keep alive. Feature-detected and silent if unavailable.
  const inGame = game.state.phase !== 'setup' && game.state.phase !== 'final'
  useWakeLock(inGame)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-start gap-6 px-6 py-8">
        <h1 className="text-fluid-lg font-bold text-blue-800">Heeler Pub Quiz</h1>
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
      <p className="text-fluid-sm font-semibold uppercase tracking-wide text-orange-700">
        Round {roundNumber}
      </p>
      <h2 id="intro-heading" className="text-fluid-xl font-bold">
        {title}
      </h2>
      <p className="text-fluid-base">{blurb}</p>
      <Button variant="primary" className="self-start" onClick={onBegin}>
        Begin round
      </Button>
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
      <h2 id="break-heading" className="text-fluid-xl font-bold">
        Standings after round {roundNumber} of {roundCount}
      </h2>
      <Standings state={state} voidedQuestionIds={voidedQuestionIds} />
      <Button variant="primary" className="self-start" onClick={onNext}>
        {lastRound ? 'See the final standings' : 'Continue to the next round'}
      </Button>
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
      <h2 id="final-heading" className="text-fluid-xl font-bold">
        Final standings
      </h2>
      <Standings state={state} voidedQuestionIds={voidedQuestionIds} />
      <div className="flex items-center gap-3">
        <Button onClick={() => setReviewing(true)}>
          Review flagged questions{flags.length > 0 ? ` (${flags.length})` : ''}
        </Button>
      </div>
      {confirming ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-fluid-base">Start a new game and clear these standings?</span>
          <Button variant="primary" onClick={onNewGame}>
            Yes, new game
          </Button>
          <Button onClick={() => setConfirming(false)}>Cancel</Button>
        </div>
      ) : (
        <Button variant="primary" className="self-start" onClick={() => setConfirming(true)}>
          New game
        </Button>
      )}
    </section>
  )
}
