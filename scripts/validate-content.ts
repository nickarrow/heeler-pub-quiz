// Content validation. Exits non-zero on any failure; CI runs it before the
// build, so a bank that fails does not deploy.
//
// The rules split by bank, and that split is load-bearing. Structural rules
// apply to any bank. Provenance rules apply to the real bank only, because
// demanding source records of invented fixture questions would make this gate
// either fail outright or pass vacuously — see docs/verification-log.md.
//
// This script also refuses to be quietly vacuous: if the real bank is absent it
// says so and names the rules it therefore did not apply.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { AnswerShape, Bank, Round } from '../src/content/types.ts'

const repoRoot = resolve(import.meta.dirname, '..')
const fixtureBankPath = resolve(repoRoot, 'src/content/fixtures/index.ts')
const realBankPath = resolve(repoRoot, 'src/content/rounds/index.ts')
const verificationDir = resolve(repoRoot, 'content/verification')

const failures: string[] = []
const checksRun: string[] = []
const checksSkipped: string[] = []

function fail(message: string): void {
  failures.push(message)
}

async function loadBank(path: string): Promise<Bank> {
  // pathToFileURL, not the bare path: on Windows an absolute path like
  // c:\... is read as a URL scheme by the ESM loader and rejected.
  const module = (await import(pathToFileURL(path).href)) as { bank: Bank }
  return module.bank
}

