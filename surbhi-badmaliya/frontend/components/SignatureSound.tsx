"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { Dict } from "@/content/i18n";
import SingerSilhouette from "./SingerSilhouette";

const NOTES = [
  { c: "♪", x: "6%", s: 28, d: 7, delay: 0, drift: 20 },
  { c: "♫", x: "22%", s: 22, d: 8, delay: 2.2, drift: -18 },
  { c: "♩", x: "78%", s: 26, d: 7.5, delay: 1.1, drift: 16 },
  { c: "♬", x: "92%", s: 24, d: 9, delay: 3.4, drift: -22 },
  { c: "♪", x: "60%", s: 18, d: 8.5, delay: 4.6, drift: 14 },
];
const SPARKS = [["14%", "20%"], ["86%", "26%"], ["8%", "70%"], ["90%", "78%"], ["50%", "4%"], ["30%", "92%"], ["70%", "94%"]];

const ICONS = [
  // dandiya sticks
  <path key="a" d="M5 19 15 5M9 19 19 5M4 20l2-2M18 6l2-2M8 20l2-2M18 4l2 2" />,
  // diya
  <path key="b" d="M12 3c1.5 2 1.5 3.5 0 5-1.5-1.5-1.5-3 0-5ZM3 12h18c0 4-4 7-9 7s-9-3-9-7Z" />,
  // film reel
  <path key="c" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM12 5.5v2M12 16.5v2M5.5 12h2M16.5 12h2" />,
];

