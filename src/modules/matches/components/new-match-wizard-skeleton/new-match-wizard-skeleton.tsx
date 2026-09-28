import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { newMatchWizardSkeletonStyles as styles } from './new-match-wizard-skeleton.styles'

const STEP_PLACEHOLDERS = [1, 2, 3, 4]
const FIELD_PLACEHOLDERS = ['date', 'time', 'round']

export function NewMatchWizardSkeleton() {
  return (
    <section aria-busy aria-label="Carregando nova partida" className={styles.wizard}>
      <div className={styles.stepper}>
        {STEP_PLACEHOLDERS.map((step) => (
          <div key={step} className={styles.step}>
            <Skeleton className={styles.stepBadge} delayMs={step * 60} />
            <span className={styles.stepText}>
              <Skeleton className={styles.stepTitle} delayMs={step * 60} />
              <Skeleton className={styles.stepValue} delayMs={step * 60} />
            </span>
          </div>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.fields}>
          {FIELD_PLACEHOLDERS.map((field, index) => (
            <div key={field} className={styles.field}>
              <Skeleton className={styles.fieldLabel} delayMs={index * 80} />
              <Skeleton className={styles.fieldInput} delayMs={index * 80} />
            </div>
          ))}
          <div className={styles.fieldWide}>
            <Skeleton className={styles.fieldLabel} delayMs={240} />
            <Skeleton className={styles.fieldInput} delayMs={240} />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <Skeleton className={styles.footerSummary} />
        <Skeleton className={styles.footerHint} />
        <Skeleton className={styles.footerBack} />
        <Skeleton className={styles.footerNext} />
      </div>
    </section>
  )
}
