import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App.tsx'

// Increment 3 turns the one-screen view into the whole game loop. These tests
// drive the phases through the real DOM; the pure reducer, scoring and storage
// have their own focused suites. localStorage is cleared between tests so each
// starts fresh, matching the isolated Playwright profile.

beforeEach(() => {
  localStorage.clear()
})
afterEach(() => {
  localStorage.clear()
})

describe('the app shell', () => {
  it('opens on the setup screen', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/set up the game/i)
  })

  it('renders the unofficial and unaffiliated notice, naming the rights holders', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent(/unofficial/i)
    expect(footer).toHaveTextContent(/not affiliated with, endorsed by, or connected to/i)
    expect(footer).toHaveTextContent(/Ludo Studio/)
    expect(footer).toHaveTextContent(/BBC Studios/)
  })

  it('shows the fixture badge while the fixture bank is loaded', () => {
    render(<App />)
    expect(screen.getByText(/fixture questions/i)).toBeInTheDocument()
  })
})

describe('setup', () => {
  it('will not start with fewer than two named teams', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/team 1 name/i), 'Alpha')
    expect(screen.getByRole('button', { name: /start game/i })).toBeDisabled()
  })

  it('starts the game once two teams are named', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/team 1 name/i), 'Alpha')
    await user.type(screen.getByLabelText(/team 2 name/i), 'Bravo')
    await user.click(screen.getByRole('button', { name: /start game/i }))
    // The round intro shows "Round 1" as framing and the round title as its
    // heading, then a Begin round control.
    expect(screen.getByText(/^round 1$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /begin round/i })).toBeInTheDocument()
  })
})

describe('persistence and restore', () => {
  const GAME_KEY = 'heeler-pub-quiz/v1/game'

  it('restores a mid-round game from storage on mount', () => {
    // A game parked mid-round on the first fixture question, with a score
    // already recorded. Written straight to storage, then App mounted fresh.
    const saved = {
      bankKind: 'fixtures',
      teams: [
        { id: 'team-a', name: 'Alpha' },
        { id: 'team-b', name: 'Bravo' },
      ],
      roundIds: ['fixture-1'],
      phase: 'reveal',
      cursor: { round: 0, question: 0 },
      results: [{ questionId: 'fx-001', awarded: { 'team-a': 1, 'team-b': 0 } }],
      timerLengthSeconds: 45,
    }
    localStorage.setItem(GAME_KEY, JSON.stringify(saved))
    render(<App />)
    // We land on the reveal of question 1, not the setup screen.
    expect(screen.getByText(/question 1 of 10/i)).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /alpha scored/i })).toHaveAttribute('aria-checked', 'true')
  })

  it('discards an incoherent stored game rather than bricking, and says so', () => {
    // roundIds names a round that does not exist in the fixture bank. Left
    // unchecked this lands on a dead "No question available." screen a reload
    // only re-restores. It must fall back to setup with a notice instead.
    const stale = {
      bankKind: 'fixtures',
      teams: [{ id: 'team-a', name: 'Alpha' }],
      roundIds: ['round-that-was-deleted'],
      phase: 'question',
      cursor: { round: 0, question: 0 },
      results: [],
      timerLengthSeconds: 45,
    }
    localStorage.setItem(GAME_KEY, JSON.stringify(stale))
    render(<App />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/set up the game/i)
    expect(screen.getByRole('status')).toHaveTextContent(/discarded|could not be read/i)
  })

  it('discards an unparseable stored game', () => {
    localStorage.setItem(GAME_KEY, '{not valid json')
    render(<App />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/set up the game/i)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

describe('dealing and exhaustion', () => {
  const SERVED_KEY = 'heeler-pub-quiz/v1/served-rounds'

  it('shows how many unplayed rounds remain on the setup screen', () => {
    render(<App />)
    // Twelve fixture rounds, none served yet.
    expect(screen.getByText(/12 unplayed rounds available/i)).toBeInTheDocument()
  })

  it('marks the dealt rounds served on deal, before any question is played', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/team 1 name/i), 'Alpha')
    await user.type(screen.getByLabelText(/team 2 name/i), 'Bravo')
    await user.click(screen.getByRole('button', { name: /start game/i }))
    // We are on the first round intro, no question played yet.
    expect(screen.getByRole('button', { name: /begin round/i })).toBeInTheDocument()
    // served-rounds already holds a full game's worth of rounds — served on deal,
    // not on finish, so an abandoned evening does not recycle them.
    const served = JSON.parse(localStorage.getItem(SERVED_KEY) ?? 'null')
    expect(Array.isArray(served)).toBe(true)
    expect(served).toHaveLength(4)
    expect(served).toContain('fixture-1')
  })

  it('offers a reset behind a confirmation when the pool cannot fill a game', async () => {
    const user = userEvent.setup()
    // Serve all but three rounds, so a four-round game cannot be dealt.
    const nearlyAll = [
      'fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5',
      'fixture-6', 'fixture-7', 'fixture-8', 'fixture-9',
    ]
    localStorage.setItem(SERVED_KEY, JSON.stringify(nearlyAll))
    render(<App />)
    // Name two teams and try to start — the deal should fail for want of rounds.
    await user.type(screen.getByLabelText(/team 1 name/i), 'Alpha')
    await user.type(screen.getByLabelText(/team 2 name/i), 'Bravo')
    await user.click(screen.getByRole('button', { name: /start game/i }))

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/out of fresh rounds/i)
    expect(screen.getByText(/not enough unplayed rounds/i)).toBeInTheDocument()

    // Reset is behind a confirmation.
    await user.click(screen.getByRole('button', { name: /^reset the rounds$/i }))
    await user.click(screen.getByRole('button', { name: /yes, reset the rounds/i }))

    // Back to a fresh setup with the full pool available again.
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/set up the game/i)
    expect(screen.getByText(/12 unplayed rounds available/i)).toBeInTheDocument()
  })
})

