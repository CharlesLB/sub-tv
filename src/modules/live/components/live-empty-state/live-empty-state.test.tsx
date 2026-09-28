import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { liveSnapshotFixture } from '../live-board/live-board.fixtures'
import { LiveEmptyState } from './live-empty-state'

describe('LiveEmptyState', () => {
  it('explains that the match has no lineup yet', () => {
    render(<LiveEmptyState seasonId={liveSnapshotFixture.seasonId} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Partida sem escalação' })).toBeInTheDocument()
    expect(screen.getByText(/ainda não tem titulares definidos/)).toBeInTheDocument()
  })

  it('links to the new match wizard of the season', () => {
    render(<LiveEmptyState seasonId={liveSnapshotFixture.seasonId} />)

    expect(screen.getByRole('link', { name: 'Nova partida' })).toHaveAttribute('href', '/campeonatos/season-1/nova-partida')
  })
})
