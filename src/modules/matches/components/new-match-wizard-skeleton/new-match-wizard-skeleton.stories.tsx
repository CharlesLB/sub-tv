import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NewMatchWizardSkeleton } from './new-match-wizard-skeleton'

const COLOR_CONTRAST_RULE = 'color-contrast'
const ARIA_PROHIBITED_ATTRIBUTE_RULE = 'aria-prohibited-attr'

const meta = {
  title: 'Matches/NewMatchWizardSkeleton',
  component: NewMatchWizardSkeleton,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          { id: COLOR_CONTRAST_RULE, enabled: false },
          { id: ARIA_PROHIBITED_ATTRIBUTE_RULE, enabled: false },
        ],
      },
    },
  },
} satisfies Meta<typeof NewMatchWizardSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
