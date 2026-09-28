import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ActionResult } from '@/lib/actions/result'
import { addCuriosity, removeCuriosity } from '../../actions/player-actions'
import { squadPlayerFixture } from '../roster-row/roster-row.fixtures'
import { CuriosityList } from './curiosity-list'
import { curiositiesFixture } from './curiosity-list.fixtures'

const NEW_CURIOSITY = 'Faz embaixadinhas com a laranja.'

const deferPlayerResult = () => Promise.withResolvers<ActionResult<{ playerId: string }>>()

describe('CuriosityList', () => {
  it('lists every curiosity with a remove button and the add form when the visitor can edit', () => {
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={curiositiesFixture} canEdit />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Joga com a camisa do irmão mais velho.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Remover curiosidade' })).toHaveLength(2)
    expect(screen.getByRole('textbox', { name: 'Nova curiosidade' })).toBeInTheDocument()
  })

  it('hides the remove buttons and the add form when the visitor cannot edit', () => {
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={curiositiesFixture} canEdit={false} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByRole('button', { name: 'Remover curiosidade' })).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Nova curiosidade' })).not.toBeInTheDocument()
  })

  it('shows the empty message when the player has no curiosity', () => {
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={[]} canEdit={false} />)

    expect(screen.getByText('Sem curiosidade cadastrada.')).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('sends the typed curiosity with the player id and shows it only while the action is pending', async () => {
    const pendingResult = deferPlayerResult()
    vi.mocked(addCuriosity).mockReturnValue(pendingResult.promise)
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={[]} canEdit />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Nova curiosidade' }), NEW_CURIOSITY)
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(await screen.findByText(NEW_CURIOSITY)).toBeInTheDocument()
    const submittedForm = vi.mocked(addCuriosity).mock.calls[0]?.[1]
    expect(submittedForm?.get('text')).toBe(NEW_CURIOSITY)
    expect(submittedForm?.get('playerId')).toBe(squadPlayerFixture.id)
    await act(async () => pendingResult.resolve({ ok: true, data: { playerId: squadPlayerFixture.id } }))
    expect(screen.queryByText(NEW_CURIOSITY)).not.toBeInTheDocument()
  })

  it('shows the text field error when adding a curiosity fails validation', async () => {
    vi.mocked(addCuriosity).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { text: ['Use no máximo 160 caracteres.'] } })
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={[]} canEdit />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Nova curiosidade' }), NEW_CURIOSITY)
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Use no máximo 160 caracteres.')
  })

  it('shows the action error when removing a curiosity fails without field errors', async () => {
    vi.mocked(removeCuriosity).mockResolvedValue({ ok: false, error: 'Curiosidade não encontrada.' })
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={curiositiesFixture} canEdit />)

    await userEvent.click(screen.getAllByRole('button', { name: 'Remover curiosidade' })[0] ?? document.body)

    expect(await screen.findByRole('alert')).toHaveTextContent('Curiosidade não encontrada.')
  })

  it('sends the curiosity id and hides the curiosity only while it is being removed', async () => {
    const pendingResult = deferPlayerResult()
    vi.mocked(removeCuriosity).mockReturnValue(pendingResult.promise)
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={curiositiesFixture} canEdit />)

    await userEvent.click(screen.getAllByRole('button', { name: 'Remover curiosidade' })[0] ?? document.body)

    expect(screen.queryByText('Bateu o pênalti decisivo na final da Copa do Interior.')).not.toBeInTheDocument()
    expect(vi.mocked(removeCuriosity).mock.calls[0]?.[1].get('curiosityId')).toBe(curiositiesFixture[0]?.id)
    await act(async () => pendingResult.resolve({ ok: true, data: { playerId: squadPlayerFixture.id } }))
    expect(screen.getByText('Bateu o pênalti decisivo na final da Copa do Interior.')).toBeInTheDocument()
  })

  it('shows the error of the most recent action when a remove fails after a failed add', async () => {
    vi.mocked(addCuriosity).mockResolvedValue({ ok: false, error: 'Não foi possível adicionar.' })
    vi.mocked(removeCuriosity).mockResolvedValue({ ok: false, error: 'Curiosidade não encontrada.' })
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={curiositiesFixture} canEdit />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Nova curiosidade' }), NEW_CURIOSITY)
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    await screen.findByText('Não foi possível adicionar.')

    await userEvent.click(screen.getAllByRole('button', { name: 'Remover curiosidade' })[0] ?? document.body)

    expect(await screen.findByRole('alert')).toHaveTextContent('Curiosidade não encontrada.')
  })

  it('clears a previous add error when a later remove succeeds', async () => {
    vi.mocked(addCuriosity).mockResolvedValue({ ok: false, error: 'Não foi possível adicionar.' })
    vi.mocked(removeCuriosity).mockResolvedValue({ ok: true, data: { playerId: squadPlayerFixture.id } })
    render(<CuriosityList playerId={squadPlayerFixture.id} curiosities={curiositiesFixture} canEdit />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Nova curiosidade' }), NEW_CURIOSITY)
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    await screen.findByText('Não foi possível adicionar.')

    await userEvent.click(screen.getAllByRole('button', { name: 'Remover curiosidade' })[0] ?? document.body)

    await vi.waitFor(() => expect(removeCuriosity).toHaveBeenCalled())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
