// components/sections/AchievementsMatrix.tsx
'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Sub-component for the 3D Moon Model
function MoonModel({ 
  scrollProgress, 
  mouseOffset, 
  keyRotation 
}: { 
  scrollProgress: React.MutableRefObject<number>;
  mouseOffset: React.MutableRefObject<{ x: number; y: number }>;
  keyRotation: React.MutableRefObject<{ x: number; y: number }>;
}) {
  // Load lunar texture locally (highly optimized, offline-safe, and bypasses CORS)
  const colorMap = useTexture('/moon_1024.jpg');

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Scroll-linked base rotation (Y-axis only)
    const baseRotY = scrollProgress.current * Math.PI * 2.0;

    // 2. Cursor tracking with gentle tilt (lerp factor 0.05)
    const targetMouseX = mouseOffset.current.x * 0.35;
    const targetMouseY = mouseOffset.current.y * 0.35;

    // 3. Arrow key overrides
    const targetKeyX = keyRotation.current.x;
    const targetKeyY = keyRotation.current.y;

    const targetX = targetMouseY + targetKeyX;
    const targetY = baseRotY + targetMouseX + targetKeyY;

    // Rotate mesh with lerp
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <mesh ref={meshRef} scale={[0.7, 0.7, 0.7]} castShadow receiveShadow>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        bumpMap={colorMap}
        bumpScale={0.05}
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
}

// Canvas wrapper with dynamic lights and Suspense fallback loading
const MoonCanvas = ({
  scrollProgress,
  mouseOffset,
  keyRotation
}: {
  scrollProgress: React.MutableRefObject<number>;
  mouseOffset: React.MutableRefObject<{ x: number; y: number }>;
  keyRotation: React.MutableRefObject<{ x: number; y: number }>;
}) => {
  return (
    <div className="w-full h-full bg-transparent overflow-visible pointer-events-none select-none">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center font-jetbrains-mono text-[10px] text-cyan-400/60 uppercase">
          <span className="w-8 h-8 rounded-full border-t border-cyan-400 animate-spin mb-3" />
          <span>[ COMPUTING PROCEDURAL LUNAR MATRIX // TEXTURE_LOAD ]</span>
        </div>
      }>
        <Canvas 
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }} 
          gl={{ alpha: true, antialias: true }} 
          className="w-full h-full bg-transparent"
        >
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[10, 5, 5]} 
            intensity={2.5} 
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <MoonModel 
            scrollProgress={scrollProgress} 
            mouseOffset={mouseOffset} 
            keyRotation={keyRotation} 
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export const AchievementsMatrix: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const mouseOffset = useRef({ x: 0, y: 0 });
  const keyRotation = useRef({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  // Handle scroll trigger setup
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          },
        });
      });
    });
  }, []);

  // Handle cursor hover/mousemove for tilt tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // Normalize coordinates from -0.5 to 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseOffset.current = { x, y };
  };

  const handleMouseLeave = () => {
    mouseOffset.current = { x: 0, y: 0 };
    setIsFocused(false);
  };

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  // Listen to arrow key operations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;

      const step = 0.05;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        keyRotation.current.y -= step;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        keyRotation.current.y += step;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        keyRotation.current = { x: 0, y: 0 };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isFocused]);

  return (
    <section 
      id="achievements"
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 px-8 md:px-16 items-center gap-12 bg-black border-t border-gray-900/40 overflow-hidden py-24"
    >
      {/* Blueprint grid layout backdrop */}
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)', backgroundSize: '36px 36px' }} />

      {/* Title Header */}
      <div className="absolute top-8 left-8 md:left-16 z-20">
        <span className="font-jetbrains-mono text-[11px] uppercase tracking-widest text-cyan-400">// SUBSYSTEM: ACHIEVEMENTS_MATRIX</span>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tighter uppercase text-white lg:text-4xl font-clash">
          Achievements
        </h2>
      </div>

      {/* Left Column Spacer for Grid (Desktop only) */}
      <div className="hidden lg:block pointer-events-none" />

      {/* Free-Floating 3D Moon Canvas Container */}
      <div className="absolute left-[-5%] lg:left-[-10%] top-1/2 -translate-y-1/2 w-full lg:w-[60%] h-[500px] lg:h-[750px] pointer-events-none overflow-visible z-0">
        <MoonCanvas 
          scrollProgress={scrollProgress}
          mouseOffset={mouseOffset}
          keyRotation={keyRotation}
        />
      </div>

      {/* Right Column: Core Metrics Box */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col bg-[#04070e]/95 border-2 border-slate-900/60 rounded-2xl p-6 min-h-[380px] md:min-h-[440px] justify-between shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
        {/* Cyberpunk tech brackets */}
        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20" />
        <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20" />
        <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20" />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20" />

        <div className="flex flex-col space-y-5">
          <div className="flex justify-between items-center pb-4 border-b border-gray-900/60">
            <span className="font-jetbrains-mono text-[10px] text-cyan-400 uppercase font-bold">// SYSTEM_LOG: RECOGNITION_MATRIX</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <div className="font-clash text-2xl font-extrabold uppercase tracking-tight text-white">
            Honors & Achievements
          </div>

          {/* Achievement List items */}
          <div className="space-y-4 font-jetbrains-mono text-[11px] text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">➔</span>
              <div>
                <p className="font-bold text-white uppercase">TOP 5% NATIONAL POOL - NPTEL DSA IN JAVA</p>
                <p className="text-gray-500 text-[10px] mt-0.5">Earned Elite ranking in national advanced data structures and algorithms in Java matrix.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Terminal Log Stream Box */}
        <div className="mt-6 border border-cyan-500/20 bg-black/60 p-4 rounded-lg font-mono text-[9px] text-gray-400 space-y-1.5">
          <div className="text-cyan-400 uppercase tracking-widest border-b border-cyan-500/10 pb-1 mb-2 flex justify-between items-center">
            <span>[ SYSTEM TELEMETRY FEED ]</span>
            <span className="text-[7px] text-slate-500 font-normal">STREAMING_60HZ</span>
          </div>
          <p className="text-cyan-400 flex items-center">
            <span className="font-mono text-cyan-400 tracking-widest text-sm font-bold">[ METRICS_STREAM: COMING SOON... ]</span>
            <span className="h-3.5 w-3.5 bg-purple-500 ml-2.5 inline-block animate-pulse" />
          </p>
        </div>
      </div>
    </section>
  );
};

export default AchievementsMatrix;
