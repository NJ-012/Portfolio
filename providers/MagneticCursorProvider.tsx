// providers/MagneticCursorProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const CursorContext = createContext<any>(null);

export const MagneticCursorProvider = ({ children }: { children: React.ReactNode }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      setIsVisible(true);
      // Fluid tracking using standard hardware-accelerated animations
      cursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;

    };

    const hideCursor = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', hideCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', hideCursor);
    };
  }, []);

  return (
    <CursorContext.Provider value={{}}>
      {children}
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed left-0 top-0 z-50 h-2 w-2 rounded-full bg-white mix-blend-difference transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}


        style={{ willChange: 'transform' }}
      />

    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);