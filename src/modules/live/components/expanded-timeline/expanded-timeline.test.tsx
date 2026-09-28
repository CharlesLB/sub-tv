import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SIDE } from '@/modules/matches/client'
import { timelineFixture } from '../event-chip/event-chip.fixtures'
import { liveSnapshotFixture } from '../live-board/live-board.fixtures'
import { ExpandedTimeline } from './expanded-timeline'

const { teams } = liveSnapshotFixture

describe('ExpandedTimeline', () => {
  it('heads the timeline with both team names in their colors', () => {
    render(<ExpandedTimeline items={timelineFixture} teams={teams} showRotateNotice={false} />)

    expect(screen.getByText('Timeline')).toBeInTheDocument()
    expect(screen.getByText('União FC')).toHaveStyle({ color: teams[SIDE.HOME].color })
    expect(screen.getByText('União FC')).toHaveClass('text-right')
    expect(screen.getByText('Serra Azul')).toHaveStyle({ color: teams[SIDE.AWAY].color })
  })

  it('lists every event in chronological order', () => {
    render(<ExpandedTimeline items={timelineFixture} teams={teams} showRotateNotice={false} />)

    const descriptions = screen.getAllByText(/GOL|AMARELO|Intervalo|SUBSTITUIÇÃO/).map((description) => description.textContent)

    expect(descriptions).toEqual(['GOL — #9 Davi · ASSIST. #10 Heitor', 'AMARELO — #9 Otávio', 'Intervalo', 'SUBSTITUIÇÃO — SAI #10 · ENTRA #12'])
    expect(screen.queryByText('Nada registrado ainda')).not.toBeInTheDocument()
  })

  it('explains that nothing was recorded when there are no events', () => {
    render(<ExpandedTimeline items={[]} teams={teams} showRotateNotice={false} />)

    expect(screen.getByText('Nada registrado ainda')).toBeInTheDocument()
    expect(screen.getByText('Gols, cartões e substituições entram aqui em ordem de minuto.')).toBeInTheDocument()
  })

  it('asks to rotate the phone when the notice is requested', () => {
    render(<ExpandedTimeline items={[]} teams={teams} showRotateNotice />)

    expect(screen.getByText('Gire O celular para A prancheta')).toBeInTheDocument()
  })

  it('hides the rotate notice by default', () => {
    render(<ExpandedTimeline items={[]} teams={teams} showRotateNotice={false} />)

    expect(screen.queryByText('Gire O celular para A prancheta')).not.toBeInTheDocument()
  })
})
