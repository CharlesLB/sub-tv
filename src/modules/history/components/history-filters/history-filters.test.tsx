import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { cruzeiroRowFixture } from '../accumulated-table/accumulated-table.fixtures'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { HistoryFilters } from './history-filters'

const { filter, availableYears } = loadedHistoryFilterFixture
const OVERVIEW_TARGET = { kind: 'overview' } as const
const TEAM_TARGET = { kind: 'team', teamKey: cruzeiroRowFixture.teamKey } as const

const filterRowOf = (label: string) => {
  const row = screen.getByText(label).parentElement
  if (!row) throw new Error(`Filter row ${label} not found`)

  return within(row)
}

const categoryRow = () => filterRowOf('Categoria')
const seasonRow = () => filterRowOf('Temporadas')

describe('HistoryFilters', () => {
  it('renders the all categories chip followed by one chip per category', () => {
    render(<HistoryFilters filter={filter} availableYears={availableYears} target={OVERVIEW_TARGET} />)

    expect(
      categoryRow()
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Todas', 'SUB-13', 'SUB-14'])
  })

  it('marks the all categories chip as current when no category is selected', () => {
    render(<HistoryFilters filter={filter} availableYears={availableYears} target={OVERVIEW_TARGET} />)

    expect(categoryRow().getByRole('link', { name: 'Todas' })).toHaveAttribute('aria-current', 'true')
    expect(categoryRow().getByRole('link', { name: 'SUB-13' })).not.toHaveAttribute('aria-current')
  })

  it('marks the selected category chip as current', () => {
    render(<HistoryFilters filter={{ ...filter, category: CATEGORY.SUB14 }} availableYears={availableYears} target={OVERVIEW_TARGET} />)

    expect(categoryRow().getByRole('link', { name: 'SUB-14' })).toHaveAttribute('aria-current', 'true')
    expect(categoryRow().getByRole('link', { name: 'Todas' })).not.toHaveAttribute('aria-current')
  })

  it('points category chips to the overview keeping the selected seasons even on a team page', () => {
    render(<HistoryFilters filter={filter} availableYears={availableYears} target={TEAM_TARGET} />)

    expect(categoryRow().getByRole('link', { name: 'SUB-13' })).toHaveAttribute('href', '/historico?cat=sub13&temporadas=2024%2C2025')
  })

  it('marks the selected seasons as current and leaves the others idle', () => {
    render(<HistoryFilters filter={filter} availableYears={availableYears} target={OVERVIEW_TARGET} />)

    expect(seasonRow().getByRole('link', { name: '2024' })).toHaveAttribute('aria-current', 'true')
    expect(seasonRow().getByRole('link', { name: '2025' })).toHaveAttribute('aria-current', 'true')
    expect(seasonRow().getByRole('link', { name: '2023' })).not.toHaveAttribute('aria-current')
    expect(seasonRow().getByRole('link', { name: 'Todas' })).not.toHaveAttribute('aria-current')
  })

  it('marks the all seasons chip as current when no season is selected', () => {
    render(<HistoryFilters filter={{ ...filter, years: [] }} availableYears={availableYears} target={OVERVIEW_TARGET} />)

    expect(seasonRow().getByRole('link', { name: 'Todas' })).toHaveAttribute('aria-current', 'true')
  })

  it('points season chips to the current target with the season toggled', () => {
    render(<HistoryFilters filter={filter} availableYears={availableYears} target={TEAM_TARGET} />)

    expect(seasonRow().getByRole('link', { name: '2024' })).toHaveAttribute('href', `/historico/times/${TEAM_TARGET.teamKey}?temporadas=2025`)
    expect(seasonRow().getByRole('link', { name: '2023' })).toHaveAttribute('href', `/historico/times/${TEAM_TARGET.teamKey}`)
    expect(seasonRow().getByRole('link', { name: 'Todas' })).toHaveAttribute('href', `/historico/times/${TEAM_TARGET.teamKey}`)
  })
})
