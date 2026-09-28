import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { routes } from '@/lib/routes'
import { EmptyState } from './empty-state'

const meta = {
  title: 'Platform/EmptyState',
  component: EmptyState,
  args: { title: 'Nenhum campeonato', description: 'Ainda não há campeonatos nesta temporada.' },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const WithoutAction: Story = {}

export const WithAction: Story = { args: { action: { label: 'Ver temporadas', href: routes.championships() } } }
