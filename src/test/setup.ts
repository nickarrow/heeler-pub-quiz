import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Testing Library only registers its own auto-cleanup when a test framework's
// globals are present, and this project runs Vitest without globals so that
// every import is explicit. Without this, renders accumulate across tests in a
// file and role queries start finding several of everything.
afterEach(() => {
  cleanup()
})
