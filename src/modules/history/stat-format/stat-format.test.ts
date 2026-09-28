import { describe, expect, it } from 'vitest'
import { barHeightPercent, formatChampionships, formatDecimal, formatPosition, formatRatio, formatSignedNumber, mostGoals, shortYear, winRatePercent } from './stat-format'

describe('winRatePercent', () => {
  it('winRatePercent with points and games returns the rounded share of possible points', () => {
    const points = 20
    const played = 10

    const result = winRatePercent(points, played)

    expect(result).toBe(67)
  })

  it('winRatePercent without games returns zero', () => {
    const result = winRatePercent(0, 0)

    expect(result).toBe(0)
  })
})

describe('formatting helpers', () => {
  it('formatSignedNumber with a positive value prefixes a plus sign', () => {
    expect(formatSignedNumber(12)).toBe('+12')
    expect(formatSignedNumber(0)).toBe('0')
    expect(formatSignedNumber(-3)).toBe('-3')
  })

  it('formatDecimal with one digit uses a comma as decimal separator', () => {
    expect(formatDecimal(4.56, 1)).toBe('4,6')
  })

  it('formatRatio without denominator divides by one', () => {
    expect(formatRatio(3, 0, 2)).toBe('3,00')
  })

  it('formatChampionships joins the championship names with a middle dot', () => {
    expect(formatChampionships(['Mineiro', 'Copa do Vale'])).toBe('Mineiro · Copa do Vale')
  })

  it('mostGoals with unsorted scorers returns the highest goal count', () => {
    expect(mostGoals([{ goals: 3 }, { goals: 9 }, { goals: 5 }])).toBe(9)
  })

  it('mostGoals without scorers returns zero', () => {
    expect(mostGoals([])).toBe(0)
  })

  it('formatPosition with a single digit pads to two digits', () => {
    expect(formatPosition(7)).toBe('07')
  })

  it('shortYear with a four digit year keeps the last two digits', () => {
    expect(shortYear(2024)).toBe('24')
  })

  it('barHeightPercent with a tiny value keeps the minimum height', () => {
    expect(barHeightPercent(1, 100, 6)).toBe(6)
    expect(barHeightPercent(50, 100, 6)).toBe(50)
  })
})
