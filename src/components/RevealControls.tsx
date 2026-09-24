// Dispute and void, on the reveal. `content-pipeline.md` §4: dispute records a
// question and a note without interrupting play; void drops the question from
// scoring for every team. Void is reversible here (a flag, not a mutation), so a
// mis-void can be undone; dispute is a note the review reads afterwards.
//
// Voiding rather than arguing with the screen matters beyond the moment:
// `design.md` §5 makes contested questions a deliberate feature, so without a
// void control a genuine error looks exactly like a designed one.

import { useState, type ReactElement } from 'react'
import { Button, TARGET_SIZE } from './Button.tsx'

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
    <div className="flex flex-col gap-3 border-t-2 border-ink/15 pt-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className={voided ? 'border-red-800 bg-red-100 text-red-800' : ''}
          aria-pressed={voided}
          onClick={onToggleVoid}
        >
          {voided ? 'Voided - restore to scoring' : 'Void this question'}
        </Button>
        {!disputing ? <Button onClick={() => setDisputing(true)}>Dispute</Button> : null}
      </div>

      {voided ? (
        <p role="status" className="text-fluid-sm font-semibold text-red-800">
          This question is voided. It scores zero for every team and is dropped from the totals.
        </p>
      ) : null}

      {disputing ? (
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-fluid-sm">
            <span>What is wrong with this question?</span>
            <input
              className={`${TARGET_SIZE} rounded-2xl border-[3px] border-ink/25 bg-white px-4 py-2 text-fluid-base`}
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-label="Dispute note"
              // eslint-disable-next-line jsx-a11y/no-autofocus -- the driver just chose to dispute; focusing the one field they need is the least-surprising behaviour
              autoFocus
            />
          </label>
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={submitDispute} disabled={note.trim().length === 0}>
              Record dispute
            </Button>
            <Button
              onClick={() => {
                setNote('')
                setDisputing(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
