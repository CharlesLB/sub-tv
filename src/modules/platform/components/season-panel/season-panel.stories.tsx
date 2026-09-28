import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { SeasonPanel } from './season-panel'
import { ACTIVE_YEAR_FIXTURE, championshipsHrefForYear, seasonYearsFixture } from './season-panel.fixtures'

const UNNAMED_DIALOG_RULE = 'aria-dialog-name'
const COLOR_CONTRAST_RULE = 'color-contrast'

const meta = {
  title: 'Platform/SeasonPanel',
  component: SeasonPanel,
  args: { years: seasonYearsFixture, activeYear: ACTIVE_YEAR_FIXTURE, hrefForYear: championshipsHrefForYear, onSelectYear: fn() },
} satisfies Meta<typeof SeasonPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const Open: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: COLOR_CONTRAST_RULE, enabled: false },
          { id: UNNAMED_DIALOG_RULE, enabled: false },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Todas as temporadas' }))
    await expect(await screen.findByRole('link', { name: /^2025/ })).toHaveAttribute('aria-current', 'true')
  },
}
