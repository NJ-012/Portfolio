// components/ui/TrackingMeshBackground.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface GridNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
}

export const TrackingMeshBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<GridNode[][]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spacing = 55; // Grid spacing in pixels

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGrid();
    };

    const initGrid = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const grid: GridNode[][] = [];

      for (let c = 0; c < cols; c++) {
        grid[c] = [];
        for (let r = 0; r < rows; r++) {
          const x = c * spacing;
          const y = r * spacing;
          grid[c][r] = {
            x,
            y,
            baseX: x,
            baseY: y,
          };
        }
      }
      nodesRef.current = grid;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Draw dark background base
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      const grid = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const warpRadius = 250;
      const maxWarp = 45;

      // Update node positions
      for (let c = 0; c < grid.length; c++) {
        for (let r = 0; r < grid[c].length; r++) {
          const node = grid[c][r];
          let targetX = node.baseX;
          let targetY = node.baseY;

          if (mx !== -1000 && my !== -1000) {
            const dx = mx - node.baseX;
            const dy = my - node.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < warpRadius) {
              const pull = (1 - dist / warpRadius) * maxWarp;
              targetX = node.baseX + (dx / (dist || 1)) * pull;
              targetY = node.baseY + (dy / (dist || 1)) * pull;
            }
          }

          // Smooth lerping coordinates
          node.x += (targetX - node.x) * 0.08;
          node.y += (targetY - node.y) * 0.08;
        }
      }

      // Draw Grid Lines
      ctx.lineWidth = 1;
      for (let c = 0; c < grid.length; c++) {
        for (let r = 0; r < grid[c].length; r++) {
          const node = grid[c][r];

          // Draw horizontal connection line
          if (c < grid.length - 1) {
            const rightNode = grid[c + 1][r];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(rightNode.x, rightNode.y);

            // Compute line opacity based on mouse proximity for dynamic highlighting
            let opacity = 0.035;
            if (mx !== -1000 && my !== -1000) {
              const distToMouse = Math.min(
                Math.sqrt((node.x - mx) ** 2 + (node.y - my) ** 2),
                Math.sqrt((rightNode.x - mx) ** 2 + (rightNode.y - my) ** 2)
              );
              if (distToMouse < warpRadius) {
                opacity = 0.035 + (1 - distToMouse / warpRadius) * 0.06;
              }
            }
            ctx.strokeStyle = `rgba(189, 0, 255, ${opacity})`;
            ctx.stroke();
          }

          // Draw vertical connection line
          if (r < grid[c].length - 1) {
            const downNode = grid[c][r + 1];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(downNode.x, downNode.y);

            // Compute line opacity based on mouse proximity
            let opacity = 0.035;
            if (mx !== -1000 && my !== -1000) {
              const distToMouse = Math.min(
                Math.sqrt((node.x - mx) ** 2 + (node.y - my) ** 2),
                Math.sqrt((downNode.x - mx) ** 2 + (downNode.y - my) ** 2)
              );
              if (distToMouse < warpRadius) {
                opacity = 0.035 + (1 - distToMouse / warpRadius) * 0.06;
              }
            }
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx.stroke();
          }
        }
      }

      // Draw Grid Intersection Dots
      for (let c = 0; c < grid.length; c++) {
        for (let r = 0; r < grid[c].length; r++) {
          const node = grid[c][r];
          let dotColor = 'rgba(255, 255, 255, 0.08)';

          if (mx !== -1000 && my !== -1000) {
            const dist = Math.sqrt((node.x - mx) ** 2 + (node.y - my) ** 2);
            if (dist < warpRadius) {
              const pulse = (1 - dist / warpRadius);
              dotColor = `rgba(0, 240, 255, ${0.08 + pulse * 0.35})`;
            }
          }

          ctx.fillStyle = dotColor;
          ctx.fillRect(node.x - 1, node.y - 1, 2, 2);
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20 bg-black"
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  );
};
export default TrackingMeshBackground;
