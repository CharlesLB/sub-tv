import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ACTIVE_YEAR_FIXTURE, championshipsHrefForYear, seasonYearsFixture } from '../season-panel/season-panel.fixtures'
import { YearAxis } from './year-axis'

const PHONE_QUERY = '(max-width: 619px)'
const COMPACT_QUERY = '(max-width: 1079px)'

const stubMatchingQueries = (matchingQueries: readonly string[]) => {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: matchingQueries.includes(query), addEventListener: vi.fn(), removeEventListener: vi.fn() }))
}

const stubViewport = ({ isPhone }: { isPhone: boolean }) => stubMatchingQueries(isPhone ? [PHONE_QUERY] : [])

const visibleYears = () => screen.getAllByRole('link').map((link) => link.textContent)

const renderAxis = (onSelectYear = vi.fn()) => render(<YearAxis years={seasonYearsFixture} activeYear={ACTIVE_YEAR_FIXTURE} hrefForYear={championshipsHrefForYear} onSelectYear={onSelectYear} />)

describe('YearAxis', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the five most recent seasons in ascending order ending at the active one on a wide screen', () => {
    stubViewport({ isPhone: false })

    renderAxis()

    expect(visibleYears()).toEqual(['2021', '2022', '2023', '2024', '2025'])
    expect(screen.getByRole('link', { name: '2025' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: '2024' })).toHaveAttribute('href', '/campeonatos?temporada=2024')
    expect(screen.getByRole('link', { name: '2024' })).toHaveAttribute('title', '5 campeonatos · elenco 2024')
  })

  it('offers only the previous years arrow when the window ends at the last season', () => {
    stubViewport({ isPhone: false })

    renderAxis()

    expect(screen.getByRole('button', { name: 'Anos anteriores' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Anos seguintes' })).not.toBeInTheDocument()
  })

  it('moves the window one year back and offers the next years arrow when the previous arrow is clicked', async () => {
    stubViewport({ isPhone: false })
    renderAxis()

    await userEvent.click(screen.getByRole('button', { name: 'Anos anteriores' }))

    expect(visibleYears()).toEqual(['2020', '2021', '2022', '2023', '2024'])
    expect(screen.getByRole('button', { name: 'Anos seguintes' })).toBeInTheDocument()
  })

  it('moves the window forward again when the next years arrow is clicked', async () => {
    stubViewport({ isPhone: false })
    renderAxis()
    await userEvent.click(screen.getByRole('button', { name: 'Anos anteriores' }))

    await userEvent.click(screen.getByRole('button', { name: 'Anos seguintes' }))

    expect(visibleYears()).toEqual(['2021', '2022', '2023', '2024', '2025'])
  })

  it('shows only the active season on a phone', () => {
    stubViewport({ isPhone: true })

    renderAxis()

    expect(visibleYears()).toEqual(['2025'])
  })

  it('shows four seasons on a compact screen at the compact breakpoint of the design', () => {
    stubMatchingQueries([COMPACT_QUERY])

    renderAxis()

    expect(visibleYears()).toEqual(['2022', '2023', '2024', '2025'])
  })

  it('reports the chosen season when a year is clicked', async () => {
    stubViewport({ isPhone: false })
    const onSelectYear = vi.fn()
    renderAxis(onSelectYear)

    await userEvent.click(screen.getByRole('link', { name: '2023' }))

    expect(onSelectYear).toHaveBeenCalledWith(2023)
  })
})
