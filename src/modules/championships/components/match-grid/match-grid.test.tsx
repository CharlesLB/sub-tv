import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '../../lib/categories/categories'
import { SEASON_ID_FIXTURE, undatedMatchFixture } from '../match-card/match-card.fixtures'
import { seasonMatchesFixture } from '../round-panel/round-panel.fixtures'
import { MatchGrid } from './match-grid'

describe('MatchGrid', () => {
  it('groups matches by phase and round with the latest kickoff first and undated rounds last', () => {
    render(<MatchGrid matches={[undatedMatchFixture, ...seasonMatchesFixture]} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB14} />)

    const groupTitles = screen.getAllByText(/Rodada|Fase/).map((title) => title.textContent)
    expect(groupTitles).toEqual(['1ª Fase · Rodada 4', '1ª Fase · Rodada 3', '2ª Fase · Rodada 3', 'Fase única'])
  })

  it('renders one card per match inside its round', () => {
    render(<MatchGrid matches={seasonMatchesFixture} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB14} />)

    expect(screen.getAllByRole('article')).toHaveLength(seasonMatchesFixture.length)
  })

  it('shows the empty message when the season has no matches', () => {
    render(<MatchGrid matches={[]} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB13} />)

    expect(screen.getByText('Nenhuma partida cadastrada.')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
})
