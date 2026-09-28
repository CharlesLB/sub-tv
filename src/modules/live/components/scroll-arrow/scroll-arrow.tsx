import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'

type ScrollArrowProps = { direction: 'previous' | 'next'; isDisabled: boolean; onClick: () => void }

export function ScrollArrow({ direction, isDisabled, onClick }: ScrollArrowProps) {
  const isPrevious = direction === 'previous'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={isPrevious ? 'Anterior' : 'Próximo'}
      aria-label={isPrevious ? 'Eventos anteriores' : 'Próximos eventos'}
      className={cn(
        'flex size-[30px] flex-none items-center justify-center rounded-card border bg-transparent p-0',
        isDisabled ? 'cursor-default border-bd text-bd3' : 'border-bd2 text-tx2 hover:border-tx hover:text-tx',
      )}
    >
      <Icon name={isPrevious ? 'chevronLeft' : 'chevronRight'} size={19} />
    </button>
  )
}
