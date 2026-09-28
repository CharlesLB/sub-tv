import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'
import { LINEUP_VIEW, type LineupView } from '../../wizard-reducer/wizard-reducer'

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
    <div role="group" aria-label="Visualização" className="mb-[14px] flex max-w-[1180px] flex-none animate-fade-up flex-wrap items-center gap-[10px]">
      <span className="text-[9.9px] font-semibold tracking-[-.01em] text-tx4">Visualização</span>
      {VIEW_OPTIONS.map((option) => {
        const isActive = option.view === view

        return (
          <button
            key={option.view}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.view)}
            className={cn(
              'flex h-[34px] items-center gap-[7px] rounded-card border px-[14px] text-[11.3px] font-bold tracking-[-.01em] transition-colors',
              isActive ? 'border-ac bg-ac text-bg' : 'border-bd2 bg-transparent text-tx2 hover:border-bd3',
            )}
          >
            <Icon name={option.icon} size={17} />
            {option.label}
          </button>
        )
      })}
      <span className="text-[12.5px] text-pretty text-tx4">{VIEW_NOTE[view]}</span>
    </div>
  )
}
