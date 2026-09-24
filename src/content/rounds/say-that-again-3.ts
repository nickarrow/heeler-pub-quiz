import type { Round } from '../types.ts'

// Say That Again, round 3 (increment 8). A third dialogue-identification round,
// again drawing on the corpus's deepest vein (206 transcripts). Same posture as
// rounds one and two: ONE line quoted, or one plain scene description, and the
// job is to name the episode (design.md section 7). Never an exchange.
//
// Twelve candidates authored; ten ship, from ten DISTINCT episodes, none of them
// an answer in round one or round two. Each quoted line was confirmed verbatim
// in its transcript, and an independent blind pass named every episode correctly
// with no ambiguity. Two candidates were held back (Cricket, Sticky Gecko) for
// tier balance. Tier mix 3 / 5 / 2.
//
// The answer is the EPISODE, so no prompt gives away its own answer. Honours the
// 7a exclusion list (no Camping, Grannies, Yoga Ball, The Sleepover, Fairytale).
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const sayThatAgainThree: Round = {
  id: 'say-that-again-3',
  theme: 'Say That Again',
  title: 'Say That Again (Third Serve)',
  blurb: 'Ten more lines, the same one job: name the episode each comes from.',
  questions: [
    {
      id: 'st3-01',
      prompt: 'Name the episode. Made to wear a cone so she cannot reach her thumb, Muffin melts down: "I want to suck my thu-umb!"',
      tier: 1,
      answer: { kind: 'single', answer: 'Muffin Cone' },
      source: { episode: 'Muffin Cone', series: 2, episodeInSeries: 43 },
    },
    {
      id: 'st3-02',
      prompt: 'Name the episode. The whole game is one rule, which Bluey states: "You have to keep the balloon in the air and can\u2019t let it touch the ground."',
      tier: 1,
      answer: { kind: 'single', answer: 'Keepy Uppy' },
      source: { episode: 'Keepy Uppy', series: 1, episodeInSeries: 3 },
    },
    {
      id: 'st3-03',
      prompt: 'Name the episode. A purple bilby puppet goes home from kindy for the weekend, and the family photographs its adventures for a scrapbook.',
      tier: 1,
      answer: { kind: 'single', answer: 'Bob Bilby' },
      source: { episode: 'Bob Bilby', series: 1, episodeInSeries: 12 },
    },
    {
      id: 'st3-04',
      prompt: 'Name the episode. Chilli whispers at the dinner table, handing over a green vegetable: "It turns people into any animal you want!"',
      tier: 2,
      answer: { kind: 'single', answer: 'Asparagus' },
      source: { episode: 'Asparagus', series: 1, episodeInSeries: 49 },
    },
    {
      id: 'st3-05',
      prompt: 'Name the episode. Bingo points a feather at the cereal box to make it impossible to lift: "Cereal, heavy!"',
      tier: 2,
      answer: { kind: 'single', answer: 'Featherwand' },
      source: { episode: 'Featherwand', series: 2, episodeInSeries: 3 },
    },
    {
      id: 'st3-06',
      prompt: 'Name the episode. At mothers\u2019 group, when another baby sits up first, one mum reassures Chilli: "Oh, well, you know, it\u2019s not a race."',
      tier: 2,
      answer: { kind: 'single', answer: 'Baby Race' },
      source: { episode: 'Baby Race', series: 2, episodeInSeries: 50 },
    },
    {
      id: 'st3-07',
      prompt: 'Name the episode. Defeated at a park water fountain she cannot work, Bingo despairs: "I can\u2019t do it. I\u2019ll never be able to drink water again."',
      tier: 2,
      answer: { kind: 'single', answer: 'Bike' },
      source: { episode: 'Bike', series: 1, episodeInSeries: 11 },
    },
    {
      id: 'st3-08',
      prompt: 'Name the episode. Consoling Bluey at the market stalls, Indy passes on her mum\u2019s saying: "What goes around, comes around."',
      tier: 2,
      answer: { kind: 'single', answer: 'Markets' },
      source: { episode: 'Markets', series: 1, episodeInSeries: 20 },
    },
    {
      id: 'st3-09',
      prompt: 'Name the episode. A playground game with one strict rule: you may only walk on the shade, and must never touch the sunlight.',
      tier: 3,
      answer: { kind: 'single', answer: 'Shadowlands' },
      source: { episode: 'Shadowlands', series: 1, episodeInSeries: 5 },
    },
    {
      id: 'st3-10',
      prompt: 'Name the episode. Dad plays a bedtime Santa who arrives on the balcony and slips "presents" under the kids\u2019 pillows.',
      tier: 3,
      answer: { kind: 'single', answer: 'Verandah Santa' },
      source: { episode: 'Verandah Santa', series: 1, episodeInSeries: 52 },
    },
  ],
}
