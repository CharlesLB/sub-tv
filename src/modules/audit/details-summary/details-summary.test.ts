import { describe, expect, it } from 'vitest'
import { nameFromDetails, summarizeDetails } from './details-summary'

describe('summarizeDetails', () => {
  it('summarizeDetails with identifiers and labelled keys keeps only readable entries', () => {
    const details = { playerId: '76de1a54-4988-4840-98a2-7e8813632d0b', text: 'Canhoto nato', minute: 12 }

    const summary = summarizeDetails(details)

    expect(summary).toBe('texto: Canhoto nato · minuto: 12')
  })

  it('summarizeDetails with a nested object flattens its primitive fields', () => {
    const summary = summarizeDetails({ clock: { period: '1T', minute: 3 }, statusChanged: true })

    expect(summary).toBe('cronômetro: período 1T, minuto 3 · status alterado: sim')
  })

  it('summarizeDetails without details returns an empty string', () => {
    expect(summarizeDetails(null)).toBe('')
    expect(summarizeDetails({ curiosityId: 'd7e14d1c-6aaa-438f-a803-e67044eaec61' })).toBe('')
  })

  it('summarizeDetails with a long text truncates with an ellipsis', () => {
    const summary = summarizeDetails({ text: 'x'.repeat(200) })

    expect(summary.length).toBe(90)
    expect(summary.endsWith('…')).toBe(true)
  })
})

describe('nameFromDetails', () => {
  it('nameFromDetails with a name field returns it, otherwise null', () => {
    expect(nameFromDetails({ name: 'Copa Teste' })).toBe('Copa Teste')
    expect(nameFromDetails({ text: 'x' })).toBeNull()
  })
})
