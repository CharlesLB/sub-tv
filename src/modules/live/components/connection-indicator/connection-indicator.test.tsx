import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { STREAM_STATUS } from '../../state/live-state'
import { ConnectionIndicator } from './connection-indicator'

describe('ConnectionIndicator', () => {
  it('shows the connecting label while the stream opens', () => {
    render(<ConnectionIndicator status={STREAM_STATUS.CONNECTING} isSaving={false} />)

    expect(screen.getByRole('status')).toHaveTextContent('Conectando')
    expect(screen.getByRole('status')).toHaveAttribute('title', 'Tempo real: conectando')
  })

  it('shows the synced label when connected with nothing to save', () => {
    render(<ConnectionIndicator status={STREAM_STATUS.CONNECTED} isSaving={false} />)

    expect(screen.getByRole('status')).toHaveTextContent('Sincronizado')
  })

  it('shows the saving label when connected with pending saves', () => {
    render(<ConnectionIndicator status={STREAM_STATUS.CONNECTED} isSaving />)

    expect(screen.getByRole('status')).toHaveTextContent('Salvando')
    expect(screen.getByRole('status')).toHaveAttribute('title', 'Tempo real: salvando')
  })

  it('keeps the reconnecting label even when there are pending saves', () => {
    render(<ConnectionIndicator status={STREAM_STATUS.RECONNECTING} isSaving />)

    expect(screen.getByRole('status')).toHaveTextContent('Reconectando')
  })
})
