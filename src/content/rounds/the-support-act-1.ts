import type { Round } from '../types.ts'

// The Support Act, round 1 — the first real round through the full pipeline
// (increment 7). Minor and supporting characters and their small stories, the
// theme the corpus supports most deeply (157 of 157 episode articles carry a
// minor character; see verification-log.md).
//
// Twelve candidates were authored and both-checked; all twelve passed blind
// re-derivation (answer withheld) and cross-anchored against a second source.
// Ten ship here; the two cuts were for tier balance, not quality — the survival
// story is in the increment-7 verification-log entry and was reported at the
// checkpoint. Tier mix is 3 / 5 / 2, the target exactly.
//
// No prompt names its own answer (the rule the owner added after 7a); episodes
// are named as framing only where the episode title is not the answer.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const theSupportActOne: Round = {
  id: 'the-support-act-1',
  theme: 'The Support Act',
  title: 'The Support Act',
  blurb: 'The neighbourhood, the school and the extended family: everyone in the show who is not one of the four Heelers at home.',
  questions: [
    {
      id: 'sa1-01',
      prompt: 'Who is the teacher at the kids\u2019 school, the one who guides their play and tells them stories?',
      tier: 1,
      answer: { kind: 'single', answer: 'Calypso', alsoAccept: ['Miss Calypso', 'Mrs Calypso'] },
      source: { episode: 'Calypso', series: 1, episodeInSeries: 17 },
    },
    {
      id: 'sa1-02',
      prompt: 'Uncle Stripe and Aunt Trixie have two daughters, who are Bluey and Bingo\u2019s cousins. Name both.',
      tier: 1,
      answer: { kind: 'list', answers: ['Muffin', 'Socks'], maxPoints: 2 },
      source: { episode: 'Muffin Cone', series: 2, episodeInSeries: 43 },
    },
    {
      id: 'sa1-03',
      prompt: 'A terrier is the new kid at school whose one great talent is running fast. What is his name?',
      tier: 1,
      answer: { kind: 'single', answer: 'Jack', alsoAccept: ['Jack Russell'] },
      note: 'He is a Jack Russell, which is the joke: of course he can run.',
      source: { episode: 'Army', series: 2, episodeInSeries: 16 },
    },
    {
      id: 'sa1-04',
      prompt: 'Chilli\u2019s estranged older sister visits after four years, and the girls meet their aunt for the first time. What is her name?',
      tier: 2,
      answer: { kind: 'single', answer: 'Brandy' },
      source: { episode: 'Onesies', series: 3, episodeInSeries: 31 },
    },
    {
      id: 'sa1-05',
      prompt: 'The kids call him Grandad, and he is Chilli\u2019s father. What is his actual first name?',
      tier: 2,
      answer: { kind: 'single', answer: 'Mort' },
      source: { episode: 'Grandad', series: 2, episodeInSeries: 27 },
    },
    {
      id: 'sa1-06',
      prompt: 'Rusty knows all about drills, rations and patrols because of his father\u2019s job. What does Rusty\u2019s dad do?',
      tier: 2,
      answer: {
        kind: 'single',
        answer: 'He is in the army',
        alsoAccept: ['In the army', 'Army', 'A soldier', 'He is a soldier'],
      },
      source: { episode: 'Army', series: 2, episodeInSeries: 16 },
    },
    {
      id: 'sa1-07',
      prompt: 'A little dog insists, more than once, that her kind is a small but hardy breed. What breed is she?',
      tier: 2,
      answer: { kind: 'single', answer: 'Pomeranian', alsoAccept: ['A Pomeranian', 'Pom Pom is a Pomeranian'] },
      note: 'The character is Pom Pom.',
      source: { episode: 'Seesaw', series: 2, episodeInSeries: 28 },
    },
    {
      id: 'sa1-08',
      prompt: 'In the story of Bluey as a baby, one friend kept reaching each milestone first, which drove Chilli to compete. Which friend?',
      tier: 2,
      answer: { kind: 'single', answer: 'Judo' },
      source: { episode: 'Baby Race', series: 2, episodeInSeries: 50 },
    },
    {
      id: 'sa1-09',
      prompt: 'Rusty is a middle child, with an older brother and a younger sister. Name both of his siblings.',
      tier: 3,
      answer: { kind: 'list', answers: ['Digger', 'Dusty'], maxPoints: 2 },
      note: 'Digger is the older brother; Dusty the little sister.',
      source: { episode: 'Cricket', series: 3, episodeInSeries: 47 },
    },
    {
      id: 'sa1-10',
      prompt: 'At school the younger kids each have an older "buddy" who is turning twelve and moving up to big school. Name Bluey\u2019s buddy and Mackenzie\u2019s buddy.',
      tier: 3,
      answer: { kind: 'list', answers: ['Mia', 'Captain'], maxPoints: 2 },
      note: 'Mia is Bluey\u2019s buddy; Captain is Mackenzie\u2019s.',
      source: { episode: 'Barky Boats', series: 2, episodeInSeries: 31 },
    },
  ],
}
