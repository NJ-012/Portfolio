// components/layout/HeaderNav.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface NavItem {
  label: string;
  targetId: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: '01 // OVERVIEW', targetId: 'overview' },
  { label: '02 // SYSTEMS_MATRIX', targetId: 'systems-matrix' },
  { label: '03 // ARCHITECTURES', targetId: 'architectures' },
  { label: '04 // CHRONO_TELEMETRY', targetId: 'chrono-telemetry' },
  { label: '05 // ACHIEVEMENTS', targetId: 'achievements' },
  { label: '06 // TERMINAL_CONNECT', targetId: 'terminal-connect' },
];

export const HeaderNav: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Track active section on scroll to update underline state
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200; // Offset for triggers
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.targetId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.targetId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(targetId);
    }
  };

  return (
    <>
      <style>{`
        @keyframes navCursorBlink {
          from, to { border-color: transparent; }
          50% { border-color: #00F0FF; }
        }
        .nav-blink-line {
          border-bottom-width: 2px;
          border-style: solid;
          animation: navCursorBlink 0.8s step-end infinite;
        }
      `}</style>
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-purple-900/20 bg-black/10 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300">
        {/* Left Brand Mark */}
        <a 
          href="#overview" 
          onClick={(e) => handleNavClick(e, 'overview')}
          className="font-jetbrains-mono text-[11px] md:text-xs font-bold tracking-widest text-white hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 select-none"
        >
          <span>NIYATI JOSHI</span>
          <span className="text-purple-500/60">//</span>
          <span className="text-emerald-500 animate-pulse">● SYS_ONLINE</span>
        </a>

        {/* Right Command Matrix */}
        <nav className="hidden lg:flex items-center gap-5 font-jetbrains-mono text-[10px] lg:pr-40">
          {NAV_ITEMS.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const isActive = activeSection === item.targetId;
            return (
              <a
                key={item.targetId}
                href={`#${item.targetId}`}
                onClick={(e) => handleNavClick(e, item.targetId)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative px-2 py-1 select-none transition-all duration-300 font-bold tracking-wider rounded border border-transparent ${
                  isHovered || isActive
                    ? 'text-cyan-400 border-cyan-500/10 bg-cyan-500/5'
                    : 'text-purple-400/50'
                }`}
              >
                <span>[ {item.label} ]</span>
                {/* Micro underline cursor blink */}
                {(isHovered || isActive) && (
                  <span className="absolute bottom-0 left-1 right-1 border-cyan-400 nav-blink-line" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Mini Indicator Tag */}
        <div className="lg:hidden font-jetbrains-mono text-[9px] text-purple-400/60 border border-purple-950 bg-purple-950/20 px-2 py-1 rounded">
          SECT: <span className="text-cyan-400 uppercase font-bold">{activeSection}</span>
        </div>
      </header>
    </>
  );
};

export default HeaderNav;
