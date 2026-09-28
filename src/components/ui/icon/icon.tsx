import { cn } from '@/lib/utils/cn'
import { ICON_PATHS, ICON_VIEW_BOX, type IconName } from './icon-paths'

type IconProps = {
  name: IconName
  size?: number
  className?: string
  label?: string
}

export function Icon({ name, size = 16, className, label }: IconProps) {
  return (
    <svg
      viewBox={ICON_VIEW_BOX}
      width={size}
      height={size}
      fill="currentColor"
      className={cn('flex-none', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}
