import type { SquadPlayerVM } from '../../types'
import { curiositiesFixture } from '../curiosity-list/curiosity-list.fixtures'

export const squadPlayerFixture: SquadPlayerVM = {
  id: '5a8c2e14-7b3f-4d91-a6e0-2f4b8c1d9e70',
  shirtNumber: 10,
  fullName: 'Rafael Moreira Duarte',
  nickname: 'Rafa',
  displayName: 'Rafinha',
  position: 'meia',
  preferredFoot: 'canhoto',
  games: 12,
  goals: 7,
  yellowCards: 1,
  redCards: 0,
  curiosities: curiositiesFixture,
  isInOtherCategory: true,
}

export const secondSquadPlayerFixture: SquadPlayerVM = {
  id: '9e1d4b27-6c8a-4f30-b5d2-7a1e3c9f0b48',
  shirtNumber: 1,
  fullName: 'Caio Henrique Batista',
  nickname: 'Caio',
  displayName: null,
  position: 'goleiro',
  preferredFoot: 'destro',
  games: 14,
  goals: 0,
  yellowCards: 0,
  redCards: 0,
  curiosities: [],
  isInOtherCategory: false,
}

export const squadPlayerWithoutDetailsFixture: SquadPlayerVM = {
  id: 'c4f7a9b2-1e3d-4a6c-8b0e-5d2f7a9c1e36',
  shirtNumber: null,
  fullName: 'Tiago Pereira Lopes',
  nickname: null,
  displayName: null,
  position: null,
  preferredFoot: null,
  games: 0,
  goals: 0,
  yellowCards: 0,
  redCards: 0,
  curiosities: [],
  isInOtherCategory: false,
}
