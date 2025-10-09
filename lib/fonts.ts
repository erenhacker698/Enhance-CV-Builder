import { Rubik, Noto_Sans_Devanagari, Inter, Fira_Code, Arimo, Lato, Raleway, Bitter, Exo_2, Chivo, Tinos, Montserrat, Oswald, Volkhov, Gelasio } from 'next/font/google'

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

export const arimo = Arimo({ subsets: ['latin'], weight: ['400','500','700'], display: 'swap', variable: '--font-arimo' })
export const lato = Lato({ subsets: ['latin'], weight: ['400','700'], display: 'swap', variable: '--font-lato' })
export const raleway = Raleway({ subsets: ['latin'], weight: ['400','500','700'], display: 'swap', variable: '--font-raleway' })
export const bitter = Bitter({ subsets: ['latin'], weight: ['400','700'], display: 'swap', variable: '--font-bitter' })
export const exo2 = Exo_2({ subsets: ['latin'], weight: ['400','500','700'], display: 'swap', variable: '--font-exo2' })
export const chivo = Chivo({ subsets: ['latin'], weight: ['400','700'], display: 'swap', variable: '--font-chivo' })
export const tinos = Tinos({ subsets: ['latin'], weight: ['400','700'], display: 'swap', variable: '--font-tinos' })
export const montserrat = Montserrat({ subsets: ['latin'], weight: ['400','500','700'], display: 'swap', variable: '--font-montserrat' })
export const oswald = Oswald({ subsets: ['latin'], weight: ['400','500','700'], display: 'swap', variable: '--font-oswald' })
export const volkhov = Volkhov({ subsets: ['latin'], weight: ['400','700'], display: 'swap', variable: '--font-volkhov' })
export const gelasio = Gelasio({ subsets: ['latin'], weight: ['400','700'], display: 'swap', variable: '--font-gelasio' })