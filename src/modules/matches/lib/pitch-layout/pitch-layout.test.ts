import { describe, expect, it } from 'vitest'
import { inferPosition, layoutStarters, type PitchPlayer } from './pitch-layout'

const makeStarters = (): PitchPlayer[] => [1, 2, 3, 4, 6, 5, 8, 10, 7, 9, 11].map((shirtNumber) => ({ key: `home-${shirtNumber}`, shirtNumber, position: null }))

describe('pitch-layout', () => {
  it('inferPosition without an editorial position uses the classic shirt numbering', () => {
    expect(inferPosition({ key: 'player', shirtNumber: 1, position: null })).toBe('goleiro')
    expect(inferPosition({ key: 'player', shirtNumber: 9, position: null })).toBe('atacante')
    expect(inferPosition({ key: 'player', shirtNumber: 17, position: null })).toBe('meia')
  })

  it('layoutStarters for the home side puts the goalkeeper near the left goal line', () => {
    const points = layoutStarters(makeStarters(), true)

    expect(points['home-1']).toEqual({ x: 6, y: 50 })
  })

  it('layoutStarters for the away side mirrors the x coordinate', () => {
    const points = layoutStarters(makeStarters(), false)

    expect(points['home-1']).toEqual({ x: 94, y: 50 })
  })

  it('layoutStarters places every starter inside the pitch', () => {
    const points = Object.values(layoutStarters(makeStarters(), true))

    expect(points).toHaveLength(11)
    expect(points.every((point) => point.x > 0 && point.x < 100 && point.y > 0 && point.y < 100)).toBe(true)
  })
})
