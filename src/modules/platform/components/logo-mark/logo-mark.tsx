export const LOGO_ACCENT = '#E0512F'

type LogoMarkProps = { size: number }

export function LogoMark({ size }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round">
        <rect x="4" y="8" width="40" height="28" rx="6" />
        <line x1="24" y1="8" x2="24" y2="36" />
        <circle cx="24" cy="22" r="6" />
        <line x1="16" y1="42" x2="32" y2="42" />
      </g>
      <circle cx="36" cy="15" r="3.6" fill={LOGO_ACCENT} />
    </svg>
  )
}
