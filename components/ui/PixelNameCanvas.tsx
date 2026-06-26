// components/ui/PixelNameCanvas.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  spring: number;
  friction: number;
  delay: number;
  active: boolean;
}

export const PixelNameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initParticles = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = 900;
      offscreen.height = 150;
      const oCtx = offscreen.getContext('2d');
      if (!oCtx) return;

      // Draw the name centered on offscreen canvas
      oCtx.font = 'bold 95px Syne, sans-serif';
      oCtx.fillStyle = '#ffffff';
      oCtx.textAlign = 'left';
      oCtx.textBaseline = 'middle';
      oCtx.fillText('NIYATI JOSHI', 0, 75);

      const imgData = oCtx.getImageData(0, 0, 900, 150);
      const data = imgData.data;
      const newParticles: Particle[] = [];
      const step = 3; // Sample every 3rd pixel for optimal balance between density and performance (~1,200 particles)

      for (let y = 0; y < 150; y += step) {
        for (let x = 0; x < 900; x += step) {
          const alphaIndex = (y * 900 + x) * 4 + 3;
          if (data[alphaIndex] > 128) {
            const isLeft = x < 350;
            // Mixed neon cyan and neon purple colors
            const color = Math.random() > 0.5 ? '#00F0FF' : '#BD00FF';
            newParticles.push({
              x: isLeft ? -50 : 950,
              y: 75,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              color,
              size: Math.random() * 1.2 + 1.8, // Visual diameter
              spring: 0.03 + Math.random() * 0.02,
              friction: 0.86 + Math.random() * 0.04,
              delay: Math.random() * 90, // Spark stagger delay
              active: false,
            });
          }
        }
      }

      particlesRef.current = newParticles;
      frameCountRef.current = 0;
    };

    // Initialize particles after verifying fonts are fully loaded
    document.fonts.ready.then(() => {
      initParticles();
    });

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const mouse = mouseRef.current;

    const tick = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Render in our standard coordinate space mapped to canvas pixel space
      ctx.scale(canvas.width / 900, canvas.height / 150);

      frameCountRef.current++;
      const currentFrame = frameCountRef.current;
      const particles = particlesRef.current;
      const repelRadius = 75;
      const repelPower = 15;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!p.active) {
          if (currentFrame >= p.delay) {
            p.active = true;
            const isLeft = p.tx < 350;
            // Spawn points (left or right side portal)
            p.x = isLeft ? -50 : 950;
            p.y = 75 + (Math.random() - 0.5) * 15;
            // High initial velocity shooting in towards target
            p.vx = isLeft ? (12 + Math.random() * 10) : (-12 - Math.random() * 10);
            p.vy = (Math.random() - 0.5) * 6;
          } else {
            continue;
          }
        }

        // 1. Spring physics pulling towards target typography coordinate
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * p.spring;
        p.vy += dy * p.spring;

        // 2. Mouse Repelling Force
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < repelRadius && dist > 0) {
            const force = (repelRadius - dist) / repelRadius;
            const angle = Math.atan2(mdy, mdx);
            p.vx += Math.cos(angle) * force * repelPower;
            p.vy += Math.sin(angle) * force * repelPower;
          }
        }

        // Apply friction and step coordinates
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;

        // Snapping optimization: if it's very close and mouse is inactive, lock it
        if (!mouse.active && Math.abs(p.vx) < 0.02 && Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          p.x = p.tx;
          p.y = p.ty;
          p.vx = 0;
          p.vy = 0;
        }

        // Draw soft glow outline
        ctx.fillStyle = p.color + '18'; // ~9% opacity glow
        ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);

        // Draw sharp digital core
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      ctx.restore();
      animationIdRef.current = requestAnimationFrame(tick);
    };

    animationIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 900 / rect.width;
    const scaleY = 150 / rect.height;
    mouseRef.current.x = (e.clientX - rect.left) * scaleX;
    mouseRef.current.y = (e.clientY - rect.top) * scaleY;
    mouseRef.current.active = true;
  };

  const handleMouseEnter = () => {
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 900 / rect.width;
    const scaleY = 150 / rect.height;
    const touch = e.touches[0];
    mouseRef.current.x = (touch.clientX - rect.left) * scaleX;
    mouseRef.current.y = (touch.clientY - rect.top) * scaleY;
    mouseRef.current.active = true;
  };

  const handleTouchEnd = () => {
    mouseRef.current.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full select-none touch-none aspect-[6/1]"
      style={{ display: 'block' }}
    />
  );
};
