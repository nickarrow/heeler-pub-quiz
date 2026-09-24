import type { Bank, Round } from '../types.ts'

// The fixture bank. Everything here is invented for testing and none of it is
// about the show â€” that is the point. `content-pipeline.md` calls for fixtures
// written by hand rather than drawn from the corpus, covering all three answer
// shapes so every code path is exercised by the set that is safe to look at.
//
// Increment 1 renders one of these. Increment 3 uses all three shapes for
// scoring, and increment 4 grows this to twelve short rounds.

const fixtureRoundOne = {
  id: 'fixture-1',
  theme: 'Fixtures',
  title: 'Fixture Round One',
  blurb: 'Invented questions for testing the app. None of this ever happened.',
  questions: [
    {
      id: 'fx-001',
      prompt: 'In the fixture world, what colour is the test card?',
      tier: 1,
      answer: { kind: 'single', answer: 'Magenta', alsoAccept: ['Puce'] },
      note: 'Invented for testing. Not from any episode of anything.',
      source: { episode: 'The Test Card', series: 1, episodeInSeries: 1 },
    },
    {
      id: 'fx-002',
      prompt: 'Name any of the placeholder animals kept on the fixture farm.',
      tier: 2,
      answer: {
        kind: 'list',
        answers: ['Widget', 'Sprocket', 'Grommet'],
        maxPoints: 2,
      },
      source: { episode: 'Placeholder Farm', series: 2, episodeInSeries: 7 },
    },
    {
      id: 'fx-003',
      prompt: 'How many sides does the fixture dice have?',
      tier: 3,
      answer: {
        kind: 'contested',
        options: [
          { answer: 'Eight', why: 'The earlier fixture states eight.' },
          { answer: 'Twelve', why: 'A later fixture contradicts it and states twelve.' },
        ],
        scores: 'either',
      },
      note: 'Deliberately contradictory, to exercise the contested shape.',
      source: { episode: 'Contested Fixture', series: 3, episodeInSeries: 12 },
    },
  ],
} satisfies Round

export const bank = {
  kind: 'fixtures',
  rounds: [fixtureRoundOne],
} satisfies Bank

export default bank
