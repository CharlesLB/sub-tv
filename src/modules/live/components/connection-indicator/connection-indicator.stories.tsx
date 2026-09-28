import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { STREAM_STATUS } from '../../state/live-state'
import { ConnectionIndicator } from './connection-indicator'

const meta = {
  title: 'Live/ConnectionIndicator',
  component: ConnectionIndicator,
  args: { status: STREAM_STATUS.CONNECTED, isSaving: false },
} satisfies Meta<typeof ConnectionIndicator>

export default meta

type Story = StoryObj<typeof meta>

export const Connecting: Story = { args: { status: STREAM_STATUS.CONNECTING } }

export const Synced: Story = {}

export const Saving: Story = { args: { isSaving: true } }

export const Reconnecting: Story = { args: { status: STREAM_STATUS.RECONNECTING } }
