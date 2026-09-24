import { bank as loadedBank } from '@bank'
import { FixtureBadge } from './components/FixtureBadge.tsx'
import { FooterNotice } from './components/FooterNotice.tsx'
import type { AnswerShape, Bank } from './content/types.ts'

// Exactly one import of the bank, through the alias, never naming either file.
// Widened to `Bank` on purpose: the app compiles identically whichever bank the
// alias resolves to, so nothing here depends on having got the fixtures.
const bank: Bank = loadedBank

/** Increment 1 shows one question. The game loop is increment 3. */
function AnswerText({ answer }: { answer: AnswerShape }) {
  switch (answer.kind) {
    case 'single':
      return <span>{answer.answer}</span>
    case 'list':
      return <span>{answer.answers.join(', ')}</span>
    case 'contested':
      return <span>{answer.options.map((option) => option.answer).join(' or ')}</span>
  }
}

export default function App() {
  const round = bank.rounds[0]
  const question = round?.questions[0]

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <main className="flex flex-1 flex-col items-start gap-6 px-6 py-8">
        <h1 className="text-3xl font-semibold">Heeler Pub Quiz</h1>

        {bank.kind === 'fixtures' ? <FixtureBadge /> : null}

        {question === undefined || round === undefined ? (
          <p>No question available.</p>
        ) : (
          <article className="flex flex-col gap-3 rounded-lg border border-neutral-300 p-6">
            <p className="text-sm uppercase tracking-wide text-neutral-500">{round.title}</p>
            <h2 className="text-2xl font-medium">{question.prompt}</h2>
            <p>
              <span className="font-semibold">Answer: </span>
              <AnswerText answer={question.answer} />
            </p>
            <p className="text-sm text-neutral-600">
              {question.source.episode} (series {question.source.series}, episode{' '}
              {question.source.episodeInSeries})
            </p>
            {question.note === undefined ? null : (
              <p className="text-sm italic text-neutral-600">{question.note}</p>
            )}
          </article>
        )}
      </main>

      <FooterNotice />
    </div>
  )
}
