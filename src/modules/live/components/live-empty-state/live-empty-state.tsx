import Link from 'next/link'
import { routes } from '@/lib/routes'
import { Icon } from '@/components/ui/icon/icon'
import { HEXAGON_MARK_SIZE, HexagonMark } from '../hexagon-mark/hexagon-mark'
import { liveEmptyStateStyles as styles } from './live-empty-state.styles'

type LiveEmptyStateProps = { seasonId: string }

export function LiveEmptyState({ seasonId }: LiveEmptyStateProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <HexagonMark size={HEXAGON_MARK_SIZE.LARGE} />
        <h2 className={styles.title}>Partida sem escalação</h2>
        <p className={styles.description}>
          Esta partida ainda não tem titulares definidos, então a prancheta não abre. Crie a transmissão pelo botão “Nova partida” do campeonato e escolha os 11 de cada time.
        </p>
        <Link href={routes.newMatch(seasonId)} className={styles.newMatchLink}>
          <Icon name="add" size={16} />
          Nova partida
        </Link>
      </div>
    </div>
  )
}
