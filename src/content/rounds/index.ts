import type { Bank } from '../types.ts'
import { familyTreesOne } from './family-trees-1.ts'
import { gamesTheyInventedOne } from './games-they-invented-1.ts'
import { propsDepartmentOne } from './props-department-1.ts'
import { sayThatAgainOne } from './say-that-again-1.ts'
import { sayThatAgainTwo } from './say-that-again-2.ts'
import { theSupportActOne } from './the-support-act-1.ts'
import { whereAndWhenOne } from './where-and-when-1.ts'

// The real bank: the shippable question bank, drawn from the corpus and checked
// two independent ways per question (content-pipeline.md §3). Selected only by
// the deploy workflow, from increment 8 onward, via HEELER_BANK=real on the
// build step; never the default, never reachable from an ordinary command.
//
// Increment 7 seeds it with one full round as a pipeline proof. Increment 8
// authors the rest at the measured survival rate, honouring the 7a exclusion
// list in content/preview-exclusions.json so no preview question enters here.
//
// Keep bank files free of typographic punctuation. Plain hyphens and straight
// quotes only. See scripts/content-rules.ts and the encoding rule it enforces.

export const bank = {
  kind: 'real',
  rounds: [
    theSupportActOne,
    whereAndWhenOne,
    gamesTheyInventedOne,
    familyTreesOne,
    sayThatAgainOne,
    propsDepartmentOne,
    sayThatAgainTwo,
  ],
} satisfies Bank

export default bank
