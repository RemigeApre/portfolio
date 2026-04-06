"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import s from "./Nav.module.css";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showName, setShowName] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    setScrolled(y > vh * 0.15);
    setShowName(y > vh * 0.8);
  });

  return (
    <motion.nav
      className={`${s.nav} ${open ? s.open : ""} ${scrolled ? s.scrolled : ""}`}
      aria-label="Navigation principale"
    >
      {/* Left: Tarifs */}
      <div className={s.left}>
        <Link href="/tarifs" className={s.navLink}>Tarifs</Link>
      </div>

      {/* Center: brand (logo mark + name, revealed on scroll) */}
      <div className={s.brandArea}>
        <Link href="/" className={s.brand}>
          <motion.img
            src="/logo.svg"
            alt="Le Geai Informatique"
            className={s.brandMark}
            animate={{ opacity: scrolled ? 0.8 : 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.span
            className={s.brandName}
            animate={{ opacity: showName ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            Le Geai
          </motion.span>
        </Link>
      </div>

      {/* Right: Nous écrire */}
      <div className={s.right}>
        <Link href="/contact" className={s.navLink}>Nous écrire</Link>
      </div>

      {/* Mobile burger */}
      <button
        className={s.burger}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span /><span /><span />
      </button>

      {/* Mobile menu (hidden by default, shown on .open) */}
      <div className={s.mobileMenu}>
        <Link href="/tarifs" onClick={() => setOpen(false)}>Tarifs</Link>
        <Link href="/contact" onClick={() => setOpen(false)}>Nous écrire</Link>
      </div>
    </motion.nav>
  );
}
