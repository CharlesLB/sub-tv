import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { NewMatchSetup, NewMatchSheet, NewMatchWizardSkeleton, SheetChampionshipDetails } from '@/modules/matches'

const toPrefillMatchId = (value: string | string[] | undefined): string | null => (typeof value === 'string' && isUuid(value) ? value : null)

const validSeasonId = (seasonId: string): string => (isUuid(seasonId) ? seasonId : notFound())

export default function NewMatchModalPage({ params, searchParams }: PageProps<'/campeonatos/[campeonatoId]/nova-partida'>) {
  return (
    <NewMatchSheet
      details={
        <Suspense fallback={null}>
          {params.then(({ campeonatoId }) => (
            <SheetChampionshipDetails seasonId={validSeasonId(campeonatoId)} />
          ))}
        </Suspense>
      }
    >
      <Suspense fallback={<NewMatchWizardSkeleton presentation="sheet" />}>
        {Promise.all([params, searchParams]).then(([{ campeonatoId }, { partida }]) => (
          <NewMatchSetup seasonId={validSeasonId(campeonatoId)} prefillMatchId={toPrefillMatchId(partida)} presentation="sheet" />
        ))}
      </Suspense>
    </NewMatchSheet>
  )
}
