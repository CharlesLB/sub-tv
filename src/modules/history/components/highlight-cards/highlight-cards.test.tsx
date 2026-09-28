import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { historyHref } from '../../history-href/history-href'
import { atleticoRowFixture, cruzeiroRowFixture } from '../accumulated-table/accumulated-table.fixtures'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { topPeriodScorerFixture } from '../period-scorers/period-scorers.fixtures'
import { HighlightCards } from './highlight-cards'
import { emptyHistoryOverviewFixture, historyOverviewFixture } from './highlight-cards.fixtures'

const filter = loadedHistoryFilterFixture.filter

describe('HighlightCards', () => {
  it('shows the best win rate, the top scorer and the team with most games', () => {
    render(<HighlightCards overview={historyOverviewFixture} filter={filter} />)

    const bestWinRate = within(screen.getByRole('link', { name: /Melhor aproveitamento/ }))
    expect(bestWinRate.getByText('81%')).toBeInTheDocument()
    expect(bestWinRate.getByText('Cruzeiro SUB-14')).toBeInTheDocument()
    expect(within(screen.getByRole('link', { name: /Maior artilheiro/ })).getByText('Lucas Andrade · Cruzeiro')).toBeInTheDocument()
    expect(within(screen.getByRole('link', { name: /Mais jogos/ })).getByText('Atlético SUB-13')).toBeInTheDocument()
  })

  it('links team highlights to the team history and the top scorer to the athlete history', () => {
    render(<HighlightCards overview={historyOverviewFixture} filter={filter} />)

    expect(screen.getByRole('link', { name: /Melhor aproveitamento/ })).toHaveAttribute('href', historyHref({ kind: 'team', teamKey: cruzeiroRowFixture.teamKey }, filter))
    expect(screen.getByRole('link', { name: /Mais jogos/ })).toHaveAttribute('href', historyHref({ kind: 'team', teamKey: atleticoRowFixture.teamKey }, filter))
    expect(screen.getByRole('link', { name: /Maior artilheiro/ })).toHaveAttribute('href', historyHref({ kind: 'athlete', playerId: topPeriodScorerFixture.playerId }, filter))
  })

  it('shows only the highlights that exist', () => {
    render(<HighlightCards overview={{ ...emptyHistoryOverviewFixture, scorers: [topPeriodScorerFixture] }} filter={filter} />)

    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Maior artilheiro/ })).toHaveTextContent('17')
  })

  it('renders nothing when there is no highlight', () => {
    const { container } = render(<HighlightCards overview={emptyHistoryOverviewFixture} filter={filter} />)

    expect(container).toBeEmptyDOMElement()
  })
})
