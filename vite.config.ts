import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { fixtureBankRelativePath, realBankRelativePath } from './scripts/bank-paths.ts'

// The two-bank guarantee. `design.md` §3 promises that no build which is not an
// explicit production build can render a real question, and this alias is the
// whole mechanism. Absence of the variable means fixtures, so forgetting to set
// it produces the harmless outcome.
//
// As of increment 1 this variable is set nowhere: not in this repository, not in
// the deploy workflow. Increment 8 is what adds it, on the workflow's build step
// only. Until then the real bank is unreachable by any command.
//
// Note this is read by every command, not only by production builds. An exported
// shell variable would reach `npm run dev` too. That is why the guard below
// exists and why a test asserts the variable is unset.
const useRealBank = process.env.HEELER_REAL_BANK === '1'

// Absolute, because Vite uses relative alias values as-is and never resolves
// them into filesystem paths. See docs/verification-log.md — the first version
// of this used a relative path and the import would simply have failed.
const bankPath = resolve(
  import.meta.dirname,
  useRealBank ? realBankRelativePath : fixtureBankRelativePath,
)

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
