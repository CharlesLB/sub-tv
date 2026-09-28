import { Icon } from '@/components/ui/icon/icon'
import { cn } from '@/lib/utils/cn'

type WizardFooterProps = {
  hint: string
  isSummaryOpen: boolean
  isFirstStep: boolean
  isFinalStep: boolean
  canAdvance: boolean
  isSubmitting: boolean
  onToggleSummary: () => void
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export function WizardFooter({ hint, isSummaryOpen, isFirstStep, isFinalStep, canAdvance, isSubmitting, onToggleSummary, onBack, onNext, onSubmit }: WizardFooterProps) {
  return (
    <div className="flex flex-none flex-wrap items-center gap-[14px] border-t border-bd bg-pan px-5 py-3 mobile:gap-[10px] mobile:px-3">
      <button
        type="button"
        onClick={onToggleSummary}
        aria-expanded={isSummaryOpen}
        className={cn(
          'flex h-[34px] flex-none items-center gap-[7px] rounded-card border px-[13px] text-[10.8px] font-bold tracking-[-.01em] transition-colors',
          isSummaryOpen ? 'border-ac bg-pan2 text-ac' : 'border-bd2 bg-transparent text-tx2',
        )}
      >
        <Icon name="expandLess" size={17} className={cn('transition-transform duration-[180ms]', isSummaryOpen && 'rotate-180')} />
        Resumo
      </button>
      <span className="min-w-[150px] flex-1 text-[10.3px] font-semibold tracking-[-.01em] text-pretty text-tx4 mobile:order-first mobile:basis-full">{hint}</span>
      <button
        type="button"
        onClick={onBack}
        className="h-11 rounded-card border border-bd2 bg-transparent px-[18px] text-[11.7px] font-bold tracking-[-.01em] text-tx2 transition-colors hover:border-tx hover:text-tx"
      >
        {isFirstStep ? 'Cancelar' : 'Voltar'}
      </button>
      {isFinalStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !canAdvance}
          aria-busy={isSubmitting}
          className="inline-flex h-12 items-center justify-center gap-[10px] bg-ac px-6 whitespace-nowrap mobile:flex-1 mobile:px-4 text-[13.5px] font-bold tracking-[-.01em] text-bg disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Icon name="check" size={19} />
          {isSubmitting ? 'Criando partida…' : 'Criar e ir ao vivo'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          aria-disabled={!canAdvance}
          className={cn('h-12 px-[26px] text-[13.5px] mobile:flex-1 font-bold tracking-[-.01em]', canAdvance ? 'cursor-pointer bg-ac text-bg' : 'cursor-not-allowed bg-bd2 text-tx4')}
        >
          Continuar
        </button>
      )}
    </div>
  )
}
