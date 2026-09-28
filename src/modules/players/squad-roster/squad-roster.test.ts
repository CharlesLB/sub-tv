import { describe, expect, it } from 'vitest'
import type { SquadPlayerVM } from '../types'
import { buildSquadPlayers, matchesSquadSearch, type SquadMembershipRow, toRosterName } from './squad-roster'

const FIRST_DIVISION_TEAM = 'first-division-team'
const CUP_TEAM = 'cup-team'

const makeMembership = (overrides: Partial<SquadMembershipRow>): SquadMembershipRow => ({
  seasonTeamId: FIRST_DIVISION_TEAM,
  playerId: 'player-a',
  usualShirtNumber: 10,
  fullName: 'Otto Santana',
  nickname: 'Otto',
  displayName: null,
  position: null,
  preferredFoot: null,
  ...overrides,
})

const makePlayer = (overrides: Partial<SquadPlayerVM>): SquadPlayerVM => ({
  id: 'player-a',
  shirtNumber: 7,
  fullName: 'João Vitor Araújo',
  nickname: 'João',
  displayName: 'Jota',
  position: 'meia',
  preferredFoot: 'destro',
  games: 0,
  goals: 0,
  yellowCards: 0,
  redCards: 0,
  curiosities: [],
  isInOtherCategory: false,
  ...overrides,
})

const emptyInput = { seasonTeamIds: [FIRST_DIVISION_TEAM, CUP_TEAM], stats: [], curiosities: [], otherCategoryPlayerIds: [] }

describe('buildSquadPlayers', () => {
  it('buildSquadPlayers with a player in two competitions merges him into one row', () => {
    const memberships = [makeMembership({ seasonTeamId: CUP_TEAM, usualShirtNumber: 21 }), makeMembership({ usualShirtNumber: 9 })]

    const players = buildSquadPlayers({ ...emptyInput, memberships })

    expect(players).toHaveLength(1)
    expect(players[0]?.shirtNumber).toBe(9)
  })

  it('buildSquadPlayers with no number in the first division uses the number from the other competition', () => {
    const memberships = [makeMembership({ usualShirtNumber: null }), makeMembership({ seasonTeamId: CUP_TEAM, usualShirtNumber: 21 })]

    const players = buildSquadPlayers({ ...emptyInput, memberships })

    expect(players[0]?.shirtNumber).toBe(21)
  })

  it('buildSquadPlayers with stats in both competitions sums games, goals and cards', () => {
    const memberships = [makeMembership({}), makeMembership({ seasonTeamId: CUP_TEAM })]

    const stats = [
      { playerId: 'player-a', games: 5, goals: 2, yellowCards: 1, redCards: 0 },
      { playerId: 'player-a', games: 3, goals: 1, yellowCards: 1, redCards: 1 },
    ]

    const players = buildSquadPlayers({ ...emptyInput, memberships, stats })

    expect(players[0]).toMatchObject({ games: 8, goals: 3, yellowCards: 2, redCards: 1 })
  })

  it('buildSquadPlayers with several players orders by shirt number and leaves players without number last', () => {
    const memberships = [
      makeMembership({ playerId: 'no-number', usualShirtNumber: null, fullName: 'Abel' }),
      makeMembership({ playerId: 'ten', usualShirtNumber: 10 }),
      makeMembership({ playerId: 'one', usualShirtNumber: 1 }),
    ]

    const players = buildSquadPlayers({ ...emptyInput, memberships })

    expect(players.map((player) => player.id)).toEqual(['one', 'ten', 'no-number'])
  })

  it('buildSquadPlayers with curiosities and another category squad keeps only the player curiosities and flags him', () => {
    const memberships = [makeMembership({})]

    const curiosities = [
      { id: 'c1', playerId: 'player-a', text: 'Canhoto nato' },
      { id: 'c2', playerId: 'player-b', text: 'Outro jogador' },
    ]

    const players = buildSquadPlayers({ ...emptyInput, memberships, curiosities, otherCategoryPlayerIds: ['player-a'] })

    expect(players[0]?.curiosities).toEqual([{ id: 'c1', text: 'Canhoto nato' }])
    expect(players[0]?.isInOtherCategory).toBe(true)
  })
})

describe('matchesSquadSearch', () => {
  it('matchesSquadSearch with the exact shirt number returns true', () => {
    const player = makePlayer({})

    const matches = matchesSquadSearch(player, '7')

    expect(matches).toBe(true)
  })

  it('matchesSquadSearch with an unaccented part of the name returns true', () => {
    const player = makePlayer({})

    const matches = matchesSquadSearch(player, 'araujo')

    expect(matches).toBe(true)
  })

  it('matchesSquadSearch with the narrator nickname returns true', () => {
    const player = makePlayer({})

    const matches = matchesSquadSearch(player, 'JOTA')

    expect(matches).toBe(true)
  })

  it('matchesSquadSearch with an unrelated text returns false', () => {
    const player = makePlayer({})

    const matches = matchesSquadSearch(player, 'pedro')

    expect(matches).toBe(false)
  })
})

describe('toRosterName', () => {
  it('toRosterName with a narrator nickname appends it in quotes', () => {
    const player = makePlayer({ fullName: 'Otto Santana', displayName: 'Bê' })

    const name = toRosterName(player)

    expect(name).toBe('Otto Santana "Bê"')
  })

  it('toRosterName without a narrator nickname returns the full name', () => {
    const player = makePlayer({ fullName: 'Otto Santana', displayName: null })

    const name = toRosterName(player)

    expect(name).toBe('Otto Santana')
  })
})
