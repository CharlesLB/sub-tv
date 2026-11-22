import { describe, expect, it } from 'vitest'
import { deriveAbbreviation, deriveClubColor, deriveDisplayName } from './club-defaults'

describe('deriveDisplayName', () => {
  it('strips corporate suffixes and applies the override for big clubs', () => {
    expect(deriveDisplayName('ATLÉTICO SAF', null)).toBe('Atlético')
    expect(deriveDisplayName('CRUZEIRO - SAF', null)).toBe('Cruzeiro')
    expect(deriveDisplayName('AMERICA', null)).toBe('América')
  })

  it('keeps club acronyms uppercase and restores accents from the official name', () => {
    expect(deriveDisplayName('SC AYMORES', 'SPORT CLUB AYMORÉS')).toBe('SC Aymorés')
    expect(deriveDisplayName('XV DE NOVEMBRO ESPORTE CLUBE', null)).toBe('XV de Novembro')
  })
})

describe('deriveAbbreviation', () => {
  it('takes three letters of the first meaningful word', () => {
    expect(deriveAbbreviation('SC Aymorés')).toBe('AYM')
    expect(deriveAbbreviation('Inter de Minas')).toBe('INT')
  })
})

describe('deriveClubColor', () => {
  it('returns the same palette colour for the same crest id', () => {
    expect(deriveClubColor('16054')).toBe(deriveClubColor('16054'))
    expect(deriveClubColor('16054')).toMatch(/^#[0-9A-F]{6}$/)
  })
})
