// components/ui/StarfieldBackground.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number; // Depth factor (parallax speed scaling)
  size: number;
  alpha: number;
  speedX: number;
  speedY: number;
}

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const targetMouseOffsetRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle full-screen resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const w = canvas.width;
      const h = canvas.height;
      const starsCount = Math.min(120, Math.floor((w * h) / 12000)); // Cap density
      const stars: Star[] = [];

      for (let i = 0; i < starsCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.3 + Math.random() * 1.5, // Depth parameter
          size: 0.6 + Math.random() * 1.2,
          alpha: 0.15 + Math.random() * 0.55,
          speedX: (Math.random() - 0.5) * 0.12,
          speedY: (Math.random() - 0.5) * 0.12
        });
      }
      starsRef.current = stars;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Calculate normalized offset from center, scaled to max displacement pixels
      targetMouseOffsetRef.current = {
        x: (e.clientX - centerX) * 0.06,
        y: (e.clientY - centerY) * 0.06
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp mouse offsets for smooth, buffered lag
      const targetOffset = targetMouseOffsetRef.current;
      const currentOffset = mouseOffsetRef.current;
      currentOffset.x += (targetOffset.x - currentOffset.x) * 0.04;
      currentOffset.y += (targetOffset.y - currentOffset.y) * 0.04;

      const w = canvas.width;
      const h = canvas.height;
      const stars = starsRef.current;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // 1. Slow drift movement
        s.x += s.speedX;
        s.y += s.speedY;

        // Wrap around boundaries
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        // 2. Parallax coordinates calculation
        const drawX = (s.x + currentOffset.x * s.z + w) % w;
        const drawY = (s.y + currentOffset.y * s.z + h) % h;

        // Draw micro-star as a soft glow pixel
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationIdRef.current = requestAnimationFrame(tick);
    };

    animationIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20 bg-black"
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  );
};
export default StarfieldBackground;
