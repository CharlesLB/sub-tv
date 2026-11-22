import { describe, expect, it } from 'vitest'
import { parseSumulaItems } from './sumula-parser'
import { SUMULA_ITEMS_FIXTURE } from './sumula-parser.fixture'

describe('parseSumulaItems', () => {
  it('reads the header with wrapped team names, final and half-time scores and added time', () => {
    const { header } = parseSumulaItems(SUMULA_ITEMS_FIXTURE)

    expect(header).toEqual({
      competition: 'SUB 14 - 2022',
      phase: '1ª FASE',
      round: 3,
      homeName: 'ASSOCIACAO ALFA DE MINAS',
      awayName: 'BETA ESPORTE CLUBE - SOCIEDADE ANÔNIMA DO FUTEBOL',
      date: '2022-09-02',
      time: '15:00',
      venue: 'ESTADIO TESTE',
      homeScore: 1,
      awayScore: 2,
      homeScoreHalfTime: 1,
      awayScoreHalfTime: 1,
      homePenalties: null,
      awayPenalties: null,
      addedTimeFirstHalf: 1,
      addedTimeSecondHalf: 3,
    })
  })

  it('reads starters and substitutes per side, the captain, a wrapped shirt number and a placeholder CBF id', () => {
    const { players } = parseSumulaItems(SUMULA_ITEMS_FIXTURE)

    expect(players.map((player) => [player.side, player.shirtNumber, player.cbfId, player.isStarter, player.isCaptain])).toEqual([
      ['home', 3, '100001', true, true],
      ['home', 10, '100002', true, false],
      ['home', 114, '100003', false, false],
      ['away', 6, '200001', true, false],
      ['away', 11, null, true, false],
      ['away', 17, '200002', false, false],
    ])

    expect(players.find((player) => player.shirtNumber === 114)?.fullName).toBe('Reserva Com Numero Longo')
    expect(players.find((player) => player.shirtNumber === 3)?.fullName).toBe('Zagueiro Teste Da Silva')
    expect(players.find((player) => player.shirtNumber === 10)).toMatchObject({ nickname: 'Camisa Dez', fullName: 'Camisa Dez Exemplo' })
  })

  it('reads the technical staff of each side, skipping empty roles', () => {
    const { staff } = parseSumulaItems(SUMULA_ITEMS_FIXTURE)

    expect(staff).toEqual([
      { side: 'home', role: 'tecnico', fullName: 'Treinador Alfa' },
      { side: 'away', role: 'tecnico', fullName: 'Treinador Beta' },
      { side: 'away', role: 'auxiliar', fullName: 'Auxiliar Beta' },
    ])
  })

  it('reads goals with type and the listed team of the scorer, including an own goal', () => {
    const { goals } = parseSumulaItems(SUMULA_ITEMS_FIXTURE)

    expect(goals.map((goal) => [goal.side, goal.period, goal.minute, goal.shirtNumber, goal.goalType])).toEqual([
      ['home', '1T', 16, 3, 'contra'],
      ['home', '1T', 23, 10, 'penalti'],
      ['away', '2T', 27, 6, 'normal'],
    ])
  })

  it('reads a player card with its reason and a staff card without shirt number', () => {
    const { cards } = parseSumulaItems(SUMULA_ITEMS_FIXTURE)

    expect(cards).toEqual([
      {
        side: 'away',
        kind: 'amarelo',
        period: '2T',
        minute: 6,
        shirtNumber: 11,
        personName: 'Ponta Exemplo Pereira',
        teamName: 'BETA ESPORTE CLUBE - SOCIEDADE ANÔNIMA DO FUTEBOL',
        reason: 'praticar atitude antidesportiva;',
      },
      { side: 'home', kind: 'amarelo', period: 'TER', minute: null, shirtNumber: null, personName: 'Treinador Alfa', teamName: 'ASSOCIACAO ALFA DE MINAS', reason: null },
    ])
  })

  it('reads substitutions at half time without minute and during the second half', () => {
    const { substitutions } = parseSumulaItems(SUMULA_ITEMS_FIXTURE)

    expect(substitutions).toEqual([
      { side: 'home', period: 'INT', minute: null, teamName: 'ASSOCIACAO ALFA DE MINAS', playerInNumber: 114, playerOutNumber: 3 },
      { side: 'away', period: '2T', minute: 8, teamName: 'BETA ESPORTE CLUBE - SOCIEDADE ANÔNIMA DO FUTEBOL', playerInNumber: 17, playerOutNumber: 11 },
    ])
  })
})
