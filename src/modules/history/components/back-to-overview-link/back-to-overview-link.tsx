import Link from 'next/link'
import { Icon } from '@/components/ui/icon/icon'
import type { HistoryFilter } from '../../history-filter/history-filter'
import { historyHref } from '../../history-href/history-href'

export function BackToOverviewLink({ filter }: { filter: HistoryFilter }) {
  return (
    <Link
      href={historyHref({ kind: 'overview' }, filter)}
      className="flex h-8 items-center gap-[6px] self-start rounded-card border border-bd2 px-3 text-[10.5px] tracking-[.05em] text-tx3 transition-colors hover:border-tx3 hover:text-tx"
    >
      <Icon name="arrowBack" size={16} />
      Voltar ao geral
    </Link>
  )
}