/** Every string a team could say and be marked right. */
function answerStrings(answer: AnswerShape): string[] {
  switch (answer.kind) {
    case 'single':
      return [answer.answer, ...(answer.alsoAccept ?? [])]
    case 'list':
      return answer.answers
    case 'contested':
      return answer.options.map((option) => option.answer)
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ---------------------------------------------------------------------------
// Structural rules: apply to any bank
// ---------------------------------------------------------------------------

function checkIdsUnique(bank: Bank, label: string): void {
  checksRun.push(`${label}: question ids unique across the bank`)
  const seen = new Map<string, string>()
  for (const round of bank.rounds) {
    for (const question of round.questions) {
      const previous = seen.get(question.id)
      if (previous !== undefined) {
        fail(`${label}: duplicate question id "${question.id}" in rounds "${previous}" and "${round.id}"`)
      }
      seen.set(question.id, round.id)
    }
  }

  checksRun.push(`${label}: round ids unique across the bank`)
  const roundIds = new Set<string>()
  for (const round of bank.rounds) {
    if (roundIds.has(round.id)) {
      fail(`${label}: duplicate round id "${round.id}"`)
    }
    roundIds.add(round.id)
  }
}

function checkBlurbsSpoilNothing(bank: Bank, label: string): void {
  checksRun.push(`${label}: no round blurb contains an answer from its own round`)
  for (const round of bank.rounds) {
    const blurb = round.blurb.toLowerCase()
    for (const question of round.questions) {
      for (const answer of answerStrings(question.answer)) {
        if (answer.length > 0 && blurb.includes(answer.toLowerCase())) {
          fail(`${label}: blurb for round "${round.id}" contains the answer "${answer}" from question ${question.id}`)
        }
      }
    }
  }
}

function checkFixtureShapeCoverage(bank: Bank): void {
  checksRun.push('fixtures: at least one question of each answer shape')
  const shapes = new Set(
    bank.rounds.flatMap((round) => round.questions.map((question) => question.answer.kind)),
  )
  for (const required of ['single', 'list', 'contested'] as const) {
    if (!shapes.has(required)) {
      fail(`fixtures: no question uses the "${required}" answer shape`)
    }
  }
}

// ---------------------------------------------------------------------------
// Provenance rules: real bank only
// ---------------------------------------------------------------------------

function checkTenQuestionsPerRound(rounds: Round[]): void {
  checksRun.push('real bank: every round has exactly ten questions')
  for (const round of rounds) {
    if (round.questions.length !== 10) {
      fail(`real bank: round "${round.id}" has ${round.questions.length} questions, expected exactly 10`)
    }
  }
}

function checkTierMix(rounds: Round[]): void {
  checksRun.push('real bank: tier mix 3 / 5 / 2 per round, tolerance plus or minus 1 on any tier')
  const expected = { 1: 3, 2: 5, 3: 2 } as const
  for (const round of rounds) {
    for (const tier of [1, 2, 3] as const) {
      const actual = round.questions.filter((question) => question.tier === tier).length
      if (Math.abs(actual - expected[tier]) > 1) {
        fail(
          `real bank: round "${round.id}" has ${actual} tier-${tier} questions, expected ${expected[tier]} plus or minus 1`,
        )
      }
    }
  }
}

/**
 * Verification records live outside `src` and stay as JSON, so they are data
 * read by this script rather than code the app could import. One file per
 * question id. The record shape is confirmed in increment 7, when the first
 * real round is authored and there is something to confirm it against.
 */
function checkVerificationRecords(rounds: Round[]): void {
  checksRun.push('real bank: verification record per question, excerpt of 40 words or fewer')
  if (!existsSync(verificationDir)) {
    fail(`real bank: verification directory is missing: ${verificationDir}`)
    return
  }
  const records = new Set(
    readdirSync(verificationDir)
      .filter((name) => name.endsWith('.json'))
      .map((name) => name.replace(/\.json$/, '')),
  )
  for (const round of rounds) {
    for (const question of round.questions) {
      if (!records.has(question.id)) {
        fail(`real bank: question ${question.id} has no verification record`)
        continue
      }
      const recordPath = resolve(verificationDir, `${question.id}.json`)
      let record: { sourceUrl?: unknown; excerpt?: unknown }
      try {
        record = JSON.parse(readFileSync(recordPath, 'utf8')) as typeof record
      } catch (error) {
        fail(`real bank: verification record for ${question.id} is not valid JSON: ${String(error)}`)
        continue
      }
      if (typeof record.sourceUrl !== 'string' || record.sourceUrl.length === 0) {
        fail(`real bank: verification record for ${question.id} has no sourceUrl`)
      }
      if (typeof record.excerpt !== 'string' || record.excerpt.length === 0) {
        fail(`real bank: verification record for ${question.id} has no excerpt`)
        continue
      }
      const words = countWords(record.excerpt)
      if (words > 40) {
        fail(`real bank: excerpt for ${question.id} is ${words} words, capped at 40`)
      }
    }
  }
}

// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  if (!existsSync(fixtureBankPath)) {
    fail(`fixture bank is missing: ${fixtureBankPath}`)
  } else {
    const fixtures = await loadBank(fixtureBankPath)
    if (fixtures.kind !== 'fixtures') {
      fail(`fixture bank declares kind "${fixtures.kind}", expected "fixtures"`)
    }
    checkIdsUnique(fixtures, 'fixtures')
    checkBlurbsSpoilNothing(fixtures, 'fixtures')
    checkFixtureShapeCoverage(fixtures)
  }

  if (existsSync(realBankPath)) {
    const real = await loadBank(realBankPath)
    if (real.kind !== 'real') {
      fail(`real bank declares kind "${real.kind}", expected "real"`)
    }
    checkIdsUnique(real, 'real bank')
    checkBlurbsSpoilNothing(real, 'real bank')
    checkTenQuestionsPerRound(real.rounds)
    checkTierMix(real.rounds)
    checkVerificationRecords(real.rounds)
  } else {
    // Not a failure. The real bank does not exist until increment 7, and a gate
    // that silently reports success while checking nothing is worse than one
    // that tells you what it skipped.
    checksSkipped.push('real bank: exactly ten questions per round')
    checksSkipped.push('real bank: tier mix 3 / 5 / 2 per round')
    checksSkipped.push('real bank: verification record per question, excerpt ≤ 40 words')
    checksSkipped.push('real bank: id uniqueness and blurb spoiler check')
  }

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
    process.exit(1)
  }

  console.log(`\nContent validation passed. ${checksRun.length} check(s) ran, ${checksSkipped.length} skipped.`)
}

await main()
