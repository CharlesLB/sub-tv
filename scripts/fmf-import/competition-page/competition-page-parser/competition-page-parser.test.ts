import { describe, expect, it } from 'vitest'
import { readEditionOptions } from '../../edition-pages/edition-pages'
import { COMPETITION_PAGE_FIXTURE } from './competition-page-parser.fixture'
import { parseCompetitionPage } from './competition-page-parser'

describe('parseCompetitionPage', () => {
  it('reads the edition label, the competition folder id and the edition selector', () => {
    const page = parseCompetitionPage(COMPETITION_PAGE_FIXTURE)
    const options = readEditionOptions(COMPETITION_PAGE_FIXTURE)

    expect(page.label).toBe('SUB 14 - 1ª DIVISÃO 2026')
    expect(page.fmfCompetitionId).toBe(1941)
    expect(options).toEqual([
      { editionId: 1941, label: 'SUB 14 - 1ª DIVISÃO 2026', isSelected: true },
      { editionId: 1839, label: 'SUB 14 - 2025', isSelected: false },
    ])
  })

  it('reads a played match with teams, score, venue, officials and the rectified sumula link', () => {
    const [played] = parseCompetitionPage(COMPETITION_PAGE_FIXTURE).matches

    expect(played).toEqual({
      phase: 'CLASSIFICATÓRIA',
      round: 15,
      matchNumber: 113,
      date: '2026-09-26',
      time: '14:00',
      home: { crestId: '1001', crestFileName: 'Foto_Logo_1001.png', shortName: 'CLUBE ALFA' },
      away: { crestId: 'clube_beta', crestFileName: 'clube_beta.png', shortName: 'BETA SAF' },
      homeScore: 0,
      awayScore: 2,
      venue: 'ESTADIO MUNICIPAL',
      city: 'CIDADE UM',
      officials: [
        { role: 'arbitro', name: 'ARBITRO PRINCIPAL' },
        { role: 'assistente_1', name: 'ASSISTENTE UM' },
        { role: 'quarto_arbitro', name: 'QUARTO NOME' },
      ],
      sumulaUrl: 'https://sge.fmf.com.br/sumulas/Retificadas\\Sumula_Jogo_90001_F10_2.pdf',
    })
  })

  it('keeps an unplayed match of another phase without score nor sumula even when the match number repeats', () => {
    const [, scheduled] = parseCompetitionPage(COMPETITION_PAGE_FIXTURE).matches

    expect(scheduled).toMatchObject({ phase: 'FINAL', round: 1, matchNumber: 113, date: '2026-10-04', homeScore: null, awayScore: null, sumulaUrl: null, officials: [] })
  })

  it('reads standings with their group and the joint table', () => {
    const page = parseCompetitionPage(COMPETITION_PAGE_FIXTURE)

    expect(page.standings.map((row) => [row.phase, row.groupName, row.team.crestId, row.points, row.goalsAgainst])).toEqual([
      ['CLASSIFICATÓRIA', 'A', 'clube_beta', 3, 0],
      ['CLASSIFICATÓRIA', 'B', '1001', 0, 2],
    ])
    expect(page.jointStandings).toHaveLength(1)
    expect(page.jointStandings[0]).toMatchObject({ phase: 'CLASSIFICATÓRIA', points: 6, played: 2 })
  })

  it('reads the top scorers with an empty nickname as null', () => {
    const { topScorers } = parseCompetitionPage(COMPETITION_PAGE_FIXTURE)

    expect(topScorers).toEqual([
      { goals: 2, nickname: 'ARTILHEIRO', fullName: 'JOGADOR ARTILHEIRO DA SILVA', clubName: 'BETA FUTEBOL CLUBE - SAF' },
      { goals: 1, nickname: null, fullName: 'OUTRO JOGADOR', clubName: 'CLUBE ALFA' },
    ])
  })
})
