"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { reelPoster } from "@/content/reels";
import type { Locale } from "@/content/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export default function MusicHero({ lang, reels, songs, posters }: { lang: Locale; reels: number; songs: number; posters: string[] }) {
  const gu = lang === "gu";
  const reduce = useReducedMotion();
  const words = gu ? ["રીલ્સ", "અને", "ગીતો"] : ["Reels", "&", "Songs"];
  return (
    <header className="relative overflow-hidden px-4 pb-10 pt-32 sm:px-8 sm:pt-40 lg:px-12">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[560px] w-[560px] rounded-full bg-fuchsia/20 blur-[150px]" />
      {/* fanned reel posters */}
      <div aria-hidden className="pointer-events-none absolute right-[-4%] top-24 hidden h-[520px] w-[46%] lg:block">
        {posters.slice(0, 4).map((id, i) => (
          <motion.div key={id} className="absolute top-0 aspect-[9/16] h-full overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,.9)]"
            style={{ left: `${i * 20}%`, zIndex: 4 - i }}
            initial={reduce ? false : { opacity: 0, y: 80, rotate: 0 }}
            animate={{ opacity: 1 - i * 0.12, y: i * 18, rotate: -8 + i * 6 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 1, ease }}>
            <motion.div className="relative h-full w-full" animate={reduce ? {} : { y: [0, -10, 0] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}>
              <Image src={reelPoster(id)} alt="" fill sizes="300px" quality={90} className="object-cover" priority={i === 0} />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-xs text-mist">
          <a href={`/${lang}`} className="hover:text-ivory">{gu ? "હોમ" : "Home"}</a> <span aria-hidden>/</span> <span aria-current="page">{gu ? "સંગીત" : "Music"}</span>
        </nav>
        <p className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[.35em] text-fuchsia">
          <span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia" /> @SurbhiBadmaliyaMusic
        </p>
        <motion.h1 className="mt-4 text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-8xl xl:text-9xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}
          initial="hide" animate="show">
          {words.map((w, i) => (
            <span key={w} className="mr-[0.2em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className={`inline-block ${i === 1 ? "font-display font-normal italic text-fuchsia" : ""}`}
                variants={{ hide: { y: reduce ? 0 : "110%" }, show: { y: 0 } }} transition={{ delay: 0.1 + i * 0.12, duration: 0.9, ease }}>{w}</motion.span>
            </span>
          ))}
        </motion.h1>
        <motion.p className="mt-6 max-w-xl text-lg text-mist" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {gu ? "ગરબા, લોકગીત, ભક્તિ અને લાઇવ પળો — સુરભિની સત્તાવાર ચેનલ પરથી, Full HD માં." : "Garba, folk, devotional and live moments — straight from Surbhi's official channel, in full HD."}
        </motion.p>
        <motion.dl className="mt-10 flex gap-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {[[reels, gu ? "રીલ્સ" : "Reels"], [songs, gu ? "ગીતો" : "Songs"], ["HD", "1080p"]].map(([n, l]) => (
            <div key={String(l)}>
              <dd className="font-display text-5xl">{n}</dd>
              <dt className="mt-1 text-[10px] uppercase tracking-[.3em] text-mist">{l}</dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </header>
  );
}
