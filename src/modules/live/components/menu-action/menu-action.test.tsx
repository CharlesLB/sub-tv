import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MENU_MARKER, MenuAction } from './menu-action'

const GOAL_ACTION = { label: 'Gol', meta: 'G', colorClass: 'bg-ac', shortcut: 'G' } as const

describe('MenuAction', () => {
  it('renders a menu item with its label, meta and keyboard shortcut', () => {
    render(<MenuAction {...GOAL_ACTION} marker={MENU_MARKER.ROUND} onSelect={vi.fn()} />)

    const item = screen.getByRole('menuitem', { name: /^Gol/ })
    expect(item).toHaveAttribute('aria-keyshortcuts', 'G')
    expect(screen.getByText('G')).toBeInTheDocument()
  })

  it('draws a round colored marker when the marker is round', () => {
    render(<MenuAction {...GOAL_ACTION} marker={MENU_MARKER.ROUND} onSelect={vi.fn()} />)

    expect(screen.getByRole('menuitem').firstElementChild).toHaveClass('size-[10px]', 'rounded-full', 'bg-ac')
  })

  it('draws a card shaped marker when the marker is a card', () => {
    render(<MenuAction label="Cartão" meta="C" colorClass="bg-am" shortcut="C" marker={MENU_MARKER.CARD} onSelect={vi.fn()} />)

    expect(screen.getByRole('menuitem').firstElementChild).toHaveClass('h-[15px]', 'w-[11px]', 'bg-am')
  })

  it('calls onSelect when the item is clicked', async () => {
    const onSelect = vi.fn()
    render(<MenuAction {...GOAL_ACTION} marker={MENU_MARKER.ROUND} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('menuitem'))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
