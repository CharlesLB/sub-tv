import { TeamListSkeleton } from '@/modules/teams'
import { SquadWorkspaceSkeleton } from '../squad-workspace/squad-workspace.skeleton'
import { squadsScreenStyles as styles } from './squads-screen.styles'

export function SquadsSkeleton() {
  return (
    <div aria-hidden className={styles.screen}>
      <TeamListSkeleton />
      <SquadWorkspaceSkeleton />
    </div>
  )
}
