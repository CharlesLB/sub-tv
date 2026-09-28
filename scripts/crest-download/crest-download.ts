import { access } from 'node:fs/promises'
import { and, eq, isNotNull } from 'drizzle-orm'
import * as R from 'remeda'
import { createDatabase, createPool } from '../../src/lib/db/connection'
import { clubs } from '../../src/lib/db/schema'
import { requestFmf } from '../fmf-import/http-client/http-client'
import { storeFile } from '../fmf-import/raw-storage/raw-storage'
import { crestDiskPathOf, crestFileNameOf, crestPublicPathOf, isPngImage } from './crest-file/crest-file'

const REFRESH_FLAG = '--refresh'

const CREST_OUTCOME = { DOWNLOADED: 'baixados', KEPT: 'já existentes', MISSING: 'ausentes na FMF', INVALID: 'não são PNG' } as const

type CrestOutcome = (typeof CREST_OUTCOME)[keyof typeof CREST_OUTCOME]

type CrestSource = { clubId: string; crestId: string; crestUrl: string; shortName: string }

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required to download crests')
const shouldRefresh = process.argv.slice(2).includes(REFRESH_FLAG)

const pool = createPool(databaseUrl)
const database = createDatabase(pool)

const fileExists = async (diskPath: string): Promise<boolean> =>
  await access(diskPath).then(
    () => true,
    () => false,
  )

const downloadCrest = async (source: CrestSource, diskPath: string): Promise<CrestOutcome> => {
  if (!shouldRefresh && (await fileExists(diskPath))) return CREST_OUTCOME.KEPT
  const result = await requestFmf({ url: source.crestUrl })
  if (!result.found) {
    console.warn(`${source.shortName}: HTTP ${result.status} em ${source.crestUrl}`)

    return CREST_OUTCOME.MISSING
  }
  if (!isPngImage(result.body)) {
    console.warn(`${source.shortName}: ${source.crestUrl} não devolveu um PNG`)

    return CREST_OUTCOME.INVALID
  }
  await storeFile(diskPath, result.body)

  return CREST_OUTCOME.DOWNLOADED
}

const syncCrest = async (source: CrestSource): Promise<CrestOutcome> => {
  const fileName = crestFileNameOf(source.crestId)
  const outcome = await downloadCrest(source, crestDiskPathOf(fileName))
  const hasFile = outcome === CREST_OUTCOME.DOWNLOADED || outcome === CREST_OUTCOME.KEPT
  if (hasFile) await database.update(clubs).set({ crestPath: crestPublicPathOf(fileName) }).where(eq(clubs.id, source.clubId))

  return outcome
}

const rows = await database
  .select({ clubId: clubs.id, crestId: clubs.fmfCrestId, crestUrl: clubs.crestUrl, shortName: clubs.shortName })
  .from(clubs)
  .where(and(isNotNull(clubs.fmfCrestId), isNotNull(clubs.crestUrl)))
const sources = rows.flatMap((row): CrestSource[] => (row.crestId && row.crestUrl ? [{ ...row, crestId: row.crestId, crestUrl: row.crestUrl }] : []))
const outcomes = await sources.reduce<Promise<CrestOutcome[]>>(async (previous, source) => [...(await previous), await syncCrest(source)], Promise.resolve([]))
await pool.end()

const summary = Object.entries(R.countBy(outcomes, (outcome) => outcome))
  .map(([outcome, count]) => `${count} ${outcome}`)
  .join(' · ')
console.info(`escudos de ${sources.length} clubes: ${summary}`)
