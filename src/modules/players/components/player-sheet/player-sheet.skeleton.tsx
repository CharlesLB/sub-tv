import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { curiosityListStyles } from '../curiosity-list/curiosity-list.styles'
import { playerProfileSummaryStyles } from '../player-profile-summary/player-profile-summary.styles'
import { profileChipsStyles } from '../profile-chips/profile-chips.styles'
import { signInToEditStyles } from '../sign-in-to-edit/sign-in-to-edit.styles'
import { playerSheetSkeletonStyles as skeletonStyles } from './player-sheet.skeleton.styles'
import { playerSheetStyles as styles } from './player-sheet.styles'

const PART_DELAY_MS = 50

const IDENTITY_FIELDS = [
  { key: 'number', labelWidth: skeletonStyles.numberLabelWidth },
  { key: 'name', labelWidth: skeletonStyles.nameLabelWidth },
] as const

const delayOf = (step: number): number => step * PART_DELAY_MS

export function PlayerSheetSkeleton() {
  return (
    <div aria-hidden className={styles.sheet}>
      <Skeleton className={skeletonStyles.closeButton} />
      <div className={styles.header}>
        <Skeleton className={skeletonStyles.crest} />
        <span className={styles.title}>
          <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.titleWidth)} delayMs={delayOf(1)} />
        </span>
        <Skeleton className={skeletonStyles.categoryTag} delayMs={delayOf(2)} />
      </div>
      <div className={styles.identityFields}>
        {IDENTITY_FIELDS.map((field, order) => (
          <div key={field.key}>
            <span className={styles.label}>
              <Skeleton className={cn(skeletonStyles.textBar, field.labelWidth)} delayMs={delayOf(order + 2)} />
            </span>
            <Skeleton className={skeletonStyles.readOnlyInput} delayMs={delayOf(order + 3)} />
          </div>
        ))}
      </div>
      <div className={playerProfileSummaryStyles.summary}>
        <div>
          <span className={playerProfileSummaryStyles.label}>
            <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.displayNameLabelWidth)} delayMs={delayOf(4)} />
          </span>
          <span className={playerProfileSummaryStyles.displayName}>
            <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.displayNameWidth)} delayMs={delayOf(5)} />
          </span>
        </div>
        <div className={profileChipsStyles.chips}>
          {skeletonSlots(skeletonStyles.chips.length).map(({ slotId, order }) => (
            <Skeleton key={slotId} className={cn(skeletonStyles.chip, skeletonStyles.chips[order])} delayMs={delayOf(order + 6)} />
          ))}
        </div>
      </div>
      <div>
        <div className={curiosityListStyles.heading}>
          <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.curiositiesHeadingWidth)} delayMs={delayOf(8)} />
        </div>
        <ul className={curiosityListStyles.list}>
          {skeletonSlots(skeletonStyles.curiosityWidths.length).map(({ slotId, order }) => (
            <li key={slotId} className={curiosityListStyles.item}>
              <Skeleton className={cn(curiosityListStyles.marker, skeletonStyles.curiosityMarker)} delayMs={delayOf(order + 9)} />
              <span className={curiosityListStyles.text}>
                <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.curiosityWidths[order])} delayMs={delayOf(order + 9)} />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <span className={signInToEditStyles.link}>
        <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.signInWidth)} delayMs={delayOf(11)} />
      </span>
      <p className={styles.curiosityNote}>
        {skeletonSlots(skeletonStyles.noteWidths.length).map(({ slotId, order }) => (
          <Skeleton key={slotId} className={cn(skeletonStyles.textBar, skeletonStyles.noteWidths[order])} delayMs={delayOf(order + 12)} />
        ))}
      </p>
    </div>
  )
}
