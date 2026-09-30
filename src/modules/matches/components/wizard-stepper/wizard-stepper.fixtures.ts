import type { WizardStep } from '../../lib/wizard-reducer/wizard-reducer'
import { WIZARD_STEP } from '../../lib/wizard-reducer/wizard-reducer'

export const stepValuesFixture: Record<WizardStep, string> = {
  [WIZARD_STEP.INFORMATION]: '03/10/2026 · 10:00',
  [WIZARD_STEP.TEAMS]: 'EDV × ASE',
  [WIZARD_STEP.LINEUPS]: '11/11 E 9/11',
  [WIZARD_STEP.REVIEW]: 'Confirmar e transmitir',
}
