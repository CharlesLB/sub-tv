import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '../../categories'
import { standingRowsFixture } from '../standings-row/standings-row.fixtures'
import { StandingsTable } from './standings-table'
import { namedGroupFixture, singleGroupFixture } from './standings-table.fixtures'

describe('StandingsTable', () => {
  it('shows the column headers and one row per team', () => {
    render(<StandingsTable group={singleGroupFixture} category={CATEGORY.SUB14} />)

    expect(screen.getByText('Clube')).toBeInTheDocument()
    expect(screen.getByText('Últimos 5')).toBeInTheDocument()
    expect(standingRowsFixture.map((row) => screen.getByText(row.team.name))).toHaveLength(standingRowsFixture.length)
  })

  it('shows the group name when the phase is split in groups', () => {
    render(<StandingsTable group={namedGroupFixture} category={CATEGORY.SUB14} />)

    expect(screen.getByText('Grupo A')).toBeInTheDocument()
  })

  it('hides the group name for a single group phase', () => {
    render(<StandingsTable group={singleGroupFixture} category={CATEGORY.SUB14} />)

    expect(screen.queryByText(/^Grupo/)).not.toBeInTheDocument()
  })
})
