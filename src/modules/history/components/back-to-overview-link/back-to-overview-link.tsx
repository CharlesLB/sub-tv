import Link from 'next/link'
import { Icon } from '@/components/ui/icon/icon'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref } from '../../history-href/history-href'
import { backToOverviewLinkStyles as styles } from './back-to-overview-link.styles'

export function BackToOverviewLink({ filter }: { filter: HistoryFilter }) {
  return (
    <Link href={historyHref({ kind: 'overview' }, filter)} className={styles.link}>
      <Icon name="arrowBack" size={16} />
      Voltar ao geral
    </Link>
  )
}
