"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type Video, ytEmbed, ytPoster, ytWatch } from "@/content/works";
import type { Dict } from "@/content/i18n";
import { track } from "@/lib/analytics";

type F = "all" | "live" | "duet" | "cover";
const ease = [0.22, 1, 0.36, 1] as const;

function Card({ v, i, d, onOpen }: { v: Video; i: number; d: Dict["music"]; onOpen: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.li layout initial={reduce ? false : { opacity: 0, y: 50, clipPath: "inset(30% 0 0 0 round 28px)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0 round 28px)" }} exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.7, delay: Math.min(i, 8) * 0.06, ease }}>
      <button type="button" onClick={onOpen} aria-label={`${d.play}: ${v.title}`}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-[#151515] text-left ring-1 ring-white/10">
        <Image src={ytPoster(v)} alt="" fill quality={95} sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110" />
        <span className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        <span className="absolute inset-0 rounded-[1.75rem] ring-2 ring-inset ring-transparent transition group-hover:ring-fuchsia/80" />

        <span className="absolute left-5 right-5 top-5 flex items-center justify-between">
          <span className="rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.2em] backdrop-blur">
            {d.filters[v.kind === "studio" ? "cover" : v.kind]}
          </span>
          <span className="font-display text-3xl italic text-white/40 transition group-hover:text-fuchsia">{String(i + 1).padStart(2, "0")}</span>
        </span>

        <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center">
          <span className="absolute inset-0 scale-75 rounded-full border-2 border-fuchsia opacity-0 transition duration-500 group-hover:scale-125 group-hover:opacity-100 group-hover:animate-ping" />
          <span className="grid h-20 w-20 scale-90 place-items-center rounded-full bg-white/15 backdrop-blur-md transition duration-300 group-hover:scale-100 group-hover:bg-fuchsia group-hover:shadow-[0_0_50px_rgba(214,40,40,.7)]">
            <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" aria-hidden><path d="M6 4l14 8-14 8z" fill="#fff" /></svg>
          </span>
        </span>

        <span className="absolute bottom-0 left-0 right-0 translate-y-2 p-6 transition-transform duration-500 group-hover:translate-y-0">
          {v.context && <span className="block text-[10px] font-semibold uppercase tracking-[.22em] text-fuchsia">{v.context}</span>}
          <span className="mt-1.5 block font-display text-3xl leading-tight">{v.title}</span>
          <span className="mt-3 flex items-center gap-3 text-xs text-mist opacity-0 transition duration-500 group-hover:opacity-100">
            <span aria-hidden className="flex h-3 items-end gap-[2px]">
              {[0.5, 1, 0.7, 0.9].map((h, k) => <span key={k} className="w-[3px] origin-bottom animate-[eq_0.9s_ease-in-out_infinite] rounded-full bg-fuchsia" style={{ height: `${h * 100}%`, animationDelay: `${k * 0.12}s` }} />)}
            </span>
            {v.vertical ? "HD · Reel" : "HD · 1080p"}
          </span>
        </span>
      </button>
    </motion.li>
  );
}

export default function MusicLibrary({ videos, d }: { videos: Video[]; d: Dict["music"] }) {
  const [f, setF] = useState<F>("all");
  const [open, setOpen] = useState<Video | null>(null);
  const list = f === "all" ? videos : videos.filter((v) => v.kind === f);

  useEffect(() => {
    if (!open) return;
    track("song_play", { id: open.id, title: open.title, from: "music_grid" });
    document.documentElement.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div role="group" aria-label={d.h1} className="mb-10 inline-flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/[.03] p-1.5">
        {(Object.keys(d.filters) as F[]).map((k) => {
          const on = f === k;
          const n = k === "all" ? videos.length : videos.filter((v) => v.kind === k).length;
          return (
            <button key={k} type="button" aria-pressed={on} onClick={() => setF(k)}
              className={`relative min-h-11 rounded-full px-5 text-sm transition-colors ${on ? "text-white" : "text-mist hover:text-ivory"}`}>
              {on && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-fuchsia shadow-[0_0_30px_rgba(214,40,40,.5)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{d.filters[k]} <span className="ml-1 text-xs opacity-60">{n}</span></span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((v, i) => <Card key={v.id} v={v} i={i} d={d} onOpen={() => setOpen(v)} />)}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-modal="true" aria-label={open.title} className="fixed inset-0 z-[90] flex items-center justify-center bg-black p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <Image src={ytPoster(open)} alt="" fill sizes="100vw" className="scale-125 object-cover opacity-25 blur-3xl" />
            <motion.div className={`relative overflow-hidden rounded-[1.75rem] bg-black shadow-[0_40px_120px_-20px_rgba(214,40,40,.5)] ring-1 ring-white/10 ${open.vertical ? "aspect-[9/16] h-[min(88svh,960px)] max-w-[94vw]" : "aspect-video w-[min(94vw,1400px,152svh)]"}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.45, ease }}>
              <iframe className="absolute inset-0 h-full w-full" src={`${ytEmbed(open.id)}&vq=hd1080`} title={`${open.title} — Surbhi Badmaliya`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
            </motion.div>
            <div className="pointer-events-none absolute bottom-8 left-8 hidden max-w-sm lg:block">
              {open.context && <p className="text-[11px] uppercase tracking-[.3em] text-fuchsia">{open.context}</p>}
              <p className="mt-2 font-display text-4xl">{open.title}</p>
              <a href={ytWatch(open.id)} target="_blank" rel="noopener noreferrer" className="pointer-events-auto mt-3 inline-block text-sm text-mist hover:text-ivory">{d.watchOn} ↗</a>
            </div>
            <button type="button" autoFocus onClick={() => setOpen(null)} aria-label="Close"
              className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl backdrop-blur hover:bg-fuchsia">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
