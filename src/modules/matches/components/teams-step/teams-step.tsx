import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import { type Category, CategoryTag } from '@/modules/championships/client'
import { opponentSide, SIDE, SIDES, type Side } from '../../live-match/live-match'
import type { SetupTeamVM } from '../../types'
import { WizardNotice } from '../wizard-notice/wizard-notice'
import { teamsStepStyles as styles } from './teams-step.styles'

const DISABLED_CREST_COLOR = 'var(--bd2)'
const SIDE_TITLE: Record<Side, string> = { [SIDE.HOME]: 'Time mandante', [SIDE.AWAY]: 'Time visitante' }

type TeamsStepProps = {
  teams: SetupTeamVM[]
  category: Category
  chosenTeamIds: Record<Side, string | null>
  notice: string | null
  onPick: (side: Side, team: SetupTeamVM) => void
}

export function TeamsStep({ teams, category, chosenTeamIds, notice, onPick }: TeamsStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.sides}>
        {SIDES.map((side) => {
          const otherTeamId = chosenTeamIds[opponentSide[side]]

          return (
            <fieldset key={side} aria-label={SIDE_TITLE[side]} className={styles.side}>
              <div className={styles.sideHeader}>
                <span className={styles.sideTitle}>{SIDE_TITLE[side]}</span>
                <CategoryTag category={category} size="medium" />
              </div>
              {teams.length === 0 ? <span className={styles.emptyMessage}>Nenhum time inscrito neste campeonato ainda.</span> : null}
              <div className={styles.teams}>
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
                      className={cn(styles.team, isSelected ? styles.teamSelected : styles.teamIdle, isDisabled ? styles.teamDisabled : styles.teamEnabled)}
                      style={isSelected ? { borderColor: team.color } : undefined}
                    >
                      <Crest color={isDisabled ? DISABLED_CREST_COLOR : team.color} imagePath={team.crestPath} width={18} className={cn(isDisabled && styles.crestDisabled)} />
                      <span className={styles.teamName}>{team.name}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )
        })}
      </div>
      {notice ? <WizardNotice icon="groups" text={notice} /> : null}
    </div>
  )
}
