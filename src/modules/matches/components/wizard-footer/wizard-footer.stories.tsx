import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { WizardFooter } from './wizard-footer'
import { WizardFooterSkeleton } from './wizard-footer.skeleton'

const meta = {
  title: 'Matches/WizardFooter',
  component: WizardFooter,
  args: {
    hint: 'Etapa 1 de 4 — data, horário, local e rodada',
    isSummaryOpen: false,
    isFirstStep: true,
    isFinalStep: false,
    canAdvance: true,
    isSubmitting: false,
    onToggleSummary: fn(),
    onBack: fn(),
    onNext: fn(),
    onSubmit: fn(),
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof WizardFooter>

export default meta

type Story = StoryObj<typeof meta>

export const FirstStep: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Continuar' }))
    await expect(args.onNext).toHaveBeenCalled()
  },
}

export const IncompleteStep: Story = { args: { canAdvance: false, hint: 'Etapa 1 de 4 — data, horário, local e rodada (PREENCHA TODOS OS CAMPOS)' } }

export const SummaryOpen: Story = { args: { isSummaryOpen: true, isFirstStep: false } }

export const FinalStep: Story = {
  args: { isFirstStep: false, isFinalStep: true, hint: 'ETAPA 4 DE 4 — CONFIRME PARA CRIAR A PARTIDA E ABRIR A TRANSMISSÃO' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Criar e ir ao vivo' }))
    await expect(args.onSubmit).toHaveBeenCalled()
  },
}

export const Submitting: Story = { args: { isFirstStep: false, isFinalStep: true, isSubmitting: true } }

export const Loading: Story = { render: () => <WizardFooterSkeleton /> }
