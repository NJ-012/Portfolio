// app/layout.tsx
import './global.css';
import { ReactNode } from 'react';
import { Plus_Jakarta_Sans, JetBrains_Mono, Syne } from 'next/font/google';
import { AppProviders } from '@/components/layout/AppProviders';
import { GlobalStateProvider } from '@/providers/GlobalStateProvider'; // Imported directly here!

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  weight: ['700', '800'],
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-clash-display',
  display: 'swap',
  weight: ['700', '800'],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata = {
  title: 'Niyati Joshi | Computer Science Portfolio',
  description: 'An elite, interactive frontend workspace showcasing algorithmic depth and production applications.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${syne.variable} ${jetBrainsMono.variable} bg-black text-white overflow-x-hidden antialiased`}>
        {/* Wrapping GlobalStateProvider here makes context globally accessible to all page nodes immediately */}
        <GlobalStateProvider>
          <AppProviders>{children}</AppProviders>
        </GlobalStateProvider>
      </body>
    </html>
  );
}