// A polite live region. `technical-design.md`: a score change is announced in a
// live region rather than only appearing. The region is always in the DOM (a
// live region must exist before its content changes to be announced reliably),
// visually hidden, and its text is replaced when something worth announcing
// happens.
//
// `aria-live="polite"` so it waits for a pause rather than interrupting, and
// `aria-atomic` so the whole message is read, not a diff.

import type { ReactElement } from 'react'

/** Visually hidden but available to assistive tech. Not `display:none`, which
 * would remove it from the accessibility tree and stop announcements. */
const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export function LiveRegion({ message }: { message: string }): ReactElement {
  return (
    <div aria-live="polite" aria-atomic="true" style={visuallyHidden} data-testid="live-region">
      {message}
    </div>
  )
}
