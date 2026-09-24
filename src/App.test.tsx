import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('the one screen', () => {
  it('renders a question from the bank', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/\?$/)
  })

  // The notice is easy to forget and increment 1 publishes to the internet, so
  // it gets a test rather than a good intention.
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
