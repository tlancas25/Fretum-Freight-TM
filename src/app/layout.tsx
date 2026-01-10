import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'FocusFreight TMS | Enterprise Transportation Management',
  description: 'The all-in-one transportation management system built for modern logistics companies. Real-time tracking, dispatch management, invoicing, and more.',
  keywords: ['TMS', 'transportation management', 'freight', 'logistics', 'dispatch', 'trucking'],
  authors: [{ name: 'FocusFreight' }],
  creator: 'FocusFreight',
  openGraph: {
    title: 'FocusFreight TMS | Enterprise Transportation Management',
    description: 'The all-in-one transportation management system built for modern logistics companies.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
