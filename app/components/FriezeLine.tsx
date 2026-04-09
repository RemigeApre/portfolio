"use client";
import { useRef, useEffect } from "react";
import s from "./FriezeLine.module.css";

/**
 * Animated horizontal frieze line — same visual language as the hero filament.
 * A gold segment travels left-to-right continuously.
 * 4 station nodes are drawn at fixed positions (12.5%, 37.5%, 62.5%, 87.5%).
 */
export default function FriezeLine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let progress = 0;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    const stations = [0.125, 0.375, 0.625, 0.875];

    const draw = () => {
      const w = W();
      const h = H();
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      time += 0.014;

      const startX = w * stations[0];
      const endX = w * stations[3];
      const trackLen = endX - startX;

      // organic speed: accelerates in the middle, slows at nodes
      progress += 0.0012;
      if (progress > 1.5) progress = -0.5;

      // ease function: slow at ends, faster in the middle
      const ease = (t: number) => {
        const c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c); // smoothstep
      };

      const headT = ease(progress);
      const tailT = ease(progress - 0.3);

      const headX = startX + headT * trackLen;
      const tailX = startX + tailT * trackLen;

      // 1. base line between first and last station
      ctx.beginPath();
      ctx.moveTo(startX, cy);
      ctx.lineTo(endX, cy);
      ctx.strokeStyle = "rgba(180, 154, 74, 0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. travelling segment with organic vertical breathing
      if (headX > tailX + 1) {
        const segments = 32;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const frac = i / segments;
          const x = tailX + frac * (headX - tailX);
          // micro vertical wave — breathing
          const breath = Math.sin(time * 2 + frac * Math.PI * 4) * 0.6;
          const drift = Math.sin(time * 0.8 + frac * Math.PI) * 0.3;
          const y = cy + (breath + drift);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const grad = ctx.createLinearGradient(tailX, 0, headX, 0);
        grad.addColorStop(0, "rgba(180, 154, 74, 0)");
        grad.addColorStop(0.15, "rgba(180, 154, 74, 0.5)");
        grad.addColorStop(0.5, "rgba(180, 154, 74, 0.65)");
        grad.addColorStop(0.85, "rgba(180, 154, 74, 0.45)");
        grad.addColorStop(1, "rgba(180, 154, 74, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // 3. station nodes
      for (const frac of stations) {
        const x = w * frac;

        // proximity to the segment
        const segCenter = (headX + tailX) / 2;
        const segHalf = (headX - tailX) / 2 + 30;
        const dist = Math.abs(x - segCenter);
        const proximity = Math.max(0, 1 - dist / segHalf);

        const radius = 4 + proximity * 2;
        const borderAlpha = 0.2 + proximity * 0.45;
        const fillAlpha = proximity * 0.1;

        ctx.beginPath();
        ctx.arc(x, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 154, 74, ${fillAlpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(180, 154, 74, ${borderAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={s.canvas} />;
}
