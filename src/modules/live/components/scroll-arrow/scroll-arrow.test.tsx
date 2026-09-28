import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ScrollArrow } from './scroll-arrow'

describe('ScrollArrow', () => {
  it('labels the previous arrow for the earlier events', () => {
    render(<ScrollArrow direction="previous" isDisabled={false} onClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Eventos anteriores' })).toHaveAttribute('title', 'Anterior')
  })

  it('labels the next arrow for the later events', () => {
    render(<ScrollArrow direction="next" isDisabled={false} onClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Próximos eventos' })).toHaveAttribute('title', 'Próximo')
  })

  it('calls onClick when an enabled arrow is clicked', async () => {
    const onClick = vi.fn()
    render(<ScrollArrow direction="next" isDisabled={false} onClick={onClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'Próximos eventos' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disables the arrow and ignores clicks at the scroll edge', async () => {
    const onClick = vi.fn()
    render(<ScrollArrow direction="previous" isDisabled onClick={onClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'Eventos anteriores' }))

    expect(screen.getByRole('button', { name: 'Eventos anteriores' })).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })
})
