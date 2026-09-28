import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '@/modules/championships/client'
import { WizardSummary } from './wizard-summary'
import { summaryLinesFixture, summarySidesFixture } from './wizard-summary.fixtures'

const meta = {
  title: 'Matches/WizardSummary',
  component: WizardSummary,
  args: { sides: summarySidesFixture, lines: summaryLinesFixture, category: CATEGORY.SUB14 },
} satisfies Meta<typeof WizardSummary>

export default meta

type Story = StoryObj<typeof meta>

export const Sub14: Story = {}

export const Sub13: Story = { args: { category: CATEGORY.SUB13 } }
