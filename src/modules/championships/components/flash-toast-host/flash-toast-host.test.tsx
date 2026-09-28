import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { clearFlashMessage, readFlashMessage, showFlashMessage } from '../../flash-message/flash-message'
import { FlashToastHost } from './flash-toast-host'

describe('FlashToastHost', () => {
  afterEach(() => {
    clearFlashMessage()
  })

  it('renders nothing while there is no flash message', () => {
    render(<FlashToastHost />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows the flash message as a success toast once it is published', () => {
    render(<FlashToastHost />)

    act(() => {
      showFlashMessage('Campeonato criado · SUB-14')
    })

    expect(screen.getByRole('status')).toHaveTextContent('Campeonato criado')
  })

  it('clears the flash message when the toast is closed', async () => {
    showFlashMessage('Campeonato criado · SUB-14')
    render(<FlashToastHost />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }))

    expect(readFlashMessage()).toBeNull()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
