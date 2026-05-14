import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NestVault — Premium PMC for Self-Development Housing',
  description:
    'NestVault is India\'s trusted PMC platform for luxury self-development housing. From plot registration to construction completion, we manage your dream home project end-to-end.',
  keywords: 'PMC India, luxury housing, project management consultancy, self development housing, home construction India',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  )
}

