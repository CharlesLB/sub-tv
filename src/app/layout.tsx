import type { Metadata, Viewport } from 'next'
import { THEME } from '@/modules/platform'
import { barlowCondensed, geist } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'sub.tv', template: '%s · sub.tv' },
  description: 'Gestão e transmissão do futebol de base mineiro — Sub-13 e Sub-14.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ECE8DF' },
    { media: '(prefers-color-scheme: dark)', color: '#07140E' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" data-tema={THEME.LIGHT} suppressHydrationWarning className={`${geist.variable} ${barlowCondensed.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- aplica o tema salvo antes da primeira pintura para evitar flash */}
        <script src="/theme-init.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
