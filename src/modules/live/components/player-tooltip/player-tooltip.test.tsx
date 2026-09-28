import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LiveMatchProvider } from '../../state/live-context'
import { liveSnapshotFixture, SilentEventSource } from '../live-screen/live-screen.fixtures'
import { benchMatchStateFixture, busyMatchStateFixture, onPitchMatchStateFixture, secondYellowMatchStateFixture, subbedOutMatchStateFixture } from '../player-marks/player-marks.fixtures'
import { PlayerTooltip } from './player-tooltip'
import { reserveHoverFixture, strikerHoverFixture, strikerHoverNearTopFixture, unknownPlayerHoverFixture } from './player-tooltip.fixtures'

const renderInMatch = (children: ReactNode) => render(<LiveMatchProvider snapshot={liveSnapshotFixture}>{children}</LiveMatchProvider>)

describe('PlayerTooltip', () => {
  beforeEach(() => {
    vi.stubGlobal('EventSource', SilentEventSource)
  })

  it('shows the player number in the team color, the name and the profile line', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverFixture} matchState={onPitchMatchStateFixture} />)

    const name = screen.getByText('Davi Moreira Campos')
    expect(name.previousElementSibling).toHaveTextContent('9')
    expect(name.previousElementSibling).toHaveStyle({ color: liveSnapshotFixture.teams.home.color })
    expect(screen.getByText('Atacante · Pé canhoto · União FC SUB-14 · "Davizinho"')).toBeInTheDocument()
  })

  it('shows the season numbers with goals and yellow cards highlighted', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverFixture} matchState={onPitchMatchStateFixture} />)

    expect(screen.getByText('Gols').previousElementSibling).toHaveTextContent('7')
    expect(screen.getByText('Gols').previousElementSibling).toHaveClass('text-ac')
    expect(screen.getByText('Assist.').previousElementSibling).toHaveTextContent('2')
    expect(screen.getByText('Amarelos').previousElementSibling).toHaveClass('text-am')
    expect(screen.getByText('Jogos').previousElementSibling).toHaveTextContent('9')
  })

  it('lists the curiosities of the player', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverFixture} matchState={onPitchMatchStateFixture} />)

    expect(screen.getByText('Curiosidades')).toBeInTheDocument()
    expect(screen.getByText('Artilheiro do time na temporada')).toBeInTheDocument()
  })

  it('hides the match section when the player has no events in the match', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverFixture} matchState={onPitchMatchStateFixture} />)

    expect(screen.queryByText('Nesta partida')).not.toBeInTheDocument()
  })

  it('lists the match highlights of the player', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverFixture} matchState={busyMatchStateFixture} />)

    expect(screen.getByText('Nesta partida')).toBeInTheDocument()
    expect(screen.getByText('2 Gols')).toBeInTheDocument()
    expect(screen.getByText('Assistência')).toBeInTheDocument()
    expect(screen.getByText('Amarelo')).toBeInTheDocument()
    expect(screen.getByText('Entrou em campo')).toBeInTheDocument()
  })

  it('shows a second yellow as a red card highlight', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverFixture} matchState={secondYellowMatchStateFixture} />)

    expect(screen.getByText('Expulso (2º amarelo)').previousElementSibling).toHaveClass('bg-vm', 'rounded-[2px]')
  })

  it('marks a bench player as a reserve and hides empty curiosities', () => {
    renderInMatch(<PlayerTooltip hover={reserveHoverFixture} matchState={benchMatchStateFixture} />)

    expect(screen.getByText('União FC SUB-14 · Reserva')).toBeInTheDocument()
    expect(screen.queryByText('Curiosidades')).not.toBeInTheDocument()
  })

  it('marks a substituted player as substituted', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverFixture} matchState={subbedOutMatchStateFixture} />)

    expect(screen.getByText('Atacante · Pé canhoto · União FC SUB-14 · "Davizinho" · Substituído')).toBeInTheDocument()
  })

  it('opens above the dot when there is room above it', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverFixture} matchState={onPitchMatchStateFixture} />)

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveClass('-translate-y-full')
    expect(tooltip).toHaveStyle({ left: '480px', top: '388px' })
  })

  it('opens below the dot when it is close to the top of the screen', () => {
    renderInMatch(<PlayerTooltip hover={strikerHoverNearTopFixture} matchState={onPitchMatchStateFixture} />)

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).not.toHaveClass('-translate-y-full')
    expect(tooltip).toHaveStyle({ top: '142px' })
  })

  it('keeps the tooltip away from the screen edge', () => {
    renderInMatch(<PlayerTooltip hover={reserveHoverFixture} matchState={benchMatchStateFixture} />)

    expect(screen.getByRole('tooltip')).toHaveStyle({ left: '170px' })
  })

  it('renders nothing for a player that is not in the match', () => {
    renderInMatch(<PlayerTooltip hover={unknownPlayerHoverFixture} matchState={onPitchMatchStateFixture} />)

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
