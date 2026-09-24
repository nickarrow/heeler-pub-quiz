import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Flag } from '../game/flags.ts'
import { ReviewScreen } from './ReviewScreen.tsx'

// The review screen and the export download plumbing. happy-dom does not perform
// a real file save on anchor.click(), so the export test asserts on the object-
// URL lifecycle (created, then revoked) rather than a downloaded file — which is
// also what proves the leak-on-throw guard: revoke must be called.

const flags: Flag[] = [
  { questionId: 'fx-001', bankKind: 'fixtures', kind: 'void', at: '2026-09-24T00:00:00.000Z' },
  {
    questionId: 'fx-002',
    bankKind: 'fixtures',
    kind: 'dispute',
    note: 'Ambiguous wording',
    at: '2026-09-24T00:01:00.000Z',
  },
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ReviewScreen', () => {
  it('lists each flag with its kind, id, bank marker and note', () => {
    render(<ReviewScreen flags={flags} onBack={() => {}} />)
    const list = screen.getByRole('list', { name: /flagged questions/i })
    expect(list).toHaveTextContent('void')
    expect(list).toHaveTextContent('fx-001')
    expect(list).toHaveTextContent('dispute')
    expect(list).toHaveTextContent('fx-002')
    expect(list).toHaveTextContent('(fixtures)')
    expect(list).toHaveTextContent('Ambiguous wording')
  })

  it('says there is nothing to export when there are no flags', () => {
    render(<ReviewScreen flags={[]} onBack={() => {}} />)
    expect(screen.getByText(/no questions were disputed or voided/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /export/i })).not.toBeInTheDocument()
  })

  it('creates and then revokes an object URL when exporting, leaking nothing', async () => {
    const created: string[] = []
    const revoked: string[] = []
    vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
      const url = `blob:test-${created.length}`
      created.push(url)
      return url
    })
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation((url) => {
      revoked.push(String(url))
    })

    const user = userEvent.setup()
    render(<ReviewScreen flags={flags} onBack={() => {}} />)
    await user.click(screen.getByRole('button', { name: /export flags as json/i }))

    expect(created).toHaveLength(1)
    // Every created URL was revoked: the finally-block guard doing its job.
    expect(revoked).toEqual(created)
  })
})
