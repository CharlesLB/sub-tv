import { Icon } from '@/components/ui/icon/icon'
import { cn } from '@/lib/utils/cn'
import { WIZARD_STEPS, type WizardStep } from '../../wizard-reducer/wizard-reducer'

const revealActiveStep = (element: HTMLButtonElement | null) => element?.scrollIntoView({ block: 'nearest', inline: 'nearest' })

const STEP_TITLE: Record<WizardStep, string> = { 1: 'Informações', 2: 'Times', 3: 'Escalações', 4: 'Revisão' }

type WizardStepperProps = {
  currentStep: WizardStep
  values: Record<WizardStep, string>
  onGoBackTo: (step: WizardStep) => void
}

export function WizardStepper({ currentStep, values, onGoBackTo }: WizardStepperProps) {
  return (
    <nav aria-label="Etapas da nova partida" className="no-scrollbar flex flex-none items-stretch overflow-x-auto border-b border-bd bg-pan">
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
            className={cn(
              'flex min-w-[158px] flex-[1_1_0] items-center gap-[11px] border-b-2 px-4 py-[13px] text-left transition-[background,border-color] duration-[180ms] disabled:cursor-default',
              index > 0 && 'border-l border-l-bd',
              isActive ? 'bg-pan2' : 'bg-transparent',
              isActive || isDone ? 'border-b-ac' : 'border-b-bd',
            )}
          >
            <span
              className={cn(
                'flex size-6 flex-none items-center justify-center rounded-card border text-[12px] font-semibold',
                isActive || isDone ? 'border-ac bg-ac text-bg' : 'border-bd2 text-tx4',
              )}
            >
              {isDone ? <Icon name="check" size={15} /> : step}
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className={cn('text-[11.7px] font-bold tracking-[-.01em] whitespace-nowrap', isActive || isDone ? 'text-tx' : 'text-tx3')}>{STEP_TITLE[step]}</span>
              <span className={cn('truncate text-[10px] tracking-[.06em] whitespace-nowrap', isDone ? 'text-ac' : isActive ? 'text-tx2' : 'text-tx5')}>{values[step]}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
