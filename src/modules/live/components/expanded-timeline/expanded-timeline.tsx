import { SIDE, type LiveTeamVM, type Side } from '@/modules/matches/client'
import type { TimelineItem } from '../../state/timeline'
import { RotateNotice } from '../rotate-notice/rotate-notice'
import { TimelineRow } from '../timeline-row/timeline-row'

type ExpandedTimelineProps = { items: TimelineItem[]; teams: Record<Side, LiveTeamVM>; showRotateNotice: boolean }

const TEAM_NAME_CLASS = 'truncate text-[14.4px] font-bold tracking-[-.01em] whitespace-nowrap mobile:text-[12.6px]'

export function ExpandedTimeline({ items, teams, showRotateNotice }: ExpandedTimelineProps) {
  const home = teams[SIDE.HOME]
  const away = teams[SIDE.AWAY]

  return (
    <div
      data-screen-label="Linha do tempo expandida"
      className="flex min-h-0 flex-[1_1_auto] animate-fade-up flex-col overflow-x-hidden overflow-y-auto border-b border-bd bg-pan px-6 pt-[14px] pb-4 mobile:px-[13px] mobile:pt-3 mobile:pb-[14px]"
    >
      {showRotateNotice ? <RotateNotice /> : null}
      <div className="grid grid-cols-[minmax(0,1fr)_92px_minmax(0,1fr)] items-center gap-[14px] border-b border-bd pb-[10px] mobile:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] mobile:gap-2">
        <span className={`${TEAM_NAME_CLASS} text-right`} style={{ color: home.color }}>
          {home.name}
        </span>
        <span className="text-center text-[10.8px] font-bold tracking-[-.01em] text-tx4">Timeline</span>
        <span className={TEAM_NAME_CLASS} style={{ color: away.color }}>
          {away.name}
        </span>
      </div>
      {items.map((item) => (
        <TimelineRow key={item.key} item={item} teams={teams} />
      ))}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 pt-[22px] pb-2 text-center">
          <span aria-hidden className="hexagon relative block h-[29px] w-6 bg-bd2">
            <span className="hexagon absolute inset-px bg-pan" />
          </span>
          <span className="text-[11.7px] font-bold tracking-[-.01em] text-tx3">Nada registrado ainda</span>
          <span className="text-[12px] text-tx4">Gols, cartões e substituições entram aqui em ordem de minuto.</span>
        </div>
      ) : null}
    </div>
  )
}
