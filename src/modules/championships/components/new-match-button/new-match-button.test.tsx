import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'
import { NewMatchButton } from './new-match-button'

describe('NewMatchButton', () => {
  it('links to the new match wizard of the season', () => {
    render(<NewMatchButton seasonId={SEASON_ID_FIXTURE} />)

    expect(screen.getByRole('link', { name: 'Nova partida' })).toHaveAttribute('href', routes.newMatch(SEASON_ID_FIXTURE))
  })
})
