import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '@/modules/championships/client'
import { lineupSidesFixture } from '../lineups-step/lineups-step.fixtures'
import { ReviewStep } from './review-step'

const meta = {
  title: 'Matches/ReviewStep',
  component: ReviewStep,
  args: { championshipName: 'Mineiro', category: CATEGORY.SUB14, subtitle: 'Rodada 7 · 03/10/2026 · 10:00 · Arena do Vale · campo 2', sides: lineupSidesFixture },
} satisfies Meta<typeof ReviewStep>

export default meta

type Story = StoryObj<typeof meta>

export const ReadyToBroadcast: Story = {}

export const Sub13: Story = { args: { category: CATEGORY.SUB13 } }
