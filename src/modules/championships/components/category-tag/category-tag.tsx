import { cn } from '@/lib/utils/cn'
import { type Category, categoryBorderClass, categoryLabel, categoryTextClass } from '../../categories'
import { categoryTagStyles as styles } from './category-tag.styles'

type CategoryTagProps = {
  category: Category
  size?: keyof typeof styles.size
  className?: string
}

export function CategoryTag({ category, size = 'small', className }: CategoryTagProps) {
  return <span className={cn(styles.tag, styles.size[size], categoryBorderClass[category], categoryTextClass[category], className)}>{categoryLabel[category]}</span>
}
