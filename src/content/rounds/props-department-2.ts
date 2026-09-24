import type { Round } from '../types.ts'

// Props Department, round 2 (increment 8). More named objects and toys, and
// where they turn up. A wider candidate pool was read from the corpus; ten ship
// after both checks (blind re-derivation with the answer withheld, cross-anchor
// against a second source). Several otherwise-good objects were cut for being
// imaginary rather than physical props, for a character rather than an object,
// or for repeating an episode already used in Props Department round 1.
//
// Prompts describe each object without naming it, so none gives away its answer
// even where the object shares its episode title. Honours the 7a exclusion list;
// no episode here overlaps with Props Department round 1. Tier mix 3 / 5 / 2.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const propsDepartmentTwo: Round = {
  id: 'props-department-2',
  theme: 'Props Department',
  title: 'Props Department',
  blurb: 'A second run at the toys and treasures, and where each one ends up.',
  questions: [
    {
      id: 'pd2-01',
      prompt: 'Bluey and Bingo build an elaborate multi-room cubby for one of their stuffed toys, who keeps winning their board game. What is that toy called?',
      tier: 1,
      answer: { kind: 'single', answer: 'Kimjim' },
      source: { episode: 'Cubby', series: 3, episodeInSeries: 38 },
    },
    {
      id: 'pd2-02',
      prompt: 'At bedtime, Bingo cannot find her favourite toy and retraces the whole day\u2019s game to look for it, finally finding it tucked inside a shape-puzzle egg. What is the toy\u2019s name?',
      tier: 1,
      answer: { kind: 'single', answer: 'Floppy' },
      source: { episode: 'Chickenrat', series: 1, episodeInSeries: 46 },
    },
    {
      id: 'pd2-03',
      prompt: 'Chilli warns Bluey to put away her special toy before the cousins arrive, but Socks grabs it and will not let go. What is the toy called?',
      tier: 1,
      answer: { kind: 'single', answer: 'Polly Puppy' },
      source: { episode: 'Horsey Ride', series: 1, episodeInSeries: 9 },
    },
    {
      id: 'pd2-04',
      prompt: 'Splitting their belongings between two rooms, Bingo keeps a plush that had been a Christmas present from Granddad. What is that plush\u2019s name?',
      tier: 2,
      answer: { kind: 'single', answer: 'Gloria' },
      source: { episode: 'Bedroom', series: 3, episodeInSeries: 2 },
    },
    {
      id: 'pd2-05',
      prompt: 'So Muffin can have proper ballerina music, Nana fetches a treasured object that her own Nana gave her long ago. What kind of object is it?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'A music box',
        alsoAccept: ['Music box', 'The music box'],
      },
      source: { episode: 'Charades', series: 2, episodeInSeries: 11 },
    },
    {
      id: 'pd2-06',
      prompt: 'At the post office, Bingo is talked into spending her money on a small novelty toy that answers questions out loud. What is the toy?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'A yes/no button',
        alsoAccept: ['Yes/no button', 'The yes/no button', 'A yes no button'],
      },
      source: { episode: 'Dance Mode', series: 2, episodeInSeries: 1 },
    },
    {
      id: 'pd2-07',
      prompt: 'While she is meant to be counting for a game, Bluey gets sidetracked by a noisy old talking toy she turns up in a cupboard. What is that toy called?',
      tier: 2,
      answer: { kind: 'single', answer: 'Chattermax' },
      source: { episode: 'Hide and Seek', series: 1, episodeInSeries: 42 },
    },
    {
      id: 'pd2-08',
      prompt: 'At Bingo\u2019s birthday party, Lucky and Rusty keep throwing one toy in through the open kitchen window. What is that toy?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'A whistleball',
        alsoAccept: ['Whistleball', 'The whistleball', 'A whistle ball'],
      },
      source: { episode: 'Handstand', series: 2, episodeInSeries: 45 },
    },
    {
      id: 'pd2-09',
      prompt: 'In the Grannies\u2019 garden, Bluey addresses one of the garden ornaments by a first name, the same one it was given in an earlier episode. What is the name?',
      tier: 3,
      answer: { kind: 'single', answer: 'Jeremy' },
      source: { episode: 'Ghostbasket', series: 3, episodeInSeries: 48 },
    },
    {
      id: 'pd2-10',
      prompt: 'Bandit invites in an obnoxious hand puppet who keeps interrupting Mum\u2019s bedtime story and, when offered a snack, chews it loudly. What is the puppet called?',
      tier: 3,
      answer: { kind: 'single', answer: 'Unicorse' },
      source: { episode: 'Unicorse', series: 3, episodeInSeries: 8 },
    },
  ],
}
