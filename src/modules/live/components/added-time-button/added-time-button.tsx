import { Icon } from '@/components/ui/icon/icon'

type AddedTimeButtonProps = { onAdd: () => void }

export function AddedTimeButton({ onAdd }: AddedTimeButtonProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      title="Adicionar 1 minuto de acréscimo"
      className="flex h-8 items-center gap-[5px] rounded-card border border-bd2 bg-transparent px-[11px] text-[9.9px] font-bold tracking-[-.01em] text-tx2 transition-colors duration-150 hover:border-tx hover:text-tx"
    >
      <Icon name="moreTime" size={15} />
      Acréscimo
    </button>
  )
}
