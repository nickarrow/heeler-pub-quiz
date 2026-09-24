import type { Round } from '../types.ts'

// Games They Invented, round 2 (increment 8). A second round of made-up games,
// their rules, roles, terms and creatures - from ten distinct episodes, none a
// round-one answer. Twelve candidates authored; all twelve passed both checks
// (blind re-derivation with the answer withheld, cross-anchor against the
// episode). Ten ship; two cut as same-episode duplicates. Tier mix 3 / 5 / 2.
//
// Every fact is about a game, not its name. No prompt names its own answer.
// Honours the 7a exclusion list.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const gamesTheyInventedTwo: Round = {
  id: 'games-they-invented-2',
  theme: 'Games They Invented',
  title: 'Games They Invented (Encore)',
  blurb: 'More rules, roles and made-up creatures from the games dreamed up on the spot.',
  questions: [
    {
      id: 'gt2-01',
      prompt: 'In Keepy Uppy the balloon has one rule to live by. What must never happen to it, or it bursts?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'It must not touch the ground',
        alsoAccept: ['Touch the ground', 'Hit the floor', 'Touch the floor', 'It must stay off the ground'],
      },
      source: { episode: 'Keepy Uppy', series: 1, episodeInSeries: 3 },
    },
    {
      id: 'gt2-02',
      prompt: 'Playing charades at Nana\u2019s, baby Socks says her very first word, which happens to be the answer to Muffin\u2019s charade. What word?',
      tier: 1,
      answer: { kind: 'single', answer: 'Ballerina' },
      source: { episode: 'Charades', series: 2, episodeInSeries: 11 },
    },
    {
      id: 'gt2-03',
      prompt: 'On their felt-pen island, the kids treat Lucky\u2019s Dad\u2019s stray football not as a ball but as what treasure they must guard?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'A (white) chocolate egg',
        alsoAccept: ['A chocolate egg', 'Chocolate egg', 'An egg', 'A white chocolate egg'],
      },
      source: { episode: 'Rug Island', series: 2, episodeInSeries: 10 },
    },
    {
      id: 'gt2-04',
      prompt: 'Narrating a pretend pirate voyage, Chilli gives the frightened friend who hides on dry land a safe role. What role?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'The lighthouse keeper',
        alsoAccept: ['Lighthouse keeper', 'Lighthouse'],
      },
      source: { episode: 'Pirates', series: 1, episodeInSeries: 27 },
    },
    {
      id: 'gt2-05',
      prompt: 'In the game where one child rules from a throne, what is the role of the other child, the one who gets bossed around?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'The butler',
        alsoAccept: ['Butler', 'The royal butler'],
      },
      source: { episode: 'Queens', series: 2, episodeInSeries: 23 },
    },
    {
      id: 'gt2-06',
      prompt: 'Playing astronauts, Jack is the navigator and works the ship\u2019s computer under what nickname?',
      tier: 2,
      answer: { kind: 'single', answer: 'Dude-a-tron', alsoAccept: ['The dude-a-tron'] },
      source: { episode: 'Space', series: 3, episodeInSeries: 34 },
    },
    {
      id: 'gt2-07',
      prompt: 'In the bathtime shop game, after the plain burger Bluey keeps inventing new menu items. What new burger does she introduce first?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'The Pickle Burger',
        alsoAccept: ['Pickle Burger', 'Pickle'],
      },
      source: { episode: 'Burger Shop', series: 2, episodeInSeries: 32 },
    },
    {
      id: 'gt2-08',
      prompt: 'In the park spy game, the kids brew a potion and build a device meant to do what to the grown-ups?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'Control them',
        alsoAccept: ['Control the grown-ups', 'Make them do what the kids say', 'Control the adults'],
      },
      source: { episode: 'Spy Game', series: 1, episodeInSeries: 13 },
    },
    {
      id: 'gt2-09',
      prompt: 'In the pretend bus game, Bingo has a pretend pet snake that "attacks" the driver. What is the snake\u2019s name?',
      tier: 3,
      answer: { kind: 'single', answer: 'Boopsie' },
      source: { episode: 'Bus', series: 2, episodeInSeries: 22 },
    },
    {
      id: 'gt2-10',
      prompt: 'The toy instrument that freezes and unfreezes Dad is struck with a mallet the girls give what in-game nickname?',
      tier: 3,
      answer: {
        kind: 'single',
        answer: 'The dinger thing',
        alsoAccept: ['Dinger thing', 'The dinger'],
      },
      source: { episode: 'The Magic Xylophone', series: 1, episodeInSeries: 1 },
    },
  ],
}
