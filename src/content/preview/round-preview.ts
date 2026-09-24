import type { Round } from '../types.ts'

// The preview round (increment 7a). Real-quality questions authored through the
// full pipeline — both checks per question, verification records alongside —
// that the owner is cleared to read to judge the SHAPE of the questions before
// 180 of them get written.
//
// These are DELIBERATELY DISJOINT from the shippable real bank (design option A):
// every question here is authored from an episode listed in
// content/preview-exclusions.json, and increment 8 excludes those episodes from
// the real bank. So reading this round spoils no question that will ever be
// sampled in increment 9. That disjointness is the whole point — see
// docs/content-pipeline.md and docs/increments.md §7a.
//
// Grounding is the episode recaps and transcripts, not the wiki's Trivia
// sections (withdrawn as a source on 24 September 2026 — see the verification
// log). Every fact was cross-anchored against a second source and passed a blind
// re-derivation with the answer withheld. The tier mix and the 3/5/2 shape are
// NOT enforced here: this is a small spread across tiers and answer shapes for
// calibration, not a shipped round.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const previewRound: Round = {
  id: 'preview-1',
  theme: 'Preview Sampler',
  title: 'Preview Sampler',
  blurb: 'A handful of real-quality questions across the answer shapes and difficulty tiers, for judging calibration.',
  questions: [
    {
      id: 'pv-001',
      prompt: 'On their camping holiday, Bluey befriends a boy at the stream who speaks French. What is his name?',
      tier: 1,
      answer: { kind: 'single', answer: 'Jean-Luc' },
      source: { episode: 'Camping', series: 1, episodeInSeries: 43 },
    },
    {
      id: 'pv-002',
      prompt: 'In their game of Grannies, Bluey and Bingo each take a granny name. What granny name does Bingo take?',
      tier: 2,
      answer: { kind: 'single', answer: 'Rita' },
      note: 'Bluey plays Janet; Bingo plays Rita, the granny who cannot hear.',
      source: { episode: 'Grannies', series: 1, episodeInSeries: 28 },
    },
    {
      id: 'pv-003',
      prompt: 'The whole argument in Grannies is over one modern dance the girls disagree grannies can do. Which dance?',
      tier: 1,
      answer: { kind: 'single', answer: 'The floss', alsoAccept: ['Floss', 'Flossing', 'The floss dance'] },
      source: { episode: 'Grannies', series: 1, episodeInSeries: 28 },
    },
    {
      id: 'pv-004',
      prompt: 'In Yoga Ball, Chilli teaches Bingo to use something so she can tell Dad when a game has gone too far. What is it?',
      tier: 2,
      answer: { kind: 'single', answer: 'Her big girl bark', alsoAccept: ['Big girl bark', 'Her big-girl bark'] },
      source: { episode: 'Yoga Ball', series: 1, episodeInSeries: 16 },
    },
    {
      id: 'pv-005',
      prompt: 'In The Sleepover, the girls play Restaurant with Muffin as their daughter. What name do they give the daughter?',
      tier: 3,
      answer: { kind: 'single', answer: 'Sheila' },
      source: { episode: 'The Sleepover', series: 1, episodeInSeries: 39 },
    },
    {
      id: 'pv-006',
      prompt: 'In Fairytale, Bandit tells a story of a 1980s holiday with his two brothers. Name both brothers.',
      tier: 2,
      answer: { kind: 'list', answers: ['Stripe', 'Rad'], maxPoints: 2 },
      note: 'Rad is also called Radley.',
      source: { episode: 'Fairytale', series: 3, episodeInSeries: 26 },
    },
    {
      id: 'pv-007',
      prompt: 'In Fairytale, a girl in a costume frees young Bandit from his jinx by reading his name. Who does Bandit say she was?',
      tier: 3,
      answer: {
        kind: 'contested',
        options: [
          { answer: 'Chilli', why: 'Bandit tells the story as though the girl was a young Chilli.' },
          {
            answer: 'Unsettled',
            why: 'Chilli playfully denies being that girl and does not remember it, so the show leaves it a genuine dispute (revisited from The Show).',
          },
        ],
        scores: 'either',
      },
      note: 'Either answer scores: the episode presents it as an unresolved dispute between Bandit and Chilli.',
      source: { episode: 'Fairytale', series: 3, episodeInSeries: 26 },
    },
    {
      id: 'pv-008',
      prompt: 'When Bandit works from home, he sits on one large inflatable object as his computer chair, which the kids keep stealing. What is it?',
      tier: 1,
      answer: { kind: 'single', answer: 'A yoga ball', alsoAccept: ['Yoga ball', 'The yoga ball', 'Exercise ball'] },
      source: { episode: 'Yoga Ball', series: 1, episodeInSeries: 16 },
    },
  ],
}
