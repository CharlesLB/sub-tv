import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { LINEUP_VIEW, type LineupView } from '../../lib/wizard-reducer/wizard-reducer'
import { lineupViewToolbarStyles as styles } from './lineup-view-toolbar.styles'

const VIEW_OPTIONS: { view: LineupView; label: string; icon: IconName }[] = [
  { view: LINEUP_VIEW.LIST, label: 'Lista', icon: 'list' },
  { view: LINEUP_VIEW.FIELD, label: 'Campo', icon: 'stadium' },
]

const VIEW_NOTE: Record<LineupView, string> = {
  [LINEUP_VIEW.LIST]: 'Marque os 11 titulares de cada elenco.',
  [LINEUP_VIEW.FIELD]: 'Arraste um reserva ao gramado para escalar, solte sobre um titular para trocar, e mova as bolinhas para ajustar a posição.',
}

type LineupViewToolbarProps = { view: LineupView; onChange: (view: LineupView) => void }

export function LineupViewToolbar({ view, onChange }: LineupViewToolbarProps) {
  return (
    <fieldset aria-label="Visualização" className={styles.toolbar}>
      <span className={styles.label}>Visualização</span>
      {VIEW_OPTIONS.map((option) => {
        const isActive = option.view === view

        return (
          <button key={option.view} type="button" aria-pressed={isActive} onClick={() => onChange(option.view)} className={cn(styles.option, isActive ? styles.optionActive : styles.optionIdle)}>
            <Icon name={option.icon} size={17} />
            {option.label}
          </button>
        )
      })}
      <span className={styles.note}>{VIEW_NOTE[view]}</span>
    </fieldset>
  )
}
