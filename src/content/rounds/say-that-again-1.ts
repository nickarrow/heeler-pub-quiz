import type { Round } from '../types.ts'

// Say That Again, round 1 (increment 8). A single line of dialogue is quoted and
// the team names the episode it is from. This is the one round that reproduces
// show wording, and design.md §7 argues it deliberately: ONE line per question,
// never an exchange, used for identification - recognising the words is the
// whole point, and paraphrasing would destroy the round. No line here is more
// than a sentence, and no round accumulates into a transcript.
//
// Twelve candidates authored; ten ship. Each quoted line was confirmed to
// uniquely identify its episode by an independent blind pass (given the line,
// name the episode). Two cut: one whose exact wording could not be confirmed
// verbatim in the transcript, and one to balance tiers. Tier mix 3 / 5 / 2.
//
// The answer is the EPISODE, so a prompt cannot give away its own answer here.
// Honours the 7a exclusion list.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const sayThatAgainOne: Round = {
  id: 'say-that-again-1',
  theme: 'Say That Again',
  title: 'Say That Again',
  blurb: 'One line of dialogue, and one job: name the episode it comes from.',
  questions: [
    {
      id: 'st1-01',
      prompt: 'Name the episode. Bingo, heading to the toilet before bed: "It\u2019s called a tactical wee."',
      tier: 1,
      answer: { kind: 'single', answer: 'Fruitbat' },
      source: { episode: 'Fruitbat', series: 1, episodeInSeries: 8 },
    },
    {
      id: 'st1-02',
      prompt: 'Name the episode. Bingo, in her dream, telling the Sun: "I have to go. I\u2019m a big girl now."',
      tier: 1,
      answer: { kind: 'single', answer: 'Sleepytime' },
      source: { episode: 'Sleepytime', series: 2, episodeInSeries: 26 },
    },
    {
      id: 'st1-03',
      prompt: 'Name the episode. Bluey, at a hardware-store checkout as a garden gnome is scanned: "She\u2019s taking my husband!"',
      tier: 1,
      answer: { kind: 'single', answer: 'Hammerbarn' },
      source: { episode: 'Hammerbarn', series: 2, episodeInSeries: 2 },
    },
    {
      id: 'st1-04',
      prompt: 'Name the episode. Bluey, as Dad steadies an injured bird\u2019s box while driving: "You\u2019re a good seat belt, Dad."',
      tier: 2,
      answer: { kind: 'single', answer: 'Copycat' },
      source: { episode: 'Copycat', series: 1, episodeInSeries: 38 },
    },
    {
      id: 'st1-05',
      prompt: 'Name the episode. Bandit, sending a wound-up Bingo waddling into kindy: "See ya, Wind-Up Bingo!"',
      tier: 2,
      answer: { kind: 'single', answer: 'Daddy Dropoff' },
      source: { episode: 'Daddy Dropoff', series: 2, episodeInSeries: 8 },
    },
    {
      id: 'st1-06',
      prompt: 'Name the episode. Rusty, promoting Jack after basic training: "Congratulations, Recruit Russell. You\u2019re now Private Russell."',
      tier: 2,
      answer: { kind: 'single', answer: 'Army' },
      source: { episode: 'Army', series: 2, episodeInSeries: 16 },
    },
    {
      id: 'st1-07',
      prompt: 'Name the episode. Bandit, asked what the single felt pen his daughter handed him is worth: "Everything!"',
      tier: 2,
      answer: { kind: 'single', answer: 'Rug Island' },
      source: { episode: 'Rug Island', series: 2, episodeInSeries: 10 },
    },
    {
      id: 'st1-08',
      prompt: 'Name the episode. At a pretend pool lesson, the strict Big Fish instructor introduces herself: "I\u2019m Margaret. I\u2019m not as nice as Karen."',
      tier: 2,
      answer: { kind: 'single', answer: 'Swim School' },
      source: { episode: 'Swim School', series: 2, episodeInSeries: 34 },
    },
    {
      id: 'st1-09',
      prompt: 'Name the episode. Chilli, to a daughter refusing to brush her teeth: "Boring things are still important." then "You sound like your Dad!"',
      tier: 3,
      answer: { kind: 'single', answer: 'The Pool' },
      source: { episode: 'The Pool', series: 1, episodeInSeries: 22 },
    },
    {
      id: 'st1-10',
      prompt: 'Name the episode. Bandit, giving a grand fake name on a pretend first date at the girls\u2019 restaurant: "Romeo McFlourish."',
      tier: 3,
      answer: { kind: 'single', answer: 'Fancy Restaurant' },
      source: { episode: 'Fancy Restaurant', series: 2, episodeInSeries: 17 },
    },
  ],
}
