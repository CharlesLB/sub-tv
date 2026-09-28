import { formatTime, formatTitleDate } from '@/lib/utils/format-date/format-date'
import type { IconName } from '@/components/ui/icon/icon-paths'
import type { LiveMatchSnapshot } from '@/modules/matches/client'

export type OfficialsStripItem = { key: string; icon: IconName; label: string; value: string }

const HALVES = 2
const HEAD_REFEREE_LABEL = 'Árbitro'
const FOURTH_OFFICIAL_LABEL = '4º árbitro'

const iconForOfficial = (label: string): IconName => {
  if (label === HEAD_REFEREE_LABEL) return 'sports'
  if (label === FOURTH_OFFICIAL_LABEL) return 'person'

  return 'flag'
}

const kickoffText = (kickoffAt: string | null): string | null => (kickoffAt ? `${formatTitleDate(kickoffAt)} · ${formatTime(kickoffAt)}` : null)

export const officialsStripItems = (snapshot: Pick<LiveMatchSnapshot, 'officials' | 'round' | 'venue' | 'city' | 'kickoffAt' | 'halfLengthMinutes'>): OfficialsStripItem[] => {
  const place = [snapshot.venue ?? snapshot.city, kickoffText(snapshot.kickoffAt)].filter((part): part is string => Boolean(part)).join(' · ')
  const roundLabel = snapshot.round === null ? 'Partida' : `Rodada ${snapshot.round}`

  return [
    ...snapshot.officials.map((official) => ({ key: official.label, icon: iconForOfficial(official.label), label: official.label, value: official.name })),
    ...(place ? [{ key: 'rodada', icon: 'stadium' as const, label: roundLabel, value: place }] : []),
    { key: 'tempo', icon: 'timer', label: 'Tempo', value: `${HALVES} × ${snapshot.halfLengthMinutes} Min` },
  ]
}
