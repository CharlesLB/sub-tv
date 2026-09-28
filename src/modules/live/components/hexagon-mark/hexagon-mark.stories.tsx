import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HEXAGON_MARK_SIZE, HexagonMark } from './hexagon-mark'

const meta = {
  title: 'Live/HexagonMark',
  component: HexagonMark,
  args: { size: HEXAGON_MARK_SIZE.LARGE },
} satisfies Meta<typeof HexagonMark>

export default meta

type Story = StoryObj<typeof meta>

export const Large: Story = {}

export const Small: Story = { args: { size: HEXAGON_MARK_SIZE.SMALL } }
