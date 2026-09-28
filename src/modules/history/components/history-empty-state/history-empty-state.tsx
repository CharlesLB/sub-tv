type HistoryEmptyStateProps = { message: string }

export function HistoryEmptyState({ message }: HistoryEmptyStateProps) {
  return (
    <div className="flex min-h-11 items-center justify-center rounded-card border border-dashed border-bd2 px-4 py-3 text-center text-[10.8px] font-bold tracking-[-.01em] text-tx4">{message}</div>
  )
}
