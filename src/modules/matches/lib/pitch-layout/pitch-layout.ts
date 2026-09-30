import * as R from 'remeda'

export const PLAYER_POSITION = {
  GOALKEEPER: 'goleiro',
  CENTER_BACK: 'zagueiro',
  FULL_BACK: 'lateral',
  DEFENSIVE_MIDFIELDER: 'volante',
  MIDFIELDER: 'meia',
  FORWARD: 'atacante',
} as const

export type PlayerPosition = (typeof PLAYER_POSITION)[keyof typeof PLAYER_POSITION]

export type PitchPoint = { x: number; y: number }

type LineIndex = 0 | 1 | 2 | 3

const LINE_X: Record<LineIndex, number> = { 0: 6, 1: 18, 2: 32, 3: 44 }
const STAGGER_OFFSET = 5
const FIRST_ROW_Y = 13
const ROW_SPAN_Y = 74
const CENTER_Y = 50
const STAGGER_MINIMUM_LINE_SIZE = 5

const POSITION_BY_SHIRT: Record<number, PlayerPosition> = {
  1: PLAYER_POSITION.GOALKEEPER,
  2: PLAYER_POSITION.FULL_BACK,
  3: PLAYER_POSITION.CENTER_BACK,
  4: PLAYER_POSITION.CENTER_BACK,
  5: PLAYER_POSITION.DEFENSIVE_MIDFIELDER,
  6: PLAYER_POSITION.FULL_BACK,
  7: PLAYER_POSITION.FORWARD,
  8: PLAYER_POSITION.MIDFIELDER,
  9: PLAYER_POSITION.FORWARD,
  10: PLAYER_POSITION.MIDFIELDER,
  11: PLAYER_POSITION.FORWARD,
}

const LINE_BY_POSITION: Record<PlayerPosition, LineIndex> = {
  [PLAYER_POSITION.GOALKEEPER]: 0,
  [PLAYER_POSITION.CENTER_BACK]: 1,
  [PLAYER_POSITION.FULL_BACK]: 1,
  [PLAYER_POSITION.DEFENSIVE_MIDFIELDER]: 2,
  [PLAYER_POSITION.MIDFIELDER]: 2,
  [PLAYER_POSITION.FORWARD]: 3,
}

export type PitchPlayer = { key: string; shirtNumber: number; position: PlayerPosition | null }

export const inferPosition = (player: PitchPlayer): PlayerPosition => player.position ?? POSITION_BY_SHIRT[player.shirtNumber] ?? PLAYER_POSITION.MIDFIELDER

const orderDefenders = (defenders: PitchPlayer[]): PitchPlayer[] => {
  const [fullBacks, centerBacks] = R.partition(defenders, (player) => inferPosition(player) === PLAYER_POSITION.FULL_BACK)
  const [firstFullBack, ...otherFullBacks] = fullBacks

  return firstFullBack ? [firstFullBack, ...centerBacks, ...otherFullBacks] : centerBacks
}

const pointsForLine = (line: LineIndex, players: PitchPlayer[], attacksRight: boolean): [string, PitchPoint][] =>
  players.map((player, index) => {
    const y = players.length === 1 ? CENTER_Y : FIRST_ROW_Y + (ROW_SPAN_Y * index) / (players.length - 1)
    const staggered = line > 0 && players.length >= STAGGER_MINIMUM_LINE_SIZE && index % 2 === 1
    const x = LINE_X[line] + (staggered ? STAGGER_OFFSET : 0)

    return [player.key, { x: attacksRight ? x : 100 - x, y }]
  })

export const layoutStarters = (starters: PitchPlayer[], attacksRight: boolean): Record<string, PitchPoint> => {
  const lines = R.groupBy(starters, (player) => LINE_BY_POSITION[inferPosition(player)])

  return R.fromEntries(
    ([0, 1, 2, 3] as const).flatMap((line) => {
      const linePlayers = lines[line] ?? []

      return pointsForLine(line, line === 1 ? orderDefenders(linePlayers) : linePlayers, attacksRight)
    }),
  )
}
