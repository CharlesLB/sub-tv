import { Icon } from '@/components/ui/icon/icon'
import { IntentLink } from '@/components/ui/intent-link/intent-link'
import type { HistoryFilter } from '../../lib/history-filter/history-filter'
import { historyHref } from '../../lib/history-href/history-href'
import { backToOverviewLinkStyles as styles } from './back-to-overview-link.styles'

export function BackToOverviewLink({ filter }: { filter: HistoryFilter }) {
  return (
    <IntentLink href={historyHref({ kind: 'overview' }, filter)} className={styles.link}>
      <Icon name="arrowBack" size={16} />
      Voltar ao geral
    </IntentLink>
  )
}
