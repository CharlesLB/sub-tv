import type { ReactNode } from 'react'
import { SeasonTeamList, type SeasonTeamVM } from '@/modules/teams'
import { squadsScreenStyles as styles } from './squads-screen.styles'

type SquadsScreenProps = { year: number; teams: SeasonTeamVM[]; children: ReactNode }

export function SquadsScreen({ year, teams, children }: SquadsScreenProps) {
  return (
    <div className={styles.screen}>
      <SeasonTeamList teams={teams} year={year} />
      {children}
    </div>
  )
}
