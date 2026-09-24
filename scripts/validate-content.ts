// Content validation. Exits non-zero on any failure; CI runs it before the build,
// so a bank that fails does not deploy.
//
// This file works out which banks exist, runs the applicable rules from
// content-rules.ts, and prints the outcome. It refuses to be quietly empty: if the
// real bank is absent it says so and names the rules it therefore did not apply,
// because a gate reporting success while checking nothing is worse than one that
// tells you what it skipped.

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Bank } from '../src/content/types.ts'
import { fixtureBankRelativePath, realBankRelativePath } from './bank-paths.ts'
import type { Report } from './content-rules.ts'
import {
  checkBlurbsSpoilNothing,
  checkFixtureShapeCoverage,
  checkIdsUnique,
  checkTenQuestionsPerRound,
  checkTextEncoding,
  checkTierMix,
  checkVerificationRecords,
} from './content-rules.ts'

const repoRoot = resolve(import.meta.dirname, '..')
const fixtureBankPath = resolve(repoRoot, fixtureBankRelativePath)
const realBankPath = resolve(repoRoot, realBankRelativePath)
const verificationDir = resolve(repoRoot, 'content/verification')

const failures: string[] = []
const checksRun: string[] = []
const checksSkipped: string[] = []

const report: Report = {
  fail: (message) => failures.push(message),
  ran: (check) => checksRun.push(check),
  skipped: (check) => checksSkipped.push(check),
}

async function loadBank(path: string): Promise<Bank> {
  // pathToFileURL, not the bare path: on Windows an absolute path like c:\... is
  // read as a URL scheme by the ESM loader and rejected.
  const module = (await import(pathToFileURL(path).href)) as { bank: Bank }
  return module.bank
}

async function validateFixtureBank(): Promise<void> {
  if (!existsSync(fixtureBankPath)) {
    report.fail(`fixture bank is missing: ${fixtureBankPath}`)
    return
  }
  const fixtures = await loadBank(fixtureBankPath)
  if (fixtures.kind !== 'fixtures') {
    report.fail(`fixture bank declares kind "${fixtures.kind}", expected "fixtures"`)
  }
  checkIdsUnique(fixtures, 'fixtures', report)
  checkBlurbsSpoilNothing(fixtures, 'fixtures', report)
  checkFixtureShapeCoverage(fixtures, report)
  checkTextEncoding(fixtures, 'fixtures', report)
}

async function validateRealBank(): Promise<void> {
  if (!existsSync(realBankPath)) {
    // Expected until increment 7. Named rather than passed over in silence.
    report.skipped('real bank: exactly ten questions per round')
    report.skipped('real bank: tier mix 3 / 5 / 2 per round')
    report.skipped('real bank: verification record per question, excerpt of 40 words or fewer')
    report.skipped('real bank: id uniqueness, blurb spoilers, text encoding')
    return
  }
  const real = await loadBank(realBankPath)
  if (real.kind !== 'real') {
    report.fail(`real bank declares kind "${real.kind}", expected "real"`)
  }
  checkIdsUnique(real, 'real bank', report)
  checkBlurbsSpoilNothing(real, 'real bank', report)
  checkTextEncoding(real, 'real bank', report)
  checkTenQuestionsPerRound(real.rounds, report)
  checkTierMix(real.rounds, report)
  checkVerificationRecords(real.rounds, verificationDir, report)
}

function printOutcome(): void {
  for (const check of checksRun) {
    console.log(`  ran      ${check}`)
  }
  for (const check of checksSkipped) {
    console.log(`  SKIPPED  ${check}`)
  }

  if (checksSkipped.length > 0) {
    console.log(`\nThe real bank is not present at ${realBankPath}, so the rules above marked`)
    console.log('SKIPPED were not applied. That is expected until increment 7.')
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} content validation failure(s):`)
    for (const failure of failures) {
      console.error(`  - ${failure}`)
    }
    // exitCode rather than process.exit(1). Node does not flush pending async
    // writes on exit, and in CI both streams are pipes, so exiting here can
    // truncate the list that was just printed.
    process.exitCode = 1
    return
  }

  console.log(
    `\nContent validation passed. ${checksRun.length} check(s) ran, ${checksSkipped.length} skipped.`,
  )
}

await validateFixtureBank()
await validateRealBank()
printOutcome()
