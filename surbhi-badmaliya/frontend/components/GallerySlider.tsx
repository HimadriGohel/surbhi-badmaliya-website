"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/content/i18n";

export type Slide = { src: string; title: string; tag: string; kind: "reel" | "video"; w: number; h: number };
type F = "all" | "reel" | "video";

const ease = [0.22, 1, 0.36, 1] as const;
const AUTO = 5000;

export default function GallerySlider({ slides, lang }: { slides: Slide[]; lang: Locale }) {
  const gu = lang === "gu";
  const reduce = useReducedMotion();
  const [f, setF] = useState<F>("all");
  const list = f === "all" ? slides : slides.filter((s) => s.kind === f);
  const [[i, dir], setI] = useState<[number, number]>([0, 1]);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const strip = useRef<HTMLUListElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const cur = list[i] ?? list[0];

  const go = useCallback((d: number) => setI(([x]) => [(x + d + list.length) % list.length, d]), [list.length]);
  const to = (n: number) => setI(([x]) => [n, n >= x ? 1 : -1]);

  useEffect(() => { setI([0, 1]); }, [f]);
  // autoplay
  useEffect(() => {
    if (!playing || hover || reduce) return;
    const id = setTimeout(() => go(1), AUTO);
    return () => clearTimeout(id);
  }, [i, playing, hover, reduce, go]);
  // keyboard
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,textarea")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go]);
  // keep active thumb in view
  useEffect(() => {
    const el = strip.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [i, reduce]);

  const full = () => { const el = frame.current; if (!el) return; if (document.fullscreenElement) void document.exitFullscreen(); else void el.requestFullscreen?.(); };

  if (!cur) return null;
  const tabs: [F, string][] = [["all", gu ? "બધા" : "All"], ["reel", gu ? "રીલ્સ" : "Reels"], ["video", gu ? "વિડિયો" : "Videos"]];

  return (
    <div>
      {/* filter */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex gap-1 rounded-full border border-white/10 bg-white/[.03] p-1.5">
          {tabs.map(([k, l]) => (
            <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}
              className={`relative min-h-11 rounded-full px-5 text-sm ${f === k ? "text-white" : "text-mist hover:text-ivory"}`}>
              {f === k && <motion.span layoutId="gal-pill" className="absolute inset-0 rounded-full bg-fuchsia" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{l} <span className="text-xs opacity-60">{k === "all" ? slides.length : slides.filter((s) => s.kind === k).length}</span></span>
            </button>
          ))}
        </div>
        <span className="text-xs uppercase tracking-[.3em] text-mist">Full HD · 1080p</span>
      </div>

      {/* main frame */}
      <div ref={frame} className="group relative overflow-hidden rounded-[2rem] bg-black ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(214,40,40,.45)] [&:fullscreen]:rounded-none"
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); touch.current = null; }}>
        <div className="relative aspect-[4/5] w-full sm:aspect-video [:fullscreen_&]:h-screen [:fullscreen_&]:aspect-auto">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div key={cur.src} className="absolute inset-0" custom={dir}
              variants={{
                enter: (d: number) => ({ x: reduce ? 0 : `${d * 12}%`, opacity: 0, scale: 1.05 }),
                center: { x: 0, opacity: 1, scale: 1 },
                exit: (d: number) => ({ x: reduce ? 0 : `${d * -12}%`, opacity: 0, scale: 0.98 }),
              }}
              initial="enter" animate="center" exit="exit" transition={{ duration: 0.8, ease }}>
              {/* blurred fill keeps vertical HD frames edge-to-edge */}
              <Image src={cur.src} alt="" fill sizes="100vw" quality={60} className="scale-125 object-cover opacity-50 blur-2xl" aria-hidden />
              <motion.div className="absolute inset-0" animate={reduce ? {} : { scale: [1, 1.04] }} transition={{ duration: AUTO / 1000 + 1, ease: "linear" }}>
                <Image src={cur.src} alt={`${cur.title} — Surbhi Badmaliya`} fill priority quality={95}
                  sizes="(min-width:1536px) 1400px, 100vw" className={cur.kind === "reel" ? "object-contain" : "object-cover"} />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* vignette + caption */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
          <AnimatePresence mode="wait">
            <motion.div key={cur.src} className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 p-6 sm:p-10"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.3em] text-fuchsia">{cur.tag}</p>
                <p className="mt-2 font-display text-3xl sm:text-5xl">{cur.title}</p>
              </div>
              <p className="shrink-0 font-display text-2xl italic text-white/70 sm:text-3xl">
                <span className="text-white">{String(i + 1).padStart(2, "0")}</span> / {String(list.length).padStart(2, "0")}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* arrows */}
          {([-1, 1] as const).map((d) => (
            <button key={d} type="button" onClick={() => go(d)} aria-label={d < 0 ? (gu ? "પાછલું" : "Previous photo") : (gu ? "આગળનું" : "Next photo")}
              className={`absolute top-1/2 grid h-16 w-16 -translate-y-1/2 place-items-center rounded-2xl border border-white/20 bg-black/40 text-2xl backdrop-blur-md transition hover:scale-110 hover:border-fuchsia hover:bg-fuchsia sm:h-20 sm:w-20 ${d < 0 ? "left-4 sm:left-6" : "right-4 sm:right-6"}`}>
              {d < 0 ? "←" : "→"}
            </button>
          ))}

          {/* top controls */}
          <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
            <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="grid h-11 w-11 place-items-center rounded-full bg-black/50 backdrop-blur hover:bg-fuchsia">{playing ? "❚❚" : "▶"}</button>
            <button type="button" onClick={full} aria-label="Fullscreen" className="grid h-11 w-11 place-items-center rounded-full bg-black/50 backdrop-blur hover:bg-fuchsia">⤢</button>
          </div>

          {/* autoplay progress */}
          <div className="absolute inset-x-0 top-0 h-1 bg-white/10">
            {playing && !hover && !reduce && (
              <motion.div key={`${cur.src}-p`} className="h-full bg-fuchsia" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: AUTO / 1000, ease: "linear" }} />
            )}
          </div>
        </div>
      </div>

      {/* thumbnails */}
      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous" className="hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 hover:border-fuchsia hover:bg-fuchsia sm:grid">←</button>
        <ul ref={strip} className="flex flex-1 gap-3 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((s, n) => {
            const on = n === i;
            return (
              <li key={s.src} className="shrink-0">
                <button type="button" onClick={() => to(n)} aria-label={s.title} aria-current={on}
                  className={`relative block h-24 overflow-hidden rounded-xl transition duration-300 sm:h-28 ${s.kind === "reel" ? "aspect-[9/16]" : "aspect-video"} ${on ? "scale-105 ring-2 ring-fuchsia" : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0"}`}>
                  <Image src={s.src} alt="" fill sizes="200px" quality={80} className="object-cover" />
                  {on && <motion.span layoutId="thumb-glow" className="absolute inset-0 rounded-xl shadow-[inset_0_0_0_2px_#d62828,0_0_24px_rgba(214,40,40,.6)]" />}
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" onClick={() => go(1)} aria-label="Next" className="hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 hover:border-fuchsia hover:bg-fuchsia sm:grid">→</button>
      </div>

      <p className="mt-6 text-xs text-mist">
        {gu ? "ફ્રેમ્સ સુરભિની સત્તાવાર યુટ્યુબ ચેનલ પરથી. " : "Frames from Surbhi's official YouTube channel. "}
        <Link href={`/${lang}/music`} className="text-fuchsia hover:underline">{gu ? "વિડિયો જુઓ →" : "Watch the videos →"}</Link>
      </p>
    </div>
  );
}
