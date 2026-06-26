// components/ui/GlitchText.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface GlitchTextProps {
  text: string;
  trigger: boolean;
  className?: string;
  speed?: number;
}

const GLITCH_CHARS = "01_Ø█▓▒░⚡</>X8@#%+=[{]};:";

export const GlitchText: React.FC<GlitchTextProps> = ({ text, trigger, className, speed = 25 }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) {
              return text[index];
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("");
      });

      if (iterations >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iterations += 1 / 3; // Control step speed of resolution
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, trigger, speed]);

  return <span className={className}>{displayText}</span>;
};
export default GlitchText;
