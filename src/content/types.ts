// The content data model. TypeScript modules rather than JSON, because
// TypeScript widens JSON imports and the tagged union below would not be
// checked without a cast.
//
// What `satisfies Round` catches: wrong value types, excess keys, a tier
// outside 1 to 3. What it cannot catch: ten questions per round, id uniqueness
// across files, a forty-word excerpt cap, or a blurb checked against its own
// round's answers. Those are runtime code in scripts/validate-content.ts.

export type Citation = {
  /** Episode title, e.g. "Sleepytime". */
  episode: string
  series: 1 | 2 | 3
  episodeInSeries: number
}

export type AnswerShape =
  | { kind: 'single'; answer: string; alsoAccept?: string[] }
  | { kind: 'list'; answers: string[]; maxPoints: number }
  | { kind: 'contested'; options: { answer: string; why: string }[]; scores: 'either' | 'all' }

export type Question = {
  /** Stable across edits; never reused. */
  id: string
  prompt: string
  tier: 1 | 2 | 3
  answer: AnswerShape
  /** One line on the reveal. */
  note?: string
  source: Citation
}

export type Round = {
  /** e.g. "support-act-1". */
  id: string
  theme: string
  title: string
  /** One line of framing, checked against its own round's answers. */
  blurb: string
  /**
   * Not typed as a ten-tuple. Ten is a rule about the real bank, enforced at
   * validation time, because fixture rounds are deliberately short.
   */
  questions: Question[]
}

/**
 * What a bank module exports. Both banks satisfy this, and the app imports
 * exactly one of them through the `@bank` alias without ever naming either
 * file.
 */
export type Bank = {
  /** Which bank this is, so the app can show the fixture badge honestly. */
  kind: 'fixtures' | 'real'
  rounds: Round[]
}
