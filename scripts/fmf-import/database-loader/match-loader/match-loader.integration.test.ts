import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { matches } from '@/lib/db/schema'
import { seedSeason } from '@/test/database-seeds/database-seeds'
import type { TableMatch } from '../../competition-page/table-tab-parser/table-tab-parser'
import { COMPETITION_SOURCES } from '../../constants/fmf-sources'
import type { EditionBundle } from '../../edition-bundle/edition-bundle'
import type { SeasonTeamLookup } from '../club-loader/club-loader'
import { SYNC_ISSUE } from '../database-context/database-context'
import { upsertMatches } from './match-loader'

const KNOWN_HOME_CREST = '101'
const KNOWN_AWAY_CREST = '102'
const UNKNOWN_CREST = '999'

const tableMatch = (matchNumber: number, homeCrestId: string, awayCrestId: string): TableMatch => ({
  phase: 'CLASSIFICATÓRIA',
  round: 1,
  matchNumber,
  date: '2026-10-03',
  time: '09:00',
  home: { crestId: homeCrestId, crestFileName: `${homeCrestId}.png`, shortName: 'ALFA' },
  away: { crestId: awayCrestId, crestFileName: `${awayCrestId}.png`, shortName: 'BETA' },
  homeScore: null,
  awayScore: null,
  venue: null,
  city: null,
  officials: [],
  sumulaUrl: null,
})

const bundleOf = (tableMatches: TableMatch[]): EditionBundle => ({
  source: COMPETITION_SOURCES[0] ?? { pageId: 15, slug: 'mineiro-sub14-1a-divisao', name: 'Mineiro 1ª Divisão', category: 'sub14', division: 'primeira' },
  editionId: 1,
  year: 2026,
  pageUrl: 'https://example.test/page',
  pageRelativePath: 'page.html',
  pageSha256: 'hash',
  page: { label: 'Mineiro 2026', fmfCompetitionId: null, matches: tableMatches, standings: [], jointStandings: [], topScorers: [] },
  sumulas: new Map(),
})

describe('upsertMatches', () => {
  it('reports a match whose away team is unknown instead of aborting the edition', async () => {
    const season = await seedSeason()

    const teams: SeasonTeamLookup = new Map([
      [KNOWN_HOME_CREST, { clubId: 'unused', seasonTeamId: season.homeTeamId }],
      [KNOWN_AWAY_CREST, { clubId: 'unused', seasonTeamId: season.awayTeamId }],
    ])

    const bundle = bundleOf([tableMatch(1, KNOWN_HOME_CREST, KNOWN_AWAY_CREST), tableMatch(2, KNOWN_HOME_CREST, UNKNOWN_CREST)])

    const result = await db.transaction(async (transaction) => await upsertMatches(transaction, bundle, season.seasonId, teams))

    expect(result.loadedMatches.map((loaded) => loaded.tableMatch.matchNumber)).toEqual([1])
    expect(result.issues).toEqual([expect.objectContaining({ type: SYNC_ISSUE.ESTRUTURA_PAGINA_MUDOU, details: expect.objectContaining({ motivo: 'jogo_com_times_invalidos', jogo: 2 }) })])
    expect(await db.select({ matchNumber: matches.matchNumber }).from(matches).where(eq(matches.seasonId, season.seasonId))).toEqual([{ matchNumber: 1 }])
  })
})
