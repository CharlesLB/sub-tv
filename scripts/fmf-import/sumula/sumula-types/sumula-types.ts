export type PositionedText = { x: number; y: number; text: string }

export const SIDE = { HOME: 'home', AWAY: 'away' } as const
export type Side = (typeof SIDE)[keyof typeof SIDE]

export const PERIODS = ['ANT', '1T', 'INT', '2T', 'PR1', 'PR2', 'PEN', 'TER'] as const
export type Period = (typeof PERIODS)[number]

export const GOAL_TYPE = { NORMAL: 'normal', PENALTI: 'penalti', CONTRA: 'contra', FALTA: 'falta' } as const
export type GoalType = (typeof GOAL_TYPE)[keyof typeof GOAL_TYPE]

export const CARD_KIND = { AMARELO: 'amarelo', VERMELHO: 'vermelho' } as const
export type CardKind = (typeof CARD_KIND)[keyof typeof CARD_KIND]

export const STAFF_ROLE = {
  TECNICO: 'tecnico',
  AUXILIAR: 'auxiliar',
  PREPARADOR_FISICO: 'preparador_fisico',
  PREPARADOR_GOLEIROS: 'preparador_goleiros',
  MEDICO: 'medico',
  FISIOTERAPEUTA: 'fisioterapeuta',
  MASSAGISTA: 'massagista',
  OUTRO: 'outro',
} as const
export type StaffRole = (typeof STAFF_ROLE)[keyof typeof STAFF_ROLE]

export type SumulaHeader = {
  competition: string | null
  phase: string | null
  round: number | null
  homeName: string
  awayName: string
  date: string | null
  time: string | null
  venue: string | null
  homeScore: number | null
  awayScore: number | null
  homeScoreHalfTime: number | null
  awayScoreHalfTime: number | null
  homePenalties: number | null
  awayPenalties: number | null
  addedTimeFirstHalf: number | null
  addedTimeSecondHalf: number | null
}

export type SumulaPlayer = {
  side: Side
  shirtNumber: number
  nickname: string | null
  fullName: string
  cbfId: string | null
  isStarter: boolean
  isCaptain: boolean
}

export type SumulaStaff = { side: Side; role: StaffRole; fullName: string }

export type SumulaGoal = { side: Side | null; period: Period; minute: number | null; shirtNumber: number | null; goalType: GoalType; playerName: string; teamName: string }

export type SumulaCard = {
  side: Side | null
  kind: CardKind
  period: Period
  minute: number | null
  shirtNumber: number | null
  personName: string
  teamName: string
  reason: string | null
}

export type SumulaSubstitution = {
  side: Side | null
  period: Period
  minute: number | null
  teamName: string
  playerInNumber: number | null
  playerOutNumber: number | null
}

export type ParsedSumula = {
  header: SumulaHeader
  players: SumulaPlayer[]
  staff: SumulaStaff[]
  goals: SumulaGoal[]
  cards: SumulaCard[]
  substitutions: SumulaSubstitution[]
  warnings: string[]
}
