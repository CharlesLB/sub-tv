import { historyEmptyStateStyles as styles } from './history-empty-state.styles'

type HistoryEmptyStateProps = { message: string }

export function HistoryEmptyState({ message }: HistoryEmptyStateProps) {
  return <div className={styles.message}>{message}</div>
}
