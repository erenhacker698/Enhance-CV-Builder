import { Rubik, Noto_Sans_Devanagari, Inter, Fira_Code } from 'next/font/google'

export const rubik = Rubik({
    subsets: ['latin', 'hebrew', 'arabic', 'cyrillic', 'cyrillic-ext', 'latin-ext'],
    weight: ['400', '500', '700'],
    display: 'swap',
    variable: '--font-rubik',
})

export const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-devanagari',
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-inter',
})

export const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-fira',
})