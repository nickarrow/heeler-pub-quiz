import { describe, expect, it } from 'vitest'
import { bank } from '@bank'

// The bank guard. `technical-design.md` asks for a test asserting the default
// alias resolution is the fixture bank, so that the mechanism behind
// `design.md` §3 cannot regress unnoticed. Vitest reads the same
// `resolve.alias` as the app, so this exercises the real resolution rather than
// a copy of it.
//
// Since increment 7a the alias chooses between three banks through one
// tri-valued variable, HEELER_BANK. This file guards the DEFAULT resolution; the
// other half of the guarantee — that the deploy path can select only the real
// bank, never preview — lives in scripts/deploy-workflow.test.ts, because
// reading the workflow file needs Node types this app-scoped project excludes.
describe('the @bank alias', () => {
  it('resolves to the fixture bank by default', () => {
    expect(bank.kind).toBe('fixtures')
  })

  it('has at least one round with at least one question', () => {
    expect(bank.rounds.length).toBeGreaterThan(0)
    expect(bank.rounds[0]?.questions.length).toBeGreaterThan(0)
  })
})

describe('the bank selector', () => {
  // Reached through globalThis with a local type rather than through `process`,
  // because `tsconfig.app.json` scopes its types to `vite/client`. Pulling Node's
  // globals into the app project to satisfy one test would make `process`
  // available to browser code, which is a worse trade than three lines here.
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env

  // Absence of the variable is what makes fixtures the default, so forgetting it
  // — or typo'ing it — produces the harmless outcome. It is set nowhere in the
  // repository, and the deploy workflow does not set it until increment 8.
  it('is not set in the test environment', () => {
    expect(env?.HEELER_BANK).toBeUndefined()
  })

  // The retired boolean must stay retired. If it reappears, the tri-valued
  // selector in vite.config.ts is not the one thing choosing the bank, and the
  // guarantee reasoning above no longer holds.
  it('does not read the retired HEELER_REAL_BANK variable', () => {
    expect(env?.HEELER_REAL_BANK).toBeUndefined()
  })
})
