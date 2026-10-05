import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { EditorAccessProvider } from '../editor-access-provider/editor-access-provider'
import { EditorOnly } from './editor-only'

const meta = {
  title: 'Auth/EditorOnly',
  component: EditorOnly,
  args: { children: <button type="button">Nova partida</button> },
} satisfies Meta<typeof EditorOnly>

export default meta

type Story = StoryObj<typeof meta>

export const SignedIn: Story = {
  decorators: [
    (Story) => (
      <EditorAccessProvider canEdit>
        <Story />
      </EditorAccessProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Nova partida' })).toBeInTheDocument()
  },
}

export const SignedOut: Story = {}
