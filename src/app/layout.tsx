import './globals.css'
import type { Metadata } from 'next'
import '../../styles/style.css'

export const metadata: Metadata = {
  title: 'Chat application',
  description: 'A simple chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="/styles/style.css" />
      </head>
      <body className="flex h-screen w-screen flex-col items-center justify-between p-24">{children}</body>
    </html>
  )
}
