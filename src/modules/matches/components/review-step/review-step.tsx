import { Crest } from '@/components/ui/crest/crest'
import { categoryLabel, CategoryTag, type Category } from '@/modules/championships/client'
import { MATCH_DURATION_LABEL } from '../../wizard-selectors/wizard-selectors'
import type { LineupSideVM } from '../lineups-step/lineups-step'


type ReviewStepProps = {
  championshipName: string
  category: Category
  subtitle: string
  sides: LineupSideVM[]
}

export function ReviewStep({ championshipName, category, subtitle, sides }: ReviewStepProps) {
  const title = sides.map(({ team }) => team.name).join('  ×  ')
  const broadcastFacts = [
    { label: 'Campeonato', value: `${championshipName} · ${categoryLabel[category]}` },
    { label: 'Tempo de jogo', value: MATCH_DURATION_LABEL },
  ]

  return (
    <div className="flex max-w-[1000px] min-h-0 flex-1 animate-fade-up flex-col gap-[14px]">
      <div className="chamfer flex flex-none flex-wrap items-center gap-5 bg-pan2 px-5 py-4 mobile:px-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <CategoryTag category={category} size="extraLarge" />
            <span className="text-[10.8px] font-semibold tracking-[-.01em] text-tx2">{championshipName}</span>
          </div>
          <div className="text-[18.9px] leading-[1.15] font-bold tracking-[-.01em] text-pretty whitespace-pre-wrap">{title}</div>
          <div className="mt-[6px] text-[11.3px] font-semibold tracking-[-.01em] text-tx2">{subtitle}</div>
        </div>
        <div className="ml-auto -skew-x-12 rounded-card border border-ac px-4 py-2">
          <span className="block skew-x-12 text-[11.3px] font-bold tracking-[-.01em] text-ac">Pronta para transmitir</span>
        </div>
      </div>
      <div className="grid flex-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[14px]">
        {sides.map(({ side, team, starterIds }) => {
          const starterSet = new Set(starterIds)

          return (
            <div key={side} className="chamfer flex min-h-0 flex-col gap-[10px] bg-pan2 px-4 py-[14px]">
              <div className="flex flex-none flex-wrap items-center gap-[10px]">
                <Crest color={team.color} imagePath={team.crestPath} width={18} />
                <span className="text-[13.5px] font-bold tracking-[-.01em]">{team.name}</span>
                <CategoryTag category={category} size="medium" />
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] content-start gap-x-[14px] gap-y-[5px]">
                {team.players
                  .filter((player) => starterSet.has(player.playerId))
                  .map((player) => (
                    <div key={player.playerId} className="flex min-w-0 items-baseline gap-2 text-[13px]">
                      <span className="w-[22px] flex-none font-bold nums" style={{ color: team.color }}>
                        {player.shirtNumber}
                      </span>
                      <span className="truncate whitespace-nowrap">{player.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-none flex-wrap items-center gap-[22px] bg-pan px-4 py-3">
        <div className="text-[10.3px] font-semibold tracking-[-.01em] text-tx4">Transmissão</div>
        {broadcastFacts.map((fact) => (
          <div key={fact.label} className="flex items-baseline gap-[10px]">
            <span className="text-[9.9px] font-semibold tracking-[-.01em] text-tx4">{fact.label}</span>
            <span className="text-[12.2px] font-bold tracking-[-.01em]">{fact.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
