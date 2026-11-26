"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

// Lightweight CSS-3D scenes (no WebGL) — one per page. Decorative only: pointer-events off, aria-hidden,
// still under prefers-reduced-motion. Follows the pointer (mouse only) and rotates with scroll.
export type Variant = "rings" | "vinyl" | "spotlights" | "pages" | "cube" | "mic";

const RED = "#d62828", ROSE = "#ff4b4b", PEACH = "#ff8a7a";

function Rings() {
  return (
    <>
      {[RED, ROSE, PEACH, RED].map((c, i) => (
        <div key={i} className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${c}`, boxShadow: `0 0 30px ${c}88, inset 0 0 24px ${c}55`, transform: `rotateY(${i * 45}deg) rotateX(${i * 20}deg)` }} />
      ))}
      {/* abhla mirror discs floating in depth */}
      {Array.from({ length: 8 }, (_, i) => (
        <div key={`m${i}`} className="absolute left-1/2 top-1/2 h-5 w-5 rounded-full border border-white/60 bg-gradient-to-br from-white/70 to-fuchsia/40"
          style={{ transform: `rotateY(${i * 45}deg) translateZ(170px) translate(-50%,-50%)` }} />
      ))}
    </>
  );
}

function Vinyl() {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="absolute inset-0 rounded-full"
          style={{ transform: `translateZ(${i * -6}px)`, background: i ? "#0b0b0b" : `repeating-radial-gradient(circle, #151515 0 3px, #1f1f1f 3px 5px)`, boxShadow: i ? "none" : "0 0 60px rgba(214,40,40,.45)" }}>
          {!i && <div className="absolute inset-[34%] rounded-full" style={{ background: `radial-gradient(circle, #111 0 12%, ${RED} 13% 100%)` }} />}
        </div>
      ))}
    </>
  );
}

function Spotlights() {
  return (
    <>
      {[-30, 0, 30].map((r, i) => (
        <div key={i} className="absolute left-1/2 top-0 h-full w-28 origin-top -translate-x-1/2"
          style={{ transform: `rotateZ(${r}deg) rotateX(18deg)`, background: `linear-gradient(180deg, ${[RED, PEACH, ROSE][i]}cc, transparent 85%)`, clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", filter: "blur(2px)", opacity: 0.55 }} />
      ))}
      <div className="absolute bottom-[6%] left-1/2 h-16 w-[90%] -translate-x-1/2 rounded-[50%] bg-fuchsia/30 blur-xl" style={{ transform: "rotateX(75deg)" }} />
    </>
  );
}

function Pages() {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="absolute left-1/2 top-1/2 h-[46%] w-[32%] rounded-xl border border-white/20 bg-gradient-to-br from-[#2a2a2a] to-[#3a1414]"
          style={{ transform: `translate(-50%,-50%) rotateY(${i * 60}deg) translateZ(110px)`, boxShadow: "0 0 30px rgba(214,40,40,.35)" }}>
          <div className="m-3 space-y-2">
            <div className="h-1.5 w-1/2 rounded bg-fuchsia" />
            {[90, 70, 80, 55, 75].map((w, k) => <div key={k} className="h-1 rounded bg-white/40" style={{ width: `${w}%` }} />)}
          </div>
        </div>
      ))}
    </>
  );
}

/** Carousel of photos on a 3D ring. */
function Cube({ images = [] }: { images?: string[] }) {
  const n = Math.max(images.length, 6);
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="absolute left-1/2 top-1/2 h-[52%] w-[30%] overflow-hidden rounded-xl border-2 border-fuchsia/70 bg-[#151515]"
          style={{ transform: `translate(-50%,-50%) rotateY(${(360 / n) * i}deg) translateZ(130px)`, boxShadow: "0 0 30px rgba(214,40,40,.45)" }}>
          {images[i] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[i]} alt="" className="h-full w-full object-cover" loading="lazy" />
          )}
        </div>
      ))}
    </>
  );
}

function Mic() {
  return (
    <>
      {/* mic head: stacked rings form a 3D grille sphere */}
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="absolute left-1/2 top-[8%] h-[38%] w-[38%] -translate-x-1/2 rounded-full border border-white/40"
          style={{ transform: `translateX(-50%) rotateY(${i * 20}deg)`, boxShadow: "0 0 12px rgba(214,40,40,.35)" }} />
      ))}
      <div className="absolute left-1/2 top-[44%] h-[46%] w-[12%] -translate-x-1/2 rounded-b-full bg-gradient-to-b from-fuchsia to-[#3a1414]" />
      {[0, 1, 2].map((i) => (
        <div key={`w${i}`} className="absolute left-1/2 top-[27%] rounded-full border-2 border-fuchsia/60"
          style={{ width: `${70 + i * 30}%`, height: `${70 + i * 30}%`, transform: "translate(-50%,-50%) rotateX(70deg)", animation: `ping-3d ${2.4 + i * 0.6}s ease-out infinite ${i * 0.5}s` }} />
      ))}
    </>
  );
}

export default function Scene3D({ variant, className = "", size = 360, images }: { variant: Variant; className?: string; size?: number; images?: string[] }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 16 }), sy = useSpring(my, { stiffness: 50, damping: 16 });
  const { scrollY } = useScroll();
  const scrollSpin = useTransform(scrollY, [0, 1500], [0, 180]);
  const rotY = useTransform([sx, scrollSpin], ([x, s]: number[]) => x * 40 + s);
  const rotX = useTransform(sy, (y) => -y * 30);

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX / innerWidth - 0.5);
      my.set(e.clientY / innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, mx, my]);

  // idle spin speed per scene (seconds per turn); vinyl spins flat like a record
  const spin = { rings: 18, vinyl: 6, spotlights: 0, pages: 20, cube: 16, mic: 0 }[variant];
  const base = variant === "vinyl" ? "rotateX(62deg)" : variant === "pages" || variant === "cube" ? "rotateX(-8deg)" : "";

  return (
    <div aria-hidden className={`pointer-events-none select-none ${className}`} style={{ width: size, height: size, perspective: 1100 }}>
      <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d", rotateY: reduce ? 0 : rotY, rotateX: reduce ? 0 : rotX }}
        initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <div className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d", transform: base }}>
          <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d", animation: spin && !reduce ? `${variant === "vinyl" ? "spin-z" : "spin-y"} ${spin}s linear infinite` : undefined }}>
            {variant === "rings" && <Rings />}
            {variant === "vinyl" && <Vinyl />}
            {variant === "spotlights" && <Spotlights />}
            {variant === "pages" && <Pages />}
            {variant === "cube" && <Cube images={images} />}
            {variant === "mic" && <Mic />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
