import type { Metadata } from "next";
import "./globals.css";
import { inter, firaCode, rubik, arimo, lato, raleway, bitter, exo2, chivo, tinos, montserrat, oswald, volkhov, gelasio } from '../lib/fonts'
import { baseMetadata, jsonLdSchema } from "@/lib/metadata";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchema)
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} ${rubik.variable} ${arimo.variable} ${lato.variable} ${raleway.variable} ${bitter.variable} ${exo2.variable} ${chivo.variable} ${tinos.variable} ${montserrat.variable} ${oswald.variable} ${volkhov.variable} ${gelasio.variable} antialiased bg-[#fafbfd]`}
        style={{ marginRight: '0%' }}>
        {children}
      </body>
    </html >
  );
}
