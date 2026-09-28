import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { historyHref } from '../../history-href/history-href'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { PeriodScorers } from './period-scorers'
import { periodScorersFixture, topPeriodScorerFixture } from './period-scorers.fixtures'

const filter = loadedHistoryFilterFixture.filter

describe('PeriodScorers', () => {
  it('links every scorer to the athlete history keeping the current filter', () => {
    render(<PeriodScorers scorers={periodScorersFixture} filter={filter} />)

    expect(screen.getAllByRole('link')).toHaveLength(periodScorersFixture.length)
    expect(screen.getByRole('link', { name: /Lucas Andrade/ })).toHaveAttribute('href', historyHref({ kind: 'athlete', playerId: topPeriodScorerFixture.playerId }, filter))
  })

  it('shows position, team with category, goals and season count of each scorer', () => {
    render(<PeriodScorers scorers={periodScorersFixture} filter={filter} />)

    const topScorer = within(screen.getByRole('link', { name: /Lucas Andrade/ }))
    expect(topScorer.getByText('01')).toBeInTheDocument()
    expect(topScorer.getByText('Cruzeiro · SUB-14')).toBeInTheDocument()
    expect(topScorer.getByText('17')).toBeInTheDocument()
    expect(topScorer.getByText('2 Temps.')).toBeInTheDocument()
    expect(within(screen.getByRole('link', { name: /Gabriel Tavares/ })).getByText('1 Temp.')).toBeInTheDocument()
  })

  it('sizes each goal bar relative to the top scorer', () => {
    const { container } = render(<PeriodScorers scorers={periodScorersFixture} filter={filter} />)

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="width"]')]
    expect(bars.map((bar) => bar.style.width)).toEqual(['100%', '71%', '29%'])
  })

  it('sizes the goal bars against the most goals even when the list is not sorted', () => {
    const { container } = render(<PeriodScorers scorers={periodScorersFixture.toReversed()} filter={filter} />)

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="width"]')]
    expect(bars.map((bar) => bar.style.width)).toEqual(['29%', '71%', '100%'])
  })

  it('shows the empty state when nobody scored', () => {
    render(<PeriodScorers scorers={[]} filter={filter} />)

    expect(screen.getByRole('region', { name: 'Artilheiros do período' })).toHaveTextContent('Nenhum gol registrado para os filtros selecionados')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
