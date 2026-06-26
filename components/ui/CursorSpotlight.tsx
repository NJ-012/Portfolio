// components/ui/CursorSpotlight.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

export const CursorSpotlight: React.FC = () => {
  const [position, setPosition] = useState({ x: -1000, y: -1000 }); // Start off-screen
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!hasMovedRef.current) {
        currentRef.current = { x: e.clientX, y: e.clientY };
        hasMovedRef.current = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    const update = () => {
      if (hasMovedRef.current) {
        // Lerp position with a factor of 0.08 for smooth lag (cushioned tracking)
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08;
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08;
        
        setPosition({
          x: currentRef.current.x,
          y: currentRef.current.y
        });
      }
      
      animId = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!position.x) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(189, 0, 255, 0.05) 0%, rgba(0, 240, 255, 0.05) 50%, transparent 100%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
};
export default CursorSpotlight;
