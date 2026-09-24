import type { Round } from '../types.ts'

// Short dealing-proof rounds, fixture-2 through fixture-7. These exist so the
// no-repeats-across-three-games proof has twelve rounds to deal from; increment 4
// deals four unserved rounds per game, and three games need twelve distinct
// rounds. They are deliberately short (three questions each) because the thing
// being proved here is dealing, not scoring, and a reviewer should be able to
// read the whole set.
//
// Each round still covers the answer shapes across its three questions so a game
// dealt from any four of them exercises single, list and contested. All invented,
// none about the show. Plain hyphens and straight quotes only.

export const shortRoundsA = [
  {
    id: 'fixture-2',
    theme: 'Fixtures',
    title: 'Fixture Round Two',
    blurb: 'A short invented round for the dealing proof. Nothing here is real.',
    questions: [
      {
        id: 'fx-201',
        prompt: 'What shape is the second fixture badge?',
        tier: 1,
        answer: { kind: 'single', answer: 'Hexagon' },
        source: { episode: 'The Badge', series: 1, episodeInSeries: 2 },
      },
      {
        id: 'fx-202',
        prompt: 'Name any of the fixture moons.',
        tier: 2,
        answer: { kind: 'list', answers: ['Alpha', 'Beta', 'Gamma'], maxPoints: 2 },
        source: { episode: 'The Moons', series: 2, episodeInSeries: 3 },
      },
      {
        id: 'fx-203',
        prompt: 'Which fixture route is the official one?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The north path', why: 'The old map shows the north path.' },
            { answer: 'The south path', why: 'The new map shows the south path.' },
          ],
          scores: 'either',
        },
        source: { episode: 'The Map', series: 3, episodeInSeries: 4 },
      },
    ],
  },
  {
    id: 'fixture-3',
    theme: 'Fixtures',
    title: 'Fixture Round Three',
    blurb: 'Another short invented round. Placeholder facts only.',
    questions: [
      {
        id: 'fx-301',
        prompt: 'What is the third fixture keyword?',
        tier: 1,
        answer: { kind: 'single', answer: 'Sample' },
        source: { episode: 'The Keyword', series: 1, episodeInSeries: 3 },
      },
      {
        id: 'fx-302',
        prompt: 'Name any of the fixture tools.',
        tier: 2,
        answer: { kind: 'list', answers: ['Hammer', 'Chisel', 'Rasp'], maxPoints: 2 },
        source: { episode: 'The Toolbox', series: 2, episodeInSeries: 6 },
      },
      {
        id: 'fx-303',
        prompt: 'How many fixture flags are there?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'Four', why: 'The census counts four.' },
            { answer: 'Five', why: 'A later tally counts five.' },
          ],
          scores: 'either',
        },
        source: { episode: 'The Flags', series: 3, episodeInSeries: 8 },
      },
    ],
  },
  {
    id: 'fixture-4',
    theme: 'Fixtures',
    title: 'Fixture Round Four',
    blurb: 'Short invented round four. None of this happened.',
    questions: [
      {
        id: 'fx-401',
        prompt: 'What colour is the fourth fixture door?',
        tier: 1,
        answer: { kind: 'single', answer: 'Teal' },
        source: { episode: 'The Door', series: 1, episodeInSeries: 5 },
      },
      {
        id: 'fx-402',
        prompt: 'Name any of the fixture birds.',
        tier: 2,
        answer: { kind: 'list', answers: ['Finch', 'Wren', 'Lark'], maxPoints: 2 },
        source: { episode: 'The Aviary', series: 2, episodeInSeries: 9 },
      },
      {
        id: 'fx-403',
        prompt: 'Which fixture recipe is authentic?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The first draft', why: 'The chef prefers the first draft.' },
            { answer: 'The reprint', why: 'The publisher prefers the reprint.' },
          ],
          scores: 'all',
        },
        source: { episode: 'The Cookbook', series: 3, episodeInSeries: 1 },
      },
    ],
  },
  {
    id: 'fixture-5',
    theme: 'Fixtures',
    title: 'Fixture Round Five',
    blurb: 'Short invented round five. Placeholder content.',
    questions: [
      {
        id: 'fx-501',
        prompt: 'What is the fifth fixture code name?',
        tier: 1,
        answer: { kind: 'single', answer: 'Marigold' },
        source: { episode: 'The Code', series: 1, episodeInSeries: 7 },
      },
      {
        id: 'fx-502',
        prompt: 'Name any of the fixture rooms.',
        tier: 2,
        answer: { kind: 'list', answers: ['The Hall', 'The Study', 'The Pantry'], maxPoints: 2 },
        source: { episode: 'The House', series: 2, episodeInSeries: 10 },
      },
      {
        id: 'fx-503',
        prompt: 'Which fixture clock is correct?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The tower clock', why: 'The council trusts the tower clock.' },
            { answer: 'The station clock', why: 'The railway trusts the station clock.' },
          ],
          scores: 'either',
        },
        source: { episode: 'The Clocks', series: 3, episodeInSeries: 5 },
      },
    ],
  },
  {
    id: 'fixture-6',
    theme: 'Fixtures',
    title: 'Fixture Round Six',
    blurb: 'Short invented round six. Nothing real inside.',
    questions: [
      {
        id: 'fx-601',
        prompt: 'What is the sixth fixture colour?',
        tier: 1,
        answer: { kind: 'single', answer: 'Ochre' },
        source: { episode: 'The Palette', series: 1, episodeInSeries: 8 },
      },
      {
        id: 'fx-602',
        prompt: 'Name any of the fixture trees.',
        tier: 2,
        answer: { kind: 'list', answers: ['Oak', 'Elm', 'Ash'], maxPoints: 2 },
        source: { episode: 'The Grove', series: 2, episodeInSeries: 12 },
      },
      {
        id: 'fx-603',
        prompt: 'How tall is the fixture tower?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'Thirty metres', why: 'The plaque says thirty.' },
            { answer: 'Forty metres', why: 'The survey says forty.' },
          ],
          scores: 'either',
        },
        source: { episode: 'The Tower', series: 3, episodeInSeries: 7 },
      },
    ],
  },
  {
    id: 'fixture-7',
    theme: 'Fixtures',
    title: 'Fixture Round Seven',
    blurb: 'Short invented round seven. Placeholder facts only.',
    questions: [
      {
        id: 'fx-701',
        prompt: 'What is the seventh fixture password?',
        tier: 1,
        answer: { kind: 'single', answer: 'Lantern' },
        source: { episode: 'The Gate', series: 1, episodeInSeries: 10 },
      },
      {
        id: 'fx-702',
        prompt: 'Name any of the fixture ships.',
        tier: 2,
        answer: { kind: 'list', answers: ['The Draft', 'The Proof', 'The Copy'], maxPoints: 2 },
        source: { episode: 'The Fleet', series: 2, episodeInSeries: 4 },
      },
      {
        id: 'fx-703',
        prompt: 'Which fixture anthem is official?',
        tier: 3,
        answer: {
          kind: 'contested',
          options: [
            { answer: 'The march', why: 'The band plays the march.' },
            { answer: 'The hymn', why: 'The choir sings the hymn.' },
          ],
          scores: 'all',
        },
        source: { episode: 'The Anthem', series: 3, episodeInSeries: 9 },
      },
    ],
  },
] satisfies Round[]
