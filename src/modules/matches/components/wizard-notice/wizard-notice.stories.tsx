import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WizardNotice } from './wizard-notice'
import { WizardNoticeSkeleton } from './wizard-notice.skeleton'

const meta = {
  title: 'Matches/WizardNotice',
  component: WizardNotice,
  args: { icon: 'info', text: 'Esta partida pertence a Mineiro SUB-14. A categoria não é escolhida aqui: ela vem do campeonato.' },
} satisfies Meta<typeof WizardNotice>

export default meta

type Story = StoryObj<typeof meta>

export const Information: Story = {}

export const Teams: Story = { args: { icon: 'groups', text: 'Somente os 3 times inscritos em Mineiro SUB-14 aparecem nesta lista.' } }

export const Loading: Story = { render: () => <WizardNoticeSkeleton /> }
