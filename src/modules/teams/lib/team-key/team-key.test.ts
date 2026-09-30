import { describe, expect, it } from 'vitest'
import { parseTeamKey, toTeamKey } from './team-key'

const CLUB_ID = '6f1c2a3b-4d5e-4f60-8a71-b2c3d4e5f607'

describe('team key', () => {
  it('toTeamKey with a category and a club id joins them with a hyphen', () => {
    const category = 'sub14'

    const key = toTeamKey(category, CLUB_ID)

    expect(key).toBe(`sub14-${CLUB_ID}`)
  })

  it('parseTeamKey with a key built by toTeamKey returns the same category and club', () => {
    const key = toTeamKey('sub13', CLUB_ID)

    const parsed = parseTeamKey(key)

    expect(parsed).toEqual({ category: 'sub13', clubId: CLUB_ID })
  })

  it('parseTeamKey with an unknown category returns null', () => {
    const key = `sub15-${CLUB_ID}`

    const parsed = parseTeamKey(key)

    expect(parsed).toBeNull()
  })

  it('parseTeamKey with a club id that is not a uuid returns null', () => {
    const key = 'sub14-cruzeiro'

    const parsed = parseTeamKey(key)

    expect(parsed).toBeNull()
  })

  it('parseTeamKey with an empty value returns null', () => {
    const key = undefined

    const parsed = parseTeamKey(key)

    expect(parsed).toBeNull()
  })
})
