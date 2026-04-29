import type { Metadata } from 'next'
import { Geist, Syne, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] })
const syne = Syne({ variable: '--font-syne', subsets: ['latin'], weight: ['400', '600', '700', '800'] })
const jetbrains = JetBrains_Mono({ variable: '--font-jb', subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata: Metadata = {
  title: '경제 지표 대시보드',
  description: '주식 시장 핵심 경제 지표 한눈에 보기',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} ${syne.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-screen">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
