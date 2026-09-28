import { Barlow_Condensed, Geist } from 'next/font/google'

export const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-geist',
  display: 'swap',
})

export const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})
