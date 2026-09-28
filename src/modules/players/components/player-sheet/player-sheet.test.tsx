import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { routes, signInRoutes } from '@/lib/routes'
import { CATEGORY } from '@/modules/championships/client'
import { secondSquadPlayerFixture, squadPlayerFixture, squadPlayerWithoutDetailsFixture } from '../roster-row/roster-row.fixtures'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { PlayerSheet } from './player-sheet'

const DISPLAY_NAME_LABEL = 'Apelido (como o narrador chama)'

describe('PlayerSheet', () => {
  it('shows the read only number and name from the FMF reports', () => {
    render(<PlayerSheet player={squadPlayerFixture} squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={null} onClose={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Ficha do jogador' })).toBeInTheDocument()
    expect(screen.getByLabelText('Número')).toHaveValue('10')
    expect(screen.getByLabelText('Número')).toBeDisabled()
    expect(screen.getByLabelText('Nome')).toHaveValue('Rafael Moreira Duarte')
  })

  it('shows a dash in the number field when the player has no number', () => {
    render(<PlayerSheet player={squadPlayerWithoutDetailsFixture} squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={null} onClose={vi.fn()} />)

    expect(screen.getByLabelText('Número')).toHaveValue('—')
  })

  it('shows the profile summary and the sign in link when the visitor cannot edit', () => {
    render(<PlayerSheet player={squadPlayerFixture} squad={teamSquadFixture} categoryFilter={CATEGORY.SUB14} canEdit={false} lastChange={null} onClose={vi.fn()} />)

    expect(screen.queryByRole('textbox', { name: DISPLAY_NAME_LABEL })).not.toBeInTheDocument()
    expect(screen.getByText('Rafinha')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Entre para editar esta ficha' })).toHaveAttribute(
      'href',
      signInRoutes.signInTo(routes.squads({ year: 2025, category: CATEGORY.SUB14, teamKey: teamSquadFixture.key, playerId: squadPlayerFixture.id })),
    )
  })

  it('shows the profile form and hides the sign in link when the visitor can edit', () => {
    render(<PlayerSheet player={squadPlayerFixture} squad={teamSquadFixture} categoryFilter={undefined} canEdit lastChange={null} onClose={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL })).toHaveValue('Rafinha')
    expect(screen.queryByRole('link', { name: 'Entre para editar esta ficha' })).not.toBeInTheDocument()
  })

  it('links to the same athlete in the other category without a category filter', () => {
    render(<PlayerSheet player={squadPlayerFixture} squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={null} onClose={vi.fn()} />)

    expect(screen.getByRole('link', { name: 'Ver este atleta no SUB-13' })).toHaveAttribute(
      'href',
      routes.squads({ year: 2025, teamKey: teamSquadFixture.otherCategoryKey, playerId: squadPlayerFixture.id }),
    )
  })

  it('switches the category filter to the other category when the list is filtered', () => {
    render(<PlayerSheet player={squadPlayerFixture} squad={teamSquadFixture} categoryFilter={CATEGORY.SUB14} canEdit={false} lastChange={null} onClose={vi.fn()} />)

    expect(screen.getByRole('link', { name: 'Ver este atleta no SUB-13' })).toHaveAttribute(
      'href',
      routes.squads({ year: 2025, category: CATEGORY.SUB13, teamKey: teamSquadFixture.otherCategoryKey, playerId: squadPlayerFixture.id }),
    )
  })

  it('hides the other category link when the athlete plays only in this category', () => {
    render(<PlayerSheet player={secondSquadPlayerFixture} squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={null} onClose={vi.fn()} />)

    expect(screen.queryByRole('link', { name: /Ver este atleta no/ })).not.toBeInTheDocument()
  })

  it('renders the last change, the curiosities and the category note', () => {
    render(<PlayerSheet player={squadPlayerFixture} squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={<p>Última alteração: Marta</p>} onClose={vi.fn()} />)

    expect(screen.getByText('Última alteração: Marta')).toBeInTheDocument()
    expect(screen.getByText('Joga com a camisa do irmão mais velho.')).toBeInTheDocument()
    expect(screen.getByText('Curiosidades pertencem a este vínculo e só aparecem em partidas da categoria SUB-14.')).toBeInTheDocument()
  })

  it('calls close when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<PlayerSheet player={squadPlayerFixture} squad={teamSquadFixture} categoryFilter={undefined} canEdit={false} lastChange={null} onClose={onClose} />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar ✕' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
