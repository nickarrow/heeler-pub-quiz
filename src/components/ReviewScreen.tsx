// The review screen. Lists the flags raised during play and exports them, which
// is the handoff `content-pipeline.md` §4 describes: the app does not correct or
// edit questions, it records what went wrong and hands it off. Reachable from the
// final screen so the review sits at the natural end of an evening.

import type { ReactElement } from 'react'
import { downloadTextFile } from '../game/download.ts'
import type { Flag } from '../game/flags.ts'
import { flagExportJson } from '../game/flagExport.ts'

export function ReviewScreen({
  flags,
  onBack,
}: {
  flags: Flag[]
  onBack: () => void
}): ReactElement {
  function downloadExport(): void {
    const now = new Date().toISOString()
    downloadTextFile(
      `heeler-pub-quiz-flags-${now.slice(0, 10)}.json`,
      flagExportJson(flags, now),
      'application/json',
    )
  }

  const disputes = flags.filter((flag) => flag.kind === 'dispute').length
  const voids = flags.filter((flag) => flag.kind === 'void').length

  return (
    <section className="flex flex-col gap-4" aria-labelledby="review-heading">
      <h2 id="review-heading" className="text-2xl font-medium">
        Flagged questions
      </h2>

      {flags.length === 0 ? (
        <p className="text-neutral-700">
          No questions were disputed or voided this evening. Nothing to export.
        </p>
      ) : (
        <>
          <p className="text-neutral-700">
            {disputes} {disputes === 1 ? 'dispute' : 'disputes'} and {voids}{' '}
            {voids === 1 ? 'void' : 'voids'} recorded.
          </p>
          <ul className="flex flex-col gap-2" aria-label="Flagged questions">
            {flags.map((flag, index) => (
              <li
                key={`${flag.questionId}-${flag.at}-${index}`}
                className="flex flex-col gap-1 rounded border border-neutral-300 px-4 py-3"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      flag.kind === 'void'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {flag.kind}
                  </span>
                  <span className="font-medium">{flag.questionId}</span>
                  <span className="text-xs text-neutral-500">({flag.bankKind})</span>
                </span>
                {flag.note !== undefined ? (
                  <span className="text-sm text-neutral-700">{flag.note}</span>
                ) : null}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="self-start rounded bg-blue-700 px-4 py-2 font-medium text-white"
            onClick={downloadExport}
          >
            Export flags as JSON
          </button>
        </>
      )}

      <button
        type="button"
        className="self-start rounded border border-neutral-400 px-4 py-2"
        onClick={onBack}
      >
        Back to the standings
      </button>
    </section>
  )
}
