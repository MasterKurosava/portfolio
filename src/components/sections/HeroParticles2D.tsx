"use client";

import { useEffect, useRef } from "react";

interface HeroParticles2DProps {
  scrollProgress: number;
}

export function HeroParticles2D({ scrollProgress }: HeroParticles2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const nodes = Array.from({ length: 20 }, () => ({
      x: 0.5 + (Math.random() - 0.5) * 0.6,
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const spread = 1 + scrollProgress * 0.8;
      const cx = w * 0.75;
      const cy = h * 0.5;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0.3 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * w;
          const dy = (nodes[i].y - nodes[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80 * spread) {
            ctx.strokeStyle = `rgba(30, 58, 74, ${0.06 * (1 - dist / (80 * spread))})`;
            ctx.beginPath();
            ctx.moveTo(cx + (nodes[i].x - 0.5) * w * 0.5 * spread, cy + (nodes[i].y - 0.5) * h * 0.6 * spread);
            ctx.lineTo(cx + (nodes[j].x - 0.5) * w * 0.5 * spread, cy + (nodes[j].y - 0.5) * h * 0.6 * spread);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [scrollProgress]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
