import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import {
  fixtureBankRelativePath,
  previewBankRelativePath,
  realBankRelativePath,
} from './scripts/bank-paths.ts'

// The bank guarantee. `design.md` §3 promises that no build which is not an
// explicit production build can render a real question, and this alias is the
// whole mechanism. Since increment 7a it selects between three banks, not two,
// through ONE tri-valued variable rather than two booleans — two booleans have
// four combinations and two of them are undefined, which is the kind of "flag
// that doesn't work" this scheme already survived once.
//
// HEELER_BANK:
//   unset / anything unrecognised -> fixtures   (the safe default)
//   'real'                        -> the real bank    (deploy only, increment 8)
//   'preview'                     -> the preview bank (a deliberate local command)
//
// Two properties this shape must keep, and does:
//   - The default is fixtures. Absence of the variable, OR any typo'd value,
//     falls to fixtures. It never falls THROUGH to real or preview.
//   - The deploy selects only 'real'. Increment 8 sets HEELER_BANK=real on the
//     workflow's build step and nowhere else; 'preview' is never written there,
//     and a committed test asserts the workflow cannot select it.
//
// Read by every command, not only production builds — an exported shell variable
// would reach `npm run dev` too. That is why the guard below exists and why the
// bank-guard tests assert both the default and the deploy path.
const bankSelection = process.env.HEELER_BANK

const bankRelativePath =
  bankSelection === 'real'
    ? realBankRelativePath
    : bankSelection === 'preview'
      ? previewBankRelativePath
      : fixtureBankRelativePath

// Absolute, because Vite uses relative alias values as-is and never resolves
// them into filesystem paths. See docs/verification-log.md — the first version
// of this used a relative path and the import would simply have failed.
const bankPath = resolve(import.meta.dirname, bankRelativePath)

// The guarantee rests entirely on this path being right, and a wrong one fails
// in confusing places. Fail here instead.
if (!existsSync(bankPath)) {
  throw new Error(`Bank alias target does not exist: ${bankPath}`)
}

export default defineConfig({
  // Without this, built asset URLs point at the domain root and the deployed
  // site loads nothing. Most likely first-deploy failure.
  base: '/heeler-pub-quiz/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@bank': bankPath,
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    // src holds the app and content tests; scripts holds tooling tests such as the
    // fetch host-pinning guard, which is security-relevant and belongs in CI.
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
  },
})
