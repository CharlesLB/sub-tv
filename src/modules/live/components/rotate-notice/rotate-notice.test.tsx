import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RotateNotice } from './rotate-notice'

describe('RotateNotice', () => {
  it('asks to rotate the phone and explains why', () => {
    render(<RotateNotice />)

    expect(screen.getByText('Gire O celular para A prancheta')).toBeInTheDocument()
    expect(screen.getByText('Na horizontal o campo abre inteiro e dá para arrastar os jogadores.')).toBeInTheDocument()
  })
})
