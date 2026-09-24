import type { Round } from '../types.ts'

// The Support Act, round 2 (increment 8). A second minor-character round, drawing
// on the corpus's deepest theme. Twelve candidates authored, all distinct from
// round one; all twelve passed both checks. Ten ship; two cut (a circular
// "who debuts as X" fact, and one to keep any single episode from dominating).
// Tier mix 3 / 5 / 2.
//
// No prompt names its own answer. Honours the 7a exclusion list.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const theSupportActTwo: Round = {
  id: 'the-support-act-2',
  theme: 'The Support Act',
  title: 'The Support Act (Encore)',
  blurb: 'More of the neighbourhood: the friends, the classmates and the folks next door.',
  questions: [
    {
      id: 'sa2-01',
      prompt: 'A Bingo-aged pup is Bingo\u2019s regular playmate; in one game she is the nervous third member of the pirate crew. What is her name?',
      tier: 1,
      answer: { kind: 'single', answer: 'Missy' },
      source: { episode: 'Pirates', series: 1, episodeInSeries: 27 },
    },
    {
      id: 'sa2-02',
      prompt: 'Muffin is made to wear the "cone of shame" to break which specific habit?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'Sucking her thumb',
        alsoAccept: ['Thumb-sucking', 'Sucking her thumb'],
      },
      source: { episode: 'Muffin Cone', series: 2, episodeInSeries: 43 },
    },
    {
      id: 'sa2-03',
      prompt: 'Rusty\u2019s little friend Snickers can\u2019t throw the cricket ball far because of his short limbs. What breed is Snickers?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'A dachshund',
        alsoAccept: ['Dachshund', 'A sausage dog', 'Sausage dog'],
      },
      source: { episode: 'Cricket', series: 3, episodeInSeries: 47 },
    },
    {
      id: 'sa2-04',
      prompt: 'The Jack Russell family has a toddler girl who rides along on the school run. What is Jack\u2019s little sister called?',
      tier: 2,
      answer: { kind: 'single', answer: 'Lulu' },
      source: { episode: 'Explorers', series: 3, episodeInSeries: 15 },
    },
    {
      id: 'sa2-05',
      prompt: 'Chilli holds up the next-door neighbour as a model of kindness: after Bluey was born she made the family five of what dish?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'Lasagnas',
        alsoAccept: ['Lasagna', 'Five lasagnas', 'Lasagne'],
      },
      note: 'The kind neighbour is Wendy.',
      source: { episode: 'Sticky Gecko', series: 2, episodeInSeries: 12 },
    },
    {
      id: 'sa2-06',
      prompt: 'At the markets, Bluey\u2019s friend Indy has so many dietary restrictions she can barely eat anything. Name a couple of the foods she cannot have.',
      tier: 2,
      answer: {
        kind: 'list',
        answers: ['Wheat', 'Sugar', 'Gluten', 'Dairy'],
        maxPoints: 2,
      },
      source: { episode: 'Markets', series: 1, episodeInSeries: 20 },
    },
    {
      id: 'sa2-07',
      prompt: 'When the Heeler house goes up for sale, which real-estate agent keeps showing it to buyers?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'Bucky Dunstan',
        alsoAccept: ['Bucky', 'Bucky Dunston'],
      },
      source: { episode: 'The Sign', series: 3, episodeInSeries: 49 },
    },
    {
      id: 'sa2-08',
      prompt: 'At the playground, a friend tears up trying and failing to reach the monkey bars before finally making it. Which pup?',
      tier: 2,
      answer: { kind: 'single', answer: 'Bentley' },
      source: { episode: 'Bike', series: 1, episodeInSeries: 11 },
    },
    {
      id: 'sa2-09',
      prompt: 'Asked in class for a sad real-life thing, one of Bluey\u2019s classmates says his pet guinea pig ran away. Which classmate?',
      tier: 3,
      answer: { kind: 'single', answer: 'Pretzel' },
      source: { episode: 'The Sign', series: 3, episodeInSeries: 49 },
    },
    {
      id: 'sa2-10',
      prompt: 'Also sharing a sad real-life thing in class, which classmate says his parents got divorced?',
      tier: 3,
      answer: { kind: 'single', answer: 'Winton' },
      source: { episode: 'The Sign', series: 3, episodeInSeries: 49 },
    },
  ],
}
