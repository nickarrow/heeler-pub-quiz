// The rounded-square is the show's whole shape language, so it is the app's too
// (restyle "move 2"). Every screen sits on one of these: a raised card surface
// above the cream, generous corner radius, a thick soft border and a gentle
// offset shadow. One component so the radius, surface and shadow are written
// once and cannot drift between screens.
//
// Presentational only: it renders a <section> and forwards the aria-* the screen
// needs for its heading association, so wrapping a screen in a Card does not
// change its accessibility tree. The springy entrance is added in move 4 and is
// already covered by the reduced-motion collapse in index.css.

import type { ReactElement, ReactNode } from 'react'

export function Card({
  children,
  className = '',
  'aria-labelledby': ariaLabelledby,
}: {
  children: ReactNode
  className?: string
  'aria-labelledby'?: string
}): ReactElement {
  return (
    <section
      aria-labelledby={ariaLabelledby}
      className={`w-full rounded-[32px] border-[3px] border-ink/10 bg-card p-6 shadow-card motion-safe:animate-[pop-in_420ms_cubic-bezier(0.34,1.56,0.64,1)_both] sm:p-8 ${className}`}
    >
      {children}
    </section>
  )
}
