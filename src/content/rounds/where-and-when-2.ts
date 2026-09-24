import type { Round } from '../types.ts'

// Where and When, round 2 (increment 8). More places and settings, distinct from
// round one. Twelve candidates authored; all passed both checks (blind
// re-derivation with the answer withheld, cross-anchor against a second source).
// Ten ship; two cut (one underdetermined by its passage, one for tier balance).
// Tier mix 3 / 5 / 2.
//
// Prompts avoid naming the answer even where a place shares its episode title
// (the beach, the creek), so the prompt-spoiler rule passes. Honours the 7a
// exclusion list.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const whereAndWhenTwo: Round = {
  id: 'where-and-when-2',
  theme: 'Where and When',
  title: 'Where and When (Encore)',
  blurb: 'More of the map: the day trips, the pretend islands and the odd roadside stop.',
  questions: [
    {
      id: 'ww2-01',
      prompt: 'On the family road trip, the grey nomads pull off the highway for a giant roadside attraction the girls beg to see too. What is it called?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'The Big Peanut',
        alsoAccept: ['Big Peanut'],
      },
      source: { episode: 'Road Trip', series: 2, episodeInSeries: 46 },
    },
    {
      id: 'ww2-02',
      prompt: 'A backyard event has Bandit and the other dads spending the whole day ripping something out of the lawn while the kids play. Ripping out what?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'Tree stumps',
        alsoAccept: ['Stumps', 'Tree stumps', 'The stumps'],
      },
      source: { episode: 'Stumpfest', series: 2, episodeInSeries: 6 },
    },
    {
      id: 'ww2-03',
      prompt: 'Bluey goes on a solo adventure following Mum\u2019s footprints along the shoreline, past crabs and a pelican. Where is the whole episode set?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'The beach',
        alsoAccept: ['Beach', 'At the beach'],
      },
      source: { episode: 'The Beach', series: 1, episodeInSeries: 26 },
    },
    {
      id: 'ww2-04',
      prompt: 'At the start of one episode the family staggers home exhausted from a day at a theme park, clutching show bags. What is the theme park called?',
      tier: 2,
      answer: { kind: 'single', answer: 'CrazyWorld', alsoAccept: ['Crazy World'] },
      source: { episode: 'Mount Mumandad', series: 1, episodeInSeries: 44 },
    },
    {
      id: 'ww2-05',
      prompt: 'Dad takes the kids to an indoor trampoline park, which is why they run late for the library. What is the trampoline place called?',
      tier: 2,
      answer: { kind: 'single', answer: 'The Trampolinium', alsoAccept: ['Trampolinium'] },
      source: { episode: 'Promises', series: 3, episodeInSeries: 4 },
    },
    {
      id: 'ww2-06',
      prompt: 'Bandit joins the girls on their make-believe island, which they have built on the floor entirely out of which art supplies?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'Coloured felt pens',
        alsoAccept: ['Felt pens', 'Felt-tip pens', 'Textas', 'Markers'],
      },
      source: { episode: 'Rug Island', series: 2, episodeInSeries: 10 },
    },
    {
      id: 'ww2-07',
      prompt: 'Bluey and her friend spend an afternoon exploring a natural bushland waterway near the neighbourhood. What is that place?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'The creek',
        alsoAccept: ['Creek', 'The bush creek'],
      },
      source: { episode: 'The Creek', series: 1, episodeInSeries: 29 },
    },
    {
      id: 'ww2-08',
      prompt: 'In the moving-house special, the family finally tracks down a runaway Frisky sitting in a gazebo at which scenic spot?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'The Lookout',
        alsoAccept: ['Lookout', 'The lookout'],
      },
      source: { episode: 'The Sign', series: 3, episodeInSeries: 49 },
    },
    {
      id: 'ww2-09',
      prompt: 'At the giant hardware store, an employee says the pizza ovens are in which aisle, warning that a flamingo means you have gone too far?',
      tier: 3,
      answer: {
        kind: 'single',
        answer: 'Aisle 300',
        alsoAccept: ['300', 'Three hundred'],
      },
      source: { episode: 'Hammerbarn', series: 2, episodeInSeries: 2 },
    },
    {
      id: 'ww2-10',
      prompt: 'In the moving-house special, the policeman says he gave Frisky a speeding ticket near her favourite kind of shop. What sort of shop?',
      tier: 3,
      answer: {
        kind: 'single',
        answer: 'A juice shop',
        alsoAccept: ['Juice shop', 'The juice shop', 'A juice bar'],
      },
      source: { episode: 'The Sign', series: 3, episodeInSeries: 49 },
    },
  ],
}
