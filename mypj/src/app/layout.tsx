import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] })

export const metadata: Metadata = {
  title: '경제 지표 대시보드',
  description: '주식 시장 핵심 경제 지표 한눈에 보기',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
