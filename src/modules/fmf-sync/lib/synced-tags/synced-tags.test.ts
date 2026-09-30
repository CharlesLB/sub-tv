import { describe, expect, it } from 'vitest'
import { syncedTagsOf } from './synced-tags'

describe('syncedTagsOf', () => {
  it('returns only the global FMF tags when no season was touched', () => {
    expect(syncedTagsOf([])).toEqual(['fmf-data', 'seasons', 'history'])
  })

  it('adds the season, matches and teams tags of every touched season', () => {
    expect(syncedTagsOf(['s1', 's2'])).toEqual(['fmf-data', 'seasons', 'history', 'season:s1', 'season:s1:matches', 'season:s1:teams', 'season:s2', 'season:s2:matches', 'season:s2:teams'])
  })
})
