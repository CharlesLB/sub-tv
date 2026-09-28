import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SeasonBarChart } from './season-bar-chart'
import { seasonBarsFixture } from './season-bar-chart.fixtures'

const BAR_COLOR = '#1f4fa3'
const TRACK_HEIGHT_CLASS = 'h-[88px]'

const renderChart = () => render(<SeasonBarChart title="Gols por temporada" bars={seasonBarsFixture} color={BAR_COLOR} trackHeightClass={TRACK_HEIGHT_CLASS} />)

describe('SeasonBarChart', () => {
  it('renders a figure named and captioned by the title', () => {
    renderChart()

    expect(screen.getByRole('figure', { name: 'Gols por temporada' })).toHaveTextContent('Gols por temporada')
  })

  it('orders the bars chronologically with the short year under each one', () => {
    renderChart()

    expect(screen.getAllByTitle(/^\d{4}: \d+$/).map((bar) => bar.title)).toEqual(['2023: 0', '2024: 6', '2025: 11'])
    expect(within(screen.getByTitle('2025: 11')).getByText('25')).toBeInTheDocument()
  })

  it('scales the bars to the highest value with a minimum height for empty seasons', () => {
    const { container } = renderChart()

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="height"]')]
    expect(bars.map((bar) => bar.style.height)).toEqual(['6%', '55%', '100%'])
    expect(bars[0]).toHaveStyle({ background: BAR_COLOR })
  })

  it('applies the track height class to every bar track', () => {
    const { container } = renderChart()

    expect(container.getElementsByClassName(TRACK_HEIGHT_CLASS)).toHaveLength(seasonBarsFixture.length)
  })
})
