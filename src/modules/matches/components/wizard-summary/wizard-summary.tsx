import { Crest } from '@/components/ui/crest/crest'
import { type Category, CategoryTag } from '@/modules/championships/client'
import type { SummaryLineVM } from '../../lib/wizard-selectors/wizard-selectors'
import { wizardSummaryStyles as styles } from './wizard-summary.styles'

export type SummarySideVM = { key: string; name: string; color: string; crestPath: string | null; lineupCount: string }

type WizardSummaryProps = {
  sides: SummarySideVM[]
  lines: SummaryLineVM[]
  category: Category
}

export function WizardSummary({ sides, lines, category }: WizardSummaryProps) {
  return (
    <section aria-label="Resumo da partida" className={styles.summary}>
      <div className={styles.matchupSection}>
        <span className={styles.sectionLabel}>Confronto</span>
        {sides.map((side) => (
          <div key={side.key} className={styles.side}>
            <Crest color={side.color} imagePath={side.crestPath} width={14} />
            <span className={styles.sideName}>{side.name}</span>
            <span className={styles.sideLineupCount}>{side.lineupCount}</span>
          </div>
        ))}
      </div>
      <div className={styles.scheduleSection}>
        <span className={styles.sectionLabel}>Quando e onde</span>
        {lines.map((line) => (
          <span key={line.id} className={styles.scheduleLine}>
            {line.text}
          </span>
        ))}
      </div>
      <div className={styles.categorySection}>
        <span className={styles.sectionLabel}>Categoria</span>
        <CategoryTag category={category} size="extraLarge" className={styles.categoryTag} />
        <span className={styles.categoryNote}>Herdada do campeonato — times e elencos são exclusivos dela.</span>
      </div>
    </section>
  )
}
