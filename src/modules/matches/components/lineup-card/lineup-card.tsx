import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import { type Category, CategoryTag } from '@/modules/championships/client'
import { STARTERS_PER_TEAM } from '../../default-starters/default-starters'
import type { SetupTeamVM } from '../../types'

type LineupCardProps = {
  team: SetupTeamVM
  category: Category
  sourceLine: string
  starterIds: string[]
  onToggle: (playerId: string) => void
}

const nicknameSuffix = (name: string, nickname: string | null): string => (nickname && nickname !== name ? ` "${nickname}"` : '')

export function LineupCard({ team, category, sourceLine, starterIds, onToggle }: LineupCardProps) {
  const starterSet = new Set(starterIds)
  const isComplete = starterIds.length === STARTERS_PER_TEAM

  return (
    <section aria-label={`Escalação ${team.name}`} className="flex min-h-0 min-w-0 flex-col bg-pan2 chamfer">
      <div className="flex flex-wrap items-center gap-[10px] border-b border-bd px-[18px] py-4 mobile:px-[14px]">
        <Crest color={team.color} imagePath={team.crestPath} width={22} />
        <span className="text-[14.4px] font-bold tracking-[-.01em]">{team.name}</span>
        <CategoryTag category={category} size="medium" />
        <span className={cn('flex-none rounded-card border px-[10px] py-1 text-[10.3px] font-bold tracking-[-.01em]', isComplete ? 'border-ac text-ac' : 'border-am text-am')}>
          {starterIds.length}/{STARTERS_PER_TEAM} titulares
        </span>
      </div>
      <div className="border-b border-bd px-[18px] py-2 text-[11.5px] text-tx4 mobile:px-[14px]">{sourceLine}</div>
      <div className="min-h-[140px] flex-1 overflow-x-hidden overflow-y-auto mobile:flex-none mobile:overflow-visible">
        {team.players.length === 0 ? <p className="px-[18px] py-4 text-[12.5px] text-tx4">Nenhum atleta vinculado a este time na temporada.</p> : null}
        {team.players.map((player) => {
          const isStarter = starterSet.has(player.playerId)
          const isLocked = !isStarter && isComplete

          return (
            <button
              key={player.playerId}
              type="button"
              role="checkbox"
              aria-checked={isStarter}
              aria-disabled={isLocked}
              onClick={() => onToggle(player.playerId)}
              className={cn(
                'flex h-[42px] w-full items-center gap-3 border-t border-bd px-[18px] text-left text-tx mobile:px-[14px]',
                isStarter ? 'bg-pan' : 'bg-transparent',
                isLocked ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
            >
              <span
                aria-hidden
                className={cn('size-4 flex-none rounded-card border', !isStarter && 'border-bd2 bg-transparent')}
                style={isStarter ? { borderColor: team.color, background: team.color } : undefined}
              />
              <span className={cn('w-6 flex-none text-[13.5px] font-bold nums', !isStarter && 'text-tx4')} style={isStarter ? { color: team.color } : undefined}>
                {player.shirtNumber}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] whitespace-nowrap">
                {player.name}
                {nicknameSuffix(player.name, player.nickname)}
              </span>
              {player.position ? <span className="text-[9.9px] font-semibold tracking-[-.01em] text-tx4 uppercase">{player.position}</span> : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
