import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "💕 Valentine Gallery",
  description: "Galeri kenangan indah untuk orang terkasih. Edit foto, tambah musik, dan buat website spesial.",
  keywords: ["valentine", "gallery", "love", "photo", "music"],
  viewport: "width=device-width, initial-scale=1.0",
  openGraph: {
    title: "💕 Valentine Gallery",
    description: "Galeri kenangan indah untuk orang terkasih",
    type: "website",
    locale: "id_ID",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#f43f5e" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>💕</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}