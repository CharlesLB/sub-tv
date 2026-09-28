import Link from 'next/link'
import { routes } from '@/lib/routes'
import { Icon } from '@/components/ui/icon/icon'
import { newMatchButtonStyles as styles } from './new-match-button.styles'

type NewMatchButtonProps = { seasonId: string }

export function NewMatchButton({ seasonId }: NewMatchButtonProps) {
  return (
    <Link href={routes.newMatch(seasonId)} title="Nova partida" className={styles.link}>
      <Icon name="sportsSoccer" size={17} />
      <span className={styles.label}>Nova partida</span>
    </Link>
  )
}
