// components/ui/ProjectCard.tsx
'use client';

import React, { useState, useRef } from 'react';
import { GlitchShaderCanvas } from './GlitchShaderCanvas';
import GlitchText from './GlitchText';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  metrics: {
    complexity: string;
    scalability: string;
    performance: string;
  };
  imageSrc: string;
  githubUrl?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  metrics,
  imageSrc,
  githubUrl
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate relative cursor position from -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    // Scale to rotation angles (max 10 degrees)
    setTilt({
      x: relativeX * 10,
      y: -relativeY * 10
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`relative flex flex-col justify-between bg-[#04070e]/95 border-2 rounded-2xl p-5 min-h-[420px] transition-all duration-300 shadow-[0_20px_45px_rgba(0,0,0,0.6)] group select-none overflow-hidden ${
        isHovered ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]' : 'border-gray-900/60'
      }`}
    >
      {/* Cyberpunk technical brackets corners */}
      <span className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 transition-all duration-300 ${isHovered ? 'border-cyan-400 shadow-[0_0_10px_#00F0FF]' : 'border-purple-500/20'}`} />
      <span className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 transition-all duration-300 ${isHovered ? 'border-cyan-400 shadow-[0_0_10px_#00F0FF]' : 'border-purple-500/20'}`} />
      <span className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 transition-all duration-300 ${isHovered ? 'border-cyan-400 shadow-[0_0_10px_#00F0FF]' : 'border-purple-500/20'}`} />
      <span className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 transition-all duration-300 ${isHovered ? 'border-cyan-400 shadow-[0_0_10px_#00F0FF]' : 'border-purple-500/20'}`} />

      {/* 3D Depth Card Inner Elements */}
      <div style={{ transform: 'translateZ(15px)' }} className="flex flex-col h-full justify-between">
        
        {/* WebGL Glitch Image Showcase */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-950 border border-gray-900/80 mb-4 select-none">
          <GlitchShaderCanvas imageSrc={imageSrc} isHovered={isHovered} />
          
          {/* Scanline CRT glass overlay mask */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%),linear-gradient(90deg,rgba(0,255,255,0.03),rgba(255,0,255,0.01),rgba(0,255,255,0.03))] bg-[size:100%_4px,3px_100%] opacity-40" />
          
          {/* Subtle grid guidelines */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)', backgroundSize: '15px 15px' }} />
          
          {/* Mock Camera Corner telemetry indicators */}
          <div className="absolute top-2 left-2 text-[8px] font-mono text-cyan-400/40 uppercase tracking-widest pointer-events-none">
            REC // WGL_MODE
          </div>
          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-purple-400/40 pointer-events-none">
            FP_60
          </div>
        </div>

        {/* Text Details */}
        <div className="flex-grow flex flex-col justify-start">
          <h3 className={`text-2xl font-bold uppercase transition-colors duration-300 font-jetbrains-mono tracking-tight ${isHovered ? 'text-cyan-400' : 'text-white'}`}>
            {title}
          </h3>
          <p className="text-gray-400 text-xs mt-2.5 font-sans leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Architecture Metrics Table */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-gray-900/60 font-jetbrains-mono text-[9px]">
          <div>
            <span className="block text-purple-400/60 uppercase font-medium">Complexity:</span>
            <span className="text-gray-300 font-bold uppercase block mt-0.5 tracking-tight">
              <GlitchText text={metrics.complexity} trigger={isHovered} />
            </span>
          </div>
          <div>
            <span className="block text-purple-400/60 uppercase font-medium">Scalability:</span>
            <span className="text-gray-300 font-bold uppercase block mt-0.5 tracking-tight">
              <GlitchText text={metrics.scalability} trigger={isHovered} />
            </span>
          </div>
          <div>
            <span className="block text-purple-400/60 uppercase font-medium">Performance:</span>
            <span className="text-gray-300 font-bold uppercase block mt-0.5 tracking-tight">
              <GlitchText text={metrics.performance} trigger={isHovered} />
            </span>
          </div>
        </div>

        {/* Footer Layer: Dynamic Glowing Tags & Anchor Action Trigger */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-900/60 w-full">
          <div className="flex flex-wrap gap-1.5 max-w-[65%]">
            {tags.map(tag => (
              <span
                key={tag}
                className={`font-jetbrains-mono text-[9px] border px-2 py-0.5 rounded transition-all duration-300 ${
                  isHovered
                    ? 'bg-cyan-500/5 text-cyan-400 border-cyan-500/30 shadow-[0_0_5px_rgba(0,240,255,0.2)]'
                    : 'bg-purple-500/5 text-purple-400/70 border-purple-500/10'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-jetbrains-mono text-[10px] font-bold text-slate-500 hover:text-[#00F0FF] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 tracking-wider uppercase select-none"
            >
              [ VIEW_ON_GITHUB ]
            </a>
          )}
        </div>

      </div>
    </div>
  );
};
export default ProjectCard;
