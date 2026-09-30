import { describe, expect, it } from 'vitest'
import { CHAMPIONSHIPS_PATH, SQUADS_PATH } from '@/lib/routes'
import { SEASON_HREF_BUILDERS } from './season-href'

describe('SEASON_HREF_BUILDERS', () => {
  it('links a season of the championships page through its season parameter only', () => {
    const href = SEASON_HREF_BUILDERS[CHAMPIONSHIPS_PATH]({ searchParams: new URLSearchParams('temporada=2025&cat=sub13'), year: 2024 })

    expect(href).toBe('/campeonatos?temporada=2024')
  })

  it('links a season of the squads page through its path and keeps the category filter but not the team', () => {
    const href = SEASON_HREF_BUILDERS[SQUADS_PATH]({ searchParams: new URLSearchParams('cat=sub13&time=sub13-abc&atleta=xyz'), year: 2024 })

    expect(href).toBe('/elencos/2024?cat=sub13')
  })
})
