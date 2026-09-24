// Turning a driver's scoring interaction into an integer per team. Kept out of
// the reducer because the mapping from answer shape to points is a rule worth
// testing on its own: `technical-design.md` names scoring across all three
// shapes, including list caps and the contested either/all rule, as a test
// group.
//
// The driver's raw input differs by shape:
//   single     -> a boolean per team (got it, or did not)
//   list       -> a count per team, 0..maxPoints, from the stepper
//   contested  -> a boolean per team (met the scoring rule, or did not)
//
// In every case the OUTPUT is a single integer per team, which is what lands in
// QuestionResult.awarded. That uniformity is what lets totals and void treat
// every shape the same.

import type { AnswerShape } from '../content/types.ts'
import { clampPoints } from './state.ts'

/** The most points a single question can award one team. Single and contested
 * are worth one; list is worth up to its cap. Used to clamp stepper input and to
 * size the stepper's range in the UI. */
export function maxPointsFor(answer: AnswerShape): number {
  switch (answer.kind) {
    case 'single':
      return 1
    case 'contested':
      return 1
    case 'list':
      return answer.maxPoints
  }
}

/** Clamp a raw count to 0..maxPoints, via the shared `clampPoints` so the cap,
 * the floor and the non-finite guard are defined in exactly one place. The
 * stepper should never produce out of range, but a persisted game restored from
 * a tampered or older store might. */
export function scoreList(count: number, answer: { maxPoints: number }): number {
  return clampPoints(count, answer.maxPoints)
}

/** A single or contested question awards one point when the team got it, zero
 * otherwise. The contested either/all distinction is about what COUNTS as
 * getting it, which the driver decides at the table by reading the reveal; the
 * app does not adjudicate the room's answer, so both collapse to one point here.
 * The reveal screen shows the scoring rule so the driver knows what to require. */
export function scoreBoolean(gotIt: boolean): number {
  return gotIt ? 1 : 0
}
