import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { backToOverviewLinkSkeletonStyles as skeletonStyles } from './back-to-overview-link.skeleton.styles'

export function BackToOverviewLinkSkeleton() {
  return <Skeleton className={skeletonStyles.link} />
}
