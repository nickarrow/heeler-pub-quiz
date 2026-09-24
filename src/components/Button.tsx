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
const base = `${TARGET_SIZE} rounded-lg px-5 py-2 text-fluid-base font-semibold disabled:opacity-60`

const variants: Record<Variant, string> = {
  // white on blue-700 is ~7:1; passes AA for normal text.
  primary: 'bg-blue-700 text-white',
  // ink on white with an ink border; ~15:1.
  secondary: 'border-2 border-ink/40 bg-white text-ink',
}

export function Button({
  variant = 'secondary',
  className = '',
  ...rest
}: { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>): ReactElement {
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...rest} />
}
