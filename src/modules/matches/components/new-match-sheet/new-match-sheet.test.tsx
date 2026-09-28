import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NewMatchSheet } from './new-match-sheet'

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }))

const router = { push: vi.fn(), back: vi.fn(), replace: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), bfcacheId: 'nova-partida' }

describe('NewMatchSheet', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(router)
  })

  it('opens as a dialog titled with the details and the content', () => {
    render(
      <NewMatchSheet details={<span>Mineiro SUB-14</span>}>
        <p>Conteúdo do assistente</p>
      </NewMatchSheet>,
    )

    expect(screen.getByRole('dialog', { name: 'Nova partida' })).toBeInTheDocument()
    expect(screen.getByText('Mineiro SUB-14')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo do assistente')).toBeInTheDocument()
  })

  it('goes back in history when the close button is clicked', async () => {
    render(<NewMatchSheet details={null}>Conteúdo</NewMatchSheet>)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(router.back).toHaveBeenCalledOnce()
  })

  it('goes back in history when escape is pressed', async () => {
    render(<NewMatchSheet details={null}>Conteúdo</NewMatchSheet>)

    await userEvent.keyboard('{Escape}')

    expect(router.back).toHaveBeenCalledOnce()
  })
})
