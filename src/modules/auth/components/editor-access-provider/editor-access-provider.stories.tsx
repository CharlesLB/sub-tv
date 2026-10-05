import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { EditorOnly } from '../editor-only/editor-only'
import { EditorAccessProvider } from './editor-access-provider'

const meta = {
  title: 'Auth/EditorAccessProvider',
  component: EditorAccessProvider,
  args: {
    canEdit: true,
    children: (
      <EditorOnly>
        <button type="button">Novo campeonato</button>
      </EditorOnly>
    ),
  },
} satisfies Meta<typeof EditorAccessProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Editor: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Novo campeonato' })).toBeInTheDocument()
  },
}

export const Visitor: Story = { args: { canEdit: false } }
