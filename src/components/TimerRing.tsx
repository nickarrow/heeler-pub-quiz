// The countdown drawn as a draining ring (restyle move 4), with the number kept
// in the middle. The ring is driven by real state — the fraction of time left,
// remaining / total — not by a CSS animation, so it can never disagree with the
// number or with the actual countdown. The stroke shortens as time runs down.
//
// Accessibility is unchanged from the plain number it replaces: the seconds are
// still shown as text, and the accessible name (the "N seconds remaining" label)
// is carried by the wrapping element in QuestionScreen, so this stays a
// presentational SVG marked aria-hidden. A ring that empties is decorative; the
// number is the information.
//
// The single dashoffset transition is short and collapses under the global
// prefers-reduced-motion rule; even fully collapsed the ring still shows the
// correct proportion, because the proportion is a value, not an animation.

import type { ReactElement } from 'react'

const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerRing({
  remaining,
  total,
}: {
  remaining: number
  total: number
}): ReactElement {
  // Guard against a zero or missing total; clamp the fraction to 0..1.
  const fraction = total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0
  const dashoffset = CIRCUMFERENCE * (1 - fraction)

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 78 78"
      className="h-20 w-20 flex-none"
      role="presentation"
    >
      <circle cx="39" cy="39" r={RADIUS} fill="none" stroke="var(--color-ink)" strokeOpacity="0.12" strokeWidth="9" />
      <circle
        cx="39"
        cy="39"
        r={RADIUS}
        fill="none"
        stroke="var(--color-orange-600)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashoffset}
        transform="rotate(-90 39 39)"
        className="transition-[stroke-dashoffset] duration-500 ease-linear"
      />
      <text
        x="39"
        y="47"
        textAnchor="middle"
        className="fill-ink text-[1.4rem] font-black tabular-nums"
      >
        {remaining}
      </text>
    </svg>
  )
}
