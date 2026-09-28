import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { awayTeamFixture, homeTeamFixture, thirdTeamFixture } from '../lineup-card/lineup-card.fixtures'
import { TeamsStep } from './teams-step'

const TEAMS = [homeTeamFixture, awayTeamFixture, thirdTeamFixture]
const CHOSEN_TEAM_IDS = { home: homeTeamFixture.seasonTeamId, away: awayTeamFixture.seasonTeamId }
const TEAMS_NOTICE = 'Somente os 3 times inscritos em Mineiro SUB-14 aparecem nesta lista.'

describe('TeamsStep', () => {
  it('shows one group per side listing every team with the chosen one pressed', () => {
    render(<TeamsStep teams={TEAMS} category={CATEGORY.SUB14} chosenTeamIds={CHOSEN_TEAM_IDS} notice={null} onPick={vi.fn()} />)

    const homeGroup = within(screen.getByRole('group', { name: 'Time mandante' }))

    expect(homeGroup.getAllByRole('button')).toHaveLength(3)
    expect(homeGroup.getByRole('button', { name: 'Estrela do Vale' })).toHaveAttribute('aria-pressed', 'true')
    expect(homeGroup.getByRole('button', { name: 'União Mineira' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('disables in each side the team already chosen by the other side', () => {
    render(<TeamsStep teams={TEAMS} category={CATEGORY.SUB14} chosenTeamIds={CHOSEN_TEAM_IDS} notice={null} onPick={vi.fn()} />)

    expect(within(screen.getByRole('group', { name: 'Time mandante' })).getByRole('button', { name: 'Atlético Serrano' })).toBeDisabled()
    expect(within(screen.getByRole('group', { name: 'Time visitante' })).getByRole('button', { name: 'Estrela do Vale' })).toBeDisabled()
  })

  it('calls onPick with the side and the team clicked', async () => {
    const onPick = vi.fn()
    render(<TeamsStep teams={TEAMS} category={CATEGORY.SUB14} chosenTeamIds={CHOSEN_TEAM_IDS} notice={null} onPick={onPick} />)

    await userEvent.click(within(screen.getByRole('group', { name: 'Time visitante' })).getByRole('button', { name: 'União Mineira' }))

    expect(onPick).toHaveBeenCalledWith('away', thirdTeamFixture)
  })

  it('shows the empty message in both sides when the championship has no teams', () => {
    render(<TeamsStep teams={[]} category={CATEGORY.SUB13} chosenTeamIds={{ home: null, away: null }} notice={null} onPick={vi.fn()} />)

    expect(screen.getAllByText('Nenhum time inscrito neste campeonato ainda.')).toHaveLength(2)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows the notice only when one is given', () => {
    const { rerender } = render(<TeamsStep teams={TEAMS} category={CATEGORY.SUB14} chosenTeamIds={CHOSEN_TEAM_IDS} notice={TEAMS_NOTICE} onPick={vi.fn()} />)

    expect(screen.getByText(TEAMS_NOTICE)).toBeInTheDocument()

    rerender(<TeamsStep teams={TEAMS} category={CATEGORY.SUB14} chosenTeamIds={CHOSEN_TEAM_IDS} notice={null} onPick={vi.fn()} />)

    expect(screen.queryByText(TEAMS_NOTICE)).not.toBeInTheDocument()
  })
})
