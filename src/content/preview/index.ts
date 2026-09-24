import type { Bank } from '../types.ts'
import { previewRound } from './round-preview.ts'

// The preview bank (increment 7a). Real-quality questions the owner is cleared
// to read, played only by a deliberate local command (`npm run dev:preview` or
// HEELER_BANK=preview), and NEVER deployed: the deploy workflow selects only the
// real bank, and a committed test asserts it cannot select this one.
//
// Its `kind` is 'preview', which drives the distinct on-screen badge and marks
// every dispute or void it produces `bankKind: 'preview'`, so a preview session
// can never feed increment 9's real-bank error-rate sample.
//
// Disjoint from the real bank by construction — see round-preview.ts and
// content/preview-exclusions.json.

export const bank = {
  kind: 'preview',
  rounds: [previewRound],
} satisfies Bank

export default bank
