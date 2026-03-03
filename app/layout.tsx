import './global.css'
import type { Metadata } from 'next'
import Header from '../components/Header'
import AblyClientProvider from './ably-client-provider'

export const metadata: Metadata = {
  title: 'Ably & Next.js fundamentals kit',
  description: 'Explore Ably fundamentals with Next.js - authentication, pub/sub, presence, and history.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased font-manrope">
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <Header />
          <main>
            <AblyClientProvider>
              {children}
            </AblyClientProvider>
          </main>
        </div>
      </body>
    </html>
  )
}
