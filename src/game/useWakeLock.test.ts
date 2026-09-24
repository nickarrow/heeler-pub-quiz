import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWakeLock } from './useWakeLock.ts'

// The wake lock is best-effort and feature-detected. These tests cover the two
// things that matter: it requests a lock when active and the API exists, and it
// does nothing (no throw) when the API is absent or the request is refused.

type Sentinel = { release: ReturnType<typeof vi.fn> }

function installWakeLock(request: () => Promise<Sentinel>): void {
  Object.defineProperty(navigator, 'wakeLock', {
    value: { request },
    configurable: true,
    writable: true,
  })
}

function removeWakeLock(): void {
  Object.defineProperty(navigator, 'wakeLock', {
    value: undefined,
    configurable: true,
    writable: true,
  })
}

/** The hook requires a secure context (Pages and localhost are). happy-dom
 * reports isSecureContext false, so set it for the tests that expect a request. */
function setSecureContext(secure: boolean): void {
  Object.defineProperty(globalThis, 'isSecureContext', {
    value: secure,
    configurable: true,
    writable: true,
  })
}

afterEach(() => {
  removeWakeLock()
  setSecureContext(false)
  vi.restoreAllMocks()
})

describe('useWakeLock', () => {
  it('requests a screen lock when active and the API exists in a secure context', async () => {
    setSecureContext(true)
    const release = vi.fn().mockResolvedValue(undefined)
    const request = vi.fn().mockResolvedValue({ release })
    installWakeLock(request)

    await act(async () => {
      renderHook(() => useWakeLock(true))
    })
    expect(request).toHaveBeenCalledWith('screen')
  })

  it('does not request outside a secure context', async () => {
    setSecureContext(false)
    const request = vi.fn().mockResolvedValue({ release: vi.fn() })
    installWakeLock(request)

    await act(async () => {
      renderHook(() => useWakeLock(true))
    })
    expect(request).not.toHaveBeenCalled()
  })

  it('does not request when inactive', async () => {
    setSecureContext(true)
    const request = vi.fn().mockResolvedValue({ release: vi.fn() })
    installWakeLock(request)

    await act(async () => {
      renderHook(() => useWakeLock(false))
    })
    expect(request).not.toHaveBeenCalled()
  })

  it('releases the lock on unmount', async () => {
    setSecureContext(true)
    const release = vi.fn().mockResolvedValue(undefined)
    const request = vi.fn().mockResolvedValue({ release })
    installWakeLock(request)

    let unmount = () => {}
    await act(async () => {
      unmount = renderHook(() => useWakeLock(true)).unmount
    })
    await act(async () => {
      unmount()
    })
    expect(release).toHaveBeenCalled()
  })

  it('does nothing and does not throw when the API is absent', async () => {
    removeWakeLock()
    await expect(
      act(async () => {
        renderHook(() => useWakeLock(true))
      }),
    ).resolves.not.toThrow()
  })

  it('degrades silently when the request is refused', async () => {
    setSecureContext(true)
    const request = vi.fn().mockRejectedValue(new Error('refused'))
    installWakeLock(request)
    await expect(
      act(async () => {
        renderHook(() => useWakeLock(true))
      }),
    ).resolves.not.toThrow()
    expect(request).toHaveBeenCalled()
  })
})
