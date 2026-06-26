// components/ui/BentoCard.tsx
'use client';

import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  hoverColor?: string;
  style?: React.CSSProperties;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = '', hoverColor, style }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Initialize Framer Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse positions to precise rotation degrees
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  // Apply smooth physics to the spring configurations
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate relative cursor position from -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);

    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
  };

  const overlayGradientStyle = {
    '--card-mouse-x': `${mousePosition.x}px`,
    '--card-mouse-y': `${mousePosition.y}px`,
  } as React.CSSProperties;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      animate={{
        borderColor: isHovering ? (hoverColor || '#A855F7') : '#1F2937',
        boxShadow: isHovering ? `0 10px 30px ${(hoverColor || '#A855F7')}26` : 'none',
      }}
      className={`relative overflow-hidden rounded-xl border-2 p-6 transition-colors duration-300 bg-[#080C14]/80 backdrop-blur-md ${className}`}
    >
      {/* Dynamic Cursor-Tracking Ambient Light Sweep */}
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={overlayGradientStyle as CSSProperties}
        >
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(
                circle 250px at var(--card-mouse-x, 50%) var(--card-mouse-y, 50%),
                ${(hoverColor || '#A855F7')}26,
                transparent 70%
              )`,
            }}
          />
        </div>
      )}

      {/* Children elements wrapper with 3D depth isolation */}
      <div style={{ transform: 'translateZ(20px)' }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default BentoCard;