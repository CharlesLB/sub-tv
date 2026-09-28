import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ActionResult } from '@/lib/actions/result'
import { CATEGORY } from '@/modules/championships/client'
import { updatePlayerProfile } from '../../actions/player-actions'
import { squadPlayerFixture, squadPlayerWithoutDetailsFixture } from '../roster-row/roster-row.fixtures'
import { PlayerProfileForm } from './player-profile-form'

const TEAM_NAME = 'Estrela do Vale'
const DISPLAY_NAME_LABEL = 'Apelido (como o narrador chama)'
const SAVED_RESULT = { ok: true, data: { playerId: squadPlayerFixture.id } } as const

const renderForm = (player = squadPlayerFixture) => render(<PlayerProfileForm player={player} teamName={TEAM_NAME} category={CATEGORY.SUB14} />)

describe('PlayerProfileForm', () => {
  it('fills the display name, chips and choices with the saved profile', () => {
    renderForm()

    expect(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL })).toHaveValue('Rafinha')
    expect(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL })).toHaveAttribute('placeholder', 'ex.: Rafa')
    expect(screen.getByRole('radio', { name: 'Meia' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Canhoto' })).toBeChecked()
    expect(screen.getByText('MEIA')).toBeInTheDocument()
    expect(screen.getByText('Estrela do Vale · SUB-14')).toBeInTheDocument()
  })

  it('suggests the fallback nickname and leaves every choice unchecked when the profile is empty', () => {
    renderForm(squadPlayerWithoutDetailsFixture)

    expect(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL })).toHaveAttribute('placeholder', 'ex.: Jota')
    expect(screen.getAllByRole('radio').filter((radio) => radio instanceof HTMLInputElement && radio.checked)).toHaveLength(0)
  })

  it('saves the display name on blur when it changed and confirms the save', async () => {
    vi.mocked(updatePlayerProfile).mockResolvedValue(SAVED_RESULT)
    renderForm()

    await userEvent.clear(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL }))
    await userEvent.type(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL }), 'Rafa Canhoto')
    await userEvent.tab()

    expect(await screen.findByText('Salvo')).toBeInTheDocument()
    const submittedForm = vi.mocked(updatePlayerProfile).mock.calls[0]?.[1]
    expect(submittedForm?.get('displayName')).toBe('Rafa Canhoto')
    expect(submittedForm?.get('playerId')).toBe(squadPlayerFixture.id)
  })

  it('does not save on blur when the display name did not change', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL }))
    await userEvent.tab()

    expect(updatePlayerProfile).not.toHaveBeenCalled()
  })

  it('saves the new position as soon as it is chosen', async () => {
    vi.mocked(updatePlayerProfile).mockResolvedValue(SAVED_RESULT)
    renderForm()

    await userEvent.click(screen.getByRole('radio', { name: 'Atacante' }))

    expect(await screen.findByText('Salvo')).toBeInTheDocument()
    expect(vi.mocked(updatePlayerProfile).mock.calls[0]?.[1].get('position')).toBe('atacante')
  })

  it('shows the saving feedback and the chosen foot in the chips while the save is pending', async () => {
    const pendingResult = Promise.withResolvers<ActionResult<{ playerId: string }>>()
    vi.mocked(updatePlayerProfile).mockReturnValue(pendingResult.promise)
    renderForm()

    await userEvent.click(screen.getByRole('radio', { name: 'Ambidestro' }))

    expect(await screen.findByText('Salvando…')).toBeInTheDocument()
    expect(screen.getByText('AMBIDESTRO')).toBeInTheDocument()
    await act(async () => pendingResult.resolve(SAVED_RESULT))
    expect(screen.getByText('Salvo')).toBeInTheDocument()
  })

  it('shows the display name error when the save is rejected', async () => {
    vi.mocked(updatePlayerProfile).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { displayName: ['Use no máximo 30 caracteres.'] } })
    renderForm()

    await userEvent.type(screen.getByRole('textbox', { name: DISPLAY_NAME_LABEL }), ' da Vila')
    await userEvent.tab()

    expect(await screen.findByText('Use no máximo 30 caracteres.')).toBeInTheDocument()
  })

  it('shows the action error when the save fails without field errors', async () => {
    vi.mocked(updatePlayerProfile).mockResolvedValue({ ok: false, error: 'Jogador não encontrado.' })
    renderForm()

    await userEvent.click(screen.getByRole('radio', { name: 'Zagueiro' }))

    expect(await screen.findByText('Jogador não encontrado.')).toBeInTheDocument()
  })
})
