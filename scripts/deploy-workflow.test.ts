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

  it('never sets HEELER_BANK to preview anywhere in the workflow', () => {
    // No assignment of the preview value, in any of the forms a YAML env or an
    // inline shell assignment could take.
    expect(workflow).not.toMatch(/HEELER_BANK\s*[:=]\s*['"]?preview/i)
  })

  it('selects only the real bank if it selects any bank at all', () => {
    // Every HEELER_BANK assignment in the workflow must name the real bank.
    // Increment 8 added one, on the build step (the deploy switch); this allows
    // that and forbids any assignment naming another bank. Comment text counts
    // here too, which is fine: the constraint is that nothing selects a
    // non-real bank, and a comment that named 'preview' would be a lie worth
    // failing on.
    const assignments = workflow.match(/HEELER_BANK\s*[:=]\s*['"]?(\w+)/gi) ?? []
    expect(assignments.length).toBeGreaterThan(0)
    for (const assignment of assignments) {
      expect(assignment).toMatch(/real/i)
    }
  })
})
