import { Icon } from '@/components/ui/icon/icon'
import { addedTimeButtonStyles as styles } from './added-time-button.styles'

type AddedTimeButtonProps = { onAdd: () => void }

export function AddedTimeButton({ onAdd }: AddedTimeButtonProps) {
  return (
    <button type="button" onClick={onAdd} title="Adicionar 1 minuto de acréscimo" className={styles.button}>
      <Icon name="moreTime" size={15} />
      Acréscimo
    </button>
  )
}
