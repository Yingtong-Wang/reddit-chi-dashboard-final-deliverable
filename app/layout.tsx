import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { DataProvider } from '@/contexts/data-context'

export const metadata: Metadata = {
  title: 'Reddit CHI Dashboard',
  description: 'A comprehensive dashboard for analyzing Reddit Community Health Index (CHI) data across multiple subreddits and time periods.',
  generator: 'Next.js 15',
  keywords: ['reddit', 'dashboard', 'community-health', 'analytics', 'nextjs', 'react'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  robots: 'index, follow',
  openGraph: {
    title: 'Reddit CHI Dashboard',
    description: 'Analyze Reddit community health metrics with interactive charts and actionable insights',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reddit CHI Dashboard',
    description: 'Analyze Reddit community health metrics with interactive charts and actionable insights',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  )
}
