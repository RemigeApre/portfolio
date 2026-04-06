"use client";
import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import s from "./HeroScene.module.css";

/* ────────────────────────────────────────────
   Organic animated line — canvas-based

   A single vertical filament falls continuously.
   When the mouse enters the zone, it doesn't
   follow — it trembles, shivers, tenses.
   Like rain disturbed by a breath.
   ──────────────────────────────────────────── */
function useOrganicLine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  zoneRef: React.RefObject<HTMLDivElement | null>
) {
  const mouseActive = useRef(false);
  const tremor = useRef(0); // 0 = calm, 1 = full shiver

  useEffect(() => {
    const canvas = canvasRef.current;
    const zone = zoneRef.current;
    if (!canvas || !zone) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let pos = -40; // Y position of line center
    const speed = 0.6;
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

    const onEnter = () => { mouseActive.current = true; };
    const onLeave = () => { mouseActive.current = false; };
    zone.addEventListener("mouseenter", onEnter);
    zone.addEventListener("mouseleave", onLeave);

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);
      time += 0.018;

      // tremor ramps up/down smoothly
      const targetTremor = mouseActive.current ? 1 : 0;
      tremor.current += (targetTremor - tremor.current) * 0.04;

      // advance position
      pos += speed;
      const lineHalf = 36;
      if (pos > h + lineHalf + 10) {
        pos = -lineHalf - 10;
      }

      // build line: 28 segments
      const cx = w / 2;
      const segments = 28;
      const lineLen = 72;
      const tr = tremor.current;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= segments; i++) {
        const frac = i / segments;
        const py = pos - lineHalf + frac * lineLen;
        let px = cx;

        if (tr > 0.005) {
          // shiver: high-frequency lateral vibration
          const freq1 = Math.sin(time * 8 + frac * 12) * 1.8;
          const freq2 = Math.sin(time * 13 + frac * 7) * 0.9;
          const freq3 = Math.sin(time * 21 + frac * 19) * 0.4;
          // stronger in the middle of the line
          const midWeight = Math.sin(frac * Math.PI);
          px += (freq1 + freq2 + freq3) * tr * midWeight;
        }

        points.push({ x: px, y: py });
      }

      // draw smooth curve
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);

      // gradient
      const top = points[0].y;
      const bot = last.y;
      const alpha = 0.7 + tr * 0.15;
      const grad = ctx.createLinearGradient(0, top, 0, bot);
      grad.addColorStop(0, "rgba(180, 154, 74, 0)");
      grad.addColorStop(0.1, `rgba(180, 154, 74, ${alpha * 0.5})`);
      grad.addColorStop(0.5, `rgba(180, 154, 74, ${alpha})`);
      grad.addColorStop(0.9, `rgba(180, 154, 74, ${alpha * 0.5})`);
      grad.addColorStop(1, "rgba(180, 154, 74, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2 + tr * 0.4;
      ctx.lineCap = "round";
      ctx.stroke();

      // glow when trembling
      if (tr > 0.03) {
        ctx.save();
        ctx.shadowColor = `rgba(180, 154, 74, ${0.25 * tr})`;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = `rgba(180, 154, 74, ${0.1 * tr})`;
        ctx.lineWidth = 4 + tr * 2;
        ctx.stroke();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      zone.removeEventListener("mouseenter", onEnter);
      zone.removeEventListener("mouseleave", onLeave);
    };
  }, [canvasRef, zoneRef]);
}

/* ────────────────────────────────────────────
   HeroScene component
   ──────────────────────────────────────────── */
export default function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineZoneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useOrganicLine(canvasRef, lineZoneRef);

  const scrollDown = useCallback(() => {
    const el = sectionRef.current;
    if (el) {
      const next = el.nextElementSibling as HTMLElement | null;
      if (next) next.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section ref={sectionRef} className={s.scene}>
      {/* ── Atmospheric background ── */}
      <div className={s.atmosphere} aria-hidden="true" />
      <div className={s.grain} aria-hidden="true" />

      <div className={s.center}>
        <motion.p
          className={s.promise}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Des outils pensés pour votre activité,
          <br />
          utiles à vos clients, simples à vivre au quotidien.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/contact" className={s.cta}>
            <span className={s.ctaText}>
              Montrez-nous comment votre activité se vit au quotidien
            </span>
          </Link>
        </motion.div>
      </div>

      <div
        ref={lineZoneRef}
        className={s.lineZone}
        onClick={scrollDown}
        role="button"
        tabIndex={0}
        aria-label="Défiler vers la suite"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") scrollDown();
        }}
      >
        <canvas ref={canvasRef} className={s.lineCanvas} />
      </div>
    </section>
  );
}
