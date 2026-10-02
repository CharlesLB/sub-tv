import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { seasonTeamsFixture } from '@/modules/teams/components/team-list-item/team-list-item.fixtures'
import { SquadsScreen } from './squads-screen'

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }))

describe('SquadsScreen', () => {
  beforeAll(() => {
    Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
  })

  it('lists the teams of the season beside the selected squad', () => {
    render(
      <SquadsScreen year={2025} teams={seasonTeamsFixture}>
        <section aria-label="Elenco" />
      </SquadsScreen>,
    )

    expect(screen.getByRole('complementary', { name: 'Times' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Estrela do Vale/, current: true })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Elenco' })).toBeInTheDocument()
  })
})