export default function SignatureSound({ d }: { d: Dict["home"] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 15 });
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["10%", reduce ? "10%" : "-35%"]);
  const discRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 220]);
  const ease = [0.22, 1, 0.36, 1] as const;
  const words = d.soundTitle.split(" ");

  return (
    <section ref={ref} aria-labelledby="sound" className="relative overflow-hidden py-14 sm:py-16">
      {/* drifting giant word */}
      <motion.p aria-hidden style={{ x: bgX }}
        className="pointer-events-none absolute top-10 select-none whitespace-nowrap text-[22vw] font-black leading-none tracking-[-0.05em] text-white/[0.035]">
        SIGNATURE SOUND
      </motion.p>
      {/* red glow */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-fuchsia/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-4">
        {/* LEFT */}
        <div className="lg:col-span-5">
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="font-display text-sm italic text-fuchsia">01</span>
            <motion.span className="h-px bg-fuchsia" initial={{ width: 0 }} whileInView={{ width: 64 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8, ease }} />
            <span className="text-[11px] uppercase tracking-[.35em] text-mist">Sound</span>
          </motion.div>

          <h2 id="sound" className="mt-5 font-display text-5xl leading-[1.02] sm:text-7xl">
            {words.map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                <motion.span className={`inline-block ${i === words.length - 1 ? "italic text-fuchsia" : ""}`}
                  initial={reduce ? false : { y: "110%", rotate: 4 }} whileInView={{ y: 0, rotate: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.9, ease }}>{w}</motion.span>
              </span>
            ))}
          </h2>

          {/* animated waveform */}
          <svg aria-hidden viewBox="0 0 320 40" className="mt-6 h-10 w-72">
            {Array.from({ length: 40 }).map((_, i) => {
              const h = 6 + Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 30;
              return (
                <motion.rect key={i} x={i * 8} width="3.5" rx="1.75" fill={i < 14 ? "#d62828" : "rgba(255,255,255,.25)"}
                  height={h} y={20 - h / 2}
                  animate={reduce ? undefined : { height: [h, h * 0.4, h], y: [20 - h / 2, 20 - h * 0.2, 20 - h / 2] }}
                  transition={{ delay: i * 0.02, duration: 1.6 + (i % 5) * 0.2, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }} />
              );
            })}
          </svg>

          <motion.p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/75"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}>
            {d.soundBody}
          </motion.p>

          {/* spinning disc with portrait */}
          <motion.div className="relative mt-10 hidden h-40 w-40 sm:block" style={{ rotate: discRotate }} aria-hidden>
            <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,#1c1c1c_0_2px,#121212_2px_5px)] ring-1 ring-white/10" />
            <div className="absolute inset-[30%] overflow-hidden rounded-full ring-4 ring-fuchsia">
              <Image src="/images/surbhi-badmaliya-portrait-closeup.jpg" alt="" fill sizes="64px" className="object-cover" />
            </div>
          </motion.div>
        </div>

        {/* RIGHT — orbit: center portrait, three orbiting photos; click one → its story flies in */}
        <div className="relative lg:col-span-7">
          <motion.div className="relative mx-auto aspect-square w-[82%] max-w-[720px] sm:w-full lg:mr-0"
            style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
            onMouseMove={(e) => { if (reduce) return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
            onMouseLeave={() => { mx.set(0); my.set(0); }}>
            {/* floating music notes */}
            {!reduce && NOTES.map((n, i) => (
              <motion.span key={i} aria-hidden className="pointer-events-none absolute select-none font-display text-fuchsia/70"
                style={{ left: n.x, bottom: "8%", fontSize: n.s }}
                animate={{ y: [0, -360], x: [0, n.drift, 0], opacity: [0, 1, 0], rotate: [0, n.drift > 0 ? 25 : -25] }}
                transition={{ duration: n.d, delay: n.delay, repeat: Infinity, ease: "easeOut" }}>{n.c}</motion.span>
            ))}
            {/* twinkling sparkles */}
            {!reduce && SPARKS.map((p, i) => (
              <motion.span key={i} aria-hidden className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,120,120,.8)]"
                style={{ left: p[0], top: p[1] }} animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4] }}
                transition={{ duration: 2.4, delay: i * 0.45, repeat: Infinity }} />
            ))}
            {/* rotating rings */}
            <motion.div aria-hidden className="absolute inset-[4%] rounded-full border border-dashed border-white/15"
              animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
            <motion.div aria-hidden className="absolute inset-[16%] rounded-full border border-fuchsia/30"
              animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
              <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-fuchsia shadow-[0_0_16px_#d62828]" />
            </motion.div>

            {/* center photo */}
            <div className="absolute inset-[22%] z-10">
              <motion.div aria-hidden className="absolute -inset-2 rounded-full"
                style={{ background: "conic-gradient(from 0deg, #d62828, transparent 40%, #ff8a7a 60%, transparent 85%, #d62828)" }}
                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
              <div className="absolute inset-0 grid place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_40%,#2a0f10,#111_70%)] ring-4 ring-night">
                <div className="flex flex-col items-center gap-1 pt-4">
                  <SingerSilhouette className="h-[min(26vw,300px)] w-auto drop-shadow-[0_0_30px_rgba(214,40,40,.45)]" />
                  <AnimatePresence mode="wait">
                    <motion.span key={open ?? "x"} className="font-display text-lg italic text-ivory/90"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      {open === null ? "Surbhi" : d.pillars[open].t}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* orbiting photos */}
            <motion.div className="absolute inset-0" animate={reduce || open !== null ? {} : { rotate: 360 }}
              transition={{ duration: 36, repeat: Infinity, ease: "linear" }}>
              <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id="beam" x1="0" x2="1"><stop offset="0" stopColor="#d62828" stopOpacity=".9" /><stop offset="1" stopColor="#ff8a7a" stopOpacity=".2" /></linearGradient>
                </defs>
                {[0, 1, 2].map((i) => {
                  const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
                  const on = open === i;
                  return (
                    <motion.line key={i} x1="50" y1="50" x2={50 + Math.cos(a) * 42} y2={50 + Math.sin(a) * 42}
                      stroke="url(#beam)" strokeWidth={on ? 0.6 : 0.3} strokeDasharray="1.2 2.4" strokeLinecap="round"
                      animate={reduce ? {} : { strokeDashoffset: [0, -7.2] }} transition={{ duration: on ? 0.6 : 1.4, repeat: Infinity, ease: "linear" }} />
                  );
                })}
              </svg>
              {d.pillars.map((p, i) => {
                const ang = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const x = 50 + Math.cos(ang) * 42, y = 50 + Math.sin(ang) * 42;
                const on = open === i;
                return (
                  <motion.button key={p.t} type="button" aria-pressed={on} aria-label={p.t}
                    onClick={() => setOpen(on ? null : i)}
                    className="absolute h-[23%] w-[23%] rounded-full"
                    style={{ left: `${x - 11.5}%`, top: `${y - 11.5}%` }}
                    animate={reduce || open !== null ? { rotate: 0 } : { rotate: -360 }}
                    transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                    whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}>
                    <span className={`absolute -inset-1 rounded-full transition-all duration-500 ${on ? "bg-fuchsia shadow-[0_0_40px_rgba(214,40,40,.8)]" : "bg-white/15"}`} />
                    <span className={`absolute inset-0 grid place-items-center rounded-full ring-2 ring-night transition-colors duration-500 ${on ? "bg-fuchsia text-white" : "bg-[#1a1a1a] text-fuchsia"}`}>
                      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{ICONS[i]}</svg>
                    </span>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold tracking-wide text-ivory/80 sm:-bottom-7 sm:text-xs">{p.t}</span>
                    {!on && !reduce && (
                      <motion.span aria-hidden className="absolute -inset-1 rounded-full border-2 border-fuchsia"
                        animate={{ scale: [1, 1.35], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }} />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* flying info card */}
            <AnimatePresence mode="wait">
              {open !== null ? (
                <div key={open} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center lg:inset-x-auto lg:bottom-auto lg:-left-[22%] lg:top-[30%]">
                <motion.div role="status"
                  className="pointer-events-auto w-[min(92vw,360px)] rounded-3xl border border-fuchsia/40 bg-black/85 p-6 shadow-[0_30px_80px_-20px_rgba(214,40,40,.6)] backdrop-blur-md"
                  initial={{ opacity: 0, scale: 0.3, x: Math.cos((open / 3) * Math.PI * 2 - Math.PI / 2) * 260 + 200, y: Math.sin((open / 3) * Math.PI * 2 - Math.PI / 2) * 200, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, x: 120 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}>
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-fuchsia text-white shadow-[0_0_30px_rgba(214,40,40,.6)]">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{ICONS[open]}</svg>
                    </span>
                    <div className="flex-1">
                      <p className="font-display text-xs italic text-fuchsia">0{open + 1} / 03</p>
                      <h3 className="font-display text-2xl">{d.pillars[open].t}</h3>
                    </div>
                    <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-fuchsia">✕</button>
                  </div>
                  <motion.p className="mt-3 text-mist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{d.pillars[open].d}</motion.p>
                </motion.div>
                </div>
              ) : (
                <motion.p key="hint" className="absolute bottom-[4%] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[.3em] text-mist"
                  initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 2.5, repeat: Infinity }}>
                  Tap a photo
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
