import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NewMatchWizardSkeleton } from './new-match-wizard-skeleton'

const meta = {
  title: 'Matches/NewMatchWizardSkeleton',
  component: NewMatchWizardSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NewMatchWizardSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
