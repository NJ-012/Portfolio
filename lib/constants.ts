// lib/constants.ts

export interface ArchitectureMetrics {
  complexity: string;
  scalability: string;
  performance: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  architectureMetrics: ArchitectureMetrics;
  githubUrl?: string;
}

export const RESUME_PROJECTS: Project[] = [
  {
    id: 'tech-island',
    title: 'Tech Island',
    description: 'Gamified competitive coding platform featuring real-time concurrent gameplay and interactive 3D UI environments.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Node.js'],
    architectureMetrics: { complexity: 'High', scalability: 'Thousands of Concurrent Users', performance: 'Process Isolated Execution Engine' },
    githubUrl: 'https://github.com/NJ-012/tech-island'
  },
  {
    id: 'shop-sphere',
    title: 'ShopSphere',
    description: 'Production-grade multi-role e-commerce system with granular RBAC and real-time inventory state synchronization.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'JWT'],
    architectureMetrics: { complexity: 'High', scalability: 'Enterprise Scalable Workloads', performance: 'Optimized SQL & Hibernate Queries' },
    githubUrl: 'https://github.com/NJ-012/shopsphere'
  },
  {
    id: 'resume-alchemist',
    title: 'Resume Alchemist',
    description: 'AI-driven skill extraction and gap analysis engine using NLP, containerized as a portable microservice ecosystem.',
    tags: ['FastAPI', 'Python', 'NLP', 'Docker'],
    architectureMetrics: { complexity: 'High', scalability: 'Containerized Microservice Topology', performance: 'Asynchronous Profile Assessment Pipelines' },
    githubUrl: 'https://github.com/NJ-012/resume-alchemist'
  },
  {
    id: 'aura-ai',
    title: 'AURA AI',
    description: 'End-to-end automated machine learning pipeline with hyperparameter optimization and high-throughput inference APIs.',
    tags: ['Python', 'Scikit-Learn', 'FastAPI'],
    architectureMetrics: { complexity: 'Medium', scalability: 'Distributed Thread Buffers', performance: 'Asynchronous Stream Inference Pipeline' },
    githubUrl: 'https://github.com/NJ-012/AURA-AI'
  }
];

export type SkillCategory = 'Core & Algorithms' | 'Full-Stack Web' | 'Infrastructure & Tools' | 'Design & Animation';

export interface Skill {
  name: string;
  category: SkillCategory;
  color?: string;
}

export const SKILLS: Skill[] = [
  { name: 'TypeScript', category: 'Core & Algorithms', color: '#00ffcc' },
  { name: 'JavaScript', category: 'Core & Algorithms', color: '#eab308' },
  { name: 'Python', category: 'Core & Algorithms', color: '#3b82f6' },
  { name: 'Java', category: 'Core & Algorithms', color: '#ef4444' },
  { name: 'C++', category: 'Core & Algorithms', color: '#a855f7' },
  { name: 'SQL', category: 'Core & Algorithms', color: '#10b981' },

  { name: 'Next.js', category: 'Full-Stack Web', color: '#ffffff' },
  { name: 'React.js', category: 'Full-Stack Web', color: '#06b6d4' },
  { name: 'Node.js', category: 'Full-Stack Web', color: '#22c55e' },
  { name: 'FastAPI', category: 'Full-Stack Web', color: '#f43f5e' },
  { name: 'Django', category: 'Full-Stack Web', color: '#15803d' },
  { name: 'Spring Boot', category: 'Full-Stack Web', color: '#6db33f' },

  { name: 'Docker', category: 'Infrastructure & Tools', color: '#00ffcc' },
  { name: 'PostgreSQL', category: 'Infrastructure & Tools', color: '#336791' },
  { name: 'MySQL', category: 'Infrastructure & Tools', color: '#f29111' },
  { name: 'Redis', category: 'Infrastructure & Tools', color: '#d82c20' },
  { name: 'Git', category: 'Infrastructure & Tools', color: '#f05032' },
  { name: 'Linux', category: 'Infrastructure & Tools', color: '#f55000' }
];

export const getSkillsByCategory = () => {
  const categorized: Record<SkillCategory, Skill[]> = {
    'Core & Algorithms': [],
    'Full-Stack Web': [],
    'Infrastructure & Tools': [],
    'Design & Animation': []
  };
  SKILLS.forEach(skill => {
    if (categorized[skill.category]) categorized[skill.category].push(skill);
  });
  
  // Adding placeholders for empty categories if any to avoid runtime crashes
  if (categorized['Design & Animation'].length === 0) {
    categorized['Design & Animation'] = [
      { name: 'GSAP', category: 'Design & Animation', color: '#8b5cf6' },
      { name: 'Framer Motion', category: 'Design & Animation', color: '#ff0055' },
      { name: 'Three.js', category: 'Design & Animation', color: '#00ffcc' }
    ];
  }
  return categorized;
};