import { describe, expect, it } from 'vitest'
import { bank } from '@bank'

// The bank guard. `technical-design.md` asks for a test asserting the default
// alias resolution is the fixture bank, so that the mechanism behind
// `design.md` §3 cannot regress unnoticed. Vitest reads the same
// `resolve.alias` as the app, so this exercises the real resolution rather than
// a copy of it.
describe('the @bank alias', () => {
  it('resolves to the fixture bank by default', () => {
    expect(bank.kind).toBe('fixtures')
  })

  it('has at least one round with at least one question', () => {
    expect(bank.rounds.length).toBeGreaterThan(0)
    expect(bank.rounds[0]?.questions.length).toBeGreaterThan(0)
  })
})

describe('the real-bank switch', () => {
  // Reached through globalThis with a local type rather than through `process`,
  // because `tsconfig.app.json` scopes its types to `vite/client`. Pulling Node's
  // globals into the app project to satisfy one test would make `process`
  // available to browser code, which is a worse trade than three lines here.
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env

  // Absence of the variable is what makes fixtures the default, so forgetting it
  // produces the harmless outcome. As of increment 1 it is set nowhere at all.
  //
  // Increment 8 sets it, and `technical-design.md` requires that to be on the
  // build step rather than job-wide. If someone sets it job-wide instead, this
  // test fails — which is the point, not a nuisance. Nothing else enforces that
  // distinction.
  it('is not set in the test environment', () => {
    expect(env?.HEELER_REAL_BANK).toBeUndefined()
  })
})
