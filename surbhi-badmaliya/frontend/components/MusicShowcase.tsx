"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Dict, Locale } from "@/content/i18n";
import { type Video, ytEmbed, ytThumb } from "@/content/works";
import { track } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;

function Eq({ on, reduce }: { on: boolean; reduce: boolean | null }) {
  return (
    <span aria-hidden className="flex h-4 items-end gap-[2px]">
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <motion.span key={i} className="w-[3px] rounded-full bg-fuchsia" style={{ height: "100%", originY: 1 }}
          animate={on && !reduce ? { scaleY: [h, 1, 0.3, h] } : { scaleY: 0.25 }}
          transition={{ duration: 0.9, repeat: on ? Infinity : 0, delay: i * 0.1 }} />
      ))}
    </span>
  );
}

export default function MusicShowcase({ list, all, d, music, lang }: { list: Video[]; all: Video[]; d: Dict["home"]; music: Dict["music"]; lang: Locale }) {
  const reduce = useReducedMotion();
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = list[cur];

  const pick = (i: number) => { setCur(i); setPlaying(false); };
  const play = () => { setPlaying(true); track("song_play", { id: v.id, title: v.title, from: "home_showcase" }); };

  return (
    <section aria-labelledby="featured" className="relative overflow-hidden py-16 sm:py-20">
      {/* moving glow */}
      <motion.div aria-hidden className="pointer-events-none absolute -top-40 h-[520px] w-[520px] rounded-full bg-fuchsia/15 blur-[140px]"
        animate={reduce ? {} : { x: ["-10vw", "80vw", "-10vw"] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative px-4 sm:px-8 lg:px-12">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="font-display text-sm italic text-fuchsia">02</span>
              <motion.span className="h-px bg-fuchsia" initial={{ width: 0 }} whileInView={{ width: 64 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} />
              <span className="text-[11px] uppercase tracking-[.35em] text-mist">Music</span>
            </motion.div>
            <motion.h2 id="featured" className="mt-4 font-display text-5xl leading-none sm:text-7xl xl:text-8xl" initial="hide" whileInView="show" viewport={{ once: true }}>
              {d.featuredTitle.split(" ").map((w, i, a) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span className={`inline-block ${i === a.length - 1 ? "italic text-fuchsia" : ""}`}
                    variants={{ hide: { y: reduce ? 0 : "110%" }, show: { y: 0 } }}
                    transition={{ delay: i * 0.1, duration: 0.9, ease }}>{w}</motion.span>
                </span>
              ))}
            </motion.h2>
            <p className="mt-3 max-w-xl text-mist">{d.featuredNote}</p>
          </div>
          <Link href={`/${lang}/music`} className="group flex items-center gap-4 rounded-full border border-white/20 py-2 pl-6 pr-2 transition hover:border-fuchsia">
            <span className="text-sm">{lang === "gu" ? "બધાં ગીતો" : "All songs"}</span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-fuchsia font-display text-sm transition-transform group-hover:rotate-[-45deg]">{all.length}</span>
          </Link>
        </div>

        {/* player + playlist */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-black ring-1 ring-white/10 sm:aspect-video">
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.iframe key={`f-${v.id}`} className="absolute inset-0 h-full w-full" src={ytEmbed(v.id)} title={`${v.title} — Surbhi Badmaliya`}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                ) : (
                  <motion.button key={`p-${v.id}`} type="button" onClick={play} aria-label={`${music.play}: ${v.title}`}
                    className="group absolute inset-0 h-full w-full text-left"
                    initial={{ opacity: 0, scale: 1.05, clipPath: "inset(0 0 0 100%)" }} animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0 0%)" }}
                    exit={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} transition={{ duration: 0.8, ease }}>
                    <motion.div className="absolute inset-0" animate={reduce ? {} : { scale: [1, 1.08] }} transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}>
                      <Image src={ytThumb(v.id)} alt="" fill sizes="(min-width:1024px) 66vw, 100vw" quality={95} className="object-cover" priority={cur === 0} />
                    </motion.div>
                    <span className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    {/* pulsing play */}
                    <span className="absolute left-1/2 top-[38%] grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center sm:top-1/2 sm:h-24 sm:w-24">
                      {!reduce && [0, 1].map((k) => (
                        <motion.span key={k} className="absolute inset-0 rounded-full border-2 border-fuchsia"
                          animate={{ scale: [1, 1.8], opacity: [0.7, 0] }} transition={{ duration: 2, repeat: Infinity, delay: k }} />
                      ))}
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-fuchsia sm:h-24 sm:w-24 shadow-[0_0_60px_rgba(214,40,40,.7)] transition-transform duration-300 group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9" aria-hidden><path d="M6 4l14 8-14 8z" fill="#fff" /></svg>
                      </span>
                    </span>
                    <span className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                      <motion.span className="block text-xs uppercase tracking-[.3em] text-fuchsia" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        Now featuring · {String(cur + 1).padStart(2, "0")}
                      </motion.span>
                      <motion.span className="mt-2 block font-display text-3xl sm:text-6xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7, ease }}>
                        {v.title}
                      </motion.span>
                      {v.context && <motion.span className="mt-2 block text-mist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>{v.context}</motion.span>}
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* playlist */}
          <ol className="flex min-w-0 flex-col gap-2 lg:col-span-4">
            {list.map((t, i) => {
              const on = i === cur;
              return (
                <motion.li key={t.id} initial={reduce ? false : { opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6, ease }}>
                  <button type="button" onClick={() => pick(i)} aria-pressed={on}
                    className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl p-2.5 pr-4 text-left transition-colors ${on ? "bg-fuchsia/15" : "hover:bg-white/5"}`}>
                    {on && <motion.span layoutId="track-bar" className="absolute inset-y-2 left-0 w-1 rounded-full bg-fuchsia" />}
                    <span className="w-6 text-center font-display text-sm italic text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image src={ytThumb(t.id)} alt="" fill sizes="192px" quality={90} className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate font-display text-lg ${on ? "text-white" : "text-ivory/85"}`}>{t.title}</span>
                      {t.context && <span className="block truncate text-xs text-mist">{t.context}</span>}
                    </span>
                    <Eq on={on && playing} reduce={reduce} />
                  </button>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* endless thumbnail strip */}
      <div className="group relative mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <motion.div className="flex w-max gap-4 group-hover:[animation-play-state:paused]"
          animate={reduce ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}>
          {[...all, ...all].map((t, i) => (
            <a key={`${t.id}-${i}`} href={`/${lang}/music`} tabIndex={i >= all.length ? -1 : 0}
              className="group/t relative h-28 w-48 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-56">
              <Image src={ytThumb(t.id)} alt={t.title} fill sizes="448px" quality={90} className="object-cover grayscale transition duration-500 group-hover/t:scale-110 group-hover/t:grayscale-0" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <span className="absolute bottom-2 left-3 right-3 truncate text-sm font-semibold">{t.title}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
