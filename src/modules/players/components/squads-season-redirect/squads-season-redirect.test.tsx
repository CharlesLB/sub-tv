import { render } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { rememberYear } from '@/modules/platform/client'
import { SquadsSeasonRedirect } from './squads-season-redirect'

vi.mock(import('next/navigation'), async (importOriginal) => ({ ...(await importOriginal()), useRouter: vi.fn() }))

const KNOWN_YEARS = [2026, 2025, 2024]
const NO_QUERY = { category: undefined, teamKey: undefined, playerId: undefined }

const arrangeRouter = () => {
  const replace = vi.fn()
  vi.mocked(useRouter).mockReturnValue({ back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), push: vi.fn(), replace, prefetch: vi.fn(), bfcacheId: 'squads-season-redirect' })

  return replace
}

describe('SquadsSeasonRedirect', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('opens the season the visitor chose last time', () => {
    rememberYear(2024)
    const replace = arrangeRouter()

    render(<SquadsSeasonRedirect knownYears={KNOWN_YEARS} fallbackYear={2026} query={NO_QUERY} />)

    expect(replace).toHaveBeenCalledWith('/elencos/2024')
  })

  it('opens the latest season when the remembered one no longer exists and keeps the rest of the address', () => {
    rememberYear(2019)
    const replace = arrangeRouter()

    render(<SquadsSeasonRedirect knownYears={KNOWN_YEARS} fallbackYear={2026} query={{ category: 'sub13', teamKey: undefined, playerId: undefined }} />)

    expect(replace).toHaveBeenCalledWith('/elencos/2026?cat=sub13')
  })
})
