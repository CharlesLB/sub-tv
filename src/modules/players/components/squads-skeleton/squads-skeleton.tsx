import { TeamListSkeleton } from '@/modules/teams'
import { SquadWorkspaceSkeleton } from '../squad-workspace-skeleton/squad-workspace-skeleton'

export function SquadsSkeleton() {
  return (
    <div aria-hidden className="flex min-h-0 flex-1 flex-wrap items-stretch gap-px overflow-hidden bg-bg">
      <TeamListSkeleton />
      <SquadWorkspaceSkeleton />
    </div>
  )
}
