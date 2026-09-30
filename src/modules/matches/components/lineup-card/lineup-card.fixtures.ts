import { PLAYER_POSITION, type PlayerPosition } from '../../lib/pitch-layout/pitch-layout'
import type { SetupPlayerVM, SetupTeamVM } from '../../types'

type PlayerSeed = { shirtNumber: number; name: string; nickname?: string; position?: PlayerPosition }

const DEFAULT_STARTER_COUNT = 11

const playersOf = (teamKey: string, seeds: PlayerSeed[]): SetupPlayerVM[] =>
  seeds.map((seed) => ({ playerId: `${teamKey}-${seed.shirtNumber}`, shirtNumber: seed.shirtNumber, name: seed.name, nickname: seed.nickname ?? null, position: seed.position ?? null }))

const teamOf = (team: Omit<SetupTeamVM, 'defaultStarterIds'>): SetupTeamVM => ({
  ...team,
  defaultStarterIds: team.players.slice(0, DEFAULT_STARTER_COUNT).map((player) => player.playerId),
})

export const homeTeamFixture: SetupTeamVM = teamOf({
  seasonTeamId: 'estrela-do-vale',
  name: 'Estrela do Vale',
  abbreviation: 'EDV',
  color: '#1f4fa3',
  crestPath: null,
  players: playersOf('estrela', [
    { shirtNumber: 1, name: 'Caio Ribeiro', position: PLAYER_POSITION.GOALKEEPER },
    { shirtNumber: 2, name: 'Davi Moreira', position: PLAYER_POSITION.FULL_BACK },
    { shirtNumber: 3, name: 'Enzo Carvalho', position: PLAYER_POSITION.CENTER_BACK },
    { shirtNumber: 4, name: 'Gustavo Pires', position: PLAYER_POSITION.CENTER_BACK },
    { shirtNumber: 5, name: 'Heitor Duarte', position: PLAYER_POSITION.DEFENSIVE_MIDFIELDER },
    { shirtNumber: 6, name: 'Igor Fontes', position: PLAYER_POSITION.FULL_BACK },
    { shirtNumber: 7, name: 'João Pedro Lima', nickname: 'Jota', position: PLAYER_POSITION.FORWARD },
    { shirtNumber: 8, name: 'Kaique Nogueira', position: PLAYER_POSITION.MIDFIELDER },
    { shirtNumber: 9, name: 'Leonardo Teixeira', position: PLAYER_POSITION.FORWARD },
    { shirtNumber: 10, name: 'Matheus Rocha', nickname: 'Teteu', position: PLAYER_POSITION.MIDFIELDER },
    { shirtNumber: 11, name: 'Nicolas Barros', position: PLAYER_POSITION.FORWARD },
    { shirtNumber: 12, name: 'Otávio Siqueira', position: PLAYER_POSITION.GOALKEEPER },
    { shirtNumber: 13, name: 'Pedro Henrique Alves' },
    { shirtNumber: 14, name: 'Rafael Campos', nickname: 'Rafa', position: PLAYER_POSITION.MIDFIELDER },
  ]),
})

export const awayTeamFixture: SetupTeamVM = teamOf({
  seasonTeamId: 'atletico-serrano',
  name: 'Atlético Serrano',
  abbreviation: 'ASE',
  color: '#b3261e',
  crestPath: null,
  players: playersOf('serrano', [
    { shirtNumber: 1, name: 'Samuel Vieira', position: PLAYER_POSITION.GOALKEEPER },
    { shirtNumber: 2, name: 'Thiago Mendes', position: PLAYER_POSITION.FULL_BACK },
    { shirtNumber: 3, name: 'Vinícius Prado', position: PLAYER_POSITION.CENTER_BACK },
    { shirtNumber: 4, name: 'Arthur Lopes', position: PLAYER_POSITION.CENTER_BACK },
    { shirtNumber: 5, name: 'Benício Freitas', position: PLAYER_POSITION.DEFENSIVE_MIDFIELDER },
    { shirtNumber: 6, name: 'Bernardo Cunha', position: PLAYER_POSITION.FULL_BACK },
    { shirtNumber: 7, name: 'Cauã Martins', nickname: 'Cauãzinho', position: PLAYER_POSITION.FORWARD },
    { shirtNumber: 8, name: 'Daniel Aguiar', position: PLAYER_POSITION.MIDFIELDER },
    { shirtNumber: 9, name: 'Emanuel Castro', position: PLAYER_POSITION.FORWARD },
    { shirtNumber: 10, name: 'Felipe Moura', nickname: 'Felipinho', position: PLAYER_POSITION.MIDFIELDER },
    { shirtNumber: 11, name: 'Gabriel Tavares', position: PLAYER_POSITION.FORWARD },
    { shirtNumber: 12, name: 'Henrique Batista', position: PLAYER_POSITION.GOALKEEPER },
    { shirtNumber: 13, name: 'Isaque Farias' },
  ]),
})

export const thirdTeamFixture: SetupTeamVM = teamOf({
  seasonTeamId: 'uniao-mineira',
  name: 'União Mineira',
  abbreviation: 'UNM',
  color: '#2e7d32',
  crestPath: null,
  players: playersOf('uniao', [
    { shirtNumber: 1, name: 'Lorenzo Pacheco', position: PLAYER_POSITION.GOALKEEPER },
    { shirtNumber: 9, name: 'Murilo Antunes', position: PLAYER_POSITION.FORWARD },
  ]),
})

export const teamWithoutPlayersFixture: SetupTeamVM = { ...thirdTeamFixture, players: [], defaultStarterIds: [] }
