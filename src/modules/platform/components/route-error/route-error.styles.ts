import { emptyStateStyles } from '../empty-state/empty-state.styles'

export const routeErrorStyles = {
  wrapper: emptyStateStyles.wrapper,
  card: emptyStateStyles.card,
  icon: 'text-am',
  title: emptyStateStyles.title,
  description: emptyStateStyles.description,
  retryButton: 'mt-1 h-[38px] rounded-card bg-ac px-4 text-[11.3px] font-bold tracking-[-.01em] text-bg',
} as const
