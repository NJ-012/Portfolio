// components/sections/TechStackDeck.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import * as THREE from 'three';
import { SkillCategory, getSkillsByCategory } from '@/lib/constants';
import { useGlobalState } from '@/providers/GlobalStateProvider';

const categorizedSkills = getSkillsByCategory();
const skillCategories = Object.keys(categorizedSkills) as SkillCategory[];

const NEON_PALETTE: number[] = [0x00ffcc, 0xff2d78, 0x9d4edd, 0x10b981, 0x38bdf8, 0xf59e0b];

const categoryToFaceId = (category: SkillCategory): number => {
  switch (category) {
    case 'Full-Stack Web': return 0;
    case 'Design & Animation': return 1;
    case 'Infrastructure & Tools': return 2;
    case 'Core & Algorithms': return 4;
    default: return 0;
  }
};

const faceIdToCategory = (faceId: number): SkillCategory => {
  switch (faceId) {
    case 0: return 'Full-Stack Web';
    case 1: return 'Design & Animation';
    case 2: return 'Infrastructure & Tools';
    case 3: return 'Core & Algorithms';
    case 4: return 'Core & Algorithms';
    case 5: return 'Infrastructure & Tools';
    default: return 'Full-Stack Web';
  }
};

const createFaceTexture = (category: string, skills: { name: string; color?: string }[], colorHex: number, isActive: boolean): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#05050a'; ctx.fillRect(0, 0, 512, 512);
  const colorStr = '#' + colorHex.toString(16).padStart(6, '0');
  
  const activeColor = isActive ? colorStr : 'rgba(255, 255, 255, 0.15)';
  const borderColor = isActive ? colorStr : 'rgba(255, 255, 255, 0.1)';
  
  if (isActive) {
    ctx.shadowColor = colorStr; ctx.shadowBlur = 18;
  } else {
    ctx.shadowBlur = 0;
  }
  
  ctx.strokeStyle = borderColor; ctx.lineWidth = 6; ctx.strokeRect(14, 14, 484, 484);
  
  ctx.shadowBlur = 0;
  ctx.strokeStyle = isActive ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.005)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const d = 14 + (484 / 4) * i;
    ctx.beginPath(); ctx.moveTo(d, 14); ctx.lineTo(d, 498); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, d); ctx.lineTo(498, d); ctx.stroke();
  }
  
  ctx.font = 'bold 28px monospace'; ctx.fillStyle = activeColor;
  ctx.fillText(`// ${category.toUpperCase()}`, 32, 68);
  
  ctx.font = '18px monospace';
  skills.slice(0, 8).forEach((skill, index) => {
    const col = index % 2; const row = Math.floor(index / 2);
    const x = 32 + col * 240; const y = 120 + row * 88;
    
    const skillColor = isActive ? (skill.color || colorStr) : 'rgba(255, 255, 255, 0.2)';
    ctx.strokeStyle = skillColor;
    ctx.globalAlpha = isActive ? 0.55 : 0.15;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, 218, 52);
    
    ctx.globalAlpha = 1;
    ctx.fillStyle = skillColor;
    ctx.beginPath(); ctx.arc(x + 14, y + 26, 4, 0, Math.PI * 2); ctx.fill();
    
    ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(skill.name, x + 26, y + 32);
  });
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

interface CubiePhysics {
  mesh: THREE.Mesh; lines: THREE.LineSegments;
  origX: number; origY: number; origZ: number;
  ax: number; ay: number; az: number;
}