describe('dispute and void', () => {
  async function startTwoTeamsAtReveal(): Promise<ReturnType<typeof userEvent.setup>> {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/team 1 name/i), 'Alpha')
    await user.type(screen.getByLabelText(/team 2 name/i), 'Bravo')
    await user.click(screen.getByRole('button', { name: /start game/i }))
    await user.click(screen.getByRole('button', { name: /begin round/i }))
    await user.click(screen.getByRole('button', { name: /^reveal$/i }))
    return user
  }

  it('void drops the question from scoring for every team, not just one', async () => {
    const user = await startTwoTeamsAtReveal()
    // Score the single-answer question for both teams.
    await user.click(screen.getByRole('switch', { name: /alpha scored/i }))
    await user.click(screen.getByRole('switch', { name: /bravo scored/i }))
    // Void it.
    await user.click(screen.getByRole('button', { name: /void this question/i }))
    // Save and continue, then skip through the rest of the round to a break to
    // read standings. Reveal+continue each remaining question without scoring.
    await user.click(screen.getByRole('button', { name: /save scores and continue/i }))
    // Fixture round one has ten questions; loop to the round break.
    for (let i = 0; i < 9; i++) {
      await user.click(screen.getByRole('button', { name: /^reveal$/i }))
      await user.click(screen.getByRole('button', { name: /save scores and continue/i }))
    }
    // At the round break: both teams should read zero, because the only scored
    // question was voided and drops for everyone.
    expect(screen.getByLabelText(/alpha total 0/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/bravo total 0/i)).toBeInTheDocument()
  })

  it('does not carry a void into the next game, because that game deals different rounds', async () => {
    // The safety here is a coupling worth pinning: a void flag survives the New
    // game reset (resetToSetup keeps flags), but served-rounds also survives, so
    // the next game deals unserved rounds and cannot re-present the voided
    // question. If a future change ever let a served round be re-dealt, a stale
    // void could bleed; this test guards the invariant that it currently cannot.
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/team 1 name/i), 'Alpha')
    await user.type(screen.getByLabelText(/team 2 name/i), 'Bravo')
    await user.click(screen.getByRole('button', { name: /start game/i }))
    // Game 1 begins on Fixture Round One.
    expect(screen.getByText(/^round 1$/i)).toBeInTheDocument()
    const firstRoundTitle = screen.getByRole('heading', { level: 2 }).textContent
    await user.click(screen.getByRole('button', { name: /begin round/i }))
    await user.click(screen.getByRole('button', { name: /^reveal$/i }))
    await user.click(screen.getByRole('button', { name: /void this question/i }))
    // Play out game 1 to the final (10 + 3 + 3 + 3 = short rounds after round 1).
    // Reveal+continue until the final's New game button appears.
    for (let guard = 0; guard < 90; guard++) {
      if (screen.queryByRole('button', { name: /^new game$/i })) {
        break
      }
      // On a reveal (including the voided Q1 we start on): save and continue.
      const save = screen.queryByRole('button', { name: /save scores and continue/i })
      if (save) {
        await user.click(save)
        continue
      }
      const reveal = screen.queryByRole('button', { name: /^reveal$/i })
      if (reveal) {
        await user.click(reveal)
        continue
      }
      const begin = screen.queryByRole('button', { name: /begin round/i })
      if (begin) {
        await user.click(begin)
        continue
      }
      const cont = screen.queryByRole('button', { name: /continue to the next round|see the final standings/i })
      if (cont) {
        await user.click(cont)
        continue
      }
      break
    }
    // At the final: start a new game.
    await user.click(screen.getByRole('button', { name: /^new game$/i }))
    await user.click(screen.getByRole('button', { name: /yes, new game/i }))
    await user.type(screen.getByLabelText(/team 1 name/i), 'Alpha')
    await user.type(screen.getByLabelText(/team 2 name/i), 'Bravo')
    await user.click(screen.getByRole('button', { name: /start game/i }))
    // Game 2 deals a DIFFERENT first round than game 1, so the voided question's
    // round cannot recur.
    const secondRoundTitle = screen.getByRole('heading', { level: 2 }).textContent
    expect(secondRoundTitle).not.toBe(firstRoundTitle)
  })

  it('records a dispute without interrupting play', async () => {
    const user = await startTwoTeamsAtReveal()
    await user.click(screen.getByRole('button', { name: /^dispute$/i }))
    await user.type(screen.getByLabelText(/dispute note/i), 'The answer looks wrong')
    await user.click(screen.getByRole('button', { name: /record dispute/i }))
    // Still on the same reveal — dispute interrupted nothing.
    expect(screen.getByText(/question 1 of 10/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save scores and continue/i })).toBeInTheDocument()
  })
})

