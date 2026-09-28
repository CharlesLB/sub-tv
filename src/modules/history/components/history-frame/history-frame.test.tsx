import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistoryFrame } from './history-frame'

describe('HistoryFrame', () => {
  it('renders its children inside the scrolling frame', () => {
    render(
      <HistoryFrame>
        <p>Conteúdo do histórico</p>
      </HistoryFrame>,
    )

    expect(screen.getByText('Conteúdo do histórico')).toBeInTheDocument()
  })
})
