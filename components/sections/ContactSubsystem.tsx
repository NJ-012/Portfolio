// components/sections/ContactSubsystem.tsx
'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';

interface LinkButtonProps {
  label: string;
  href: string;
  telemetry: string;
  download?: string;
  isDownload?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({ label, href, telemetry, download, isDownload }) => {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (!btnRef.current) return;
    // Animate border color and neon cyan shadow glow on hover
    gsap.to(btnRef.current, {
      borderColor: '#00F0FF',
      boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)',
      backgroundColor: 'rgba(0, 240, 255, 0.03)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    // Return to passive state: muted borders, no glow
    gsap.to(btnRef.current, {
      borderColor: 'rgba(157, 78, 221, 0.12)',
      boxShadow: 'none',
      backgroundColor: 'rgba(8, 12, 24, 0.3)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {/* Micro-telemetry string above the row */}
      <span className="text-[8px] font-mono text-purple-400/40 uppercase tracking-widest pl-1">
        {telemetry}
      </span>
      
      {/* Anchor action panel */}
      {isDownload ? (
        <a
          ref={btnRef}
          href={href}
          download={download}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full flex items-center justify-between border border-purple-500/10 bg-[#080c18]/30 px-6 py-4 rounded-xl font-jetbrains-mono text-xs font-bold text-purple-400 hover:text-cyan-300 transition-colors duration-300 select-none cursor-pointer"
        >
          <span>{label}</span>
          <span className="text-[10px] text-purple-500/60 font-normal">➔ DL_EXEC</span>
        </a>
      ) : (
        <a
          ref={btnRef}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full flex items-center justify-between border border-purple-500/10 bg-[#080c18]/30 px-6 py-4 rounded-xl font-jetbrains-mono text-xs font-bold text-purple-400 hover:text-cyan-300 transition-colors duration-300 select-none cursor-pointer"
        >
          <span>{label}</span>
          <span className="text-[10px] text-purple-500/60 font-normal">➔ REDIRECT</span>
        </a>
      )}
    </div>
  );
};

export const ContactSubsystem: React.FC = () => {
  return (
    <section className="relative px-8 py-24 lg:px-16 bg-[#010204] border-t border-gray-900/50 w-full overflow-hidden">
      {/* Persisted grid overlay lines */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="mb-16">
          <span className="font-jetbrains-mono text-[11px] uppercase tracking-widest text-cyan-400">// SUBSYSTEM: INITIATE_CONTACT</span>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-500 lg:text-6xl font-clash">
            Let's Connect
          </h2>
        </div>

        {/* 2-Column Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-12 items-center">
          
          {/* LEFT COLUMN: Hardware-bracketed unaltered portrait box */}
          <div className="md:col-span-4 flex justify-center w-full">
            <div className="relative z-35 w-full max-w-[280px] aspect-[3/4] rounded-2xl border border-purple-500/20 p-2 bg-[#04070e]/80 shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
              {/* Corner brackets */}
              <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20" />

              {/* Natural Lighting Image */}
              <img
                src="/image_767f38.png"
                alt="Niyati Joshi"
                className="w-full h-full object-cover rounded-xl filter brightness-100 contrast-100 saturates-100"
              />
              
              {/* Telemetry frame caption */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm border border-cyan-400/20 py-1.5 px-3 rounded font-jetbrains-mono text-[8px] text-cyan-400/80 flex justify-between z-20">
                <span>PORTRAIT // NATURAL</span>
                <span>ISO 400</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stacked terminal panels command array */}
          <div className="md:col-span-6 flex flex-col space-y-5 w-full">
            
            <LinkButton
              label="[ GET_RESUME.PDF ]"
              href="/resume.pdf"
              telemetry="SYS_STATUS: ACTIVE // METRIC: RESUME_CV // PING: 18ms"
              download="Niyati_Joshi_Resume.pdf"
              isDownload={true}
            />

            <LinkButton
              label="// GITHUB"
              href="https://github.com/NJ-012"
              telemetry="NODE: github.com/NJ-012 // SECURE_PORT: 443 // RATIO: STABLE"
            />

            <LinkButton
              label="// LINKEDIN"
              href="https://linkedin.com/in/niyati-joshi-a6502b242"
              telemetry="NODE: linkedin.com/in/niyati-joshi-a6502b242 // VERIFIED: ACTIVE // PING: 22ms"
            />

            <LinkButton
              label="// MAIL_TO"
              href="mailto:jniyati06@gmail.com"
              telemetry="PROTOCOL: smtp // jniyati06@gmail.com // BUFFER: READY"
            />

          </div>

        </div>

      </div>
    </section>
  );
};
export default ContactSubsystem;
