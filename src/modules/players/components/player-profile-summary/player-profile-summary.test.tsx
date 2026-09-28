import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { squadPlayerFixture, squadPlayerWithoutDetailsFixture } from '../roster-row/roster-row.fixtures'
import { PlayerProfileSummary } from './player-profile-summary'

describe('PlayerProfileSummary', () => {
  it('shows the display name and the profile chips', () => {
    render(<PlayerProfileSummary player={squadPlayerFixture} teamName="Estrela do Vale" category={CATEGORY.SUB14} />)

    expect(screen.getByText('Rafinha')).toBeInTheDocument()
    expect(screen.getByText('MEIA')).toBeInTheDocument()
    expect(screen.getByText('CANHOTO')).toBeInTheDocument()
    expect(screen.getByText('Estrela do Vale · SUB-14')).toBeInTheDocument()
  })

  it('shows a dash when the player has no display name', () => {
    render(<PlayerProfileSummary player={squadPlayerWithoutDetailsFixture} teamName="Estrela do Vale" category={CATEGORY.SUB14} />)

    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
