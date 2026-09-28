import { sql } from 'drizzle-orm'
import * as R from 'remeda'
import { competitions, seasons } from '../../../../src/lib/db/schema'
import { CURRENT_SEASON_YEAR } from '../../constants/fmf-sources'
import type { EditionBundle } from '../../edition-bundle/edition-bundle'
import type { Transaction } from '../database-context/database-context'

const upsertCompetition = async (transaction: Transaction, bundle: EditionBundle): Promise<string> => {
  const { source } = bundle

  const [competition] = await transaction
    .insert(competitions)
    .values({ name: source.name, slug: source.slug, category: source.category, division: source.division })
    .onConflictDoUpdate({ target: competitions.slug, set: { name: source.name, category: source.category, division: source.division } })
    .returning({ id: competitions.id })

  if (!competition) throw new Error(`falha ao gravar a competição ${source.slug}`)

  return competition.id
}

export const upsertSeason = async (transaction: Transaction, bundle: EditionBundle): Promise<string> => {
  const competitionId = await upsertCompetition(transaction, bundle)

  const matchDates = R.pipe(
    bundle.page.matches.map((match) => match.date),
    R.filter(R.isNonNullish),
    R.sortBy((date) => date),
  )

  const values = {
    competitionId,
    year: bundle.year,
    label: bundle.page.label,
    fmfCompetitionId: bundle.page.fmfCompetitionId ?? bundle.editionId,
    fmfPageUrl: bundle.pageUrl,
    isCurrent: bundle.year >= CURRENT_SEASON_YEAR,
    startsOn: matchDates[0] ?? null,
    endsOn: matchDates.at(-1) ?? null,
  }

  const [season] = await transaction
    .insert(seasons)
    .values(values)
    .onConflictDoUpdate({
      target: [seasons.competitionId, seasons.year],
      set: {
        label: values.label,
        fmfCompetitionId: values.fmfCompetitionId,
        fmfPageUrl: values.fmfPageUrl,
        isCurrent: values.isCurrent,
        startsOn: values.startsOn,
        endsOn: values.endsOn,
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: seasons.id })

  if (!season) throw new Error(`falha ao gravar a temporada ${bundle.page.label}`)

  return season.id
}
