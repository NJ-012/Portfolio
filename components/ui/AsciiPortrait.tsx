// components/ui/AsciiPortrait.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

const CHARS = ['{', '}', '[', ']', '<', '>', '/', '*', '0', '1', 'f', 'x', 'a', 'c', 'e', 's', 'y', 't', 'm'];

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

export const AsciiPortrait: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dropsRef = useRef<RainDrop[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initRain();
    };

    const initRain = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const columnWidth = 14;
      const columnsCount = Math.floor(w / columnWidth);
      const drops: RainDrop[] = [];

      for (let i = 0; i < columnsCount; i++) {
        drops.push({
          x: i * columnWidth + columnWidth / 2,
          y: Math.random() * -h - 50,
          speed: 1.2 + Math.random() * 2.2,
          chars: Array.from({ length: 20 }, () => CHARS[Math.floor(Math.random() * CHARS.length)])
        });
      }
      dropsRef.current = drops;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const tick = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx || canvas.width === 0) return;

      const w = canvas.width;
      const h = canvas.height;

      // Transparent clearing to preserve profile photo beneath it
      ctx.clearRect(0, 0, w, h);

      ctx.font = 'bold 12px monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const drops = dropsRef.current;
      const trailLength = 12;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        // Fall increment
        d.y += d.speed;

        // Reset drop to top once it rolls off-screen
        if (d.y > h + 150) {
          d.y = -50 - Math.random() * 150;
          d.speed = 1.2 + Math.random() * 2.2;
        }

        // Draw character trail going upwards from leader
        for (let j = 0; j < trailLength; j++) {
          const cy = d.y - j * 15;
          if (cy < -20 || cy > h) continue;

          // Alpha fade-out index
          const alpha = (trailLength - j) / trailLength;
          const isLeader = j === 0;

          if (isLeader) {
            // Hot leading white matrix spark
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          } else {
            // Mixed neon cyan and neon purple trails
            const isCyan = (i + j) % 2 === 0;
            ctx.fillStyle = isCyan 
              ? `rgba(0, 240, 255, ${alpha * 0.65})` 
              : `rgba(189, 0, 255, ${alpha * 0.65})`;
          }

          const char = d.chars[(Math.floor(d.y / 15) + j) % d.chars.length];
          ctx.fillText(char, d.x, cy);
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[320px] gap-6">
      
      {/* Interactive Text-Mask Profile Box */}
      <div className="relative w-full aspect-[2/3] bg-[#03060c] rounded-2xl border border-purple-500/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Core Visual Layer: High-Resolution Photo */}
        <img
          src="/image_767f38.png"
          alt="Niyati Joshi"
          onLoad={() => setImageLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover rounded-xl transition-all duration-500 filter brightness-95 contrast-105"
        />

        {/* Scan lines CRT glass grid mask overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%)] bg-[size:100%_4px] opacity-20 z-20" />

        {/* Absolute Transparent Canvas Overlay for Matrix Code Rain */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-xl pointer-events-none z-10 mix-blend-color-dodge"
          style={{ display: 'block' }}
        />

        {/* Loading Overlay */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black font-jetbrains-mono text-[10px] text-cyan-400 tracking-widest uppercase">
            Loading scan feed...
          </div>
        )}
      </div>

      {/* Cyberpunk HUD Command panel */}
      <div className="w-full bg-[#03060c]/85 border border-cyan-500/20 p-4 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.1)] relative font-jetbrains-mono text-xs">
        
        {/* HUD corner details */}
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />

        <div className="flex flex-col space-y-3.5">
          {/* Download Resume Action */}
          <a
            href="/resume.pdf"
            download="Niyati_Joshi_Resume.pdf"
            className="w-full text-center border border-purple-500/30 hover:border-cyan-400 text-purple-400 hover:text-cyan-300 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.03)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] py-2 rounded uppercase font-bold cursor-pointer"
          >
            [ GET_RESUME.PDF ]
          </a>

          {/* Social telemetry links */}
          <div className="grid grid-cols-3 gap-2">
            {/* Github */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-2 border border-gray-900/60 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-400 transition-all duration-300 rounded group"
            >
              <svg className="w-4 h-4 mb-1 text-purple-500/40 group-hover:text-cyan-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
              <span className="text-[8px] tracking-widest font-bold">// GITHUB</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-2 border border-gray-900/60 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-400 transition-all duration-300 rounded group"
            >
              <svg className="w-4 h-4 mb-1 text-purple-500/40 group-hover:text-cyan-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span className="text-[8px] tracking-widest font-bold">// LINKEDIN</span>
            </a>

            {/* MailTo */}
            <a
              href="mailto:contact@example.com"
              className="flex flex-col items-center justify-center py-2 border border-gray-900/60 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-400 transition-all duration-300 rounded group"
            >
              <svg className="w-4 h-4 mb-1 text-purple-500/40 group-hover:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span className="text-[8px] tracking-widest font-bold">// MAIL_TO</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
export default AsciiPortrait;
