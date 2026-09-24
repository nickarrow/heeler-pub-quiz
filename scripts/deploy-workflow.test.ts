import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// The deploy path is the one place a real bank ships, and the preview bank must
// be unreachable from it — the same category of guarantee as "the default is
// fixtures", asserted the same way: against the artefact, not by trust. The
// workflow is a committed file, so this reads it and checks what it selects.
//
// This lives in scripts/ rather than alongside the @bank alias guard because
// reading a file needs Node types, and the app test project is scoped to
// vite/client. tsconfig.node.json covers scripts/ and has them.
describe('the deploy workflow cannot select the preview bank', () => {
  const workflow = readFileSync(
    resolve(import.meta.dirname, '..', '.github', 'workflows', 'deploy.yml'),
    'utf8',
  )

  // The lines that actually SET the variable, comments excluded. A YAML comment
  // (`# ...`) never sets an env var, so it must not count when we assert the
  // switch is present — an increment-8 review found the earlier version passed
  // on the explanatory comment alone, meaning deleting the real `env:` line
  // would have shipped fixtures to production with a green guard. We still scan
  // the raw text, comments included, for the preview value: a comment naming
  // preview is a lie worth failing on.
  const assignmentLines = workflow
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !line.startsWith('#'))
    .filter((line) => /HEELER_BANK\s*[:=]\s*['"]?\w+/i.test(line))

  it('never sets HEELER_BANK to preview anywhere in the workflow', () => {
    // No assignment of the preview value, in any form a YAML env or inline shell
    // assignment could take. Scans the whole file, comments included.
    expect(workflow).not.toMatch(/HEELER_BANK\s*[:=]\s*['"]?preview/i)
  })

  it('actually sets the real bank on a step, not just in a comment', () => {
    // At least one real assignment line (comments excluded). This fails if the
    // `env: HEELER_BANK: real` line is removed even if the comment mentioning it
    // stays — the gap the review found.
    expect(assignmentLines.length).toBeGreaterThan(0)
  })

  it('selects only the real bank on every assignment line', () => {
    // Every real (non-comment) assignment must name the real bank; none may name
    // fixtures or preview.
    for (const line of assignmentLines) {
      expect(line).toMatch(/HEELER_BANK\s*[:=]\s*['"]?real\b/i)
    }
  })
})
