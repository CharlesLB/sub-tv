import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { crestStyles as styles } from './crest.styles'

const CREST_HEIGHT_RATIO = 1.2

type CrestProps = {
  color: string
  imagePath?: string | null
  width?: number
  className?: string
}

export function Crest({ color, imagePath = null, width = 18, className }: CrestProps) {
  const height = Math.round(width * CREST_HEIGHT_RATIO)

  if (imagePath) {
    return <Image aria-hidden src={imagePath} alt="" width={width} height={height} className={cn(styles.image, className)} style={{ width, height }} />
  }

  return <span aria-hidden className={cn(styles.hexagon, className)} style={{ width, height, background: color }} />
}
