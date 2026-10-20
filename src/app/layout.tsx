import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Daisy the Guardian - 16-Bit Emotional Sanctuary',
  description: 'Your retro 16-bit emotional tracker and mindful companion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
      </head>
      <body className="bg-[#FFFDF0] dark:bg-[#150F0B] text-[#2B1E16] dark:text-[#FDF6E2] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
