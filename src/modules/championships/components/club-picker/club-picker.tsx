import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import type { ClubOptionVM } from '../../types'
import { clubPickerStyles as styles } from './club-picker.styles'

type ClubPickerProps = {
  clubs: ClubOptionVM[]
  selectedClubIds: string[]
  onToggle: (clubId: string) => void
}

export function ClubPicker({ clubs, selectedClubIds, onToggle }: ClubPickerProps) {
  if (clubs.length === 0) return <span className={styles.emptyMessage}>Nenhum clube cadastrado nesta categoria ainda.</span>

  return (
    <div className={styles.grid}>
      {clubs.map((club) => {
        const isSelected = selectedClubIds.includes(club.clubId)

        return (
          <label key={club.clubId} className={cn(styles.option, isSelected ? styles.optionSelected : styles.optionIdle)} style={isSelected ? { borderColor: club.badge.color } : undefined}>
            <input type="checkbox" name="clubId" value={club.clubId} checked={isSelected} onChange={() => onToggle(club.clubId)} className={styles.checkbox} />
            <Crest color={club.badge.color} imagePath={club.badge.crestPath} width={18} />
            <span className={styles.clubName}>{club.badge.name}</span>
          </label>
        )
      })}
    </div>
  )
}
