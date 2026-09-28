import { BrandLogo } from '../brand-logo/brand-logo'
import { platformRailSkeletonStyles as styles } from './platform-rail-skeleton.styles'

export function PlatformRailSkeleton() {
  return (
    <div className={styles.rail}>
      <div className={styles.brand}>
        <BrandLogo />
      </div>
    </div>
  )
}
