import { cn } from '@/lib/utils/cn'
import { categoryBorderClass, categoryLabel, categoryTextClass, type Category } from '../../categories'

const TAG_SIZE_CLASS = {
  small: 'px-2 py-[2px] text-[10px]',
  medium: 'px-2 py-[3px] text-[10.5px]',
  large: 'px-[10px] py-[3px] text-[11.5px]',
  extraLarge: 'px-[11px] py-1 text-[13px]',
} as const

type CategoryTagProps = {
  category: Category
  size?: keyof typeof TAG_SIZE_CLASS
  className?: string
}

export function CategoryTag({ category, size = 'small', className }: CategoryTagProps) {
  return (
    <span
      className={cn(
        'inline-flex flex-none items-center self-center rounded-card border font-bold whitespace-nowrap tracking-[-.01em]',
        TAG_SIZE_CLASS[size],
        categoryBorderClass[category],
        categoryTextClass[category],
        className,
      )}
    >
      {categoryLabel[category]}
    </span>
  )
}
