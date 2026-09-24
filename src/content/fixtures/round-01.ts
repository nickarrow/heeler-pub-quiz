import type { Round } from '../types.ts'

// Fixture round one: the detailed ten-question round increment 3 plays through,
// covering all three answer shapes and all three tiers. Kept as its own file so
// the eleven short dealing-proof rounds in `short-rounds-a.ts` and
// `short-rounds-b.ts` do not bloat it past the length target, and so increment
// 3's tests (which name fx-001..fx-010) keep a stable home.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const roundOne = {
  id: 'fixture-1',
  theme: 'Fixtures',
  title: 'Fixture Round One',
  blurb: 'Invented questions for testing the whole game loop. None of this ever happened.',
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
      note: 'A point each up to two, so the stepper cap gets exercised.',
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
      note: 'Deliberately contradictory, to exercise the contested either shape.',
      source: { episode: 'Contested Fixture', series: 3, episodeInSeries: 12 },
    },
    {
      id: 'fx-004',
      prompt: 'What is the name of the invented mascot on the fixture packaging?',
      tier: 1,
      answer: { kind: 'single', answer: 'Cogsworth the Placeholder' },
      source: { episode: 'The Mascot', series: 1, episodeInSeries: 4 },
    },
    {
      id: 'fx-005',
      prompt: 'Name any of the three fixture rivers.',
      tier: 2,
      answer: {
        kind: 'list',
        answers: ['The Stub', 'The Mock', 'The Sample'],
        maxPoints: 3,
      },
      note: 'A point each up to three, so a larger stepper cap gets exercised.',
      source: { episode: 'Three Rivers', series: 2, episodeInSeries: 2 },
    },
    {
      id: 'fx-006',
      prompt: 'On the fixture calendar, which day is designated Placeholder Day?',
      tier: 1,
      answer: { kind: 'single', answer: 'Thirdday', alsoAccept: ['Third-day'] },
      source: { episode: 'The Calendar', series: 1, episodeInSeries: 9 },
    },
    {
      id: 'fx-007',
      prompt: 'Which fixture tool is correct for tightening a widget?',
      tier: 2,
      answer: {
        kind: 'contested',
        options: [
          { answer: 'The blue spanner', why: 'The manual names the blue spanner.' },
          { answer: 'The green spanner', why: 'The errata sheet corrects it to the green spanner.' },
        ],
        scores: 'all',
      },
      note: 'Scores all, so both answers must be given for the point. Exercises the contested all rule.',
      source: { episode: 'The Manual', series: 2, episodeInSeries: 11 },
    },
    {
      id: 'fx-008',
      prompt: 'What is stamped on the underside of every fixture crate?',
      tier: 3,
      answer: { kind: 'single', answer: 'Do Not Ship' },
      note: 'A deep-cut fixture detail, invented.',
      source: { episode: 'The Warehouse', series: 3, episodeInSeries: 3 },
    },
    {
      id: 'fx-009',
      prompt: 'Name any of the placeholder crew aboard the fixture boat.',
      tier: 2,
      answer: {
        kind: 'list',
        answers: ['Bosun Stub', 'Deckhand Mock', 'Cook Sample', 'Captain Dummy'],
        maxPoints: 2,
      },
      source: { episode: 'The Boat', series: 2, episodeInSeries: 5 },
    },
    {
      id: 'fx-010',
      prompt: 'What is the fixture password, according to the earlier draft?',
      tier: 1,
      answer: { kind: 'single', answer: 'Placeholder', alsoAccept: ['Stub'] },
      note: 'Closes the round on a straightforward single answer.',
      source: { episode: 'The Password', series: 1, episodeInSeries: 6 },
    },
  ],
} satisfies Round
