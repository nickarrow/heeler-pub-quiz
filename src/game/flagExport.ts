// Building the flags export. The export is the handoff (`content-pipeline.md`
// §4): the app records disputes and voids during play, and this turns them into
// something that can be acted on afterwards. Kept pure and separate from the
// download plumbing so it is testable without a browser.
//
// The export carries every flag AND each flag's bank marker, so the increment-9
// consumer computing a real-bank error rate can filter to `bankKind: 'real'` and
// leave everything else out of the sample: the fixture-era disputes from
// increments 3 to 6, and — since 7a — any preview-bank disputes. That marker is
// why the increment-1 review left this for increment 5 to shape.

import type { Flag } from './flags.ts'

export type FlagExport = {
  exportedAt: string
  /** Counts by bank and kind, so the consumer sees the shape at a glance without
   * re-tallying. */
  summary: {
    total: number
    /** The only count increment 9 samples from. Everything else is excluded by
     * construction. */
    real: number
    fixtures: number
    preview: number
    disputes: number
    voids: number
  }
  flags: Flag[]
}

/** Build the export object from the current flags. Deterministic given the flags
 * and the timestamp. */
export function buildFlagExport(flags: Flag[], exportedAt: string): FlagExport {
  return {
    exportedAt,
    summary: {
      total: flags.length,
      real: flags.filter((flag) => flag.bankKind === 'real').length,
      fixtures: flags.filter((flag) => flag.bankKind === 'fixtures').length,
      preview: flags.filter((flag) => flag.bankKind === 'preview').length,
      disputes: flags.filter((flag) => flag.kind === 'dispute').length,
      voids: flags.filter((flag) => flag.kind === 'void').length,
    },
    flags,
  }
}

/** The export serialised as pretty JSON, ready to write to a file. */
export function flagExportJson(flags: Flag[], exportedAt: string): string {
  return JSON.stringify(buildFlagExport(flags, exportedAt), null, 2)
}
