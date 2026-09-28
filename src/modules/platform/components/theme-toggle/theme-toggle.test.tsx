import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-tema')
    localStorage.clear()
  })

  it('offers the dark theme while the page is in the light theme', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Mudar para o modo escuro' })).toBeInTheDocument()
  })

  it('offers the light theme while the page is in the dark theme', () => {
    document.documentElement.setAttribute('data-tema', 'escuro')

    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Mudar para o modo claro' })).toBeInTheDocument()
  })

  it('switches the page to the dark theme and remembers it when clicked in the light theme', async () => {
    render(<ThemeToggle />)

    await userEvent.click(screen.getByRole('button', { name: 'Mudar para o modo escuro' }))

    expect(document.documentElement).toHaveAttribute('data-tema', 'escuro')
    expect(localStorage.getItem('subtv-tema')).toBe('escuro')
    expect(await screen.findByRole('button', { name: 'Mudar para o modo claro' })).toBeInTheDocument()
  })

  it('switches the page back to the light theme when clicked in the dark theme', async () => {
    document.documentElement.setAttribute('data-tema', 'escuro')
    render(<ThemeToggle />)

    await userEvent.click(screen.getByRole('button', { name: 'Mudar para o modo claro' }))

    expect(document.documentElement).toHaveAttribute('data-tema', 'claro')
    expect(localStorage.getItem('subtv-tema')).toBe('claro')
  })
})
