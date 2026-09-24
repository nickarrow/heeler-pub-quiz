// Start the dev server against the PREVIEW bank.
//
// This exists so there is one cross-platform command — `npm run dev:preview` —
// that works the same on the owner's PowerShell as on a CI-style bash shell,
// rather than asking anyone to remember the shell-specific way to set an
// environment variable inline. It sets HEELER_BANK=preview in this process and
// then hands off to Vite, so the alias in vite.config.ts resolves to the preview
// bank.
//
// It is a DEV command by design. There is no build:preview and no way for the
// deploy workflow to reach this file: the preview bank is local-only, and the
// only thing that ever ships is the real bank, selected on the deploy build step
// in increment 8. See docs/technical-design.md.

import { spawn } from 'node:child_process'

process.env.HEELER_BANK = 'preview'

// Inherit stdio so the Vite server's URL and logs appear as usual. `shell: true`
// lets the platform resolve the `vite` bin from node_modules/.bin on both
// Windows and POSIX without hard-coding the path.
const child = spawn('vite', process.argv.slice(2), {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

child.on('exit', (code) => {
  process.exitCode = code ?? 0
})
