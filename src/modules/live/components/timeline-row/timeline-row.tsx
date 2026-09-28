import { SIDE, type LiveTeamVM, type Side } from '@/modules/matches/client'
import type { TimelineItem } from '../../state/timeline'
import { EventIcon } from '../event-icon/event-icon'

type TimelineRowProps = { item: TimelineItem; teams: Record<Side, LiveTeamVM> }

const ROW_CLASS = 'grid grid-cols-[minmax(0,1fr)_92px_minmax(0,1fr)] items-center gap-[14px] border-b border-pan2 py-[9px] mobile:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] mobile:gap-2'
const NAME_CLASS = 'min-w-0 truncate text-[13.5px] font-bold tracking-[-.01em] text-tx mobile:text-[12px]'
const META_CLASS = 'flex-none text-[10.5px] tracking-[.08em] text-tx4'

export function TimelineRow({ item, teams }: TimelineRowProps) {
  const team = item.side ? teams[item.side] : null
  const isAway = item.side === SIDE.AWAY
  const icon = <EventIcon kind={item.kind} teamColor={team?.color ?? null} size={19} />

  return (
    <div className={ROW_CLASS}>
      <div className="flex min-w-0 items-center justify-end gap-[9px]">
        {isAway ? null : (
          <>
            <span className={NAME_CLASS}>{item.text}</span>
            {team ? <span className={META_CLASS}>{team.abbreviation}</span> : null}
            {icon}
          </>
        )}
      </div>
      <span className="text-center text-[12.5px] font-semibold tracking-[.04em] text-tx nums">{item.minuteLabel}</span>
      <div className="flex min-w-0 items-center gap-[9px]">
        {isAway ? (
          <>
            {icon}
            <span className={NAME_CLASS}>{item.text}</span>
            {team ? <span className={META_CLASS}>{team.abbreviation}</span> : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
