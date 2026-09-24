// The sunny backdrop (restyle "move 3"): a warm South-East-Queensland-ish sky
// with a few original flat shapes — a sun, soft clouds, rolling hills. Every
// shape is a primitive we authored here; nothing is traced from the show, and
// there is no character art. Decorative only: aria-hidden and pointer-events
// none, mounted once behind the whole app, so it never enters the accessibility
// tree or catches a click.
//
// It fades to "calm" behind the live question and reveal, where a busy backdrop
// would compete with reading the prompt from across the room (owner's call).
// Elsewhere — setup, round intro, standings, final — it shows in full. The fade
// is a plain opacity transition, which the global prefers-reduced-motion rule in
// index.css collapses to an instant change.
//
// Self-contained: inline SVG, no image request, no CDN, consistent with the
// no-third-party-asset posture in design.md.

import type { ReactElement } from 'react'

export function Scenery({ calm = false }: { calm?: boolean }): ReactElement {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500 ${
        calm ? 'opacity-40' : 'opacity-100'
      }`}
    >
      {/* The sky gradient itself lives on <body> in index.css; this layer adds
          the shapes. preserveAspectRatio slices so hills always sit on the
          bottom edge whatever the viewport ratio. */}
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        role="presentation"
      >
        {/* sun, upper right */}
        <circle cx="1230" cy="150" r="70" fill="var(--color-mustard)" opacity="0.9" />
        <circle cx="1230" cy="150" r="96" fill="var(--color-mustard)" opacity="0.25" />
        {/* clouds */}
        <ellipse cx="300" cy="150" rx="90" ry="34" fill="#ffffff" opacity="0.75" />
        <ellipse cx="360" cy="130" rx="60" ry="26" fill="#ffffff" opacity="0.75" />
        <ellipse cx="980" cy="90" rx="70" ry="26" fill="#ffffff" opacity="0.65" />
        {/* rolling hills, two layers */}
        <path d="M0 760 Q 360 640 720 730 T 1440 700 V900 H0 Z" fill="var(--color-grass)" opacity="0.55" />
        <path d="M0 820 Q 420 720 860 800 T 1440 790 V900 H0 Z" fill="var(--color-grass)" opacity="0.7" />
      </svg>
    </div>
  )
}
