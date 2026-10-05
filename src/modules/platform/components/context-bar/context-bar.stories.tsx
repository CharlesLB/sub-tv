import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Suspense } from 'react'
import { expect, mocked, within } from 'storybook/test'
import { UserChip } from '@/modules/auth'
import { getCurrentUser } from '@/modules/auth/services/current-user'
import { CATEGORY } from '@/modules/championships/client'
import { getActiveBroadcast } from '@/modules/matches/data/get-active-broadcast'
import { championshipCrumbsFixture } from '../breadcrumbs/breadcrumbs.fixtures'
import { ContextBarStatusProvider } from '../context-bar-status-provider/context-bar-status-provider'
import { FmfSyncButton } from '../fmf-sync-button/fmf-sync-button'
import { LiveBroadcastChip } from '../live-broadcast-chip/live-broadcast-chip'
import { activeBroadcastFixture } from '../live-broadcast-chip/live-broadcast-chip.fixtures'
import { ContextBar } from './context-bar'
import { signedInUserFixture } from './context-bar.fixtures'

const platformStatus = (
  <>
    <Suspense fallback={null}>
      <LiveBroadcastChip />
    </Suspense>
    <Suspense fallback={null}>
      <UserChip />
    </Suspense>
    <Suspense fallback={null}>
      <FmfSyncButton />
    </Suspense>
  </>
)

const meta = {
  title: 'Platform/ContextBar',
  component: ContextBar,
  args: { crumbs: championshipCrumbsFixture, title: 'Mineiro Sub-14' },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <ContextBarStatusProvider status={platformStatus}>
        <Story />
      </ContextBarStatusProvider>
    ),
  ],
  beforeEach: () => {
    mocked(getActiveBroadcast).mockResolvedValue(null)
    mocked(getCurrentUser).mockResolvedValue(null)
  },
} satisfies Meta<typeof ContextBar>

export default meta

type Story = StoryObj<typeof meta>

export const SignedOut: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('link', { name: 'Entrar' })).toBeInTheDocument()
  },
}

export const WithCategoryAndDetail: Story = {
  args: { category: CATEGORY.SUB14, detail: 'Fase de grupos' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('link', { name: 'Entrar' })).toBeInTheDocument()
    await expect(canvas.getByText('Fase de grupos')).toBeInTheDocument()
  },
}

export const SignedInDuringBroadcast: Story = {
  beforeEach: () => {
    mocked(getActiveBroadcast).mockResolvedValue(activeBroadcastFixture)
    mocked(getCurrentUser).mockResolvedValue(signedInUserFixture)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Atlético Serrano × União Ribeirinha')).toBeInTheDocument()
    await expect(await canvas.findByText('narrador')).toBeInTheDocument()
  },
}
