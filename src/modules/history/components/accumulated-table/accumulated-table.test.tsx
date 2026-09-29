import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { historyHref } from '../../history-href/history-href'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { AccumulatedTable } from './accumulated-table'
import { accumulatedTeamRowsFixture, cruzeiroRowFixture, tupiRowFixture } from './accumulated-table.fixtures'

const filter = loadedHistoryFilterFixture.filter
const CREST_IMAGE_SELECTOR = 'img'

describe('AccumulatedTable', () => {
  it('links every team row to its team history keeping the current filter', () => {
    render(<AccumulatedTable rows={accumulatedTeamRowsFixture} filter={filter} />)

    expect(screen.getAllByRole('link')).toHaveLength(accumulatedTeamRowsFixture.length)
    expect(screen.getByRole('link', { name: /Cruzeiro/ })).toHaveAttribute('href', historyHref({ kind: 'team', teamKey: cruzeiroRowFixture.teamKey }, filter))
  })

  it('shows position, category, signed goal difference, points and win rate of each row', () => {
    render(<AccumulatedTable rows={accumulatedTeamRowsFixture} filter={filter} />)

    const leaderRow = within(screen.getByRole('link', { name: /Cruzeiro/ }))
    expect(leaderRow.getByText('01')).toBeInTheDocument()
    expect(leaderRow.getByText('SUB-14')).toBeInTheDocument()
    expect(leaderRow.getByText('+47')).toBeInTheDocument()
    expect(leaderRow.getByText('58')).toBeInTheDocument()
    expect(leaderRow.getByText('81%')).toBeInTheDocument()
    expect(within(screen.getByRole('link', { name: /Tupi/ })).getByText(String(tupiRowFixture.goalDifference))).toBeInTheDocument()
  })

  it('staggers the row entrance animation by row position', () => {
    render(<AccumulatedTable rows={accumulatedTeamRowsFixture} filter={filter} />)

    expect(screen.getByRole('link', { name: /Tupi/ })).toHaveStyle({ animationDelay: '60ms' })
  })

  it('shows the empty state under the section title when there are no rows', () => {
    render(<AccumulatedTable rows={[]} filter={filter} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Classificação acumulada por time' })).toBeInTheDocument()
    expect(screen.getByText('Nenhuma campanha registrada para os filtros selecionados')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('shows the crest image of a team that has one and the colored hexagon for the others', () => {
    render(<AccumulatedTable rows={accumulatedTeamRowsFixture} filter={filter} />)

    expect(screen.getByRole('link', { name: /Cruzeiro/ }).querySelector(CREST_IMAGE_SELECTOR)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Tupi/ }).querySelector(CREST_IMAGE_SELECTOR)).not.toBeInTheDocument()
  })
})
