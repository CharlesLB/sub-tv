import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import type { ClubOptionVM } from '../../types'

type ClubPickerProps = {
  clubs: ClubOptionVM[]
  selectedClubIds: string[]
  onToggle: (clubId: string) => void
}

export function ClubPicker({ clubs, selectedClubIds, onToggle }: ClubPickerProps) {
  if (clubs.length === 0) return <span className="text-[12.5px] text-tx4">Nenhum clube cadastrado nesta categoria ainda.</span>

  return (
    <div className="grid max-h-[248px] grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 overflow-y-auto pr-1">
      {clubs.map((club) => {
        const isSelected = selectedClubIds.includes(club.clubId)

        return (
          <label
            key={club.clubId}
            className={cn(
              'flex min-w-0 cursor-pointer items-center gap-[10px] rounded-card border px-[14px] py-3 text-tx transition-[border-color,background] duration-[140ms] has-focus-visible:outline-2 has-focus-visible:outline-tx',
              isSelected ? 'bg-pan' : 'border-bd2 bg-transparent hover:border-bd3',
            )}
            style={isSelected ? { borderColor: club.badge.color } : undefined}
          >
            <input type="checkbox" name="clubId" value={club.clubId} checked={isSelected} onChange={() => onToggle(club.clubId)} className="sr-only" />
            <Crest color={club.badge.color} imagePath={club.badge.crestPath} width={18} />
            <span className="truncate text-[11.7px] font-bold tracking-[-.01em] whitespace-nowrap">{club.badge.name}</span>
          </label>
        )
      })}
    </div>
  )
}
