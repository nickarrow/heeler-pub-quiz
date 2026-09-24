import type { Round } from '../types.ts'

// Say That Again, round 2 (increment 8). A second dialogue-identification round,
// drawing on the corpus's deepest vein (206 transcripts). Same posture as round
// one: ONE line quoted, name the episode; never an exchange (design.md section
// 7). Twelve candidates authored; ten ship, from ten DISTINCT episodes, none of
// them a round-one answer. Each line was confirmed verbatim in its transcript
// and confirmed by an independent blind pass to identify its episode uniquely;
// two candidates were cut (one whose exact wording was not verbatim in the
// transcript, one reusing a round-one episode). Tier mix 3 / 5 / 2.
//
// The answer is the EPISODE, so no prompt gives away its own answer.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const sayThatAgainTwo: Round = {
  id: 'say-that-again-2',
  theme: 'Say That Again',
  title: 'Say That Again (Encore)',
  blurb: 'Another ten lines, the same one job: name the episode each comes from.',
  questions: [
    {
      id: 'st2-01',
      prompt: 'Name the episode. After Dad scabs her last hot chip, Bingo gets three chances to make the grown-ups dance on command as payback.',
      tier: 1,
      answer: { kind: 'single', answer: 'Dance Mode' },
      source: { episode: 'Dance Mode', series: 2, episodeInSeries: 1 },
    },
    {
      id: 'st2-02',
      prompt: 'Name the episode. Refusing to go to sleep, Bluey threatens: "I\u2019ll take everyone\u2019s bed to the dump!"',
      tier: 1,
      answer: { kind: 'single', answer: 'Unicorse' },
      source: { episode: 'Unicorse', series: 3, episodeInSeries: 8 },
    },
    {
      id: 'st2-03',
      prompt: 'Name the episode. Almost wordless: during a summer downpour, Bluey and Mum build a dam across the front path.',
      tier: 1,
      answer: { kind: 'single', answer: 'Rain' },
      source: { episode: 'Rain', series: 3, episodeInSeries: 18 },
    },
    {
      id: 'st2-04',
      prompt: 'Name the episode. Playing by herself one afternoon, the little sister loses the New Zealand piece of her world puzzle and puts up "missing" posters for it.',
      tier: 2,
      answer: { kind: 'single', answer: 'Bingo' },
      source: { episode: 'Bingo', series: 2, episodeInSeries: 9 },
    },
    {
      id: 'st2-05',
      prompt: 'Name the episode. A fortune cookie reads: "Flowers may bloom again, but a person never has a chance to be young again."',
      tier: 2,
      answer: { kind: 'single', answer: 'Takeaway' },
      source: { episode: 'Takeaway', series: 1, episodeInSeries: 14 },
    },
    {
      id: 'st2-06',
      prompt: 'Name the episode. Resting at sunset on the porch swing he has finally assembled, Bandit sighs: "This is heaven."',
      tier: 2,
      answer: { kind: 'single', answer: 'Flat Pack' },
      source: { episode: 'Flat Pack', series: 2, episodeInSeries: 24 },
    },
    {
      id: 'st2-07',
      prompt: 'Name the episode. In the waiting-room game, Rusty explains he swallowed a hippopotamus, so now he burps up baby hippos.',
      tier: 2,
      answer: { kind: 'single', answer: 'The Doctor' },
      source: { episode: 'The Doctor', series: 1, episodeInSeries: 18 },
    },
    {
      id: 'st2-08',
      prompt: 'Name the episode. In a restaurant game, the girls turn Dad into a half-chicken, half-rat creature and make him lay an egg.',
      tier: 2,
      answer: { kind: 'single', answer: 'Chickenrat' },
      source: { episode: 'Chickenrat', series: 1, episodeInSeries: 46 },
    },
    {
      id: 'st2-09',
      prompt: 'Name the episode. Smearing mud on his face to hide from Chilli in the bush, the girls\u2019 grandfather grins: "She can\u2019t find what she can\u2019t see."',
      tier: 3,
      answer: { kind: 'single', answer: 'Grandad' },
      source: { episode: 'Grandad', series: 2, episodeInSeries: 27 },
    },
    {
      id: 'st2-10',
      prompt: 'Name the episode. During Dad\u2019s backyard workout, Bingo turns up as a brand-new employee introducing herself: "I\u2019m Larn."',
      tier: 3,
      answer: { kind: 'single', answer: 'Exercise' },
      source: { episode: 'Exercise', series: 3, episodeInSeries: 39 },
    },
  ],
}
