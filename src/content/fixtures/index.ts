import type { Bank } from '../types.ts'
import { roundOne } from './round-01.ts'
import { shortRoundsA } from './short-rounds-a.ts'
import { shortRoundsB } from './short-rounds-b.ts'

// The fixture bank. Everything here is invented for testing and none of it is
// about the show, which is the point. `content-pipeline.md` calls for fixtures
// written by hand rather than drawn from the corpus, and they stay in the repo
// as the permanent test fixture.
//
// Twelve rounds: one detailed ten-question round (round-01) that increment 3
// plays through for scoring, plus eleven short three-question rounds
// (short-rounds-a and -b) that increment 4 deals from to prove no round repeats
// across three games of four rounds. Split across files to keep each inside the
// length target; assembled here in a stable, deliberate order.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const bank = {
  kind: 'fixtures',
  rounds: [roundOne, ...shortRoundsA, ...shortRoundsB],
} satisfies Bank

export default bank
