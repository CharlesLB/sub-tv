import { CATEGORY } from '../../lib/categories/categories'
import type { ChampionshipCardVM } from '../../types'
import { cerradoBadgeFixture, liveMatchFixture, ribeirinhaBadgeFixture, serranoBadgeFixture, valeVerdeBadgeFixture } from '../match-card/match-card.fixtures'

export const championshipWithNextMatchFixture: ChampionshipCardVM = {
  id: 'a7b6c5d4-0001-4e3f-9a8b-7c6d5e4f3a21',
  name: 'Copa do Vale',
  category: CATEGORY.SUB13,
  year: 2025,
  statusLine: '2025 · 1ª Fase · rodada 3',
  isFinished: false,
  teamCount: 8,
  athleteCount: 160,
  podium: [
    { position: 1, team: valeVerdeBadgeFixture, points: 9 },
    { position: 2, team: serranoBadgeFixture, points: 7 },
    { position: 3, team: ribeirinhaBadgeFixture, points: 4 },
  ],
  nextMatch: { kickoffAt: '2025-04-19T13:30:00.000Z', round: 4 },
  liveMatch: null,
  lastActivityAt: '2025-04-12T18:00:00.000Z',
}

export const liveChampionshipFixture: ChampionshipCardVM = {
  ...championshipWithNextMatchFixture,
  id: 'a7b6c5d4-0002-4e3f-9a8b-7c6d5e4f3a22',
  name: 'Taça das Serras',
  category: CATEGORY.SUB14,
  teamCount: 6,
  athleteCount: 120,
  liveMatch: { matchId: liveMatchFixture.id, home: ribeirinhaBadgeFixture, away: cerradoBadgeFixture, homeScore: 0, awayScore: 1 },
}

export const finishedChampionshipFixture: ChampionshipCardVM = {
  ...championshipWithNextMatchFixture,
  id: 'a7b6c5d4-0003-4e3f-9a8b-7c6d5e4f3a23',
  name: 'Torneio de Inverno',
  statusLine: '2025 · Encerrado · Fase única',
  isFinished: true,
  nextMatch: null,
}

export const championshipWithoutResultsFixture: ChampionshipCardVM = {
  ...championshipWithNextMatchFixture,
  id: 'a7b6c5d4-0004-4e3f-9a8b-7c6d5e4f3a24',
  name: 'Copa Revelação',
  statusLine: '2025 · Fase única',
  teamCount: 0,
  athleteCount: 0,
  podium: [],
  nextMatch: null,
}

export const championshipWithUndatedRoundFixture: ChampionshipCardVM = { ...championshipWithNextMatchFixture, nextMatch: { kickoffAt: '2025-04-19T13:30:00.000Z', round: null } }
