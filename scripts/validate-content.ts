// Content validation. Exits non-zero on any failure; CI runs it before the
// build, so a bank that fails does not deploy.
//
// The rules split by bank, and that split is load-bearing. Structural rules
// apply to any bank. Provenance rules apply to the real bank only, because
// demanding source records of invented fixture questions would make this gate
// either fail outright or pass with nothing checked. See docs/verification-log.md.
//
// Two properties of the output matter as much as the rules:
//
// 1. No failure message ever prints question or answer text. CI logs on a public
//    repository are readable by the owner, who has opted out of reading the bank
//    so that increment 9's error rate means something. A message that quotes an
//    answer to be helpful would cancel that. Messages name ids and counts only.
// 2. It refuses to be quietly empty: if the real bank is absent it says so and
//    names the rules it therefore did not apply.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { AnswerShape, Bank, Round } from '../src/content/types.ts'
import { fixtureBankRelativePath, realBankRelativePath } from './bank-paths.ts'

const repoRoot = resolve(import.meta.dirname, '..')
const fixtureBankPath = resolve(repoRoot, fixtureBankRelativePath)
const realBankPath = resolve(repoRoot, realBankRelativePath)
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

/** Every human-readable string in a bank, each labelled by where it lives. */
function bankText(bank: Bank): { where: string; text: string }[] {
  const entries: { where: string; text: string }[] = []
  for (const round of bank.rounds) {
    entries.push({ where: `round ${round.id} title`, text: round.title })
    entries.push({ where: `round ${round.id} blurb`, text: round.blurb })
    entries.push({ where: `round ${round.id} theme`, text: round.theme })
    for (const question of round.questions) {
      entries.push({ where: `question ${question.id} prompt`, text: question.prompt })
      entries.push({ where: `question ${question.id} episode`, text: question.source.episode })
      if (question.note !== undefined) {
        entries.push({ where: `question ${question.id} note`, text: question.note })
      }
      for (const answer of answerStrings(question.answer)) {
        entries.push({ where: `question ${question.id} answer`, text: answer })
      }
      if (question.answer.kind === 'contested') {
        for (const option of question.answer.options) {
          entries.push({ where: `question ${question.id} contested note`, text: option.why })
        }
      }
    }
  }
  return entries
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
          // Names the question, never the answer. See the note at the top.
          fail(
            `${label}: blurb for round "${round.id}" gives away an answer to question ${question.id} (text withheld)`,
          )
        }
      }
    }
  }
}

function checkFixtureShapeCoverage(bank: Bank): void {
  checksRun.push('fixtures: at least one question of each answer shape')
  // A Record keyed by the union, so adding a fourth answer shape to
  // src/content/types.ts makes this object a type error rather than silently
  // stopping short of requiring it.
  const required: Record<AnswerShape['kind'], true> = { single: true, list: true, contested: true }
  const present = new Set(
    bank.rounds.flatMap((round) => round.questions.map((question) => question.answer.kind)),
  )
  for (const shape of Object.keys(required) as AnswerShape['kind'][]) {
    if (!present.has(shape)) {
      fail(`fixtures: no question uses the "${shape}" answer shape`)
    }
  }
}

function checkTextEncoding(bank: Bank, label: string): void {
  checksRun.push(`${label}: no mis-encoded characters in any bank text`)
  // This file was committed once carrying a double-encoded em dash. It matters
  // beyond tidiness: the blurb check above compares by substring, so text
  // encoded two different ways stops matching and that gate passes silently.
  // Neither sequence below is ever legitimate in this bank's text.
  const corrupt: { pattern: string; description: string }[] = [
    { pattern: '\u00e2\u20ac', description: 'double-encoded UTF-8 (a dash or quote mangled)' },
    { pattern: '\ufffd', description: 'Unicode replacement character' },
  ]
  for (const { where, text } of bankText(bank)) {
    for (const { pattern, description } of corrupt) {
      if (text.includes(pattern)) {
        fail(`${label}: ${where} contains ${description}`)
      }
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
 * question id, holding `sourceUrl` and `excerpt`. The shape is provisional: it
 * is confirmed in increment 7, when the first real round is authored and there
 * is something to confirm it against. `content-pipeline.md` §2 also names the
 * episode as recorded per question, which this does not yet require.
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
      } catch {
        // The parse error is deliberately not reported. V8's JSON errors quote
        // the offending region of the file, and that region is an excerpt.
        fail(`real bank: verification record for ${question.id} is not valid JSON`)
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
    checkTextEncoding(fixtures, 'fixtures')
  }

  if (existsSync(realBankPath)) {
    const real = await loadBank(realBankPath)
    if (real.kind !== 'real') {
      fail(`real bank declares kind "${real.kind}", expected "real"`)
    }
    checkIdsUnique(real, 'real bank')
    checkBlurbsSpoilNothing(real, 'real bank')
    checkTextEncoding(real, 'real bank')
    checkTenQuestionsPerRound(real.rounds)
    checkTierMix(real.rounds)
    checkVerificationRecords(real.rounds)
  } else {
    // Not a failure. The real bank does not exist until increment 7, and a gate
    // that silently reports success while checking nothing is worse than one
    // that tells you what it skipped.
    checksSkipped.push('real bank: exactly ten questions per round')
    checksSkipped.push('real bank: tier mix 3 / 5 / 2 per round')
    checksSkipped.push('real bank: verification record per question, excerpt of 40 words or fewer')
    checksSkipped.push('real bank: id uniqueness, blurb spoilers, text encoding')
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
    // exitCode rather than process.exit(1). Node does not flush pending async
    // writes on exit, and in CI both streams are pipes, so exiting here can
    // truncate the list that was just printed.
    process.exitCode = 1
    return
  }

  console.log(`\nContent validation passed. ${checksRun.length} check(s) ran, ${checksSkipped.length} skipped.`)
}

await main()
