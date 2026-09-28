import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BestSeasonBanner } from './best-season-banner'
import { bestSeasonFixture, singleGoalSeasonFixture } from './best-season-banner.fixtures'

describe('BestSeasonBanner', () => {
  it('describes the goals, year and championships of the best season', () => {
    render(<BestSeasonBanner season={bestSeasonFixture} />)

    expect(screen.getByText('11 Gols em 2025 · Mineiro Sub-14 · Copa Integração')).toBeInTheDocument()
  })

  it('uses the singular when the best season has a single goal', () => {
    render(<BestSeasonBanner season={singleGoalSeasonFixture} />)

    expect(screen.getByText('1 Gol em 2025 · Mineiro Sub-14 · Copa Integração')).toBeInTheDocument()
  })
})
