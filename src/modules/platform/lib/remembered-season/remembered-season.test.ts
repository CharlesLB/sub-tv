import { afterEach, describe, expect, it, vi } from 'vitest'
import { readRememberedYear, rememberYear } from './remembered-season'

describe('remembered season', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('reads back the last year the visitor chose', () => {
    rememberYear(2024)

    expect(readRememberedYear()).toBe(2024)
  })

  it('reads nothing when no year was chosen or the stored value is not a positive whole number', () => {
    expect(readRememberedYear()).toBeNull()

    localStorage.setItem('futebol-temporada', 'abc')

    expect(readRememberedYear()).toBeNull()
  })

  it('reads nothing and does not throw when the browser blocks the storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    expect(() => rememberYear(2024)).not.toThrow()
    expect(readRememberedYear()).toBeNull()
  })
})
