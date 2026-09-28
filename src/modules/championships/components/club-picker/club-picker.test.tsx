import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ClubPicker } from './club-picker'
import { clubOptionsFixture, serranoClubFixture, valeVerdeClubFixture } from './club-picker.fixtures'

describe('ClubPicker', () => {
  it('lists every club as a checkbox and checks only the selected ones', () => {
    render(<ClubPicker clubs={clubOptionsFixture} selectedClubIds={[serranoClubFixture.clubId]} onToggle={vi.fn()} />)

    expect(screen.getAllByRole('checkbox')).toHaveLength(clubOptionsFixture.length)
    expect(screen.getByRole('checkbox', { name: 'Serrano FC' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Vale Verde EC' })).not.toBeChecked()
  })

  it('outlines a selected club with its team color', () => {
    render(<ClubPicker clubs={clubOptionsFixture} selectedClubIds={[serranoClubFixture.clubId]} onToggle={vi.fn()} />)

    expect(screen.getByText('Serrano FC').closest('label')).toHaveStyle({ borderColor: serranoClubFixture.badge.color })
  })

  it('reports the club id when a club is toggled', async () => {
    const onToggle = vi.fn()
    render(<ClubPicker clubs={clubOptionsFixture} selectedClubIds={[]} onToggle={onToggle} />)

    await userEvent.click(screen.getByRole('checkbox', { name: 'Vale Verde EC' }))

    expect(onToggle).toHaveBeenCalledWith(valeVerdeClubFixture.clubId)
  })

  it('shows a message when the category has no clubs', () => {
    render(<ClubPicker clubs={[]} selectedClubIds={[]} onToggle={vi.fn()} />)

    expect(screen.getByText('Nenhum clube cadastrado nesta categoria ainda.')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
