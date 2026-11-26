"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo } from "@/content/gallery";
import type { Dict, Locale } from "@/content/i18n";

type Chapter = "all" | Photo["chapter"];

/** Contact-sheet gallery: staggered editorial columns with chapter filter + accessible lightbox. */
export default function Gallery({ photos, d, lang, filter = true }: { photos: Photo[]; d: Dict["gallery"]; lang: Locale; filter?: boolean }) {
  const [chapter, setChapter] = useState<Chapter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = chapter === "all" ? photos : photos.filter((p) => p.chapter === chapter);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const alt = (p: Photo) => (lang === "gu" ? p.altGu : p.alt);

  const close = useCallback(() => { setOpen(null); lastFocus.current?.focus(); }, []);
  const step = useCallback((n: number) => setOpen((o) => (o === null ? o : (o + n + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") {
        const f = document.querySelectorAll<HTMLElement>("#lightbox button");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); document.documentElement.style.overflow = ""; };
  }, [open, close, step]);

  const chapters = Object.keys(d.chapters) as Chapter[];

  return (
    <div>
      {filter && (
        <div role="group" aria-label={d.h1} className="mb-8 flex flex-wrap gap-2">
          {chapters.map((c) => (
            <button key={c} type="button" aria-pressed={chapter === c} onClick={() => setChapter(c)}
              className={`min-h-10 rounded-full px-4 text-sm transition ${chapter === c ? "bg-ivory text-night" : "border border-ivory/20 text-mist hover:text-ivory"}`}>
              {d.chapters[c]}
            </button>
          ))}
        </div>
      )}

      <motion.ul layout className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li layout key={p.src} className="mb-3 break-inside-avoid sm:mb-4"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}>
              <button type="button" className="group relative block w-full overflow-hidden rounded-xl"
                onClick={(e) => { lastFocus.current = e.currentTarget; setOpen(i); }} aria-label={alt(p)}>
                <Image src={p.src} alt={alt(p)} width={p.w} height={p.h} sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                  className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                  style={{ objectPosition: p.focus }} />
                <span className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="absolute bottom-2 left-3 text-[10px] uppercase tracking-[.25em] text-saffron opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  {d.chapters[p.chapter]}
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {open !== null && list[open] && (
          <motion.div id="lightbox" role="dialog" aria-modal="true" aria-label={alt(list[open])}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-night/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
            <motion.div key={list[open].src} className="relative max-h-[86vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35 }}>
              <Image src={list[open].src} alt={alt(list[open])} width={list[open].w} height={list[open].h} sizes="90vw"
                className="mx-auto h-auto max-h-[86vh] w-auto rounded-lg object-contain" />
              <p className="mt-3 text-center text-sm text-mist">{alt(list[open])}</p>
            </motion.div>
            <button ref={closeRef} type="button" onClick={close} className="absolute right-4 top-4 min-h-11 rounded-full border border-ivory/30 px-4 text-sm">{d.close} ✕</button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label={d.prev} className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/10 text-2xl hover:bg-ivory/20">‹</button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label={d.next} className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/10 text-2xl hover:bg-ivory/20">›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
