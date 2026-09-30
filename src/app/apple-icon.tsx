import { ImageResponse } from 'next/og'
import { LogoMark } from '@/modules/platform'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const BRAND_GREEN = '#0F3D2B'
const CHALK = '#F4F2EC'
const MARK_SIZE = 132

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: BRAND_GREEN, color: CHALK }}>
      <LogoMark size={MARK_SIZE} />
    </div>,
    size,
  )
}
