// components/sections/ProjectsGallery.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RESUME_PROJECTS, Project } from '@/lib/constants';
import ProjectCard from '@/components/ui/ProjectCard';

export default function ProjectsGallery() {
  return (
    <section className="relative px-8 py-28 lg:px-16 bg-black border-t border-gray-900/40 w-full overflow-hidden">
      {/* Subtle blueprint tech lines layer */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)', backgroundSize: '45px 45px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 flex items-end justify-between">
          <div>
            <span className="font-jetbrains-mono text-[11px] uppercase tracking-widest text-purple-400">// SELECTED PLATFORM ARCHITECTURES</span>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-400 lg:text-6xl font-clash" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Selected Work
            </h2>
          </div>
        </div>

        {/* 2x2 Blueprint HUD Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {RESUME_PROJECTS.map((project: Project, idx: number) => (
            <motion.div
              key={project.id} 
              className="h-full"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.12 }}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                tags={project.tags}
                metrics={project.architectureMetrics}
                imageSrc={`/project${idx + 1}.png`}
                githubUrl={project.githubUrl}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}