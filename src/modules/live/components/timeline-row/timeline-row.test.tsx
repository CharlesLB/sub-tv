import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { liveTeamsFixture } from '../scoreboard-team/scoreboard-team.fixtures'
import { TimelineRow } from './timeline-row'
import { awayYellowCardItemFixture, halfTimeItemFixture, homeGoalItemFixture } from './timeline-row.fixtures'

const cellsOf = (container: HTMLElement) => {
  const [homeCell, minuteCell, awayCell] = Array.from(container.firstElementChild?.children ?? []).filter((cell): cell is HTMLElement => cell instanceof HTMLElement)

  return { homeCell, minuteCell, awayCell }
}

describe('TimelineRow', () => {
  it('places a home event in the home column with the team abbreviation', () => {
    const { container } = render(<TimelineRow item={homeGoalItemFixture} teams={liveTeamsFixture} />)

    const { homeCell, minuteCell, awayCell } = cellsOf(container)
    expect(within(homeCell ?? container).getByText(homeGoalItemFixture.text)).toBeInTheDocument()
    expect(within(homeCell ?? container).getByText('UNI')).toBeInTheDocument()
    expect(minuteCell).toHaveTextContent("1ºT 12'")
    expect(awayCell).toBeEmptyDOMElement()
  })

  it('places an away event in the away column with the team abbreviation', () => {
    const { container } = render(<TimelineRow item={awayYellowCardItemFixture} teams={liveTeamsFixture} />)

    const { homeCell, awayCell } = cellsOf(container)
    expect(homeCell).toBeEmptyDOMElement()
    expect(within(awayCell ?? container).getByText(awayYellowCardItemFixture.text)).toBeInTheDocument()
    expect(within(awayCell ?? container).getByText('SER')).toBeInTheDocument()
  })

  it('shows a match marker in the home column without a team abbreviation', () => {
    const { container } = render(<TimelineRow item={halfTimeItemFixture} teams={liveTeamsFixture} />)

    const { homeCell } = cellsOf(container)
    expect(within(homeCell ?? container).getByText('Intervalo')).toBeInTheDocument()
    expect(screen.queryByText('UNI')).not.toBeInTheDocument()
    expect(screen.queryByText('SER')).not.toBeInTheDocument()
  })
})
