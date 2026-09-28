export const MATCH_STATUS = {
  SCHEDULED: 'agendado',
  LIVE: 'ao_vivo',
  FINISHED: 'encerrado',
  POSTPONED: 'adiado',
  CANCELLED: 'cancelado',
  WALKOVER: 'wo',
} as const

export type MatchStatus = (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS]
