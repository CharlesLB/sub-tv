import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createManualPlayer } from '../../actions/player-actions'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { NewPlayerPopover } from './new-player-popover'

const NEW_PLAYER_ID = 'e2a4c6b8-1d3f-4a5c-9e7b-0c2d4f6a8b10'

const fillAndSubmit = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Cadastrar novo jogador SUB-14' }))
  await userEvent.type(screen.getByLabelText('Número'), '17')
  await userEvent.type(screen.getByLabelText('Nome completo'), 'Bruno Carvalho Nunes')
  await userEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))
}

describe('NewPlayerPopover', () => {
  it('shows only the trigger with the squad category before it is clicked', () => {
    render(<NewPlayerPopover squad={teamSquadFixture} onPlayerCreated={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Cadastrar novo jogador SUB-14' })).toBeInTheDocument()
    expect(screen.queryByText('Novo jogador SUB-14')).not.toBeInTheDocument()
  })

  it('opens the manual registration form when the trigger is clicked', async () => {
    render(<NewPlayerPopover squad={teamSquadFixture} onPlayerCreated={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cadastrar novo jogador SUB-14' }))

    expect(screen.getByRole('dialog', { name: 'Novo jogador SUB-14' })).toBeInTheDocument()
    expect(screen.getByText('Até a súmula da FMF chegar, o atleta fica como cadastro provisório neste elenco.')).toBeInTheDocument()
  })

  it('sends the squad identity with the typed player and reports the created player', async () => {
    const onPlayerCreated = vi.fn()
    vi.mocked(createManualPlayer).mockResolvedValue({ ok: true, data: { playerId: NEW_PLAYER_ID } })
    render(<NewPlayerPopover squad={teamSquadFixture} onPlayerCreated={onPlayerCreated} />)

    await fillAndSubmit()

    const submittedForm = vi.mocked(createManualPlayer).mock.calls[0]?.[1]
    expect(submittedForm?.get('year')).toBe('2025')
    expect(submittedForm?.get('category')).toBe(teamSquadFixture.category)
    expect(submittedForm?.get('clubId')).toBe(teamSquadFixture.clubId)
    expect(submittedForm?.get('shirtNumber')).toBe('17')
    expect(submittedForm?.get('fullName')).toBe('Bruno Carvalho Nunes')
    expect(onPlayerCreated).toHaveBeenCalledWith(NEW_PLAYER_ID)
    expect(screen.queryByText('Novo jogador SUB-14')).not.toBeInTheDocument()
  })

  it('shows the full name error first when the action rejects both fields', async () => {
    vi.mocked(createManualPlayer).mockResolvedValue({
      ok: false,
      error: 'Confira os campos.',
      fieldErrors: { fullName: ['Informe o nome completo.'], shirtNumber: ['Número de 1 a 99.'] },
    })

    render(<NewPlayerPopover squad={teamSquadFixture} onPlayerCreated={vi.fn()} />)

    await fillAndSubmit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Informe o nome completo.')
  })

  it('shows the shirt number error when it is the only field error', async () => {
    vi.mocked(createManualPlayer).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { shirtNumber: ['Número de 1 a 99.'] } })
    render(<NewPlayerPopover squad={teamSquadFixture} onPlayerCreated={vi.fn()} />)

    await fillAndSubmit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Número de 1 a 99.')
  })

  it('shows the action error and keeps the form open when the action fails without field errors', async () => {
    const onPlayerCreated = vi.fn()
    vi.mocked(createManualPlayer).mockResolvedValue({ ok: false, error: 'Número 17 já está em uso neste elenco.' })
    render(<NewPlayerPopover squad={teamSquadFixture} onPlayerCreated={onPlayerCreated} />)

    await fillAndSubmit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Número 17 já está em uso neste elenco.')
    expect(screen.getByText('Novo jogador SUB-14')).toBeInTheDocument()
    expect(onPlayerCreated).not.toHaveBeenCalled()
  })

  it('closes the form when cancel is clicked', async () => {
    render(<NewPlayerPopover squad={teamSquadFixture} onPlayerCreated={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cadastrar novo jogador SUB-14' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByText('Novo jogador SUB-14')).not.toBeInTheDocument()
  })
})
