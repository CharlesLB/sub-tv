import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { WIZARD_STEP } from '../../wizard-reducer/wizard-reducer'
import { WizardStepper } from './wizard-stepper'
import { stepValuesFixture } from './wizard-stepper.fixtures'

const COLOR_CONTRAST_RULE = 'color-contrast'
const SCROLLABLE_REGION_FOCUSABLE_RULE = 'scrollable-region-focusable'

const meta = {
  title: 'Matches/WizardStepper',
  component: WizardStepper,
  args: { currentStep: WIZARD_STEP.INFORMATION, values: stepValuesFixture, onGoBackTo: fn() },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof WizardStepper>

export default meta

type Story = StoryObj<typeof meta>

export const FirstStep: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: COLOR_CONTRAST_RULE, enabled: false },
          { id: SCROLLABLE_REGION_FOCUSABLE_RULE, enabled: false },
        ],
      },
    },
  },
}

export const LastStep: Story = {
  args: { currentStep: WIZARD_STEP.REVIEW },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Informações/ }))
    await expect(args.onGoBackTo).toHaveBeenCalledWith(WIZARD_STEP.INFORMATION)
  },
}
