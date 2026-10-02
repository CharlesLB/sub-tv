import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamFixture, seasonTeamsFixture, secondSeasonTeamFixture } from '../../components/team-list-item/team-list-item.fixtures'
import { selectSquadTeam } from './squad-selection'

describe('selectSquadTeam', () => {
  it('shows every team and selects the first one when the address names neither category nor team', () => {
    const selection = selectSquadTeam(seasonTeamsFixture, { category: null, teamKey: null })

    expect(selection).toEqual({ categoryFilter: undefined, visibleTeams: seasonTeamsFixture, selectedTeam: seasonTeamFixture })
  })

  it('keeps only the teams of the filtered category and selects the first of them', () => {
    const selection = selectSquadTeam(seasonTeamsFixture, { category: CATEGORY.SUB13, teamKey: undefined })

    expect(selection).toEqual({ categoryFilter: CATEGORY.SUB13, visibleTeams: [secondSeasonTeamFixture], selectedTeam: secondSeasonTeamFixture })
  })

  it('selects the team named by the address even when the category filter hides it', () => {
    const selection = selectSquadTeam(seasonTeamsFixture, { category: CATEGORY.SUB13, teamKey: seasonTeamFixture.key })

    expect(selection.selectedTeam).toBe(seasonTeamFixture)
  })

  it('ignores an unknown category and selects nothing when the season has no team', () => {
    const selection = selectSquadTeam([], { category: 'sub99', teamKey: 'unknown' })

    expect(selection).toEqual({ categoryFilter: undefined, visibleTeams: [], selectedTeam: null })
  })
})
