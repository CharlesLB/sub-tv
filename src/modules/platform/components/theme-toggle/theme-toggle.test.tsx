import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { THEME, THEME_ATTRIBUTE } from '../../theme/theme'
import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle', () => {
  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE)
    localStorage.clear()
  })

  it('offers the dark theme while the page is in the light theme', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Mudar para o modo escuro' })).toBeInTheDocument()
  })

  it('offers the light theme while the page is in the dark theme', () => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, THEME.DARK)

    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Mudar para o modo claro' })).toBeInTheDocument()
  })

  it('switches the page to the dark theme and remembers it when clicked in the light theme', async () => {
    render(<ThemeToggle />)

    await userEvent.click(screen.getByRole('button', { name: 'Mudar para o modo escuro' }))

    expect(document.documentElement).toHaveAttribute(THEME_ATTRIBUTE, THEME.DARK)
    expect(localStorage.getItem('subtv-tema')).toBe('escuro')
    expect(await screen.findByRole('button', { name: 'Mudar para o modo claro' })).toBeInTheDocument()
  })

  it('switches the page back to the light theme when clicked in the dark theme', async () => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, THEME.DARK)
    render(<ThemeToggle />)

    await userEvent.click(screen.getByRole('button', { name: 'Mudar para o modo claro' }))

    expect(document.documentElement).toHaveAttribute(THEME_ATTRIBUTE, THEME.LIGHT)
    expect(localStorage.getItem('subtv-tema')).toBe('claro')
  })
})
