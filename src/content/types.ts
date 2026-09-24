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
 * Which bank is loaded. Three states, not two, since increment 7a:
 *
 * - `fixtures` — invented content, the safe default, ships in every ordinary
 *   build and is what any screenshot or demo link shows.
 * - `real` — the shippable question bank, selected only by the deploy workflow.
 * - `preview` — a small set of real-quality questions the owner is cleared to
 *   read, reachable only by a deliberate local command, never deployed, and
 *   disjoint from the real bank so reading it spoils no shippable question.
 *
 * This one union is the source of truth for the kind everywhere it travels: the
 * game state, a flag's bank marker, the export summary and the on-screen badge
 * all import it rather than re-spelling the three strings, so a fourth state
 * later is one edit, not six.
 */
export type BankKind = 'fixtures' | 'real' | 'preview'

/**
 * What a bank module exports. All three banks satisfy this, and the app imports
 * exactly one of them through the `@bank` alias without ever naming either
 * file.
 */
export type Bank = {
  /** Which bank this is, so the app can show the right badge honestly. */
  kind: BankKind
  rounds: Round[]
}
