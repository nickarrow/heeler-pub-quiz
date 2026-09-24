import type { Round } from '../types.ts'

// Games They Invented, round 1 (increment 8). The made-up games and their rules,
// roles, invented terms and winners. Twelve candidates authored from the corpus;
// all twelve passed both checks (blind re-derivation with the answer withheld,
// cross-anchor against the episode's transcript). Ten ship; two were cut for
// tier balance (a real-game forfeit and an in-game mallet name), not quality.
// Tier mix 3 / 5 / 2 exactly.
//
// Every fact is ABOUT a game (a rule, role, term, winner) rather than the game's
// name, so no prompt gives away its answer even where the game shares an episode
// title. Honours the 7a exclusion list.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const gamesTheyInventedOne: Round = {
  id: 'games-they-invented-1',
  theme: 'Games They Invented',
  title: 'Games They Invented',
  blurb: 'The rules, the roles and the made-up creatures of the games the kids dream up on the spot.',
  questions: [
    {
      id: 'gt1-01',
      prompt: 'In the shade-and-sunlight game, the shady ground is safe. What does the sunlit grass count as, the thing you must never step into?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'Crocodile-infested sea',
        alsoAccept: ['Crocodiles', 'The sea', 'Water', 'Crocodile sea', 'Lava-style crocodile water'],
      },
      source: { episode: 'Shadowlands', series: 1, episodeInSeries: 5 },
    },
    {
      id: 'gt1-02',
      prompt: 'Bingo carries a magic feather that, against all expectation, does what to anything she points it at?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'Makes it incredibly heavy',
        alsoAccept: ['Makes it heavy', 'Makes things heavy', 'Heavy'],
      },
      source: { episode: 'Featherwand', series: 2, episodeInSeries: 3 },
    },
    {
      id: 'gt1-03',
      prompt: 'In the herding game, Bluey and Bingo are the working dogs rounding up the flock. What animal does Dad play?',
      tier: 1,
      answer: {
        kind: 'single',
        answer: 'A sheep',
        alsoAccept: ['The sheep', 'Sheepy', 'A sheep on all fours'],
      },
      source: { episode: 'Sheepdog', series: 3, episodeInSeries: 12 },
    },
    {
      id: 'gt1-04',
      prompt: 'In the spy game in the park, Bingo makes the potion and refuses to answer to anything but which codename?',
      tier: 2,
      answer: { kind: 'single', answer: 'Sparkleshot' },
      source: { episode: 'Spy Game', series: 1, episodeInSeries: 13 },
    },
    {
      id: 'gt1-05',
      prompt: 'In the restaurant game, Bandit orders a chickenrat egg. What two animals is a chickenrat said to be a mix of?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'Half chicken, half rat',
        alsoAccept: ['Chicken and rat', 'A chicken and a rat', 'Half-chicken half-rat'],
      },
      source: { episode: 'Chickenrat', series: 1, episodeInSeries: 46 },
    },
    {
      id: 'gt1-06',
      prompt: 'When the girls tell the tidying-up robot they never want to clean again, its logic makes it try to put them where?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'In the wheelie bin',
        alsoAccept: ['The wheelie bin', 'The rubbish bin', 'The bin', 'Out with the rubbish'],
      },
      source: { episode: 'Daddy Robot', series: 1, episodeInSeries: 4 },
    },
    {
      id: 'gt1-07',
      prompt: 'The girls race up their sleeping parents in a five-minute bedtime game. How do they finish the climb and win?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'Plant a flag on Bandit\u2019s head',
        alsoAccept: ['Plant the flag on Dad\u2019s head', 'A flag on Bandit\u2019s head', 'Flag on Dad\u2019s head'],
      },
      source: { episode: 'Mount Mumandad', series: 1, episodeInSeries: 44 },
    },
    {
      id: 'gt1-08',
      prompt: 'Playing his home-made claw machine, Dad dangles one grand special prize to tempt Bluey. What is the prize?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'A bottomless bowl of ice cream',
        alsoAccept: ['Bottomless ice cream', 'Two bottomless bowls of ice cream', 'Bottomless bowl of ice cream'],
      },
      source: { episode: 'The Claw', series: 1, episodeInSeries: 19 },
    },
    {
      id: 'gt1-09',
      prompt: 'In the imagination chase game, the kids credit their Dreamhouse Car to a "science butler." What is his name?',
      tier: 3,
      answer: { kind: 'single', answer: 'Jerry Lee' },
      source: { episode: 'Escape', series: 2, episodeInSeries: 21 },
    },
    {
      id: 'gt1-10',
      prompt: 'Fleeing the tickle crabs, Bandit gives himself a grand heroic fake name while hiding with Chilli. What name does he take?',
      tier: 3,
      answer: { kind: 'single', answer: 'Telemachus' },
      source: { episode: 'Ticklecrabs', series: 2, episodeInSeries: 20 },
    },
  ],
}
