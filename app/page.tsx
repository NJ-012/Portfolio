// app/page.tsx
'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalState } from '@/providers/GlobalStateProvider';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import TerminalMode from '@/components/sections/TerminalMode';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsGallery from '@/components/sections/ProjectsGallery';
import ExperienceTelemetry from '@/components/sections/ExperienceTelemetry';
import ContactSubsystem from '@/components/sections/ContactSubsystem';
import CursorSpotlight from '@/components/ui/CursorSpotlight';
import TrackingMeshBackground from '@/components/ui/TrackingMeshBackground';
import StarfieldBackground from '@/components/ui/StarfieldBackground';
import HeaderNav from '@/components/layout/HeaderNav';

const TechStackDeck = dynamic(() => import('@/components/sections/TechStackDeck'), { ssr: false });
const AchievementsMatrix = dynamic(() => import('@/components/sections/AchievementsMatrix'), { ssr: false });

const pageVariants = {
  guiEnter: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
  guiExit: { opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: 'easeIn' } },
  coreEnter: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
  coreExit: { opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: 'easeIn' } },
};

export default function HomePage() {
  const { isCoreOsMode } = useGlobalState();

  useEffect(() => {
    if (isCoreOsMode) return;

    // Dynamically import GSAP to run purely client-side
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const sections = document.querySelectorAll('.scroll-section');
        sections.forEach((section, idx) => {
          if (idx === 0) {
            // First section (Hero) resolves instantly
            gsap.fromTo(
              section,
              { opacity: 0, y: 0 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
          } else {
            // Successive sections fade & slide in smoothly on scroll
            gsap.fromTo(
              section,
              { opacity: 0, y: 35, scale: 0.99 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              }
            );
          }
        });
      });
    });
  }, [isCoreOsMode]);

  return (
    <main className="relative min-h-screen w-screen bg-black overflow-hidden">
      {/* Tiny twinkling stars over empty spaces */}
      <StarfieldBackground />

      {/* 60FPS 2D Tracking Mesh Background */}
      <TrackingMeshBackground />

      {/* Volumetric ambient background mesh backlight spotlights */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[650px] h-[650px] rounded-full filter blur-[150px] pulse-bg-glow opacity-75" />
        <div className="absolute top-[40%] right-[15%] w-[750px] h-[750px] rounded-full filter blur-[180px] pulse-bg-glow opacity-75 [animation-delay:2s]" />
        <div className="absolute top-[70%] left-[10%] w-[700px] h-[700px] rounded-full filter blur-[165px] pulse-bg-glow opacity-75 [animation-delay:4s]" />
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            background: radial-gradient(circle, rgba(189, 0, 255, 0.03) 0%, rgba(0, 240, 255, 0.01) 70%, transparent 100%);
          }
          50% {
            background: radial-gradient(circle, rgba(0, 240, 255, 0.03) 0%, rgba(189, 0, 255, 0.01) 70%, transparent 100%);
          }
        }
        .pulse-bg-glow {
          animation: pulseGlow 12s ease-in-out infinite;
        }
      `}</style>

      {/* Interactive Cursor Spotlight Glow */}
      {!isCoreOsMode && <CursorSpotlight />}

      {/* Global Navigation Overlay */}
      {!isCoreOsMode && <HeaderNav />}

      {/* Fixed UI Layer Control Hub Toggle Switch */}
      <div className="fixed top-6 right-6 z-50">
        <ToggleSwitch />
      </div>

      <AnimatePresence mode="wait">
        {isCoreOsMode ? (
          <motion.div
            key="terminal"
            variants={pageVariants}
            initial="coreExit"
            animate="coreEnter"
            exit="coreExit"
            className="fixed inset-0 z-40 bg-black"
          >
            <TerminalMode />
          </motion.div>
        ) : (
          <motion.div
            key="gui"
            variants={pageVariants}
            initial="guiExit"
            animate="guiEnter"
            exit="guiExit"
            className="relative z-10 w-full flex flex-col pt-16"
          >
            {/* 1. Hero fold */}
            <div id="overview" className="scroll-section w-full">
              <HeroSection />
            </div>

            {/* 2. Systems Matrix Deck */}
            <div id="systems-matrix" className="scroll-section w-full opacity-0">
              <TechStackDeck />
            </div>

            {/* 3. Projects Gallery */}
            <div id="architectures" className="scroll-section w-full opacity-0">
              <ProjectsGallery />
            </div>

            {/* 4. Experience Telemetry */}
            <div id="chrono-telemetry" className="scroll-section w-full opacity-0">
              <ExperienceTelemetry />
            </div>

            {/* 5. Achievements Matrix */}
            <div id="achievements" className="scroll-section w-full opacity-0">
              <AchievementsMatrix />
            </div>

            {/* 6. Contact Subsystem */}
            <div id="terminal-connect" className="scroll-section w-full opacity-0">
              <ContactSubsystem />
            </div>

            {/* 6. Embedded Minimal Footer */}
            <footer className="w-full border-t border-gray-900/60 bg-black py-8 px-8 md:px-16 lg:px-32 font-jetbrains-mono text-[10px] text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                © {new Date().getFullYear()} NIYATI JOSHI // ALL RIGHTS RESERVED.
              </div>
              <div className="flex items-center gap-6">
                <span>LOC: INDORE, IN</span>
                <span className="text-emerald-500 animate-pulse">● SYS_ONLINE</span>
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}