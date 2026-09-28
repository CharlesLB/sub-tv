import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { BackToOverviewLink } from './back-to-overview-link'

describe('BackToOverviewLink', () => {
  it('points to the history overview keeping the selected seasons', () => {
    render(<BackToOverviewLink filter={loadedHistoryFilterFixture.filter} />)

    expect(screen.getByRole('link', { name: 'Voltar ao geral' })).toHaveAttribute('href', '/historico?temporadas=2024%2C2025')
  })

  it('points to the history overview keeping the selected category', () => {
    render(<BackToOverviewLink filter={{ category: CATEGORY.SUB13, years: [] }} />)

    expect(screen.getByRole('link', { name: 'Voltar ao geral' })).toHaveAttribute('href', '/historico?cat=sub13')
  })
})
