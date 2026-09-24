import type { ReactElement } from 'react'
import type { AnswerShape } from '../content/types.ts'

/**
 * Renders an answer of any of the three shapes.
 *
 * The explicit `ReactElement` return type is load-bearing. Without it, adding a
 * fourth answer shape to `content/types.ts` lets this switch fall through and
 * return `undefined`, which React renders as nothing at all — a blank answer and
 * no error. With it, the missing case is a compile error. Extracted from App in
 * increment 3 so the reveal screen and the one-question view share it.
 */
export function AnswerText({ answer }: { answer: AnswerShape }): ReactElement {
  switch (answer.kind) {
    case 'single':
      return <span>{answer.answer}</span>
    case 'list':
      return <span>{answer.answers.join(', ')}</span>
    case 'contested': {
      // Join with the connector that matches the scoring rule: "or" when either
      // answer scores, "and" when all are required. Joining "all" answers with
      // "or" reads as an either/or and invites the driver to mis-score, which a
      // cold read caught.
      const connector = answer.scores === 'either' ? ' or ' : ' and '
      return <span>{answer.options.map((option) => option.answer).join(connector)}</span>
    }
  }
}
