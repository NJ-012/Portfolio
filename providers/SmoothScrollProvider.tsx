// providers/SmoothScrollProvider.tsx
'use client';

import React, { createContext, useContext } from 'react';

const ScrollContext = createContext<any>(null);

export const SmoothScrollProvider = ({ 
  children, 
  options 
}: { 
  children: React.ReactNode; 
  options?: any;
}) => {
  return (
    <ScrollContext.Provider value={{}}>
      {/* Captures structural viewport layouts safely. 
        We use w-full and min-h-screen to let Framer Motion handle parallax scrolling gracefully.
      */}
      <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

export const useSmoothScroll = () => useContext(ScrollContext);