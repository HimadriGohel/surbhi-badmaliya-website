"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Photo } from "@/content/gallery";
import type { Dict, Locale } from "@/content/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export default function StageWall({ photos, d, lang }: { photos: Photo[]; d: Dict["home"]; lang: Locale }) {
  const reduce = useReducedMotion();
  // split photos into 4 columns
  const cols = [0, 1, 2, 3, 4].map((c) => photos.filter((_, i) => i % 5 === c));
  const words = d.stageTitle.split(" ");

  return (
    <section aria-labelledby="stage" className="relative grid min-h-[100svh] overflow-hidden bg-black lg:grid-cols-[minmax(340px,32%)_1fr]">
      {/* LEFT panel */}
      <div className="relative z-20 flex flex-col justify-end bg-black px-6 py-16 sm:px-12 lg:py-20">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="font-display text-sm italic text-fuchsia">03</span>
          <motion.span className="h-px bg-fuchsia" initial={{ width: 0 }} whileInView={{ width: 64 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} />
          <span className="text-[11px] uppercase tracking-[.35em] text-mist">Live</span>
        </motion.div>
        <motion.h2 id="stage" className="mt-5 text-5xl leading-[1.02] sm:text-6xl" initial="hide" whileInView="show" viewport={{ once: true }}>
          {words.map((w, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span className={`inline-block ${i < 2 ? "font-extrabold tracking-tight" : "font-display italic text-fuchsia"}`}
                style={i < 2 ? { fontFamily: "var(--nf-body), system-ui, sans-serif" } : undefined}
                variants={{ hide: { y: reduce ? 0 : "110%" }, show: { y: 0 } }} transition={{ delay: i * 0.1, duration: 0.9, ease }}>{w}</motion.span>
            </span>
          ))}
        </motion.h2>
        <motion.p className="mt-6 max-w-sm leading-relaxed text-mist" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          {d.stageBody}
        </motion.p>
        <motion.div className="mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.45 }}>
          <p className="text-[10px] uppercase tracking-[.3em] text-mist">{lang === "gu" ? "લાઇવ કાર્યક્રમો" : "Watch live"}</p>
          <Link href={`/${lang}/on-stage`} className="group mt-2 inline-flex items-center gap-3 font-semibold">
            {d.stageCta}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-fuchsia transition-transform group-hover:translate-x-1 group-hover:-rotate-45">→</span>
          </Link>
        </motion.div>
        {/* edge fade into the wall */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 -right-24 hidden w-24 bg-gradient-to-r from-black to-transparent lg:block" />
      </div>

      {/* RIGHT — tilted, endlessly scrolling photo wall */}
      <div aria-hidden className="relative h-[80svh] overflow-hidden lg:h-auto">
        <div className="absolute -inset-[14%] flex rotate-[-10deg] gap-4 sm:gap-5">
          {cols.map((col, c) => {
            const items = [...col, ...col, ...col];
            const down = c % 2 === 1;
            return (
              <motion.div key={c} className="flex w-1/3 shrink-0 flex-col sm:w-1/4 lg:w-1/5 gap-4 sm:gap-5"
                initial={{ y: down ? "-33.333%" : "0%" }}
                animate={reduce ? {} : { y: down ? ["-33.333%", "0%"] : ["0%", "-33.333%"] }}
                transition={{ duration: 28 + c * 6, repeat: Infinity, ease: "linear" }}>
                {items.map((p, i) => (
                  <motion.div key={`${p.src}-${i}`}
                    className="group relative aspect-[4/5] shrink-0 overflow-hidden rounded-[1.6rem] ring-1 ring-white/10"
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.9, delay: (i % 3) * 0.1 + c * 0.08, ease }}>
                    <Image src={p.src} alt="" fill sizes="(min-width:1024px) 22vw, 40vw" quality={90}
                      className="object-cover transition duration-700 group-hover:scale-110" style={{ objectPosition: p.focus }} />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 transition-opacity group-hover:opacity-0" />
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </div>
        {/* soft vignette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_60%_50%,transparent_55%,rgba(0,0,0,.75))]" />
      </div>
    </section>
  );
}
