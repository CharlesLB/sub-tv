import { describe, expect, it } from 'vitest'
import { toChampionshipSlug } from './championship-slug'

describe('toChampionshipSlug', () => {
  it('toChampionshipSlug with accents and punctuation returns lowercase words joined by hyphens with the category', () => {
    const name = 'Copa do Vale · Fase Única!'

    const slug = toChampionshipSlug(name, 'sub13')

    expect(slug).toBe('copa-do-vale-fase-unica-sub13')
  })

  it('toChampionshipSlug with the same name in the other category returns a different slug', () => {
    const name = 'Copa do Vale'

    const slugs = [toChampionshipSlug(name, 'sub13'), toChampionshipSlug(name, 'sub14')]

    expect(slugs[0]).not.toBe(slugs[1])
  })
})
