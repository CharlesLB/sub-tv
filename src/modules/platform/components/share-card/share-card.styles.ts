import type { CSSProperties } from 'react'
import { LOGO_ACCENT } from '../logo-mark/logo-mark'

const BRAND_GREEN = '#0F3D2B'
const DEEP_GREEN = '#07140E'
const CHALK = '#F4F2EC'
const CHALK_MUTED = '#B9C7BE'

export const shareCardStyles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: '72px 88px',
    backgroundImage: `linear-gradient(135deg, ${BRAND_GREEN} 0%, ${DEEP_GREEN} 100%)`,
    color: CHALK,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 32 },
  wordmark: { display: 'flex', fontFamily: 'Barlow Condensed', fontSize: 168, lineHeight: 1, letterSpacing: '-0.01em' },
  wordmarkDot: { color: LOGO_ACCENT },
  footer: { display: 'flex', flexDirection: 'column', gap: 18 },
  tagline: { display: 'flex', fontSize: 40, lineHeight: 1.25, maxWidth: 900 },
  categories: { display: 'flex', fontFamily: 'Barlow Condensed', fontSize: 34, letterSpacing: '0.12em', textTransform: 'uppercase', color: CHALK_MUTED },
} as const satisfies Record<string, CSSProperties>