describe('playing through to a reveal and scoring', () => {
  async function startTwoTeams(): Promise<ReturnType<typeof userEvent.setup>> {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/team 1 name/i), 'Alpha')
    await user.type(screen.getByLabelText(/team 2 name/i), 'Bravo')
    await user.click(screen.getByRole('button', { name: /start game/i }))
    await user.click(screen.getByRole('button', { name: /begin round/i }))
    return user
  }

  it('reveals a single-answer question and scores a team', async () => {
    const user = await startTwoTeams()
    await user.click(screen.getByRole('button', { name: /^reveal$/i }))
    // The single shape shows a toggle per team, named for the team.
    const alphaSwitch = screen.getByRole('switch', { name: /alpha scored/i })
    await user.click(alphaSwitch)
    expect(alphaSwitch).toHaveAttribute('aria-checked', 'true')
  })

  it('announces a score change in the live region', async () => {
    const user = await startTwoTeams()
    await user.click(screen.getByRole('button', { name: /^reveal$/i }))
    const live = screen.getByTestId('live-region')
    expect(live).toHaveTextContent('')
    await user.click(screen.getByRole('switch', { name: /alpha scored/i }))
    // The live region now carries the resulting score for the team by name.
    expect(live).toHaveTextContent(/alpha: 1 point/i)
  })

  it('exposes a spin control for a list question, named for the team', async () => {
    const user = await startTwoTeams()
    // Advance to the second question (fx-002, the list shape) by revealing and
    // continuing through the first.
    await user.click(screen.getByRole('button', { name: /^reveal$/i }))
    await user.click(screen.getByRole('button', { name: /save scores and continue/i }))
    await user.click(screen.getByRole('button', { name: /^reveal$/i }))
    const spin = screen.getByRole('spinbutton', { name: /alpha points/i })
    expect(spin).toHaveAttribute('aria-valuemax', '2')
    await user.click(within(spin).getByRole('button', { name: /more points for alpha/i }))
    expect(spin).toHaveAttribute('aria-valuenow', '1')
  })
})
