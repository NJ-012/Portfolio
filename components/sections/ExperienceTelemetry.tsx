// components/sections/ExperienceTelemetry.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchText from '@/components/ui/GlitchText';

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  location: string;
  logs: string[];
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    company: "Ouranos Robotics Pvt. Ltd.",
    role: "Web Development Intern",
    duration: "June 2026 – Present",
    location: "Remote",
    logs: [
      "[LOG_01]: >> Building responsive Agri-IoT product interfaces using production-grade frameworks and scalable API-driven architectures.",
      "[LOG_02]: >> Shipping high-throughput features across iterative CI/CD deployment pipelines through cross-functional collaboration."
    ]
  },
  {
    company: "Third Essentials",
    role: "Software Engineering Intern",
    duration: "May 2026 – Present",
    location: "On-site",
    logs: [
      "[LOG_01]: >> Integrating low-latency real-time telemetry protocols for distributed sensory arrays.",
      "[LOG_02]: >> Implementing automated unit testing modules and reducing execution overhead inside core services."
    ]
  }
];

const SCRAMBLE_CHARS = "01_Ø█▓▒░⚡</>X8@#%+=[{]};:";

export const ExperienceTelemetry: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchLines, setGlitchLines] = useState<string[]>([]);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [activeLogIdx, setActiveLogIdx] = useState<number>(0);
  const [isPanelHovered, setIsPanelHovered] = useState(false);

  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Matrix Glitch reset and start typewriter logs on selection changes
  useEffect(() => {
    // Clear any active typing sequence timers
    if (typewriterTimerRef.current) {
      clearTimeout(typewriterTimerRef.current);
    }

    setIsGlitching(true);
    setTypedLogs(["", ""]);
    setActiveLogIdx(0);

    let glitchCount = 0;
    const currentItem = EXPERIENCE_DATA[selectedIdx];

    const glitchInterval = setInterval(() => {
      // Create random scrambled matrix strings
      const lines = currentItem.logs.map(log => 
        Array.from({ length: Math.floor(log.length * 0.8) }, () => 
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ).join('')
      );
      setGlitchLines(lines);
      glitchCount++;

      if (glitchCount > 8) {
        clearInterval(glitchInterval);
        setIsGlitching(false);
        startTypewriterSequence(currentItem.logs);
      }
    }, 45);

    return () => {
      clearInterval(glitchInterval);
      if (typewriterTimerRef.current) {
        clearTimeout(typewriterTimerRef.current);
      }
    };
  }, [selectedIdx]);

  const startTypewriterSequence = (logs: string[]) => {
    let currentLog = 0;
    let currentChar = 0;

    const typeChar = () => {
      if (currentLog >= logs.length) {
        setActiveLogIdx(-1); // Remove cursor when typing completes
        return;
      }

      const logText = logs[currentLog];
      if (currentChar < logText.length) {
        setTypedLogs(prev => {
          const updated = [...prev];
          updated[currentLog] = logText.slice(0, currentChar + 1);
          return updated;
        });
        currentChar++;
        setActiveLogIdx(currentLog);
        typewriterTimerRef.current = setTimeout(typeChar, 10 + Math.random() * 20);
      } else {
        // Line complete, stagger before next line
        currentLog++;
        currentChar = 0;
        typewriterTimerRef.current = setTimeout(typeChar, 250);
      }
    };

    typewriterTimerRef.current = setTimeout(typeChar, 100);
  };

  return (
    <section className="relative px-8 py-24 lg:px-16 bg-[#020306] border-t border-gray-900/40 w-full overflow-hidden">
      {/* Background Grid Guide Line */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.25) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <style>{`
        .experience-cursor::after {
          content: '▋';
          color: #BD00FF;
          margin-left: 2px;
          animation: exp-cursor-blink 0.8s infinite step-end;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes exp-cursor-blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-jetbrains-mono text-[11px] uppercase tracking-widest text-cyan-400">// CORE SYSTEMS TELEMETRY</span>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-500 lg:text-6xl font-clash">
            Experience & Internships
          </h2>
        </div>

        {/* Split-pane Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-stretch">
          
          {/* LEFT PANE: Interactive Chrono-Timeline (35% / 3-Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-start bg-black/40 border border-gray-950 p-6 rounded-2xl relative select-none">
            <div className="absolute top-2 right-4 font-jetbrains-mono text-[8px] text-purple-400/40 uppercase tracking-widest">
              SYS_CHRONO // ACTIVE
            </div>
            
            {/* The vertical glowing fiber line */}
            <div className="relative pl-8 border-l border-purple-500/20 py-4 flex flex-col space-y-12">
              
              {EXPERIENCE_DATA.map((item, idx) => {
                const isActive = selectedIdx === idx;
                return (
                  <div 
                    key={item.company}
                    onClick={() => setSelectedIdx(idx)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className="relative group cursor-pointer"
                  >
                    {/* Fiber Timeline Node Indicator */}
                    <div className="absolute -left-[41px] top-1.5 flex items-center justify-center">
                      {isActive ? (
                        <div className="relative flex items-center justify-center">
                          {/* Pulsing High-contrast Sonar Ring Animations */}
                          <span className="absolute h-9 w-9 rounded-full border border-cyan-300/80 opacity-80 animate-ping pointer-events-none" />
                          <span className="absolute h-12 w-12 rounded-full border border-cyan-300/40 opacity-50 animate-ping pointer-events-none [animation-delay:0.3s]" />
                          
                          {/* Blinking Cyan Circuit Ring Core with Enhanced Radiance */}
                          <span className="h-4.5 w-4.5 rounded-full border-2 border-cyan-300 bg-black flex items-center justify-center shadow-[0_0_15px_#00F0FF,0_0_5px_#00F0FF] animate-pulse z-10" />
                          
                          {/* Laser Anchor Pointer Line connecting Timeline to Details */}
                          <span className="absolute left-[9px] w-[50px] h-[1.5px] bg-gradient-to-r from-cyan-400 to-transparent shadow-[0_0_8px_rgba(0,240,255,0.8)] pointer-events-none z-0" />
                        </div>
                      ) : (
                        /* Dull Purple Point */
                        <span className="h-3 w-3 rounded-full bg-purple-900/60 border border-purple-500/40 group-hover:bg-purple-400 group-hover:shadow-[0_0_6px_#A855F7] transition-all duration-300" />
                      )}
                    </div>

                    {/* Timeline Role Details */}
                    <div className={`transition-all duration-300 pl-2 ${isActive ? 'translate-x-1.5' : 'translate-x-0'}`}>
                      <h4 className={`text-lg font-bold font-jetbrains-mono leading-tight transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-300 group-hover:text-cyan-400/80'}`}>
                        {item.company}
                      </h4>
                      <p className="text-gray-400 text-xs font-semibold mt-1">
                        {item.role}
                      </p>
                      <div className="flex gap-4 mt-2 text-[10px] font-jetbrains-mono text-gray-500">
                        <span>{item.duration}</span>
                        <span className="text-purple-500">//</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* RIGHT PANE: System Log Data Streamer (65% / 6-Columns) */}
          <div 
            onMouseEnter={() => setIsPanelHovered(true)}
            onMouseLeave={() => setIsPanelHovered(false)}
            className="lg:col-span-6 flex flex-col justify-between bg-[#03060c]/90 border border-cyan-500/25 p-6 rounded-2xl shadow-[inset_0_0_25px_rgba(0,240,255,0.04)] relative font-jetbrains-mono overflow-hidden"
          >
            
            {/* Repeating low-opacity technical cyan grid mesh */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none rounded-2xl" style={{ backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            {/* Glowing Tech Corners */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/40" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/40" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/40" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/40" />
            
            {/* Panel Header Terminal Mock Performance Telemetry */}
            <div className="flex flex-wrap justify-between items-center pb-4 border-b border-gray-900/60 gap-3 text-[9px] text-gray-500">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-400 font-bold uppercase tracking-widest">TELEMETRY_STREAM: ONLINE</span>
              </div>
              <div className="flex gap-4">
                <span>LATENCY: <GlitchText text="0.02ms" trigger={isPanelHovered} /></span>
                <span>BUFFER: <GlitchText text="STABLE" trigger={isPanelHovered} /></span>
                <span>SYS_TEMP: <GlitchText text="34C" trigger={isPanelHovered} /></span>
              </div>
            </div>

            {/* Main Log Window */}
            <div className="flex-grow py-6 flex flex-col space-y-4 text-xs select-text">
              {isGlitching ? (
                /* Matrix Glitch resetting visual */
                <div className="flex flex-col space-y-4 text-purple-400/80 tracking-widest opacity-80 break-all select-none">
                  {glitchLines.map((line, idx) => (
                    <div key={idx} className="font-mono">
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                /* Typewriter logs stream */
                <div className="flex flex-col space-y-4 font-mono text-gray-300 leading-relaxed">
                  {EXPERIENCE_DATA[selectedIdx].logs.map((_, logIdx) => {
                    const isCurrentTyping = activeLogIdx === logIdx;
                    const textToShow = typedLogs[logIdx];

                    // Render typed logs sequentially
                    if (textToShow === "" && !isCurrentTyping) return null;

                    return (
                      <p 
                        key={logIdx} 
                        className={isCurrentTyping ? "experience-cursor" : ""}
                        style={{ wordBreak: 'break-word' }}
                      >
                        {textToShow}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Log Panel Footer */}
            <div className="pt-4 border-t border-gray-900/60 text-[9px] text-gray-600 flex justify-between">
              <span>STREAM: WORK_LOG_0x0{selectedIdx + 1}</span>
              <span>CORE_INTEGRITY: 100%</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
export default ExperienceTelemetry;
