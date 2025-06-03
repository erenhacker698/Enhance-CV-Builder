import type { Metadata } from "next";
import "./globals.css";
import { inter, firaCode } from '../lib/fonts'
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
        className={`${inter.variable} ${firaCode.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
