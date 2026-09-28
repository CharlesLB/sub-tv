import { describe, expect, it } from 'vitest'
import { areNamesCompatible, sanitizePersonName } from './text-normalization'

describe('sanitizePersonName', () => {
  it('drops document fragments, dates and dangling punctuation from a name', () => {
    expect(sanitizePersonName('Joao Teste Exemplo 1.234-')).toBe('Joao Teste Exemplo')
    expect(sanitizePersonName('01/02/2 Nome Exemplo Dos Reis')).toBe('Nome Exemplo Dos Reis')
    expect(sanitizePersonName('Nome Da Comissao - Mg12345678')).toBe('Nome Da Comissao')
  })

  it('returns an empty text when the cell only held digits and punctuation', () => {
    expect(sanitizePersonName('123.456.789-00')).toBe('')
    expect(sanitizePersonName('12345678901')).toBe('')
  })

  it('fixes a zero misread inside a word and keeps the letters glued to a digit run', () => {
    expect(sanitizePersonName('J0ao Exemplo')).toBe('Joao Exemplo')
    expect(sanitizePersonName('Jose123456')).toBe('Jose')
  })
})

describe('areNamesCompatible', () => {
  it('matches abbreviated middle names in order', () => {
    expect(areNamesCompatible('Caio Lourenco T. Mota E Brito', 'CAIO LOURENCO TEIXEIRA MOTA E BRITO')).toBe(true)
    expect(areNamesCompatible('Caio Lourenco Mota', 'Carlos Lourenco Mota')).toBe(false)
  })
})
