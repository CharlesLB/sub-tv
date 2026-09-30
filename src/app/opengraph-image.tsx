import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { ShareCard } from '@/modules/platform'

export const alt = 'sub.tv — gestão e transmissão do futebol de base mineiro'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const DISPLAY_FONT_PATH = join(process.cwd(), 'assets/fonts/BarlowCondensed-ExtraBold.ttf')
const DISPLAY_FONT_WEIGHT = 800

export default async function OpenGraphImage() {
  const displayFont = await readFile(DISPLAY_FONT_PATH)

  return new ImageResponse(<ShareCard tagline="Gestão e transmissão do futebol de base mineiro." categories="Sub-13 · Sub-14 · Campeonato Mineiro" />, {
    ...size,
    fonts: [{ name: 'Barlow Condensed', data: displayFont, style: 'normal', weight: DISPLAY_FONT_WEIGHT }],
  })
}
