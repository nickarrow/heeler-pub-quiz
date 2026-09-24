import { describe, expect, it } from 'vitest'
import type { Bank } from '../src/content/types.ts'
import { checkPromptsSpoilNothing, type Report } from './content-rules.ts'

// The prompt-spoiler rule, negative-tested. The owner caught a preview question
// whose prompt named the episode "Yoga Ball" while the answer was a yoga ball,
// giving itself away. This rule is the safeguard, and it runs against all three
// banks — so it must catch the leak and, just as importantly, NOT flag a prompt
// that merely names its source episode as framing.

/** A report that just collects failure messages, so a test can assert on them. */
function collectingReport(): { report: Report; failures: string[] } {
  const failures: string[] = []
  return {
    failures,
    report: { fail: (m) => failures.push(m), ran: () => {}, skipped: () => {} },
  }
}

function bankWith(prompt: string, answer: Bank['rounds'][number]['questions'][number]['answer']): Bank {
  return {
    kind: 'preview',
    rounds: [
      {
        id: 'r1',
        theme: 'T',
        title: 'T',
        blurb: 'A blurb that spoils nothing.',
        questions: [
          { id: 'q1', prompt, tier: 1, answer, source: { episode: 'Yoga Ball', series: 1, episodeInSeries: 16 } },
        ],
      },
    ],
  }
}

describe('checkPromptsSpoilNothing', () => {
  it('fails when the answer appears in its own prompt, and withholds the answer text', () => {
    const { report, failures } = collectingReport()
    const bank = bankWith(
      'Working from home in Yoga Ball, what does Bandit sit on?',
      { kind: 'single', answer: 'A yoga ball', alsoAccept: ['Yoga ball'] },
    )
    checkPromptsSpoilNothing(bank, 'preview bank', report)
    expect(failures).toHaveLength(1)
    expect(failures[0]).toContain('q1')
    // The message must not carry the answer text into a public CI log.
    expect(failures[0]?.toLowerCase()).not.toContain('yoga ball')
  })

  it('passes when the prompt names the source episode only as framing, not the answer', () => {
    const { report, failures } = collectingReport()
    // Episode named in the prompt, but the answer ("big girl bark") is not in it.
    const bank = bankWith(
      'In Yoga Ball, what does Chilli teach Bingo to use to tell Dad a game is too rough?',
      { kind: 'single', answer: 'Her big girl bark' },
    )
    checkPromptsSpoilNothing(bank, 'preview bank', report)
    expect(failures).toHaveLength(0)
  })

  it('catches a leak in any accepted variant, and in list and contested shapes', () => {
    const { report: r1, failures: f1 } = collectingReport()
    checkPromptsSpoilNothing(
      bankWith('Name the floss dance the grannies argue about.', {
        kind: 'list',
        answers: ['The floss'],
        maxPoints: 1,
      }),
      'preview bank',
      r1,
    )
    expect(f1).toHaveLength(1)

    const { report: r2, failures: f2 } = collectingReport()
    checkPromptsSpoilNothing(
      bankWith('Was the girl Chilli or not?', {
        kind: 'contested',
        options: [
          { answer: 'Chilli', why: 'x' },
          { answer: 'Unsettled', why: 'y' },
        ],
        scores: 'either',
      }),
      'preview bank',
      r2,
    )
    expect(f2).toHaveLength(1)
  })
})
