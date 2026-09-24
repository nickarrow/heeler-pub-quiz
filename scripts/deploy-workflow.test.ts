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
    // Every HEELER_BANK assignment in the workflow, if present, must name the
    // real bank. As of increment 7a there are none — the switch is increment 8 —
    // so this both passes now and constrains increment 8 to select real, and
    // only real, when it adds one.
    const assignments = workflow.match(/HEELER_BANK\s*[:=]\s*['"]?(\w+)/gi) ?? []
    for (const assignment of assignments) {
      expect(assignment).toMatch(/real/i)
    }
  })
})
