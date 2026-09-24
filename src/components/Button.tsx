// One button, so the room's rules — 44x44 minimum target, AA-contrast colours,
// fluid text, visible focus (from the global :focus-visible) — are set in one
// place rather than re-typed on every control. Two variants: primary (the
// forward action) and secondary (everything else).
//
// The 44px minimum is comfortably above the 24px floor in success criterion
// 2.5.8; the colours are the contrast-checked palette tokens from index.css.

import type { ButtonHTMLAttributes, ReactElement } from 'react'

type Variant = 'primary' | 'secondary'

/** The minimum tap-target size, one source of truth. 44x44 CSS pixels,
 * comfortably above the 24px floor in success criterion 2.5.8. Both this button
 * and the raw inputs/steppers elsewhere pull from this so the number cannot
 * drift on one control and not another. */
export const TARGET_SIZE = 'min-h-[44px] min-w-[44px]'

// Disabled controls dim, but only to 60%: at 40% an ink glyph on white composited
// over cream fell to ~2.2:1, which is unreadable from three metres even though
// WCAG exempts disabled controls from contrast. 60% keeps the dimmed state
// visible while still reading clearly as inactive.
//
// Restyle "move 2": chunky rounded pills instead of the plain rounded-lg. Still
// at least 44x44 (TARGET_SIZE), just with more horizontal padding so they read
// as friendly. The primary variant gets a "shelf" shadow — a solid darker-blue
// edge beneath it — and presses down on :active, which reads as a bouncy button
// even before the springy transition that move 4 adds. All of it collapses
// under prefers-reduced-motion via the global rule in index.css.
const base = `${TARGET_SIZE} rounded-full px-6 py-2.5 text-fluid-base font-bold disabled:opacity-60`

const variants: Record<Variant, string> = {
  // white on blue-700 (#2b62d6) is 5.5:1; passes AA for normal text. The shelf
  // is blue-800, and the button drops onto it when pressed.
  primary:
    'bg-blue-700 text-white shadow-[0_6px_0_0_var(--color-blue-800)] active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-blue-800)]',
  // ink on white with an ink border; ~12:1.
  secondary: 'border-[3px] border-ink/25 bg-white text-ink active:translate-y-[2px]',
}

export function Button({
  variant = 'secondary',
  className = '',
  ...rest
}: { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>): ReactElement {
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...rest} />
}
