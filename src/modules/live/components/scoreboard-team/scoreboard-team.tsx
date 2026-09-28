import type { LiveTeamVM } from '@/modules/matches/client'

type ScoreboardTeamProps = { team: LiveTeamVM }

export function ScoreboardTeam({ team }: ScoreboardTeamProps) {
  return (
    <div className="flex items-center px-4 py-2 mobile:px-3" style={{ background: team.color }} title={team.name}>
      <span className="skew-x-12 text-[15.3px] font-bold tracking-[-.01em] text-bg mobile:text-[13.5px]">{team.abbreviation}</span>
    </div>
  )
}
