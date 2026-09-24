import { describe, expect, it } from 'vitest'
import type { Flag } from './flags.ts'
import { buildFlagExport, flagExportJson } from './flagExport.ts'

const flags: Flag[] = [
  { questionId: 'fx-001', bankKind: 'fixtures', kind: 'dispute', note: 'off', at: '2026-09-24T00:00:00.000Z' },
  { questionId: 'fx-002', bankKind: 'fixtures', kind: 'void', at: '2026-09-24T00:01:00.000Z' },
  { questionId: 'real-1', bankKind: 'real', kind: 'dispute', note: 'wrong', at: '2026-09-24T00:02:00.000Z' },
]

describe('buildFlagExport', () => {
  it('summarises by bank and kind, so a consumer can filter to the real bank', () => {
    const out = buildFlagExport(flags, '2026-09-24T00:03:00.000Z')
    expect(out.summary).toEqual({ total: 3, real: 1, fixtures: 2, disputes: 2, voids: 1 })
    expect(out.exportedAt).toBe('2026-09-24T00:03:00.000Z')
  })

  it('carries every flag with its bank marker intact', () => {
    const out = buildFlagExport(flags, 'now')
    expect(out.flags).toHaveLength(3)
    // The marker is what keeps fixture-era disputes out of the increment-9 sample.
    const real = out.flags.filter((flag) => flag.bankKind === 'real')
    expect(real).toHaveLength(1)
    expect(real[0]?.questionId).toBe('real-1')
  })
})

describe('flagExportJson', () => {
  it('produces valid, parseable JSON', () => {
    const json = flagExportJson(flags, 'now')
    const parsed = JSON.parse(json) as ReturnType<typeof buildFlagExport>
    expect(parsed.summary.total).toBe(3)
    expect(parsed.flags).toHaveLength(3)
  })
})
