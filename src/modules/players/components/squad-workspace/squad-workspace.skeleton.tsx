import { cn } from '@/lib/utils/cn'
import { PlayerSheetSkeleton } from '../player-sheet/player-sheet.skeleton'
import { RosterTableSkeleton } from '../roster-table/roster-table.skeleton'
import { SquadHeaderSkeleton } from '../squad-header/squad-header.skeleton'
import { squadWorkspaceStyles as styles } from './squad-workspace.styles'

export function SquadWorkspaceSkeleton() {
  return (
    <>
      <div aria-hidden className={styles.roster}>
        <SquadHeaderSkeleton />
        <RosterTableSkeleton />
      </div>
      <div aria-hidden className={cn(styles.sheetPanel, styles.sheetPanelMobile, styles.sheetPanelHiddenOnMobile)}>
        <PlayerSheetSkeleton />
      </div>
    </>
  )
}
