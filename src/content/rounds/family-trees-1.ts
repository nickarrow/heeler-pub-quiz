import type { Round } from '../types.ts'

// Family Trees, round 1 (increment 8). Relationships across the Heeler, Cattle
// and neighbouring families. Twelve candidates authored; all twelve passed both
// checks (blind re-derivation with the answer withheld, cross-anchor against a
// second source). Ten ship; two were cut as near-duplicates of kept facts.
// Deliberately avoids the Family-adjacent facts already used elsewhere (Brandy,
// Mort, Rusty's siblings, Bella). Tier mix 3 / 5 / 2 exactly.
//
// No prompt names its own answer. Honours the 7a exclusion list.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const familyTreesOne: Round = {
  id: 'family-trees-1',
  theme: 'Family Trees',
  title: 'Family Trees',
  blurb: 'Who belongs to whom: the parents, the cousins, the aunties and uncles and the grandparents across the families.',
  questions: [
    {
      id: 'ft1-01',
      prompt: 'Bandit has a brother who is also a dad and cooks the barbecue beside him. What is that brother\u2019s name?',
      tier: 1,
      answer: { kind: 'single', answer: 'Stripe' },
      source: { episode: 'BBQ', series: 1, episodeInSeries: 7 },
    },
    {
      id: 'ft1-02',
      prompt: 'Uncle Stripe and Aunt Trixie\u2019s two daughters are the girls\u2019 cousins. Name both girls.',
      tier: 1,
      answer: { kind: 'list', answers: ['Muffin', 'Socks'], maxPoints: 2 },
      source: { episode: 'BBQ', series: 1, episodeInSeries: 7 },
    },
    {
      id: 'ft1-03',
      prompt: 'The grandmother who minds all the grandkids, and is Bandit\u2019s own mum, goes by Nana. What is her actual name?',
      tier: 1,
      answer: { kind: 'single', answer: 'Chris' },
      source: { episode: 'Charades', series: 2, episodeInSeries: 11 },
    },
    {
      id: 'ft1-04',
      prompt: 'Stripe\u2019s wife, the mother of the two Heeler cousins, is which character?',
      tier: 2,
      answer: { kind: 'single', answer: 'Trixie' },
      source: { episode: 'BBQ', series: 1, episodeInSeries: 7 },
    },
    {
      id: 'ft1-05',
      prompt: 'Besides Stripe, Bandit has a second brother, an uncle to the girls, who turns up to babysit. What is his name?',
      tier: 2,
      answer: { kind: 'single', answer: 'Rad', alsoAccept: ['Radley', 'Uncle Rad'] },
      source: { episode: 'Double Babysitter', series: 2, episodeInSeries: 39 },
    },
    {
      id: 'ft1-06',
      prompt: 'Frisky turns up to babysit alongside Uncle Rad. What is her established relationship to Bluey?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'Her godmother',
        alsoAccept: ['Godmother', 'Fairy godmother', 'Bluey\u2019s godmother'],
      },
      source: { episode: 'Double Babysitter', series: 2, episodeInSeries: 39 },
    },
    {
      id: 'ft1-07',
      prompt: 'In the Labrador family who watch the rugby, who is the mother of Lucky and Chucky?',
      tier: 2,
      answer: { kind: 'single', answer: 'Janelle' },
      source: { episode: 'The Decider', series: 3, episodeInSeries: 37 },
    },
    {
      id: 'ft1-08',
      prompt: 'Who is the father of Lucky and Chucky, the head of the Labrador family?',
      tier: 2,
      answer: { kind: 'single', answer: 'Pat', alsoAccept: ['Lucky\u2019s Dad'] },
      source: { episode: 'The Decider', series: 3, episodeInSeries: 37 },
    },
    {
      id: 'ft1-09',
      prompt: 'In the Labrador family, Chucky is the younger brother of which other pup?',
      tier: 3,
      answer: { kind: 'single', answer: 'Lucky' },
      source: { episode: 'The Decider', series: 3, episodeInSeries: 37 },
    },
    {
      id: 'ft1-10',
      prompt: 'Muffin and Socks are cousins to Bluey and Bingo. What are Muffin and Socks to each other?',
      tier: 3,
      answer: { kind: 'single', answer: 'Sisters' },
      source: { episode: 'Faceytalk', series: 3, episodeInSeries: 24 },
    },
  ],
}
