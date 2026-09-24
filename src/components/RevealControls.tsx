// Dispute and void, on the reveal. `content-pipeline.md` §4: dispute records a
// question and a note without interrupting play; void drops the question from
// scoring for every team. Void is reversible here (a flag, not a mutation), so a
// mis-void can be undone; dispute is a note the review reads afterwards.
//
// Voiding rather than arguing with the screen matters beyond the moment:
// `design.md` §5 makes contested questions a deliberate feature, so without a
// void control a genuine error looks exactly like a designed one.

import { useState, type ReactElement } from 'react'

export function RevealControls({
  voided,
  onToggleVoid,
  onDispute,
}: {
  voided: boolean
  onToggleVoid: () => void
  onDispute: (note: string) => void
}): ReactElement {
  const [disputing, setDisputing] = useState(false)
  const [note, setNote] = useState('')

  function submitDispute(): void {
    const trimmed = note.trim()
    if (trimmed.length === 0) {
      return
    }
    onDispute(trimmed)
    setNote('')
    setDisputing(false)
  }

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 pt-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={`rounded border px-4 py-2 ${
            voided ? 'border-red-700 bg-red-100 text-red-900' : 'border-neutral-400'
          }`}
          aria-pressed={voided}
          onClick={onToggleVoid}
        >
          {voided ? 'Voided - restore to scoring' : 'Void this question'}
        </button>
        {!disputing ? (
          <button
            type="button"
            className="rounded border border-neutral-400 px-4 py-2"
            onClick={() => setDisputing(true)}
          >
            Dispute
          </button>
        ) : null}
      </div>

      {voided ? (
        <p role="status" className="text-sm text-red-900">
          This question is voided. It scores zero for every team and is dropped from the totals.
        </p>
      ) : null}

      {disputing ? (
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-sm">
            <span>What is wrong with this question?</span>
            <input
              className="rounded border border-neutral-400 px-3 py-2"
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-label="Dispute note"
              // eslint-disable-next-line jsx-a11y/no-autofocus -- the driver just chose to dispute; focusing the one field they need is the least-surprising behaviour
              autoFocus
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded bg-blue-700 px-4 py-2 font-medium text-white disabled:opacity-50"
              onClick={submitDispute}
              disabled={note.trim().length === 0}
            >
              Record dispute
            </button>
            <button
              type="button"
              className="rounded border border-neutral-400 px-4 py-2"
              onClick={() => {
                setNote('')
                setDisputing(false)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
