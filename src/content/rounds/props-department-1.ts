import type { Round } from '../types.ts'

// Props Department, round 1 (increment 8). Specific named objects and what
// happens to them. Twelve candidates authored; all twelve passed both checks
// (blind re-derivation with the answer withheld, cross-anchor against a second
// source). Ten ship; two cut for tier balance and to avoid an object already
// used in the Games round. Tier mix 3 / 5 / 2 exactly.
//
// Prompts describe each object without naming it, so none gives away its answer
// even where the object's name is also its episode title. Honours the 7a
// exclusion list.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const propsDepartmentOne: Round = {
  id: 'props-department-1',
  theme: 'Props Department',
  title: 'Props Department',
  blurb: 'The toys, the treasures and the odd objects, and what becomes of them.',
  questions: [
    {
      id: 'pd1-01',
      prompt: 'What is the name of the class-mascot puppet each kindy kid takes home for a weekend and records in a scrapbook?',
      tier: 1,
      answer: { kind: 'single', answer: 'Bob Bilby' },
      source: { episode: 'Bob Bilby', series: 1, episodeInSeries: 12 },
    },
    {
      id: 'pd1-02',
      prompt: 'At the family\u2019s summer Christmas, Bluey is given a big teddy and introduces him to everyone. What is the teddy\u2019s name?',
      tier: 1,
      answer: { kind: 'single', answer: 'Bartlebee' },
      source: { episode: 'Christmas Swim', series: 2, episodeInSeries: 51 },
    },
    {
      id: 'pd1-03',
      prompt: 'Playing dress-up, Bingo puts on a costume and "becomes" a feral animal, chasing everyone on all fours. Which animal\u2019s costume?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'The cheetah',
        alsoAccept: ['Cheetah', 'A cheetah', 'The cheetah onesie'],
      },
      source: { episode: 'Onesies', series: 3, episodeInSeries: 31 },
    },
    {
      id: 'pd1-04',
      prompt: 'In the home claw-machine game, what is the name of the ballerina toy Bingo wins and Bluey later trades to Dad?',
      tier: 2,
      answer: { kind: 'single', answer: 'Grey Dancer' },
      source: { episode: 'The Claw', series: 1, episodeInSeries: 19 },
    },
    {
      id: 'pd1-05',
      prompt: 'Bingo finds an abandoned toy on a park swing, names it, and keeps hiding it so no one else can take it. What is the name she gives it?',
      tier: 2,
      answer: { kind: 'single', answer: 'Turtleboy' },
      source: { episode: 'Turtleboy', series: 3, episodeInSeries: 30 },
    },
    {
      id: 'pd1-06',
      prompt: 'During a big toy clear-out, one toy is left in the "chuck" basket, and later donated to a sick child. It is a monkey wearing underpants. What is it called?',
      tier: 2,
      answer: { kind: 'single', answer: 'Mr Monkeyjocks', alsoAccept: ['Mr. Monkeyjocks', 'Monkeyjocks'] },
      source: { episode: 'Mr Monkeyjocks', series: 2, episodeInSeries: 48 },
    },
    {
      id: 'pd1-07',
      prompt: 'For her kindy show and tell, Bingo brings a beach find and learns to pull its tendon to make it move. What is the object?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'A crab claw',
        alsoAccept: ['Crab claw', 'A crab pincer'],
      },
      source: { episode: 'Show and Tell', series: 3, episodeInSeries: 42 },
    },
    {
      id: 'pd1-08',
      prompt: 'After losing at birthday party after birthday party, Bingo finally wins one prize at Bluey\u2019s party. What is the prize?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'A birdie kite',
        alsoAccept: ['Birdie kite', 'A kite', 'Bird kite'],
      },
      source: { episode: 'Pass the Parcel', series: 3, episodeInSeries: 14 },
    },
    {
      id: 'pd1-09',
      prompt: 'To carry an injured budgie to the vet, Bandit has Bluey fetch a tea towel and what everyday container to make it a little bed?',
      tier: 3,
      answer: {
        kind: 'single',
        answer: 'A shoebox',
        alsoAccept: ['Shoebox', 'A shoe box'],
      },
      source: { episode: 'Copycat', series: 1, episodeInSeries: 38 },
    },
    {
      id: 'pd1-10',
      prompt: 'Building a sand sculpture at the beach, Bingo and Bandit use one found object for its head, which older kids later take. What object?',
      tier: 3,
      answer: {
        kind: 'single',
        answer: 'A stick',
        alsoAccept: ['A bird-shaped stick', 'The stick'],
      },
      source: { episode: 'Stickbird', series: 3, episodeInSeries: 41 },
    },
  ],
}
