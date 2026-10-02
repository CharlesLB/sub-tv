import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { NAVIGATION_PROGRESS_LABEL } from '../navigation-progress/navigation-progress'
import { FormPendingIndicator } from './form-pending-indicator'

const neverSettles = () => new Promise<void>(() => undefined)

describe('FormPendingIndicator', () => {
  it('shows nothing before its form is submitted', () => {
    render(
      <form action={neverSettles}>
        <button type="submit">Filtrar</button>
        <FormPendingIndicator />
      </form>,
    )

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('shows the progress bar while its form is being submitted', async () => {
    render(
      <form action={neverSettles}>
        <button type="submit">Filtrar</button>
        <FormPendingIndicator />
      </form>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(await screen.findByRole('progressbar', { name: NAVIGATION_PROGRESS_LABEL })).toBeInTheDocument()
  })
})
