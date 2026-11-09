// Small red, white and blue firework bursts drawn on a canvas around a moving point.
import { useEffect, type RefObject } from 'react';

export interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const RED = '#B22234';
const BLUE = '#3C3B6E';
const WHITE = '#FFFFFF';
const COLORS = [RED, BLUE, WHITE] as const;
const BURST_EVERY_MS = 280;
const PARTICLES_PER_BURST = 16;

/**
 * While `active` is true, spawns a burst near `pointRef.current` every 280 ms.
 * Does nothing when the viewer prefers reduced motion.
 */
export function useFireworks(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  pointRef: RefObject<Point | null>,
  active: boolean,
): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let particles: Particle[] = [];
    let frame = 0;

    const drawStreak = (p: Particle) => {
      ctx.beginPath();
      ctx.moveTo(p.px - p.vx * 2, p.py - p.vy * 2);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.lineCap = 'round';
      for (const p of particles) {
        p.px = p.x;
        p.py = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 0.035;
        p.life -= 0.022;
        ctx.globalAlpha = Math.max(0, p.life);
        if (p.color === WHITE) {
          // White sparks get a thin blue edge so they read on a white page.
          ctx.strokeStyle = BLUE;
          ctx.lineWidth = 3.6;
          drawStreak(p);
        }
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        drawStreak(p);
      }
      ctx.globalAlpha = 1;
      particles = particles.filter((p) => p.life > 0);
      frame = particles.length ? requestAnimationFrame(tick) : 0;
    };

    const burst = () => {
      const at = pointRef.current;
      if (!at) return;
      const angle = Math.random() * Math.PI * 2;
      const dist = 18 + Math.random() * 26;
      const cx = at.x + Math.cos(angle) * dist;
      const cy = at.y + Math.sin(angle) * dist;
      for (let i = 0; i < PARTICLES_PER_BURST; i++) {
        const a = (i / PARTICLES_PER_BURST) * Math.PI * 2 + Math.random() * 0.2;
        const v = 1.3 + Math.random() * 1.4;
        particles.push({
          x: cx, y: cy, px: cx, py: cy,
          vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          life: 1, color: COLORS[i % COLORS.length] ?? RED,
        });
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    burst();
    const timer = window.setInterval(burst, BURST_EVERY_MS);
    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [canvasRef, pointRef, active]);
}
