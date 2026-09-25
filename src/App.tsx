import { useState, type ReactElement } from 'react'
import { Button } from './components/Button.tsx'
import { BankBadge } from './components/BankBadge.tsx'
import { Card } from './components/Card.tsx'
import { Scenery } from './components/Scenery.tsx'
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

  // The backdrop calms behind the live question and reveal so it never competes
  // with reading the prompt; full everywhere else.
  const calmScenery = game.state.phase === 'question' || game.state.phase === 'reveal'

  return (
    <div className="relative flex min-h-screen flex-col">
      <Scenery calm={calmScenery} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-stretch gap-6 px-4 py-8 sm:px-6">
        <Wordmark />
        <BankBadge kind={game.state.bankKind} />
        <StorageNotice notice={game.storageNotice} />

        <Phases game={game} />
      </main>

      <FooterNotice />
    </div>
  )
}

// The wordmark (restyle move 5). A plain, coloured, gently tilted setting of the
// name in our rounded font — deliberately NOT a recreation of the show's
// hand-lettered logo (design.md §7 bans title-card lettering). It stays a single
// <h1> so its accessible name is exactly "Heeler Pub Quiz"; the tilts are static
// transforms, not motion, and each colour was contrast-checked on the sky the
// header sits on (ink 9.68:1, blue-700 4.36:1 as large text >=3, orange-700
// 6.04:1). The tagline is the "generic dog-breed wink" the design settled on,
// kept well clear of the rights holders' catchphrases.
function Wordmark(): ReactElement {
  return (
    <div className="flex flex-col gap-0.5">
      <h1 className="text-fluid-xl font-black leading-none tracking-tight">
        <span className="text-ink">Heeler </span>
        <span className="inline-block -rotate-3 text-blue-700">Pub </span>
        <span className="inline-block rotate-2 text-orange-700">Quiz</span>
      </h1>
      <p className="text-fluid-sm font-bold uppercase tracking-wide text-orange-700">
        A very good unofficial fan quiz
      </p>
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
          roundsPerGame={game.roundsPerGame}
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
    <Card aria-labelledby="intro-heading" className="flex flex-col gap-4">
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
    </Card>
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
    <Card aria-labelledby="break-heading" className="flex flex-col gap-4">
      <h2 id="break-heading" className="text-fluid-xl font-bold">
        Standings after round {roundNumber} of {roundCount}
      </h2>
      <Standings state={state} voidedQuestionIds={voidedQuestionIds} />
      <Button variant="primary" className="self-start" onClick={onNext}>
        {lastRound ? 'See the final standings' : 'Continue to the next round'}
      </Button>
    </Card>
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
    <Card aria-labelledby="final-heading" className="flex flex-col gap-4">
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
    </Card>
  )
}
