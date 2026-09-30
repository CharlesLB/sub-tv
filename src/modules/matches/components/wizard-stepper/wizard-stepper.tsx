import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { WIZARD_STEP, WIZARD_STEPS, type WizardStep } from '../../lib/wizard-reducer/wizard-reducer'
import { wizardStepperStyles as styles } from './wizard-stepper.styles'

const revealActiveStep = (element: HTMLButtonElement | null) => element?.scrollIntoView({ block: 'nearest', inline: 'nearest' })

const STEP_TITLE: Record<WizardStep, string> = {
  [WIZARD_STEP.INFORMATION]: 'Informações',
  [WIZARD_STEP.TEAMS]: 'Times',
  [WIZARD_STEP.LINEUPS]: 'Escalações',
  [WIZARD_STEP.REVIEW]: 'Revisão',
}

type WizardStepperProps = {
  currentStep: WizardStep
  values: Record<WizardStep, string>
  onGoBackTo: (step: WizardStep) => void
}

export function WizardStepper({ currentStep, values, onGoBackTo }: WizardStepperProps) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: a trilha de etapas rola na horizontal e todos os botões ficam desabilitados na primeira etapa, então a própria trilha precisa receber foco para ser rolada pelo teclado
    <nav aria-label="Etapas da nova partida" tabIndex={0} className={styles.stepper}>
      {WIZARD_STEPS.map((step, index) => {
        const isActive = step === currentStep
        const isDone = step < currentStep

        return (
          <button
            key={step}
            ref={isActive ? revealActiveStep : undefined}
            type="button"
            onClick={() => onGoBackTo(step)}
            disabled={!isDone}
            aria-current={isActive ? 'step' : undefined}
            className={cn(styles.step, index > 0 && styles.stepFollowing, isActive ? styles.stepActive : styles.stepInactive, isActive || isDone ? styles.stepReached : styles.stepPending)}
          >
            <span className={cn(styles.badge, isActive || isDone ? styles.badgeReached : styles.badgePending)}>{isDone ? <Icon name="check" size={15} /> : step}</span>
            <span className={styles.text}>
              <span className={cn(styles.title, isActive || isDone ? styles.titleReached : styles.titlePending)}>{STEP_TITLE[step]}</span>
              <span className={cn(styles.value, isDone ? styles.valueDone : isActive ? styles.valueActive : styles.valuePending)}>{values[step]}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
