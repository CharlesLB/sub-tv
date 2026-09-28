import { TeamListSkeleton } from '@/modules/teams'
import { SquadWorkspaceSkeleton } from '../squad-workspace-skeleton/squad-workspace-skeleton'
import { squadsSkeletonStyles as styles } from './squads-skeleton.styles'

export function SquadsSkeleton() {
  return (
    <div aria-hidden className={styles.screen}>
      <TeamListSkeleton />
      <SquadWorkspaceSkeleton />
    </div>
  )
}
