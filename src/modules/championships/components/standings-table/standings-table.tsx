import { cn } from '@/lib/utils/cn'
import type { Category } from '../../categories'
import type { StandingGroupVM } from '../../types'
import { StandingsRow } from '../standings-row/standings-row'
import { standingsTableStyles as styles } from './standings-table.styles'

export const STANDINGS_HEADERS = [
  { label: '#', className: styles.headerAlignStart },
  { label: 'Clube', className: styles.headerAlignStart },
  { label: 'PTS', className: styles.headerAlignCenter },
  { label: 'J', className: styles.headerAlignCenter },
  { label: 'V', className: styles.headerAlignCenterWideOnly },
  { label: 'E', className: styles.headerAlignCenterWideOnly },
  { label: 'D', className: styles.headerAlignCenterWideOnly },
  { label: 'SG', className: styles.headerAlignCenter },
  { label: 'Últimos 5', className: styles.headerAlignEndWideOnly },
] as const

type StandingsTableProps = { group: StandingGroupVM; category: Category }

export function StandingsTable({ group, category }: StandingsTableProps) {
  return (
    <div className={styles.table}>
      {group.groupName ? <div className={styles.groupName}>Grupo {group.groupName}</div> : null}
      <div className={cn(styles.grid, styles.headerRow)}>
        {STANDINGS_HEADERS.map((header) => (
          <span key={header.label} className={cn(styles.headerCell, header.className)}>
            {header.label}
          </span>
        ))}
      </div>
      {group.rows.map((row, index) => (
        <StandingsRow key={row.seasonTeamId} row={row} index={index} groupSize={group.rows.length} category={category} />
      ))}
    </div>
  )
}
