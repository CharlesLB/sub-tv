const POINTS_PER_WIN = 3
const PERCENT = 100
const DECIMAL_POINT = '.'
const DECIMAL_COMMA = ','
const POSITION_WIDTH = 2
const SHORT_YEAR_LENGTH = 2
const CHAMPIONSHIP_SEPARATOR = ' · '

export const winRatePercent = (points: number, played: number): number => (played > 0 ? Math.round((points / (played * POINTS_PER_WIN)) * PERCENT) : 0)

export const formatPercent = (percent: number): string => `${percent}%`

export const formatSignedNumber = (value: number): string => (value > 0 ? `+${value}` : String(value))

export const formatDecimal = (value: number, fractionDigits: number): string => value.toFixed(fractionDigits).replace(DECIMAL_POINT, DECIMAL_COMMA)

export const formatRatio = (numerator: number, denominator: number, fractionDigits: number): string => formatDecimal(numerator / Math.max(1, denominator), fractionDigits)

export const formatChampionships = (championships: string[]): string => championships.join(CHAMPIONSHIP_SEPARATOR)

export const mostGoals = (scorers: { goals: number }[]): number => Math.max(0, ...scorers.map((scorer) => scorer.goals))

export const formatPosition = (position: number): string => String(position).padStart(POSITION_WIDTH, '0')

export const shortYear = (year: number): string => String(year).slice(-SHORT_YEAR_LENGTH)

export const barHeightPercent = (value: number, maximum: number, minimumPercent: number): number => Math.max(minimumPercent, Math.round((value / Math.max(1, maximum)) * PERCENT))

export const barWidthPercent = (value: number, maximum: number): number => Math.round((value / Math.max(1, maximum)) * PERCENT)
