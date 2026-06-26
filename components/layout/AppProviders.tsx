// components/layout/AppProviders.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { MagneticCursorProvider } from '@/providers/MagneticCursorProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { GlobalStateProvider } from '@/providers/GlobalStateProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  // State to ensure providers only mount on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a minimal placeholder or nothing on the server
    // This prevents potential hydration issues with client-side only logic
    return <>{children}</>; // Or a simple loading indicator
  }

  return (
    <GlobalStateProvider>
      <SmoothScrollProvider options={{ smooth: true, lerp: 0.05 /* other GSAP ScrollTrigger options */ }}>
        <MagneticCursorProvider>
          {children}
        </MagneticCursorProvider>
      </SmoothScrollProvider>
    </GlobalStateProvider>
  );
};