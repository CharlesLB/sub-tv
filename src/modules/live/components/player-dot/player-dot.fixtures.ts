import { PLAYER_POSITION, PREFERRED_FOOT, SIDE } from '@/modules/matches/client'
import { makePlayer, PLAYER } from '../../state/live-state.fixtures'

export const homeStrikerFixture = makePlayer({
  playerId: PLAYER.HOME_STRIKER,
  side: SIDE.HOME,
  shirtNumber: 9,
  name: 'Davi Moreira Campos',
  shortName: 'Davi Moreira',
  nickname: 'Davizinho',
  position: PLAYER_POSITION.FORWARD,
  preferredFoot: PREFERRED_FOOT.LEFT,
  pitchPoint: { x: 44, y: 50 },
  season: { goals: 7, assists: 2, yellowCards: 1, games: 9 },
  curiosities: ['Artilheiro do time na temporada', 'Estreou na base com 12 anos'],
})

export const homeMidfielderFixture = makePlayer({
  playerId: PLAYER.HOME_MIDFIELDER,
  side: SIDE.HOME,
  shirtNumber: 10,
  name: 'Enzo Barbosa Lima',
  shortName: 'Enzo Barbosa',
  position: PLAYER_POSITION.MIDFIELDER,
  preferredFoot: PREFERRED_FOOT.RIGHT,
  pitchPoint: { x: 32, y: 30 },
  season: { goals: 1, assists: 5, yellowCards: 0, games: 9 },
})

export const homeReserveFixture = makePlayer({
  playerId: PLAYER.HOME_RESERVE,
  side: SIDE.HOME,
  shirtNumber: 12,
  name: 'Heitor Nunes Prado',
  shortName: 'Heitor Nunes',
  isStarter: false,
  pitchPoint: null,
})

export const awayStrikerFixture = makePlayer({
  playerId: PLAYER.AWAY_STRIKER,
  side: SIDE.AWAY,
  shirtNumber: 9,
  name: 'Theo Assis Carvalho',
  shortName: 'Theo Assis',
  position: PLAYER_POSITION.FORWARD,
  pitchPoint: { x: 56, y: 50 },
})

export const awayReserveFixture = makePlayer({
  playerId: PLAYER.AWAY_RESERVE,
  side: SIDE.AWAY,
  shirtNumber: 12,
  name: 'Bento Ramos Teixeira',
  shortName: 'Bento Ramos',
  isStarter: false,
  pitchPoint: null,
})

export const livePlayersFixture = [homeStrikerFixture, homeMidfielderFixture, homeReserveFixture, awayStrikerFixture, awayReserveFixture]
