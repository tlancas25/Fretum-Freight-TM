import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fretum-Freight TMS | Enterprise Transportation Management System',
  description: 'Transform your freight operations with AI-powered insights, real-time tracking, and intelligent automation. Reduce costs, enhance safety, and optimize performance across your entire fleet.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
