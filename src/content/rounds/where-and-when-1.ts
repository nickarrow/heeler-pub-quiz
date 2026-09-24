import type { Round } from '../types.ts'

// Where and When, round 1 (increment 8). Locations, the neighbourhood, the
// setting and continuity. Twelve candidates authored from the corpus; ten
// passed both checks and ship. Two were cut for failing blind re-derivation as
// worded (a country the passage did not actually name; a place answer too vague
// to be a fair question) - the honest survival note is in the increment-8
// verification-log entry.
//
// Tier mix 2 / 6 / 2, within the 3/5/2 tolerance. No prompt names its own
// answer. Honours the 7a exclusion list.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const whereAndWhenOne: Round = {
  id: 'where-and-when-1',
  theme: 'Where and When',
  title: 'Where and When',
  blurb: 'The city, the street, the far-off holidays and the corner shops: the places the show lives in.',
  questions: [
    {
      id: 'ww1-01',
      prompt: 'Which Australian state is the show set in, on its famously hot days?',
      tier: 1,
      answer: { kind: 'single', answer: 'Queensland' },
      source: { episode: 'The Pool', series: 1, episodeInSeries: 22 },
    },
    {
      id: 'ww1-02',
      prompt: 'Christmas at the Heelers looks unlike a northern one. What is the family doing, given the season it falls in down under?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'Swimming (it is a hot summer Christmas)',
        alsoAccept: ['Swimming', 'Summer Christmas', 'Swimming in the pool', 'A summer barbecue and a swim'],
      },
      source: { episode: 'Christmas Swim', series: 2, episodeInSeries: 51 },
    },
    {
      id: 'ww1-03',
      prompt: 'Jealous of Lucky\u2019s Dad\u2019s new pizza oven, Bandit drives the family to a giant hardware warehouse to buy one. What is the store called?',
      tier: 2,
      answer: { kind: 'single', answer: 'Hammerbarn' },
      source: { episode: 'Hammerbarn', series: 2, episodeInSeries: 2 },
    },
    {
      id: 'ww1-04',
      prompt: 'The Heeler house sits on what kind of street, where the neighbour wheels out bins and the kids play street cricket?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'A cul-de-sac',
        alsoAccept: ['Cul-de-sac', 'A dead-end street', 'A dead end'],
      },
      source: { episode: 'Bin Night', series: 2, episodeInSeries: 42 },
    },
    {
      id: 'ww1-05',
      prompt: 'While Uncle Stripe is away on a tropical holiday, he lets the family use his pool. Where has he gone?',
      tier: 2,
      answer: { kind: 'single', answer: 'Bali' },
      source: { episode: 'The Pool', series: 1, episodeInSeries: 22 },
    },
    {
      id: 'ww1-06',
      prompt: 'Bandit leaves the family for six weeks for work, flying overseas. Which country is he travelling to?',
      tier: 2,
      answer: { kind: 'single', answer: 'Indonesia' },
      source: { episode: 'Curry Quest', series: 3, episodeInSeries: 9 },
    },
    {
      id: 'ww1-07',
      prompt: 'On the girls\u2019 first trip to the cinema, what is the name of the film they go to see?',
      tier: 2,
      answer: { kind: 'single', answer: 'Chunky Chimp' },
      source: { episode: 'Movies', series: 2, episodeInSeries: 29 },
    },
    {
      id: 'ww1-08',
      prompt: 'The family picks up dinner from their local Chinese takeaway. By the characters on its sign, what is the shop called?',
      tier: 2,
      answer: { kind: 'single', answer: 'Golden Crown' },
      source: { episode: 'Takeaway', series: 1, episodeInSeries: 14 },
    },
    {
      id: 'ww1-09',
      prompt: 'Who is the Heelers\u2019 next-door neighbour \u2014 the older lady who wheels out her bins and warns of a magpie at the park?',
      tier: 3,
      answer: { kind: 'single', answer: 'Doreen' },
      source: { episode: 'Bin Night', series: 2, episodeInSeries: 42 },
    },
    {
      id: 'ww1-10',
      prompt: 'In one pretend adventure the family journeys "beyond" a real Australian mountain range that the episode is named for. Which range?',
      tier: 3,
      answer: {
        kind: 'single',
        answer: 'The Blue Mountains',
        alsoAccept: ['Blue Mountains'],
      },
      source: { episode: 'Blue Mountains', series: 1, episodeInSeries: 21 },
    },
  ],
}
