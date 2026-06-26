// components/sections/HeroSection.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import styles from './HeroSection.module.css';
import { PixelNameCanvas } from '../ui/PixelNameCanvas';
import { TerminalTypewriter } from '../ui/TerminalTypewriter';

const NEON_COLORS = {
  R: 0xE0E0E0, // Right: Pure White/Matrix Silver
  L: 0x00FFC4, // Left: Bright Emerald/Teal
  U: 0x8A2BE2, // Top: Electric Purple
  D: 0x4B0082, // Bottom: Deep Violet
  F: 0x00F0FF, // Front: Neon Cyan
  B: 0xFF007F  // Back: Neon Pink/Magenta
};

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const engineRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    meshGroup: THREE.Group;
    cubeGroup: THREE.Group;
    cubies: THREE.Group[];
    outerMat: THREE.MeshBasicMaterial;
  } | null>(null);

  const isAnimatingRef = useRef(false);
  const gameActiveRef = useRef(false);

  useEffect(() => {
    gameActiveRef.current = gameActive;
  }, [gameActive]);

  useEffect(() => {
    setIsClient(true);
    const updateMousePosition = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // --- GROUP A: Background Mesh (Geodesic Wireframe Sphere) ---
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    const outerGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const outerMat = new THREE.MeshBasicMaterial({ color: 0x9d4edd, wireframe: true, transparent: true, opacity: 0.35 });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    meshGroup.add(outerMesh);

    const innerGeo = new THREE.IcosahedronGeometry(0.7, 0);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.5 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    meshGroup.add(innerMesh);

    // --- GROUP B: Solid Opaque Neon Rubik's Cube ---
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    cubeGroup.rotation.set(0.45, -0.6, 0);

    if (gameActiveRef.current) {
      meshGroup.scale.set(0, 0, 0);
      cubeGroup.scale.set(1.35, 1.35, 1.35);
    } else {
      meshGroup.scale.set(1, 1, 1);
      cubeGroup.scale.set(0, 0, 0);
    }

    const cubies: THREE.Group[] = [];
    const sizeUnit = 0.58;

    // Define 6 distinct materials for the Rubik-style cube faces
    const faceMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xE0E0E0, roughness: 0.15, metalness: 0.8 }), // Right (+X)
      new THREE.MeshStandardMaterial({ color: 0x00FFC4, roughness: 0.15, metalness: 0.8 }), // Left (-X)
      new THREE.MeshStandardMaterial({ color: 0x8A2BE2, roughness: 0.15, metalness: 0.8 }), // Top (+Y)
      new THREE.MeshStandardMaterial({ color: 0x4B0082, roughness: 0.15, metalness: 0.8 }), // Bottom (-Y)
      new THREE.MeshStandardMaterial({ color: 0x00F0FF, roughness: 0.15, metalness: 0.8 }), // Front (+Z)
      new THREE.MeshStandardMaterial({ color: 0xFF007F, roughness: 0.15, metalness: 0.8 })  // Back (-Z)
    ];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubieContainer = new THREE.Group();
          cubieContainer.position.set(x * sizeUnit, y * sizeUnit, z * sizeUnit);

          const bodyGeo = new THREE.BoxGeometry(sizeUnit * 0.97, sizeUnit * 0.97, sizeUnit * 0.97);
          const bodyMesh = new THREE.Mesh(bodyGeo, faceMaterials);
          cubieContainer.add(bodyMesh);

          // NEON EDGES: Overlay glowing wireframe outlines around the solid bodies
          const edgeGeo = new THREE.EdgesGeometry(bodyGeo);
          
          let lineColor = 0x222225;
          if (x === 1) lineColor = NEON_COLORS.R;
          else if (x === -1) lineColor = NEON_COLORS.L;
          else if (y === 1) lineColor = NEON_COLORS.U;
          else if (y === -1) lineColor = NEON_COLORS.D;
          else if (z === 1) lineColor = NEON_COLORS.F;
          else if (z === -1) lineColor = NEON_COLORS.B;

          const edgeMat = new THREE.LineBasicMaterial({ color: lineColor, linewidth: 2.5 });
          const lineSegments = new THREE.LineSegments(edgeGeo, edgeMat);
          cubieContainer.add(lineSegments);

          cubeGroup.add(cubieContainer);
          cubies.push(cubieContainer);
        }
      }
    }

    engineRef.current = { scene, camera, renderer, meshGroup, cubeGroup, cubies, outerMat };

    // --- Interaction Slicers ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let intersectCubie: THREE.Group | null = null;

    const getMousePositionOnCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!gameActiveRef.current) return;
      getMousePositionOnCanvas(e as unknown as MouseEvent);

      raycaster.setFromCamera(pointer, camera);
      const hitTargets = cubies.map(c => c.children[0]);
      const intersects = raycaster.intersectObjects(hitTargets);

      if (intersects.length > 0) {
        intersectCubie = intersects[0].object.parent as THREE.Group;
        canvas.setPointerCapture(e.pointerId);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!gameActiveRef.current || !intersectCubie) return;

      const prevX = pointer.x;
      const prevY = pointer.y;
      getMousePositionOnCanvas(e as unknown as MouseEvent);

      const deltaX = pointer.x - prevX;
      const deltaY = pointer.y - prevY;

      if (Math.abs(deltaX) > 0.05 || Math.abs(deltaY) > 0.05) {
        const localPos = intersectCubie.position.clone();
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          rotateLayer('y', localPos.y, deltaX > 0 ? -Math.PI / 2 : Math.PI / 2);
        } else {
          rotateLayer('x', localPos.x, deltaY > 0 ? -Math.PI / 2 : Math.PI / 2);
        }
      }

      intersectCubie = null;
      canvas.releasePointerCapture(e.pointerId);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);

    // --- Global View Camera Orbit ---
    let isDraggingGlobal = false;
    let prevGlobalMouse = { x: 0, y: 0 };

    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (!gameActiveRef.current || intersectCubie) return;
      isDraggingGlobal = true;
      prevGlobalMouse = { x: e.clientX, y: e.clientY };
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingGlobal) return;
      const dx = e.clientX - prevGlobalMouse.x;
      const dy = e.clientY - prevGlobalMouse.y;
      cubeGroup.rotation.y += dx * 0.007;
      cubeGroup.rotation.x += dy * 0.007;
      prevGlobalMouse = { x: e.clientX, y: e.clientY };
    };

    const handleGlobalMouseUp = () => { isDraggingGlobal = false; };

    canvas.addEventListener('mousedown', handleGlobalMouseDown);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    let animId: number;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const trackGlobalMouse = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', trackGlobalMouse);

    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      if (!gameActiveRef.current) {
        // Continuous passive base rotation
        const passiveRotX = time * 0.08;
        const passiveRotY = time * 0.12;

        // Target rotation combining passive rotation and NDC cursor tilt tracking
        const targetRotX = passiveRotX + (-targetMouseY * 0.35);
        const targetRotY = passiveRotY + (targetMouseX * 0.35);

        // Target translation mapping NDC coordinates to physical offsets next to the card
        const targetTransX = targetMouseX * 0.45;
        const targetTransY = targetMouseY * 0.45;

        // Cushioned anti-gravity movement with a LERP factor of exactly 0.05
        meshGroup.rotation.x += (targetRotX - meshGroup.rotation.x) * 0.05;
        meshGroup.rotation.y += (targetRotY - meshGroup.rotation.y) * 0.05;
        meshGroup.position.x += (targetTransX - meshGroup.position.x) * 0.05;
        meshGroup.position.y += (targetTransY - meshGroup.position.y) * 0.05;

        outerMat.opacity = Math.sin(time * 2.5) * 0.12 + 0.38;
      } else {
        if (!isDraggingGlobal) {
          cubeGroup.rotation.y += 0.002;
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', trackGlobalMouse);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      renderer.dispose(); outerGeo.dispose(); outerMat.dispose(); innerGeo.dispose(); innerMat.dispose();
      faceMaterials.forEach(m => m.dispose());
    };
  }, [isClient]);

  const rotateLayer = (axis: 'x' | 'y' | 'z', thresholdValue: number, angle: number) => {
    const engine = engineRef.current;
    if (!engine || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const tempGroup = new THREE.Group();
    engine.cubeGroup.add(tempGroup);

    const sliceCubies: THREE.Group[] = [];
    const epsilon = 0.1;

    engine.cubies.forEach((cubie) => {
      const pos = cubie.position.clone();
      let isMatch = false;
      if (axis === 'x' && Math.abs(pos.x - thresholdValue) < epsilon) isMatch = true;
      if (axis === 'y' && Math.abs(pos.y - thresholdValue) < epsilon) isMatch = true;
      if (axis === 'z' && Math.abs(pos.z - thresholdValue) < epsilon) isMatch = true;
      if (isMatch) sliceCubies.push(cubie as unknown as THREE.Group);
    });

    sliceCubies.forEach((cubie) => tempGroup.attach(cubie));

    const duration = 180;
    const startTime = performance.now();
    const initialRot = tempGroup.rotation[axis];

    const stepAnim = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      tempGroup.rotation[axis] = initialRot + angle * progress;

      if (progress < 1) {
        requestAnimationFrame(stepAnim);
      } else {
        tempGroup.updateMatrixWorld();
        sliceCubies.forEach((cubie) => {
          engine.cubeGroup.attach(cubie);
          cubie.position.x = Math.round(cubie.position.x * 100) / 100;
          cubie.position.y = Math.round(cubie.position.y * 100) / 100;
          cubie.position.z = Math.round(cubie.position.z * 100) / 100;
        });
        engine.cubeGroup.remove(tempGroup);
        isAnimatingRef.current = false;
      }
    };
    requestAnimationFrame(stepAnim);
  };

  const activateGameDeck = () => {
    const engine = engineRef.current;
    if (!engine) return;
    setGameActive(true);

    let start: number | null = null;
    const duration = 400;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      engine.meshGroup.scale.set(1 - progress, 1 - progress, 1 - progress);
      engine.cubeGroup.scale.set(progress * 1.35, progress * 1.35, progress * 1.35);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const deactivateGameDeck = () => {
    const engine = engineRef.current;
    if (!engine) return;

    let start: number | null = null;
    const duration = 400;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      engine.cubeGroup.scale.set(1.35 * (1 - progress), 1.35 * (1 - progress), 1.35 * (1 - progress));
      engine.meshGroup.scale.set(progress, progress, progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setGameActive(false);
      }
    };
    requestAnimationFrame(step);
  };

  const backgroundStyle = { '--mouse-x': `${mousePosition.x}px`, '--mouse-y': `${mousePosition.y}px` };

  return (
    <section ref={heroRef} className={styles.heroWrapper} style={backgroundStyle as React.CSSProperties}>
      <div className={styles.matrixGrid} />
      <div className={styles.particleContainer} />

      <div className="absolute inset-0 z-10 flex items-center px-8 md:px-16 lg:px-32 max-w-7xl mx-auto w-full py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-items-center w-full">
          {/* Left Column: Text & Typewriter */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-6 text-left w-full">
            <div className="flex items-center space-x-3 rounded border border-purple-500/20 bg-purple-500/5 px-3 py-1 font-jetbrains-mono text-[11px] text-purple-400 uppercase tracking-widest self-start">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" />
              <span>[ CORE ENGINE: NEON_MATRIX_ONLINE ]</span>
            </div>
            
            {/* Responsive canvas wrapper for interactive pixel assembly typography */}
            <div className="w-full relative select-none">
              <PixelNameCanvas />
            </div>

            {/* Sequential high-tech terminal typing sequence */}
            <TerminalTypewriter />
          </div>

          {/* Right Column: 3D Geodesic Web & Rubik Cube Viewer */}
          <div className="md:col-span-5 relative w-full h-[380px] md:h-[500px] flex flex-col items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none z-10" />
            
            <div className="absolute bottom-2 flex flex-col items-center justify-center w-full z-20">
              <AnimatePresence mode="wait">
                {!gameActive ? (
                  <motion.button
                    key="fun-btn" onClick={activateGameDeck}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0,255,204,0.3)' }}
                    className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md px-5 py-2.5 font-jetbrains-mono text-xs font-bold text-cyan-400 shadow-[0_0_20px_rgba(0,255,204,0.15)] uppercase tracking-wider cursor-pointer"
                  >
                    ✦ Let's have some fun? ✦
                  </motion.button>
                ) : (
                  <motion.button
                    key="done-btn" onClick={deactivateGameDeck}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255,0,85,0.3)' }}
                    className="rounded-xl border border-pink-500/40 bg-pink-500/10 backdrop-blur-md px-5 py-2.5 font-jetbrains-mono text-xs font-bold text-pink-400 shadow-[0_0_20px_rgba(255,0,85,0.15)] uppercase tracking-wider cursor-pointer"
                  >
                    ➔ Done for now, continue
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="absolute top-2 right-2 font-jetbrains-mono text-[8px] text-gray-700 pointer-events-none select-none uppercase z-20">
              {!gameActive ? 'STATE: WIREFRAME_PASSIVE' : 'STATE: NEON_TACTILE_ACTIVE'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;