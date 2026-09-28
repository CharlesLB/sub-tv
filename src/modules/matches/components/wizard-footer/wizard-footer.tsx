import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { wizardFooterStyles as styles } from './wizard-footer.styles'

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
    <div className={styles.footer}>
      <button type="button" onClick={onToggleSummary} aria-expanded={isSummaryOpen} className={cn(styles.summaryToggle, isSummaryOpen ? styles.summaryToggleOpen : styles.summaryToggleClosed)}>
        <Icon name="expandLess" size={17} className={cn(styles.summaryToggleIcon, isSummaryOpen && styles.summaryToggleIconOpen)} />
        Resumo
      </button>
      <span className={styles.hint}>{hint}</span>
      <button type="button" onClick={onBack} className={styles.backButton}>
        {isFirstStep ? 'Cancelar' : 'Voltar'}
      </button>
      {isFinalStep ? (
        <button type="button" onClick={onSubmit} disabled={isSubmitting || !canAdvance} aria-busy={isSubmitting} className={styles.submitButton}>
          <Icon name="check" size={19} />
          {isSubmitting ? 'Criando partida…' : 'Criar e ir ao vivo'}
        </button>
      ) : (
        <button type="button" onClick={onNext} aria-disabled={!canAdvance} className={cn(styles.nextButton, canAdvance ? styles.nextButtonReady : styles.nextButtonBlocked)}>
          Continuar
        </button>
      )}
    </div>
  )
}
