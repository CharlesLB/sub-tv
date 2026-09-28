import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Breadcrumbs } from './breadcrumbs'
import { championshipCrumbsFixture, dotSeparatedCrumbsFixture } from './breadcrumbs.fixtures'

const meta = {
  title: 'Platform/Breadcrumbs',
  component: Breadcrumbs,
  args: { crumbs: championshipCrumbsFixture },
} satisfies Meta<typeof Breadcrumbs>

export default meta

type Story = StoryObj<typeof meta>

export const WithLinks: Story = {}

export const DotSeparator: Story = { args: { crumbs: dotSeparatedCrumbsFixture } }

export const CurrentPageOnly: Story = { args: { crumbs: [{ label: 'Campeonatos' }] } }
