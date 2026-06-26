// components/ui/TerminalTypewriter.tsx
'use client';

import React, { useState, useEffect } from 'react';

const LINES = [
  "Elite Frontend Architect & Systems Engineer",
  "B.Tech Computer Science // NMIMS MPSTME [2024-2028]",
  "• NPTEL Elite DSA Core Matrix Rank: Top 5% National Pool",
  "• Full-Stack Web Architecture & Real-Time Performance Optimizations"
];

export const TerminalTypewriter: React.FC = () => {
  const [typedText, setTypedText] = useState<string[]>(["", "", "", ""]);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let timer: NodeJS.Timeout;

    const typeCharacter = () => {
      if (currentLine >= LINES.length) {
        // Typing fully complete: deactivate blinking cursor
        setActiveLineIndex(-1);
        return;
      }

      const text = LINES[currentLine];
      if (currentChar < text.length) {
        setTypedText(prev => {
          const updated = [...prev];
          updated[currentLine] = text.slice(0, currentChar + 1);
          return updated;
        });
        currentChar++;
        setActiveLineIndex(currentLine);
        // Randomize speed slightly for a more authentic mechanical-typewriter feel
        timer = setTimeout(typeCharacter, 20 + Math.random() * 35);
      } else {
        // Done with current line, wait 350ms before moving to the next line
        currentLine++;
        currentChar = 0;
        timer = setTimeout(typeCharacter, 350);
      }
    };

    // Stagger start: wait 600ms before typing begins
    timer = setTimeout(typeCharacter, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <style>{`
        .typewriter-active-cursor::after {
          content: '▋';
          color: #BD00FF;
          margin-left: 2px;
          animation: typewriter-cursor-blink 0.8s infinite step-end;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes typewriter-cursor-blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Main Title Block */}
      <p className="text-lg font-bold uppercase tracking-widest text-purple-400/90 font-sans min-h-[28px] flex items-center">
        <span className={activeLineIndex === 0 ? "typewriter-active-cursor" : ""}>
          {typedText[0]}
        </span>
      </p>

      {/* Academic & Professional Bullet Points Block */}
      <div className="mt-4 space-y-3 border-l-2 border-purple-500/20 pl-5 font-jetbrains-mono text-xs text-gray-500">
        {/* Line 1: Academic */}
        {(typedText[1] !== "" || activeLineIndex === 1) && (
          <p className="text-gray-400 text-sm min-h-[20px] flex items-center">
            <span className={activeLineIndex === 1 ? "typewriter-active-cursor" : ""}>
              {typedText[1]}
            </span>
          </p>
        )}

        {/* Line 2: DSA Rank */}
        {(typedText[2] !== "" || activeLineIndex === 2) && (
          <p className="min-h-[16px] flex items-center">
            <span className={activeLineIndex === 2 ? "typewriter-active-cursor" : ""}>
              {typedText[2]}
            </span>
          </p>
        )}

        {/* Line 3: Stack */}
        {(typedText[3] !== "" || activeLineIndex === 3) && (
          <p className="min-h-[16px] flex items-center">
            <span className={activeLineIndex === 3 ? "typewriter-active-cursor" : ""}>
              {typedText[3]}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
