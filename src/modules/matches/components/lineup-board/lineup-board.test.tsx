import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LineupBoard } from './lineup-board'
import { boardSidesFixture } from './lineup-board.fixtures'

const FIELD_RECTANGLE = { left: 0, top: 0, width: 1050, height: 640 }
const FIELD_CENTER = { clientX: 525, clientY: 320 }
const HOME_GOALKEEPER = 'Camisa 1 — Caio Ribeiro, Estrela do Vale. Enter manda ao banco'
const HOME_RESERVE = 'Reserva camisa 12, Otávio Siqueira'
const AWAY_RESERVE = 'Reserva camisa 10, Felipe Moura'

const homeSide = boardSidesFixture[0]
const homeGoalkeeperPoint = homeSide?.positions['estrela-1'] ?? { x: 0, y: 0 }

const toPointer = (point: { x: number; y: number }) => ({ clientX: (point.x / 100) * FIELD_RECTANGLE.width, clientY: (point.y / 100) * FIELD_RECTANGLE.height })

const dragTo = (element: HTMLElement, pointer: { clientX: number; clientY: number }) => {
  fireEvent.pointerDown(element, { clientX: 0, clientY: 0, button: 0 })
  fireEvent.pointerMove(window, pointer)
}

describe('LineupBoard', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      DOMRect.fromRect({ x: FIELD_RECTANGLE.left, y: FIELD_RECTANGLE.top, width: FIELD_RECTANGLE.width, height: FIELD_RECTANGLE.height }),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a bench per side and a dot per starter on the pitch', () => {
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={vi.fn()} />)

    expect(within(screen.getByLabelText('Banco Estrela do Vale')).getAllByRole('button')).toHaveLength(3)
    expect(within(screen.getByLabelText('Banco Atlético Serrano')).getAllByRole('button')).toHaveLength(4)
    expect(screen.getAllByRole('button', { name: /Enter manda ao banco$/ })).toHaveLength(20)
  })

  it('announces how many starters each side has on the pitch', () => {
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={vi.fn()} />)

    expect(screen.getByText('Estrela do Vale: 11 de 11 em campo. Atlético Serrano: 9 de 11 em campo')).toBeInTheDocument()
  })

  it('benches a starter clicked without dragging', () => {
    const dispatch = vi.fn()
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={dispatch} />)

    fireEvent.pointerDown(screen.getByRole('button', { name: HOME_GOALKEEPER }), { button: 0 })
    fireEvent.pointerUp(window)

    expect(dispatch).toHaveBeenCalledWith({ type: 'starter/benched', side: 'home', playerId: 'estrela-1' })
  })

  it('ignores a pointer down that is not the primary button', () => {
    const dispatch = vi.fn()
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={dispatch} />)

    fireEvent.pointerDown(screen.getByRole('button', { name: HOME_GOALKEEPER }), { button: 2 })
    fireEvent.pointerUp(window)

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('moves a dragged starter to the point where it was released', () => {
    const dispatch = vi.fn()
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={dispatch} />)

    dragTo(screen.getByRole('button', { name: HOME_GOALKEEPER }), FIELD_CENTER)
    fireEvent.pointerUp(window)

    expect(dispatch).toHaveBeenCalledWith({ type: 'starter/moved', side: 'home', playerId: 'estrela-1', point: { x: 50, y: 50 } })
  })

  it('benches a starter from the keyboard', () => {
    const dispatch = vi.fn()
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={dispatch} />)

    fireEvent.keyDown(screen.getByRole('button', { name: HOME_GOALKEEPER }), { key: 'Delete' })

    expect(dispatch).toHaveBeenCalledWith({ type: 'starter/benched', side: 'home', playerId: 'estrela-1' })
  })

  it('places a reserve clicked without dragging or picked from the keyboard', () => {
    const dispatch = vi.fn()
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={dispatch} />)

    fireEvent.pointerDown(screen.getByRole('button', { name: AWAY_RESERVE }), { button: 0 })
    fireEvent.pointerUp(window)
    fireEvent.keyDown(screen.getByRole('button', { name: AWAY_RESERVE }), { key: 'Enter' })

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'reserve/placed', side: 'away', playerId: 'serrano-10', point: null })
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'reserve/placed', side: 'away', playerId: 'serrano-10', point: null })
  })

  it('shows a ghost of the reserve while it is dragged', () => {
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={vi.fn()} />)

    dragTo(screen.getByRole('button', { name: AWAY_RESERVE }), FIELD_CENTER)

    expect(screen.getAllByText('Felipinho')).toHaveLength(2)
  })

  it('places a reserve dropped on a free spot of the pitch at that point', () => {
    const dispatch = vi.fn()
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={dispatch} />)

    dragTo(screen.getByRole('button', { name: AWAY_RESERVE }), FIELD_CENTER)
    fireEvent.pointerUp(window)

    expect(dispatch).toHaveBeenCalledWith({ type: 'reserve/placed', side: 'away', playerId: 'serrano-10', point: { x: 50, y: 50 } })
    expect(screen.getAllByText('Felipinho')).toHaveLength(1)
  })

  it('swaps a reserve dropped over a starter and gives it the starter point', () => {
    const dispatch = vi.fn()
    render(<LineupBoard sides={boardSidesFixture} categoryLabel="SUB-14" dispatch={dispatch} />)

    dragTo(screen.getByRole('button', { name: HOME_RESERVE }), toPointer(homeGoalkeeperPoint))
    fireEvent.pointerUp(window)

    expect(dispatch).toHaveBeenCalledWith({ type: 'reserve/swapped', side: 'home', reserveId: 'estrela-12', starterId: 'estrela-1', point: homeGoalkeeperPoint })
  })
})
