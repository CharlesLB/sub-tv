import { describe, expect, it } from 'vitest'
import { normalizeUsername } from './normalize-username'

describe('normalizeUsername', () => {
  it('normalizeUsername with different casing returns the same key', () => {
    expect(normalizeUsername('RAFAELA torres')).toBe(normalizeUsername('Rafaela Torres'))
  })

  it('normalizeUsername with extra spaces collapses them', () => {
    expect(normalizeUsername('  Rafaela    Torres ')).toBe('rafaela torres')
  })

  it('normalizeUsername keeps accents so different names stay different', () => {
    expect(normalizeUsername('Andréa')).toBe('andréa')
  })
})
