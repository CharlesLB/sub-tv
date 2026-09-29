import { MatchInfoStepSkeleton } from '../match-info-step/match-info-step.skeleton'
import { WizardFooterSkeleton } from '../wizard-footer/wizard-footer.skeleton'
import { WizardStepperSkeleton } from '../wizard-stepper/wizard-stepper.skeleton'
import type { WizardPresentation } from './new-match-wizard'
import { newMatchWizardStyles as styles } from './new-match-wizard.styles'

const PRESENTATION_WITH_NOTICES: WizardPresentation = 'page'

type NewMatchWizardSkeletonProps = { presentation: WizardPresentation }

export function NewMatchWizardSkeleton({ presentation }: NewMatchWizardSkeletonProps) {
  return (
    <div aria-hidden className={styles.wizard}>
      <WizardStepperSkeleton />
      <div className={styles.content}>
        <MatchInfoStepSkeleton hasNotice={presentation === PRESENTATION_WITH_NOTICES} />
      </div>
      <WizardFooterSkeleton />
    </div>
  )
}
