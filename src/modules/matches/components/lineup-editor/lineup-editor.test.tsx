import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { LINEUP_VIEW } from '../../lib/wizard-reducer/wizard-reducer'
import { boardSidesFixture } from '../lineup-board/lineup-board.fixtures'
import { LineupEditor } from './lineup-editor'

const MOBILE_QUERY = '(max-width: 619px), (max-height: 479px) and (max-width: 999px)'

const stubScreen = (isMobile: boolean) => {
  const matchMedia = vi.fn((query: string) => ({ matches: isMobile && query === MOBILE_QUERY, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  vi.stubGlobal('matchMedia', matchMedia)
}

describe('LineupEditor', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the view toolbar and the pitch board on a large screen in field view', () => {
    stubScreen(false)

    render(<LineupEditor sides={boardSidesFixture} view={LINEUP_VIEW.FIELD} category={CATEGORY.SUB14} year={2026} dispatch={vi.fn()} />)

    expect(screen.getByRole('group', { name: 'Visualização' })).toBeInTheDocument()
    expect(screen.getByLabelText('Banco Estrela do Vale')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Escalação Estrela do Vale' })).not.toBeInTheDocument()
  })

  it('shows the lineup cards on a large screen in list view', () => {
    stubScreen(false)

    render(<LineupEditor sides={boardSidesFixture} view={LINEUP_VIEW.LIST} category={CATEGORY.SUB14} year={2026} dispatch={vi.fn()} />)

    expect(screen.getByRole('group', { name: 'Visualização' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Escalação Estrela do Vale' })).toBeInTheDocument()
    expect(screen.getByText('Elenco 2026 · 14 Atletas vinculados ao SUB-14')).toBeInTheDocument()
  })

  it('hides the toolbar and falls back to the list on a small screen even in field view', () => {
    stubScreen(true)

    render(<LineupEditor sides={boardSidesFixture} view={LINEUP_VIEW.FIELD} category={CATEGORY.SUB14} year={2026} dispatch={vi.fn()} />)

    expect(screen.queryByRole('group', { name: 'Visualização' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Escalação Estrela do Vale' })).toBeInTheDocument()
  })

  it('dispatches the chosen view from the toolbar', async () => {
    stubScreen(false)
    const dispatch = vi.fn()
    render(<LineupEditor sides={boardSidesFixture} view={LINEUP_VIEW.FIELD} category={CATEGORY.SUB14} year={2026} dispatch={dispatch} />)

    await userEvent.click(screen.getByRole('button', { name: 'Lista' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'view/changed', view: LINEUP_VIEW.LIST })
  })

  it('dispatches a starter toggle from the list', async () => {
    stubScreen(false)
    const dispatch = vi.fn()
    render(<LineupEditor sides={boardSidesFixture} view={LINEUP_VIEW.LIST} category={CATEGORY.SUB14} year={2026} dispatch={dispatch} />)

    await userEvent.click(within(screen.getByRole('region', { name: 'Escalação Estrela do Vale' })).getByRole('checkbox', { name: /Caio Ribeiro/ }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'starter/toggled', side: 'home', playerId: 'estrela-1' })
  })
})