const TechStackDeck: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  
  const initialFaceId = categoryToFaceId('Full-Stack Web');
  const presets: Record<number, { x: number; y: number }> = {
    0: { x: 0, y: -Math.PI / 2 },
    1: { x: 0, y: Math.PI / 2 },
    2: { x: -Math.PI / 2, y: 0 },
    3: { x: Math.PI / 2, y: 0 },
    4: { x: 0, y: 0 },
    5: { x: 0, y: Math.PI },
  };
  const initP = presets[initialFaceId];
  const initialX = initP.x + 0.25;
  const initialY = initP.y - 0.35;

  const [activeFace, setActiveFace] = useState<number | null>(initialFaceId);
  const [isExploded, setIsExploded] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  const { setCubeScrollProgress, selectedTechStackCategory, setSelectedTechStackCategory } = useGlobalState();

  const cubeGroupRef = useRef<THREE.Group | null>(null);

  const cubiesRef = useRef<CubiePhysics[]>([]);
  const platesMeshRef = useRef<THREE.Mesh | null>(null);
  const scrollProgressRef = useRef(0);
  const targetRotation = useRef({ x: initialX, y: initialY });
  const currentRotation = useRef({ x: initialX, y: initialY });
  const rotateToFaceRef = useRef<(faceId: number) => void>(() => {});

  useEffect(() => {
    // --- Three.js scene (Systems Matrix cube) ---
    if (!mountRef.current) return;

    const container = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 40);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    cubeGroupRef.current = mainGroup;

    const subSize = 0.58;

    // Create 27 small cubes (cubies)
    const localCubies: CubiePhysics[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geo = new THREE.BoxGeometry(subSize * 0.9, subSize * 0.9, subSize * 0.9);
          const mat = new THREE.MeshBasicMaterial({ color: 0x020205 });
          const mesh = new THREE.Mesh(geo, mat);

          const edgeGeo = new THREE.EdgesGeometry(geo);
          // 6 edge colors
          let edgeColor = NEON_PALETTE[0];
          if (x === 1) edgeColor = NEON_PALETTE[1];
          else if (x === -1) edgeColor = NEON_PALETTE[3];
          else if (y === 1) edgeColor = NEON_PALETTE[2];
          else if (y === -1) edgeColor = NEON_PALETTE[5];
          const edgeMat = new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 });
          const lines = new THREE.LineSegments(edgeGeo, edgeMat);

          const px = x * subSize;
          const py = y * subSize;
          const pz = z * subSize;

          mesh.position.set(px, py, pz);
          lines.position.set(px, py, pz);

          mainGroup.add(mesh);
          mainGroup.add(lines);

          const seed = (x + 2) * 9 + (y + 2) * 3 + (z + 2);
          const rand = (s: number, amp: number) => ((Math.sin(s * 127.1) * 0.5 + 0.5) * 2 - 1) * amp;

          localCubies.push({
            mesh,
            lines,
            origX: px,
            origY: py,
            origZ: pz,
            ax: rand(seed + 3, 0.02),
            ay: rand(seed + 4, 0.02),
            az: rand(seed + 5, 0.015),
          });
        }
      }
    }
    cubiesRef.current = localCubies;

    const plateGeo = new THREE.BoxGeometry(subSize * 3.02, subSize * 3.02, subSize * 3.02);
    const buildFaceMaterials = (selectedCat: SkillCategory) => {
      return [
        new THREE.MeshBasicMaterial({ map: createFaceTexture('Full-Stack Web', categorizedSkills['Full-Stack Web'], NEON_PALETTE[0], selectedCat === 'Full-Stack Web'), transparent: true }),
        new THREE.MeshBasicMaterial({ map: createFaceTexture('Design & Animation', categorizedSkills['Design & Animation'], NEON_PALETTE[1], selectedCat === 'Design & Animation'), transparent: true }),
        new THREE.MeshBasicMaterial({ map: createFaceTexture('Infrastructure & Tools', categorizedSkills['Infrastructure & Tools'], NEON_PALETTE[2], selectedCat === 'Infrastructure & Tools'), transparent: true }),
        new THREE.MeshBasicMaterial({ map: createFaceTexture('Core & Algorithms', categorizedSkills['Core & Algorithms'], NEON_PALETTE[3], selectedCat === 'Core & Algorithms'), transparent: true }),
        new THREE.MeshBasicMaterial({ map: createFaceTexture('Core & Algorithms', categorizedSkills['Core & Algorithms'], NEON_PALETTE[4], selectedCat === 'Core & Algorithms'), transparent: true }),
        new THREE.MeshBasicMaterial({ map: createFaceTexture('Infrastructure & Tools', categorizedSkills['Infrastructure & Tools'], NEON_PALETTE[5], selectedCat === 'Infrastructure & Tools'), transparent: true }),
      ];
    };

    let faceMaterials = buildFaceMaterials(selectedTechStackCategory);
    const plateMesh = new THREE.Mesh(plateGeo, faceMaterials);
    mainGroup.add(plateMesh);
    platesMeshRef.current = plateMesh;

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let dragStart = { x: 0, y: 0 };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      dragStart = { x: e.clientX, y: e.clientY };
      setActiveFace(null);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      targetRotation.current.y += (e.clientX - prevMouse.x) * 0.007;
      targetRotation.current.x += (e.clientY - prevMouse.y) * 0.007;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging = false;
      const dx = Math.abs(e.clientX - dragStart.x);
      const dy = Math.abs(e.clientY - dragStart.y);
      if (dx < 5 && dy < 5) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        if (platesMeshRef.current && platesMeshRef.current.visible) {
          const intersects = raycaster.intersectObject(platesMeshRef.current);
          if (intersects.length > 0) {
            const hit = intersects[0];
            const faceId = hit.face?.materialIndex;
            if (faceId !== undefined && faceId >= 0 && faceId <= 5) {
              rotateToFaceRef.current(faceId);
            }
          }
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    let lastT = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastT) / 16.67, 3);
      lastT = now;

      const p = scrollProgressRef.current;

      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08 * dt;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08 * dt;

      mainGroup.rotation.x = currentRotation.current.x;
      mainGroup.rotation.y = currentRotation.current.y;

      if (p > 0) {
        if (platesMeshRef.current) platesMeshRef.current.visible = false;

        cubiesRef.current.forEach((c) => {
          const factor = 1 + p * 5.5;
          const gravity = p * p * 12;
          const tx = c.origX * factor;
          const ty = c.origY * factor - gravity;
          const tz = c.origZ * factor;

          c.mesh.position.x += (tx - c.mesh.position.x) * 0.12 * dt;
          c.mesh.position.y += (ty - c.mesh.position.y) * 0.12 * dt;
          c.mesh.position.z += (tz - c.mesh.position.z) * 0.12 * dt;
          c.lines.position.copy(c.mesh.position);

          c.mesh.rotation.x += c.ax * p * 1.5 * dt;
          c.mesh.rotation.y += c.ay * p * 1.5 * dt;
          c.mesh.rotation.z += c.az * p * 0.5 * dt;
          c.lines.rotation.copy(c.mesh.rotation);
        });
      } else {
        if (platesMeshRef.current) platesMeshRef.current.visible = true;

        cubiesRef.current.forEach((c) => {
          c.mesh.position.x += (c.origX - c.mesh.position.x) * 0.15 * dt;
          c.mesh.position.y += (c.origY - c.mesh.position.y) * 0.15 * dt;
          c.mesh.position.z += (c.origZ - c.mesh.position.z) * 0.15 * dt;
          c.lines.position.copy(c.mesh.position);
          c.mesh.rotation.x *= 0.85;
          c.mesh.rotation.y *= 0.85;
          c.mesh.rotation.z *= 0.85;
          c.lines.rotation.copy(c.mesh.rotation);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);

      // Dispose
      cubiesRef.current.forEach((c) => {
        c.mesh.geometry.dispose();
        (c.mesh.material as THREE.Material).dispose();
        c.lines.geometry.dispose();
        (c.lines.material as THREE.Material).dispose();
      });

      plateGeo.dispose();
      if (platesMeshRef.current) {
        const activeMats = platesMeshRef.current.material as THREE.MeshBasicMaterial[];
        if (Array.isArray(activeMats)) {
          activeMats.forEach((m) => {
            m.map?.dispose();
            m.dispose();
          });
        }
      }

      renderer.dispose();

      // remove canvas
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {

      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      let progress = 0;
      if (rect.top < 0) {
        progress = Math.min(Math.abs(rect.top) / (rect.height * 0.55), 1);
      }
      scrollProgressRef.current = progress;
      setIsExploded(progress > 0.05);
      setScrollPct(Math.round(progress * 100));
      setCubeScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setCubeScrollProgress]);

  const rotateToFace = (faceId: number) => {
    const category = faceIdToCategory(faceId);
    setSelectedTechStackCategory(category);
    setActiveFace(faceId);

    const presets: Record<number, { x: number; y: number }> = {
      0: { x: 0, y: -Math.PI / 2 },      // Right (+X)
      1: { x: 0, y: Math.PI / 2 },       // Left (-X)
      2: { x: -Math.PI / 2, y: 0 },      // Top (+Y)
      3: { x: Math.PI / 2, y: 0 },       // Bottom (-Y)
      4: { x: 0, y: 0 },                 // Front (+Z)
      5: { x: 0, y: Math.PI },           // Back (-Z)
    };
    const p = presets[faceId] ?? presets[4];
    targetRotation.current = { x: p.x + 0.25, y: p.y - 0.35 };
  };

  rotateToFaceRef.current = rotateToFace;

  useEffect(() => {
    const faceId = categoryToFaceId(selectedTechStackCategory);
    if (activeFace !== faceId) {
      rotateToFace(faceId);
    }
  }, [selectedTechStackCategory]);

  useEffect(() => {
    if (!platesMeshRef.current) return;

    const oldMaterials = platesMeshRef.current.material as THREE.MeshBasicMaterial[];

    const newMaterials = [
      new THREE.MeshBasicMaterial({ map: createFaceTexture('Full-Stack Web', categorizedSkills['Full-Stack Web'], NEON_PALETTE[0], selectedTechStackCategory === 'Full-Stack Web'), transparent: true }),
      new THREE.MeshBasicMaterial({ map: createFaceTexture('Design & Animation', categorizedSkills['Design & Animation'], NEON_PALETTE[1], selectedTechStackCategory === 'Design & Animation'), transparent: true }),
      new THREE.MeshBasicMaterial({ map: createFaceTexture('Infrastructure & Tools', categorizedSkills['Infrastructure & Tools'], NEON_PALETTE[2], selectedTechStackCategory === 'Infrastructure & Tools'), transparent: true }),
      new THREE.MeshBasicMaterial({ map: createFaceTexture('Core & Algorithms', categorizedSkills['Core & Algorithms'], NEON_PALETTE[3], selectedTechStackCategory === 'Core & Algorithms'), transparent: true }),
      new THREE.MeshBasicMaterial({ map: createFaceTexture('Core & Algorithms', categorizedSkills['Core & Algorithms'], NEON_PALETTE[4], selectedTechStackCategory === 'Core & Algorithms'), transparent: true }),
      new THREE.MeshBasicMaterial({ map: createFaceTexture('Infrastructure & Tools', categorizedSkills['Infrastructure & Tools'], NEON_PALETTE[5], selectedTechStackCategory === 'Infrastructure & Tools'), transparent: true }),
    ];

    platesMeshRef.current.material = newMaterials;

    if (Array.isArray(oldMaterials)) {
      oldMaterials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    }
  }, [selectedTechStackCategory]);


  return (
    <div ref={sectionRef} className="w-full">
      <section className="relative px-8 py-24 lg:px-16 bg-black border-t border-gray-900/40 w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex flex-col space-y-5 text-left">
            <div>
              <span className="font-jetbrains-mono text-[11px] uppercase tracking-widest text-purple-400">// COMPILING 3D NEON CONFIG</span>
              <h2 className="text-4xl font-extrabold tracking-tighter uppercase text-white lg:text-5xl" style={{ fontFamily: 'var(--font-clash-display)' }}>Systems Matrix</h2>
              <p className="mt-3 text-xs text-gray-600 font-jetbrains-mono leading-relaxed">Drag to rotate · Click to inspect face</p>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              {skillCategories.map((category) => {
                const faceId = categoryToFaceId(category);
                const isActive = activeFace === faceId;
                const color = NEON_PALETTE[faceId] ?? NEON_PALETTE[0];
                const hex = '#' + color.toString(16).padStart(6, '0');
                return (
                  <button
                    key={category} onClick={() => rotateToFace(faceId)}
                    className="w-full text-left font-jetbrains-mono text-[11px] uppercase border p-3.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-3"
                    style={isActive ? { borderColor: hex, background: `${hex}18`, color: hex, boxShadow: `0 0 16px ${hex}30` } : { borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(2,4,8,0.5)', color: 'rgba(156,163,175,0.8)' }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isActive ? hex : 'rgba(255,255,255,0.15)' }} />
                    ➔ {category}
                  </button>
                );
              })}
            </div>
            {isExploded && <p className="font-jetbrains-mono text-[10px] text-pink-500/60 animate-pulse pt-1">⚡ FRAGMENTING — {scrollPct}% ↓</p>}
          </div>
          <div className="lg:col-span-8 relative w-full h-[520px] rounded-3xl overflow-hidden border border-gray-900/60 bg-black">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechStackDeck;