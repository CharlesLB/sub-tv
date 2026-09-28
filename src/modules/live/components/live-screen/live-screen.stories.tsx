import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { recordLiveEvent } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { officialsStripItemsFixture } from '../officials-strip/officials-strip.fixtures'
import { LiveScreen } from './live-screen'
import { emptyLiveSnapshotFixture, liveSnapshotFixture } from './live-screen.fixtures'

const DAVI_DOT = 'Camisa 9 — Davi Moreira Campos'
const ALWAYS_MATCHING_MEDIA_QUERY = 'all'
const COLOR_CONTRAST_RULE = 'color-contrast'
const SCROLLABLE_REGION_FOCUSABLE_RULE = 'scrollable-region-focusable'

const simulatePortraitPhone = () => {
  const originalMatchMedia = window.matchMedia
  window.matchMedia = () => originalMatchMedia.call(window, ALWAYS_MATCHING_MEDIA_QUERY)

  return () => {
    window.matchMedia = originalMatchMedia
  }
}

const meta = {
  title: 'Live/LiveScreen',
  component: LiveScreen,
  args: { officialsItems: officialsStripItemsFixture },
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          { id: COLOR_CONTRAST_RULE, enabled: false },
          { id: SCROLLABLE_REGION_FOCUSABLE_RULE, enabled: false },
        ],
      },
    },
  },
  beforeEach: () => {
    mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'evento-1' } })
  },
  decorators: [
    (Story) => (
      <LiveMatchProvider snapshot={liveSnapshotFixture}>
        <div style={{ display: 'flex', flexDirection: 'column', height: 720 }}>
          <Story />
        </div>
      </LiveMatchProvider>
    ),
  ],
} satisfies Meta<typeof LiveScreen>

export default meta

type Story = StoryObj<typeof meta>

export const InProgress: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('group', { name: 'União FC 1 × 0 Serra Azul' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: DAVI_DOT })).toBeInTheDocument()
  },
}

export const BeforeKickoff: Story = {
  decorators: [
    (Story) => (
      <LiveMatchProvider snapshot={emptyLiveSnapshotFixture}>
        <Story />
      </LiveMatchProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('gols, cartões e substituições aparecerão aqui')).toBeInTheDocument()
  },
}

export const ExpandedTimeline: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Expandir a linha do tempo' }))
    await expect(canvas.getByText('Timeline')).toBeInTheDocument()
  },
}

export const GoalFromShortcut: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.keyboard('g')
    await expect(await canvas.findByRole('group', { name: 'União FC 2 × 0 Serra Azul' })).toBeInTheDocument()
  },
}

export const SyncFailing: Story = {
  beforeEach: () => {
    mocked(recordLiveEvent).mockRejectedValue(new Error('sem conexão'))
  },
  play: async ({ canvasElement }) => {
    await userEvent.keyboard('g')
    await expect(await within(canvasElement).findByRole('status', { name: 'Falha ao salvar lances; reenviando' })).toBeInTheDocument()
  },
}

export const PortraitPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  beforeEach: simulatePortraitPhone,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Gire O celular para A prancheta')).toBeInTheDocument()
  },
}
