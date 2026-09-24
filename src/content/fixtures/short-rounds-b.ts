import type { Round } from '../types.ts'

// Short dealing-proof rounds, fixture-8 through fixture-12. The second half of
// the eleven short rounds; see short-rounds-a.ts for why they exist and why they
// are short. Together with round-01 and short-rounds-a this makes twelve rounds,
// which is what three games of four unserved rounds needs. All invented, plain
// hyphens and straight quotes only.

export const shortRoundsB = [
  {
    id: 'fixture-8',
    theme: 'Fixtures',
    title: 'Fixture Round Eight',
    blurb: 'Short invented round eight. Nothing here is real.',
    questions: [
      {
        id: 'fx-801',
        prompt: 'What is the eighth fixture emblem?',
        tier: 1,
        answer: { kind: 'single', answer: 'A spiral' },
        source: { episode: 'The Emblem', series: 1, episodeInSeries: 11 },
      },
      {
        id: 'fx-802',
        prompt: 'Name any of the fixture rivers of the east.',
        tier: 2,
        answer: { kind: 'list', answers: ['The Reed', 'The Rush', 'The Bend'], maxPoints: 2 },
        source: { episode: 'The Delta', series: 2, episodeInSeries: 1 },
      },
      {
        id: 'fx-803',
        prompt: 'Which fixture founder came first?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The elder', why: 'The statue names the elder.' },
            { answer: 'The scribe', why: 'The ledger names the scribe.' },
          ],
          scores: 'either',
        },
        source: { episode: 'The Founders', series: 3, episodeInSeries: 2 },
      },
    ],
  },
  {
    id: 'fixture-9',
    theme: 'Fixtures',
    title: 'Fixture Round Nine',
    blurb: 'Short invented round nine. Placeholder content only.',
    questions: [
      {
        id: 'fx-901',
        prompt: 'What is the ninth fixture signal?',
        tier: 1,
        answer: { kind: 'single', answer: 'Two long, one short' },
        source: { episode: 'The Signal', series: 1, episodeInSeries: 12 },
      },
      {
        id: 'fx-902',
        prompt: 'Name any of the fixture spices.',
        tier: 2,
        answer: { kind: 'list', answers: ['Salt', 'Clove', 'Mace'], maxPoints: 2 },
        source: { episode: 'The Larder', series: 2, episodeInSeries: 8 },
      },
      {
        id: 'fx-903',
        prompt: 'Which fixture bridge is older?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The stone bridge', why: 'The mason dates the stone bridge first.' },
            { answer: 'The iron bridge', why: 'The engineer disputes it for the iron bridge.' },
          ],
          scores: 'all',
        },
        source: { episode: 'The Bridges', series: 3, episodeInSeries: 6 },
      },
    ],
  },
  {
    id: 'fixture-10',
    theme: 'Fixtures',
    title: 'Fixture Round Ten',
    blurb: 'Short invented round ten. None of this happened.',
    questions: [
      {
        id: 'fx-1001',
        prompt: 'What is the tenth fixture watchword?',
        tier: 1,
        answer: { kind: 'single', answer: 'Beacon' },
        source: { episode: 'The Watch', series: 1, episodeInSeries: 13 },
      },
      {
        id: 'fx-1002',
        prompt: 'Name any of the fixture lakes.',
        tier: 2,
        answer: { kind: 'list', answers: ['Still', 'Deep', 'Clear'], maxPoints: 2 },
        source: { episode: 'The Lakes', series: 2, episodeInSeries: 13 },
      },
      {
        id: 'fx-1003',
        prompt: 'Which fixture tale is canonical?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The long version', why: 'The archive keeps the long version.' },
            { answer: 'The short version', why: 'The teller prefers the short version.' },
          ],
          scores: 'either',
        },
        source: { episode: 'The Tale', series: 3, episodeInSeries: 10 },
      },
    ],
  },
  {
    id: 'fixture-11',
    theme: 'Fixtures',
    title: 'Fixture Round Eleven',
    blurb: 'Short invented round eleven. Placeholder facts only.',
    questions: [
      {
        id: 'fx-1101',
        prompt: 'What is the eleventh fixture cipher?',
        tier: 1,
        answer: { kind: 'single', answer: 'Shift by three' },
        source: { episode: 'The Cipher', series: 1, episodeInSeries: 14 },
      },
      {
        id: 'fx-1102',
        prompt: 'Name any of the fixture gems.',
        tier: 2,
        answer: { kind: 'list', answers: ['Paste', 'Glass', 'Quartz'], maxPoints: 2 },
        source: { episode: 'The Vault', series: 2, episodeInSeries: 14 },
      },
      {
        id: 'fx-1103',
        prompt: 'Which fixture ruler reigned longest?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The first', why: 'One chronicle credits the first.' },
            { answer: 'The third', why: 'Another chronicle credits the third.' },
          ],
          scores: 'either',
        },
        source: { episode: 'The Reigns', series: 3, episodeInSeries: 11 },
      },
    ],
  },
  {
    id: 'fixture-12',
    theme: 'Fixtures',
    title: 'Fixture Round Twelve',
    blurb: 'Short invented round twelve. The last of the dealing-proof rounds.',
    questions: [
      {
        id: 'fx-1201',
        prompt: 'What is the twelfth fixture motto?',
        tier: 1,
        answer: { kind: 'single', answer: 'Test twice' },
        source: { episode: 'The Motto', series: 1, episodeInSeries: 15 },
      },
      {
        id: 'fx-1202',
        prompt: 'Name any of the fixture harbours.',
        tier: 2,
        answer: { kind: 'list', answers: ['East Dock', 'West Dock', 'The Quay'], maxPoints: 2 },
        source: { episode: 'The Harbour', series: 2, episodeInSeries: 15 },
      },
      {
        id: 'fx-1203',
        prompt: 'Which fixture verdict stands?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The first ruling', why: 'The lower court gave the first ruling.' },
            { answer: 'The appeal', why: 'The higher court gave the appeal.' },
          ],
          scores: 'all',
        },
        source: { episode: 'The Verdict', series: 3, episodeInSeries: 12 },
      },
    ],
  },
] satisfies Round[]
