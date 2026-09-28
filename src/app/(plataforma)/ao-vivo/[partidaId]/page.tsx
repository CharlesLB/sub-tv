import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { routes } from '@/lib/routes'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { requireUser } from '@/modules/auth'
import { MATCH_STATUS } from '@/modules/championships'
import { LiveBoard, LiveEmptyState, LiveSkeleton, officialsStripItems } from '@/modules/live'
import { getLiveMatch, type LiveMatchSnapshot } from '@/modules/matches'
import { ContextBar } from '@/modules/platform'

const LOADING_TITLE = 'Abrindo partida'
const FINISHED_LABEL = 'Encerrada'
const LIVE_LABEL = 'Ao vivo'

const detailOf = (snapshot: LiveMatchSnapshot): string =>
  [snapshot.status === MATCH_STATUS.FINISHED ? FINISHED_LABEL : LIVE_LABEL, snapshot.round === null ? null : `rodada ${snapshot.round}`, snapshot.venue ?? snapshot.city].filter(Boolean).join(' · ')

const titleOf = (snapshot: LiveMatchSnapshot): string => `${snapshot.teams.home.name} × ${snapshot.teams.away.name}`

async function LiveMatchScreen({ matchId }: { matchId: string }) {
  await requireUser()
  const snapshot = isUuid(matchId) ? await getLiveMatch(matchId) : null
  if (!snapshot) notFound()

  const { championship, seasonId } = snapshot

  const crumbs = [
    { label: 'Campeonatos', href: routes.championships(championship.year) },
    { label: championship.name, href: routes.championship(seasonId) },
    { label: String(championship.year), separator: '·' as const, href: routes.championship(seasonId) },
  ]

  return (
    <>
      <ContextBar crumbs={crumbs} title={titleOf(snapshot)} category={championship.category} detail={detailOf(snapshot)} />
      {snapshot.players.length === 0 ? <LiveEmptyState seasonId={seasonId} /> : <LiveBoard snapshot={snapshot} officialsItems={officialsStripItems(snapshot)} />}
    </>
  )
}

export async function generateMetadata({ params }: PageProps<'/ao-vivo/[partidaId]'>): Promise<Metadata> {
  const { partidaId } = await params
  const snapshot = isUuid(partidaId) ? await getLiveMatch(partidaId) : null

  return { title: snapshot ? `${titleOf(snapshot)} · Ao vivo` : 'Ao vivo' }
}

export default function LiveMatchPage({ params }: PageProps<'/ao-vivo/[partidaId]'>) {
  const fallback = (
    <>
      <ContextBar crumbs={[{ label: 'Campeonatos', href: routes.championships() }]} title={LOADING_TITLE} />
      <LiveSkeleton />
    </>
  )

  return (
    <Suspense fallback={fallback}>
      {params.then(({ partidaId }) => (
        <LiveMatchScreen matchId={partidaId} />
      ))}
    </Suspense>
  )
}
