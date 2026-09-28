import { Crest } from '@/components/ui/crest/crest'
import { cn } from '@/lib/utils/cn'
import { CategoryTag, type Category } from '@/modules/championships/client'
import type { MatchSide, SetupTeamVM } from '../../types'
import { WizardNotice } from '../wizard-notice/wizard-notice'

const DISABLED_CREST_COLOR = 'var(--bd2)'
const SIDE_TITLE: Record<MatchSide, string> = { home: 'Time mandante', away: 'Time visitante' }
const SIDES: MatchSide[] = ['home', 'away']

type TeamsStepProps = {
  teams: SetupTeamVM[]
  category: Category
  chosenTeamIds: Record<MatchSide, string | null>
  notice: string | null
  onPick: (side: MatchSide, team: SetupTeamVM) => void
}

export function TeamsStep({ teams, category, chosenTeamIds, notice, onPick }: TeamsStepProps) {
  return (
    <div className="flex max-w-[1100px] animate-fade-up flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-4">
        {SIDES.map((side) => {
          const otherTeamId = chosenTeamIds[side === 'home' ? 'away' : 'home']

          return (
            <div key={side} role="group" aria-label={SIDE_TITLE[side]} className="chamfer flex flex-col gap-3 bg-pan2 p-[18px] mobile:p-[14px]">
              <div className="flex flex-wrap items-center gap-[10px]">
                <span className="text-[10.3px] font-semibold tracking-[-.01em] text-tx4">{SIDE_TITLE[side]}</span>
                <CategoryTag category={category} size="medium" />
              </div>
              {teams.length === 0 ? <span className="text-[12.5px] text-tx4">Nenhum time inscrito neste campeonato ainda.</span> : null}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
                {teams.map((team) => {
                  const isSelected = chosenTeamIds[side] === team.seasonTeamId
                  const isDisabled = otherTeamId === team.seasonTeamId

                  return (
                    <button
                      key={team.seasonTeamId}
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      onClick={() => onPick(side, team)}
                      className={cn(
                        'flex min-w-0 items-center gap-[10px] rounded-card border px-[14px] py-3 text-left transition-[border-color,background] duration-[140ms]',
                        isSelected ? 'bg-pan' : 'border-bd2 bg-transparent hover:border-bd3',
                        isDisabled ? 'cursor-not-allowed text-tx4 opacity-45' : 'text-tx',
                      )}
                      style={isSelected ? { borderColor: team.color } : undefined}
                    >
                      <Crest color={isDisabled ? DISABLED_CREST_COLOR : team.color} imagePath={team.crestPath} width={18} className={cn(isDisabled && 'grayscale')} />
                      <span className="truncate text-[11.7px] font-bold tracking-[-.01em] whitespace-nowrap">{team.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {notice ? <WizardNotice icon="groups" text={notice} /> : null}
    </div>
  )
}
