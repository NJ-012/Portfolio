// components/ui/GlitchShaderCanvas.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface GlitchShaderCanvasProps {
  imageSrc: string;
  isHovered: boolean;
}

export const GlitchShaderCanvas: React.FC<GlitchShaderCanvasProps> = ({ imageSrc, isHovered }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverValRef = useRef(0);
  const glitchValRef = useRef(0);
  const glitchActiveRef = useRef(false);
  const glitchTimeRef = useRef(0);
  const prevHoveredRef = useRef(isHovered);
  const animationFrameIdRef = useRef<number | null>(null);

  // Trigger brief glitch spike on hover state transition
  useEffect(() => {
    if (isHovered !== prevHoveredRef.current) {
      glitchValRef.current = 1.0;
      glitchActiveRef.current = true;
      glitchTimeRef.current = 0;
      prevHoveredRef.current = isHovered;
    }
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported in this browser.');
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        vUv.y = 1.0 - vUv.y; // Correct orientation
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uHover;
      uniform float uGlitch;
      uniform float uTime;

      void main() {
        vec2 uv = vUv;
        
        // Apply horizontal glitch displacement strips
        if (uGlitch > 0.0) {
          float strip = step(0.85, sin(uv.y * 24.0 + uTime * 50.0));
          uv.x += strip * 0.035 * sin(uTime * 90.0) * uGlitch;
        }
        
        vec4 col;
        if (uGlitch > 0.0) {
          // Chromatic aberration / RGB shift
          float r = texture2D(uTexture, uv + vec2(0.015 * uGlitch, 0.0)).r;
          float g = texture2D(uTexture, uv).g;
          float b = texture2D(uTexture, uv - vec2(0.015 * uGlitch, 0.0)).b;
          col = vec4(r, g, b, 1.0);
        } else {
          col = texture2D(uTexture, uv);
        }
        
        // Grayscale conversion based on hover state
        float gray = dot(col.rgb, vec3(0.299, 0.587, 0.114));
        vec3 finalCol = mix(vec3(gray), col.rgb, uHover);
        
        // Subtly blended CRT scanlines
        float scanline = sin(vUv.y * 300.0) * 0.045;
        finalCol -= scanline;
        
        // Vignette overlay
        float dist = length(vUv - 0.5);
        finalCol *= 1.0 - dist * 0.22;
        
        gl_FragColor = vec4(finalCol, 1.0);
      }
    `;

    // Helper to compile shaders
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Create Shader Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    // Set up full-screen quad vertices
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Set up texture bindings
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Initial placeholder texture pixels while loading image
    const placeholder = new Uint8Array([10, 12, 20, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, placeholder);

    // Load actual texture image asynchronously
    let textureLoaded = false;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      textureLoaded = true;
    };

    gl.useProgram(program);
    const hoverLoc = gl.getUniformLocation(program, 'uHover');
    const glitchLoc = gl.getUniformLocation(program, 'uGlitch');
    const timeLoc = gl.getUniformLocation(program, 'uTime');

    let startTime = performance.now();

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const loop = (now: number) => {
      const elapsedTime = (now - startTime) / 1000.0;

      // 1. Lerp grayscale/vibrancy value
      const targetHover = isHovered ? 1.0 : 0.0;
      hoverValRef.current += (targetHover - hoverValRef.current) * 0.1;

      // 2. Linear decay of active glitch timer
      if (glitchActiveRef.current) {
        glitchTimeRef.current += 0.016; // approx 16.6ms per frame
        glitchValRef.current = Math.max(0.0, 1.0 - glitchTimeRef.current / 0.25);
        if (glitchValRef.current <= 0.0) {
          glitchActiveRef.current = false;
        }
      }

      // Draw if WebGL is in focus
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0);

      gl.uniform1f(hoverLoc, hoverValRef.current);
      gl.uniform1f(glitchLoc, glitchValRef.current);
      gl.uniform1f(timeLoc, elapsedTime);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      gl.deleteTexture(texture);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [imageSrc, isHovered]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover" />;
};
