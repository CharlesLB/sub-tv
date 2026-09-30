import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { routes } from '@/lib/routes'
import { createChampionship } from '../../actions/championship-actions'
import { CATEGORY } from '../../lib/categories/categories'
import { clearFlashMessage, readFlashMessage } from '../../lib/flash-message/flash-message'
import { categoryClubsFixture, categoryClubsWithoutSub14Fixture } from '../club-picker/club-picker.fixtures'
import { NewChampionshipPanel } from './new-championship-panel'

const navigation = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: navigation.push }) }))

const CREATED_SEASON_ID = 'b2c3d4e5-0001-4f5a-8b9c-0d1e2f3a4b5c'
const DEFAULT_YEAR = 2025
const TOAST_DURATION_MS = 3800
const PART_OF_TOAST_DURATION_MS = 2000

const renderPanel = (onClose = vi.fn()) => render(<NewChampionshipPanel initialCategory={CATEGORY.SUB13} defaultYear={DEFAULT_YEAR} clubs={categoryClubsFixture} onClose={onClose} />)

describe('NewChampionshipPanel', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    clearFlashMessage()
    vi.useRealTimers()
  })

  it('opens with the initial category selected, the default year and the default phase', () => {
    renderPanel()

    expect(screen.getByRole('heading', { name: 'Novo campeonato' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SUB-13' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'SUB-14' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByLabelText('Temporada')).toHaveValue(DEFAULT_YEAR)
    expect(screen.getByLabelText('Fase')).toHaveValue('1ª FASE · RODADA 1')
    expect(screen.getAllByRole('checkbox')).toHaveLength(categoryClubsFixture[CATEGORY.SUB13].length)
  })

  it('warns and does not call the action when the name is empty', async () => {
    renderPanel()

    await userEvent.click(screen.getByRole('button', { name: 'Criar campeonato' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Defina nome e categoria do campeonato')
    expect(createChampionship).not.toHaveBeenCalled()
  })

  it('hides the missing name warning after the toast duration even when the form rerenders meanwhile', () => {
    vi.useFakeTimers()
    renderPanel()
    fireEvent.click(screen.getByRole('button', { name: 'Criar campeonato' }))

    act(() => {
      vi.advanceTimersByTime(PART_OF_TOAST_DURATION_MS)
    })

    fireEvent.click(screen.getByRole('button', { name: 'SUB-14' }))

    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS - PART_OF_TOAST_DURATION_MS)
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('groups the category options under the Categoria name', () => {
    renderPanel()

    expect(screen.getByRole('group', { name: 'Categoria' }).tagName).toBe('FIELDSET')
  })

  it('counts the selected clubs', async () => {
    renderPanel()

    await userEvent.click(screen.getByRole('checkbox', { name: 'Vale Verde EC' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Serrano FC' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Vale Verde EC' }))

    expect(screen.getByText('1 selecionado')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Serrano FC' })).toBeChecked()
  })

  it('switches the club list and clears the selection when another category is chosen', async () => {
    renderPanel()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Vale Verde EC' }))

    await userEvent.click(screen.getByRole('button', { name: 'SUB-14' }))

    expect(screen.getByRole('button', { name: 'SUB-14' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('checkbox', { name: 'Atlético Cerrado' })).not.toBeChecked()
    expect(screen.getByText('0 selecionados')).toBeInTheDocument()
  })

  it('shows the empty club message when the chosen category has no clubs', () => {
    render(<NewChampionshipPanel initialCategory={CATEGORY.SUB14} defaultYear={DEFAULT_YEAR} clubs={categoryClubsWithoutSub14Fixture} onClose={vi.fn()} />)

    expect(screen.getByText('Nenhum clube cadastrado nesta categoria ainda.')).toBeInTheDocument()
  })

  it('sends the form, publishes a flash message and opens the new championship when the action succeeds', async () => {
    vi.mocked(createChampionship).mockResolvedValue({ ok: true, data: { seasonId: CREATED_SEASON_ID } })
    renderPanel()

    await userEvent.type(screen.getByLabelText('Nome'), 'Copa do Vale')
    await userEvent.click(screen.getByRole('checkbox', { name: 'Serrano FC' }))
    await userEvent.click(screen.getByRole('button', { name: 'Criar campeonato' }))

    await waitFor(() => expect(navigation.push).toHaveBeenCalledWith(routes.championship(CREATED_SEASON_ID)))
    const submittedForm = vi.mocked(createChampionship).mock.calls[0]?.[1]
    expect(submittedForm?.get('name')).toBe('Copa do Vale')
    expect(submittedForm?.get('category')).toBe(CATEGORY.SUB13)
    expect(submittedForm?.getAll('clubId')).toEqual([categoryClubsFixture[CATEGORY.SUB13][1]?.clubId])
    expect(readFlashMessage()).toBe('Campeonato criado · SUB-13')
  })

  it('shows the first field error when the action rejects a field', async () => {
    vi.mocked(createChampionship).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { name: ['Nome muito curto.'] } })
    renderPanel()

    await userEvent.type(screen.getByLabelText('Nome'), 'AB')
    await userEvent.click(screen.getByRole('button', { name: 'Criar campeonato' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Nome muito curto.')
  })

  it('shows the action error when there is no field error', async () => {
    vi.mocked(createChampionship).mockResolvedValue({ ok: false, error: 'Já existe um campeonato com esse nome.' })
    renderPanel()

    await userEvent.type(screen.getByLabelText('Nome'), 'Copa do Vale')
    await userEvent.click(screen.getByRole('button', { name: 'Criar campeonato' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Já existe um campeonato com esse nome.')
  })

  it('disables the submit button while the championship is being created', async () => {
    vi.mocked(createChampionship).mockReturnValue(new Promise(() => undefined))
    renderPanel()

    await userEvent.type(screen.getByLabelText('Nome'), 'Copa do Vale')
    await userEvent.click(screen.getByRole('button', { name: 'Criar campeonato' }))

    expect(await screen.findByRole('button', { name: 'Criando…' })).toBeDisabled()
  })

  it('closes when cancel is clicked', async () => {
    const onClose = vi.fn()
    renderPanel(onClose)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
