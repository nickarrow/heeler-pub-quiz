// The content rules themselves. `validate-content.ts` decides which banks exist
// and prints the result; this file decides what is and is not acceptable.
//
// The rules split by bank, and that split is load-bearing. Structural rules apply
// to any bank. Provenance rules apply to the real bank only, because demanding
// source records of invented fixture questions would make the gate either fail
// outright or pass with nothing checked. See docs/verification-log.md.
//
// ONE RULE ABOUT OUTPUT, and it is not negotiable: no failure message ever prints
// question or answer text, regardless of bank. CI logs on a public repository are
// readable by the owner, who has opted out of reading the bank so that increment
// 9's error rate means something. A message that quoted an answer to be helpful
// would cancel that. Messages name ids and counts only.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import type { AnswerShape, Bank, Round } from '../src/content/types.ts'

/** Where a rule records what it did and what it found. */
export type Report = {
  fail(message: string): void
  ran(check: string): void
  skipped(check: string): void
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

export function checkIdsUnique(bank: Bank, label: string, report: Report): void {
  report.ran(`${label}: question ids unique across the bank`)
  const seen = new Map<string, string>()
  for (const round of bank.rounds) {
    for (const question of round.questions) {
      const previous = seen.get(question.id)
      if (previous !== undefined) {
        report.fail(
          `${label}: duplicate question id "${question.id}" in rounds "${previous}" and "${round.id}"`,
        )
      }
      seen.set(question.id, round.id)
    }
  }

  report.ran(`${label}: round ids unique across the bank`)
  const roundIds = new Set<string>()
  for (const round of bank.rounds) {
    if (roundIds.has(round.id)) {
      report.fail(`${label}: duplicate round id "${round.id}"`)
    }
    roundIds.add(round.id)
  }
}

export function checkBlurbsSpoilNothing(bank: Bank, label: string, report: Report): void {
  report.ran(`${label}: no round blurb contains an answer from its own round`)
  for (const round of bank.rounds) {
    const blurb = round.blurb.toLowerCase()
    for (const question of round.questions) {
      for (const answer of answerStrings(question.answer)) {
        if (answer.length > 0 && blurb.includes(answer.toLowerCase())) {
          // Names the question, never the answer. See the note at the top.
          report.fail(
            `${label}: blurb for round "${round.id}" gives away an answer to question ${question.id} (text withheld)`,
          )
        }
      }
    }
  }
}

export function checkFixtureShapeCoverage(bank: Bank, report: Report): void {
  report.ran('fixtures: at least one question of each answer shape')
  // A Record keyed by the union, so adding a fourth answer shape to
  // src/content/types.ts makes this object a type error rather than silently
  // stopping short of requiring it.
  const required: Record<AnswerShape['kind'], true> = { single: true, list: true, contested: true }
  const present = new Set(
    bank.rounds.flatMap((round) => round.questions.map((question) => question.answer.kind)),
  )
  for (const shape of Object.keys(required) as AnswerShape['kind'][]) {
    if (!present.has(shape)) {
      report.fail(`fixtures: no question uses the "${shape}" answer shape`)
    }
  }
}

export function checkTextEncoding(bank: Bank, label: string, report: Report): void {
  report.ran(`${label}: no mis-encoded characters in any bank text`)
  // The fixture bank was committed once carrying a double-encoded em dash. It
  // matters beyond tidiness: the blurb rule above compares by substring, so text
  // encoded two different ways stops matching and that gate passes silently.
  // Neither sequence below is ever legitimate in this bank's text.
  const corrupt = [
    { pattern: '\u00e2\u20ac', description: 'double-encoded UTF-8 (a dash or quote mangled)' },
    { pattern: '\ufffd', description: 'Unicode replacement character' },
  ]
  for (const { where, text } of bankText(bank)) {
    for (const { pattern, description } of corrupt) {
      if (text.includes(pattern)) {
        report.fail(`${label}: ${where} contains ${description}`)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Provenance rules: real bank only
// ---------------------------------------------------------------------------

export function checkTenQuestionsPerRound(rounds: Round[], report: Report): void {
  report.ran('real bank: every round has exactly ten questions')
  for (const round of rounds) {
    if (round.questions.length !== 10) {
      report.fail(
        `real bank: round "${round.id}" has ${round.questions.length} questions, expected exactly 10`,
      )
    }
  }
}

export function checkTierMix(rounds: Round[], report: Report): void {
  report.ran('real bank: tier mix 3 / 5 / 2 per round, tolerance plus or minus 1 on any tier')
  const expected = { 1: 3, 2: 5, 3: 2 } as const
  for (const round of rounds) {
    for (const tier of [1, 2, 3] as const) {
      const actual = round.questions.filter((question) => question.tier === tier).length
      if (Math.abs(actual - expected[tier]) > 1) {
        report.fail(
          `real bank: round "${round.id}" has ${actual} tier-${tier} questions, expected ${expected[tier]} plus or minus 1`,
        )
      }
    }
  }
}

/**
 * Verification records live outside `src` and stay as JSON, so they are data read
 * by this script rather than code the app could import. One file per question id.
 *
 * The shape, confirmed in increment 7a against the first authored questions and
 * reconciled with `content-pipeline.md` §2, which the increment-1 code did not
 * yet honour:
 *
 *   {
 *     "sourceUrl": string,        // where the fact was authored from
 *     "excerpt":   string,        // the grounding passage, 40 words or fewer
 *     "episode":   string,        // §2 names the episode per question; now required
 *     "checks": {                 // that BOTH checks were run — the pipeline, as data
 *       "rederivation": { "agreed": true },
 *       "crossAnchor":  { "sourceUrl": string }
 *     }
 *   }
 *
 * Two things this validates and two it deliberately does not. It requires the
 * episode AND cross-checks it against the question's own citation, so a record
 * pasted from the wrong question fails rather than passing quietly. It requires
 * the `checks` block to be PRESENT and to claim agreement — that the procedure
 * ran — but it cannot and does not adjudicate the re-derivation itself; a machine
 * cannot judge whether an answer was correctly derived, only that the record says
 * it was. The judgement lives in the authoring, recorded here so "survived the
 * two checks" is data rather than a claim in prose.
 *
 * Applies to any bank that carries provenance: the real bank, and — since 7a —
 * the preview bank, because the whole point of preview is the owner judging
 * real-quality questions that went through the full pipeline.
 */
export function checkVerificationRecords(
  rounds: Round[],
  verificationDir: string,
  label: string,
  report: Report,
): void {
  report.ran(`${label}: verification record per question, excerpt of 40 words or fewer, both checks recorded`)
  if (!existsSync(verificationDir)) {
    report.fail(`${label}: verification directory is missing: ${verificationDir}`)
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
        report.fail(`${label}: question ${question.id} has no verification record`)
        continue
      }
      const recordPath = resolve(verificationDir, `${question.id}.json`)
      let record: {
        sourceUrl?: unknown
        excerpt?: unknown
        episode?: unknown
        checks?: unknown
      }
      try {
        record = JSON.parse(readFileSync(recordPath, 'utf8')) as typeof record
      } catch {
        // The parse error is deliberately not reported. V8's JSON errors quote
        // the offending region of the file, and that region is an excerpt.
        report.fail(`${label}: verification record for ${question.id} is not valid JSON`)
        continue
      }
      if (typeof record.sourceUrl !== 'string' || record.sourceUrl.length === 0) {
        report.fail(`${label}: verification record for ${question.id} has no sourceUrl`)
      }
      if (typeof record.episode !== 'string' || record.episode.length === 0) {
        report.fail(`${label}: verification record for ${question.id} has no episode`)
      } else if (record.episode !== question.source.episode) {
        // The record was filed against a different episode than the question
        // cites — a sign it was pasted from the wrong question. Names ids and
        // that they disagree; never the episode text of either, which could hint
        // at an answer.
        report.fail(
          `${label}: verification record for ${question.id} names a different episode than the question's citation`,
        )
      }
      checkRecordChecks(record.checks, question.id, label, report)
      if (typeof record.excerpt !== 'string' || record.excerpt.length === 0) {
        report.fail(`${label}: verification record for ${question.id} has no excerpt`)
        continue
      }
      const words = countWords(record.excerpt)
      if (words > 40) {
        report.fail(`${label}: excerpt for ${question.id} is ${words} words, capped at 40`)
      }
    }
  }
}

/**
 * The `checks` block: proof, as data, that both checks from `content-pipeline.md`
 * §3 were run. Presence and structure only — a re-derivation cannot be judged by
 * a script, so this asserts the record CLAIMS agreement and a cross-anchor
 * source, not that either was sound. No message here prints any excerpt or note.
 */
function checkRecordChecks(checks: unknown, questionId: string, label: string, report: Report): void {
  if (typeof checks !== 'object' || checks === null) {
    report.fail(`${label}: verification record for ${questionId} has no checks block`)
    return
  }
  const c = checks as { rederivation?: unknown; crossAnchor?: unknown }
  const rederivation = c.rederivation as { agreed?: unknown } | undefined
  if (typeof rederivation !== 'object' || rederivation === null || rederivation.agreed !== true) {
    report.fail(
      `${label}: verification record for ${questionId} does not record a passed blind re-derivation`,
    )
  }
  const crossAnchor = c.crossAnchor as { sourceUrl?: unknown } | undefined
  if (
    typeof crossAnchor !== 'object' ||
    crossAnchor === null ||
    typeof crossAnchor.sourceUrl !== 'string' ||
    crossAnchor.sourceUrl.length === 0
  ) {
    report.fail(
      `${label}: verification record for ${questionId} does not record a cross-anchor second source`,
    )
  }
}
