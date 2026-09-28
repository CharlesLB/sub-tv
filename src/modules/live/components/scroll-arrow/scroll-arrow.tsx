import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { scrollArrowStyles as styles } from './scroll-arrow.styles'

export const SCROLL_DIRECTION = { PREVIOUS: 'previous', NEXT: 'next' } as const

type ScrollDirection = (typeof SCROLL_DIRECTION)[keyof typeof SCROLL_DIRECTION]

type ScrollArrowProps = { direction: ScrollDirection; isDisabled: boolean; onClick: () => void }

export function ScrollArrow({ direction, isDisabled, onClick }: ScrollArrowProps) {
  const isPrevious = direction === SCROLL_DIRECTION.PREVIOUS

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={isPrevious ? 'Anterior' : 'Próximo'}
      aria-label={isPrevious ? 'Eventos anteriores' : 'Próximos eventos'}
      className={cn(styles.button, isDisabled ? styles.buttonDisabled : styles.buttonEnabled)}
    >
      <Icon name={isPrevious ? 'chevronLeft' : 'chevronRight'} size={19} />
    </button>
  )
}
