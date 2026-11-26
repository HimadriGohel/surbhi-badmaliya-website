"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type Reel, reelEmbed, reelPoster } from "@/content/reels";
import type { Locale } from "@/content/i18n";
import { track } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;

function ReelCard({ r, i, lang, onOpen }: { r: Reel; i: number; lang: Locale; onOpen: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.li className="snap-start" initial={reduce ? false : { opacity: 0, y: 60, rotate: 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: "0px -5% 0px 0px" }}
      transition={{ duration: 0.8, delay: Math.min(i, 6) * 0.07, ease }}>
      <motion.button type="button" onClick={onOpen} aria-label={`Play reel: ${r.title}`}
        className="group relative block aspect-[9/16] w-[62vw] overflow-hidden rounded-[1.75rem] bg-[#151515] text-left ring-1 ring-white/10 sm:w-[260px] xl:w-[290px]"
        whileHover={reduce ? {} : { y: -10 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
        <Image src={reelPoster(r.id)} alt="" fill sizes="(min-width:1280px) 290px, (min-width:640px) 260px, 62vw" quality={95}
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
        {/* gradients + shine */}
        <span className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        <span className="absolute inset-0 rounded-[1.75rem] ring-2 ring-inset ring-transparent transition group-hover:ring-fuchsia/80" />
        {/* top bar */}
        <span className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <span className="flex items-center gap-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.2em] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia" /> Reel
          </span>
          <span className="font-display text-sm italic text-white/70">{String(i + 1).padStart(2, "0")}</span>
        </span>
        {/* play */}
        <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full bg-fuchsia/90 opacity-0 shadow-[0_0_40px_rgba(214,40,40,.7)] transition duration-300 group-hover:scale-100 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" aria-hidden><path d="M6 4l14 8-14 8z" fill="#fff" /></svg>
        </span>
        {/* caption */}
        <span className="absolute bottom-0 left-0 right-0 p-5">
          {r.tag && <span className="block text-[10px] font-semibold uppercase tracking-[.25em] text-fuchsia">{r.tag}</span>}
          <span className="mt-1 block font-display text-2xl leading-tight">{lang === "gu" && r.gu ? r.gu : r.title}</span>
          <span aria-hidden className="mt-3 flex h-4 items-end gap-[3px] opacity-60 transition group-hover:opacity-100">
            {[0.4, 0.9, 0.6, 1, 0.5, 0.8].map((h, k) => (
              <span key={k} className="w-[3px] origin-bottom rounded-full bg-white group-hover:animate-[eq_0.9s_ease-in-out_infinite]" style={{ height: `${h * 100}%`, animationDelay: `${k * 0.1}s` }} />
            ))}
          </span>
        </span>
      </motion.button>
    </motion.li>
  );
}

export function ReelRow({ reels, title, kicker, lang, onOpen }: { reels: Reel[]; title: string; kicker: string; lang: Locale; onOpen: (i: number) => void }) {
  const row = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const scroll = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });
  const onScroll = () => {
    const el = row.current; if (!el) return;
    setEdge({ start: el.scrollLeft < 10, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 10 });
  };
  return (
    <section className="relative py-10">
      <div className="flex items-end justify-between gap-6 px-4 sm:px-8 lg:px-12">
        <div>
          <p className="text-[11px] uppercase tracking-[.35em] text-fuchsia">{kicker} · {reels.length}</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}>{title}</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          {([-1, 1] as const).map((d) => (
            <button key={d} type="button" onClick={() => scroll(d)} disabled={d < 0 ? edge.start : edge.end}
              aria-label={d < 0 ? "Scroll left" : "Scroll right"}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-xl transition hover:border-fuchsia hover:bg-fuchsia disabled:opacity-30 disabled:hover:bg-transparent">
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>
      <ul ref={row} onScroll={onScroll}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-6 pt-3 [scrollbar-width:none] sm:scroll-px-8 sm:gap-5 sm:px-8 lg:scroll-px-12 lg:px-12 [&::-webkit-scrollbar]:hidden">
        {reels.map((r, i) => <ReelCard key={r.id} r={r} i={i} lang={lang} onOpen={() => onOpen(i)} />)}
      </ul>
    </section>
  );
}

export function ReelViewer({ reels, index, onClose, onIndex, lang }: { reels: Reel[]; index: number | null; onClose: () => void; onIndex: (i: number) => void; lang: Locale }) {
  const go = useCallback((d: number) => { if (index === null) return; onIndex((index + d + reels.length) % reels.length); }, [index, reels.length, onIndex]);
  const startY = useRef<number | null>(null);
  useEffect(() => {
    if (index === null) return;
    track("song_play", { id: reels[index].id, title: reels[index].title, from: "reel" });
    document.documentElement.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") go(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.documentElement.style.overflow = ""; };
  }, [index, go, onClose, reels]);

  const r = index !== null ? reels[index] : null;
  return (
    <AnimatePresence>
      {r && (
        <motion.div role="dialog" aria-modal="true" aria-label={r.title} className="fixed inset-0 z-[90] flex items-center justify-center bg-black"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          onTouchStart={(e) => { startY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => { if (startY.current === null) return; const dy = e.changedTouches[0].clientY - startY.current; if (Math.abs(dy) > 60) go(dy < 0 ? 1 : -1); startY.current = null; }}>
          {/* blurred poster backdrop */}
          <Image key={`bg-${r.id}`} src={reelPoster(r.id)} alt="" fill sizes="100vw" className="scale-125 object-cover opacity-30 blur-3xl" />
          <AnimatePresence mode="wait">
            <motion.div key={r.id} className="relative aspect-[9/16] h-[min(88svh,960px)] max-w-[94vw] overflow-hidden rounded-[2rem] bg-black shadow-[0_40px_120px_-20px_rgba(214,40,40,.5)] ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -60, scale: 0.94 }}
              transition={{ duration: 0.45, ease }}>
              <Image src={reelPoster(r.id)} alt="" fill sizes="540px" quality={95} className="object-cover" priority />
              <iframe className="absolute inset-0 h-full w-full" src={reelEmbed(r.id)} title={`${r.title} — Surbhi Badmaliya`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
            </motion.div>
          </AnimatePresence>

          {/* side info (desktop) */}
          <div className="pointer-events-none absolute bottom-10 left-10 hidden max-w-xs lg:block">
            <p className="text-[11px] uppercase tracking-[.3em] text-fuchsia">{r.tag}</p>
            <p className="mt-2 font-display text-4xl">{lang === "gu" && r.gu ? r.gu : r.title}</p>
            <p className="mt-3 text-sm text-mist">{index! + 1} / {reels.length}</p>
          </div>

          <button type="button" onClick={onClose} aria-label="Close" autoFocus
            className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl backdrop-blur hover:bg-fuchsia">✕</button>
          <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-3">
            <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous reel"
              className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl backdrop-blur hover:bg-fuchsia">↑</button>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next reel"
              className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl backdrop-blur hover:bg-fuchsia">↓</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ReelsSection({ folk, live, lang }: { folk: Reel[]; live: Reel[]; lang: Locale }) {
  const gu = lang === "gu";
  const [view, setView] = useState<{ list: Reel[]; i: number } | null>(null);
  return (
    <>
      <ReelRow reels={folk} lang={lang} kicker={gu ? "રીલ્સ" : "Reels"} title={gu ? "લોકગીત અને ગરબા" : "Folk & Garba"} onOpen={(i) => setView({ list: folk, i })} />
      <ReelRow reels={live} lang={lang} kicker={gu ? "રીલ્સ" : "Reels"} title={gu ? "નવરાત્રિ અને લાઇવ પળો" : "Navratri & live moments"} onOpen={(i) => setView({ list: live, i })} />
      <ReelViewer reels={view?.list ?? []} index={view ? view.i : null} lang={lang}
        onClose={() => setView(null)} onIndex={(i) => setView((v) => (v ? { ...v, i } : v))} />
    </>
  );
}
