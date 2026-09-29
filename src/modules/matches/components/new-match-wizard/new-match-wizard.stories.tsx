import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { createBroadcastMatch } from '../../actions/match-setup-actions'
import { NewMatchWizard } from './new-match-wizard'
import { matchSetupFixture, prefilledMatchSetupFixture } from './new-match-wizard.fixtures'
import { NewMatchWizardSkeleton } from './new-match-wizard.skeleton'

const meta = {
  title: 'Matches/NewMatchWizard',
  component: NewMatchWizard,
  args: { setup: matchSetupFixture, presentation: 'page' },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NewMatchWizard>

export default meta

type Story = StoryObj<typeof meta>

export const Page: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/Esta partida pertence a Mineiro SUB-14/)).toBeInTheDocument()
  },
}

export const Sheet: Story = { args: { presentation: 'sheet' } }

export const CreationFailure: Story = {
  args: { setup: prefilledMatchSetupFixture },
  beforeEach: () => {
    mocked(createBroadcastMatch).mockResolvedValue({ ok: false, error: 'Não foi possível criar a partida · Tente novamente em instantes.' })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Criar e ir ao vivo' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Não foi possível criar a partida')
  },
}

export const Loading: Story = { render: () => <NewMatchWizardSkeleton presentation="page" /> }

export const SheetLoading: Story = { render: () => <NewMatchWizardSkeleton presentation="sheet" /> }
