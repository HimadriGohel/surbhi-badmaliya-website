"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { Dict, Locale } from "@/content/i18n";
import { profile } from "@/content/profile";

const ease = [0.22, 1, 0.36, 1] as const;
const body = { fontFamily: "var(--nf-body), var(--nf-gu), system-ui" };

const CH_ICONS = [
  <path key="0" d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3" />,
  <g key="1"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></g>,
  <path key="2" d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  <g key="3"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></g>,
  <path key="4" d="M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm11-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z" />,
];

const RELEASES = [
  { title: "Hokaro", gu: "હોકારો", type: { en: "Folk album · 28 tracks", gu: "લોક આલ્બમ · 28 ગીતો" }, year: "2024", with: "Mayank Panchal", label: "Oaken Music", href: "https://music.apple.com/us/album/hokaro/1769844159", where: "Apple Music" },
  { title: "Janani Ni Jod", gu: "જનની ની જોડ", type: { en: "Single", gu: "સિંગલ" }, year: "2024", with: "Aastha Patel, Neha Bhatti, Mayank Panchal, Amit Kyada", label: "Coconut Media Box", href: "https://music.apple.com/us/album/janani-ni-jod-single/1750188959", where: "Apple Music" },
  { title: "Garba Room 2", gu: "ગરબા રૂમ 2", type: { en: "Album", gu: "આલ્બમ" }, year: "", with: "Kushal Chokshi, Jigardan Gadhavi & more", label: "", href: "https://www.jiosaavn.com/artist/surbhi-badmaliya-songs/JarG2fMdILw_", where: "JioSaavn" },
  { title: "Modi Garbo", gu: "મોદી ગરબો", type: { en: "Single", gu: "સિંગલ" }, year: "", with: "Jigar Badreshiya", label: "", href: "https://www.saregama.com/artist/surbhi-badmaliya_82052/songs", where: "Saregama" },
  { title: "Gulabi", gu: "ગુલાબી", type: { en: "Single", gu: "સિંગલ" }, year: "", with: "Vivek Rao", label: "", href: "https://www.jiosaavn.com/artist/surbhi-badmaliya-songs/JarG2fMdILw_", where: "JioSaavn" },
  { title: "Hu Tara Vina Kai Nai", gu: "હું તારા વિના કંઈ નઈ", type: { en: "Album", gu: "આલ્બમ" }, year: "2024", with: "Umesh Barot", label: "", href: "https://www.jiosaavn.com/song/bhulo-padyo/G1wsfjJRUWc", where: "JioSaavn" },
];

const PEOPLE = ["Raj Gadhvi", "Mayank Panchal", "Aastha Patel", "Neha Bhatti", "Amit Kyada", "Kushal Chokshi", "Jigardan Gadhavi", "Jigar Badreshiya", "Vivek Rao", "Umesh Barot", "Mukhtar Shah", "Vishwanath Batunge"];

function Kicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
      <span className="font-display text-sm italic text-fuchsia">{n}</span>
      <motion.span className="h-px bg-fuchsia" initial={{ width: 0 }} whileInView={{ width: 64 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} />
      <span className="text-[11px] uppercase tracking-[.35em] text-mist">{children}</span>
    </motion.div>
  );
}

export default function StoryExperience({ d, lang }: { d: Dict["story"]; lang: Locale }) {
  const gu = lang === "gu";
  const reduce = useReducedMotion();

  // horizontal chapter scroll
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], ["0%", `-${(d.chapters.length - 1) * 100}%`]);
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"]);

  // hero parallax
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress: hp } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const titleY = useTransform(hp, [0, 1], ["0%", reduce ? "0%" : "35%"]);
  const fade = useTransform(hp, [0, 0.8], [1, 0]);

  const title = gu ? ["તેમની", "સફર"] : ["Her", "Story"];

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section ref={hero} className="relative grid min-h-[100svh] overflow-hidden lg:grid-cols-12">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[600px] w-[600px] rounded-full bg-fuchsia/20 blur-[160px]" />
        <motion.div style={{ y: titleY, opacity: fade }} className="relative z-10 flex flex-col justify-end px-4 pb-16 pt-32 sm:px-8 lg:col-span-7 lg:px-12">
          <nav aria-label="Breadcrumb" className="text-xs text-mist">
            <Link href={`/${lang}`} className="hover:text-ivory">{gu ? "હોમ" : "Home"}</Link> <span aria-hidden>/</span> <span aria-current="page">{gu ? "સફર" : "Story"}</span>
          </nav>
          <p className="mt-8 text-[11px] uppercase tracking-[.35em] text-fuchsia">{gu ? profile.nameGu : profile.name}</p>
          <h1 className="mt-4 font-black leading-[0.82] tracking-[-0.05em]" style={{ ...body, fontSize: "clamp(4.5rem, 15vw, 13rem)" }}>
            {title.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.12em]">
                <motion.span className={`block ${i ? "font-display font-normal italic text-fuchsia" : ""}`}
                  initial={reduce ? false : { y: "105%", rotate: 3 }} animate={{ y: 0, rotate: 0 }} transition={{ delay: 0.15 + i * 0.18, duration: 1.1, ease }}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
            {d.chapters[0].d}
          </motion.p>
          <motion.div className="mt-10 flex items-center gap-4 text-xs uppercase tracking-[.3em] text-mist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <motion.span className="grid h-12 w-8 place-items-start justify-center rounded-full border border-white/30 pt-2" aria-hidden>
              <motion.span className="h-2 w-1 rounded-full bg-fuchsia" animate={reduce ? {} : { y: [0, 14, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
            </motion.span>
            {gu ? "સ્ક્રોલ કરો" : "Scroll the story"}
          </motion.div>
        </motion.div>
        {/* animated record + floating words (no photos) */}
        <div aria-hidden className="relative hidden h-[100svh] items-center justify-center lg:col-span-5 lg:flex">
          <motion.div className="relative aspect-square w-[80%] max-w-[520px] rounded-full bg-[repeating-radial-gradient(circle,#1d1d1d_0_2px,#101010_2px_6px)] shadow-[0_0_120px_-20px_rgba(214,40,40,.6)] ring-1 ring-white/10"
            animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
            <span className="absolute inset-[34%] grid place-items-center rounded-full bg-fuchsia">
              <span className="font-display text-2xl italic">Surbhi</span>
            </span>
            <span className="absolute left-1/2 top-[8%] h-[14%] w-[2px] -translate-x-1/2 bg-white/40" />
          </motion.div>
          {[["Garba", "12%", "18%"], ["Folk", "72%", "14%"], ["Devotional", "6%", "72%"], ["Live", "76%", "70%"], ["♪", "48%", "6%"], ["♫", "50%", "88%"]].map(([w, x, y], i) => (
            <motion.span key={w} className={`absolute rounded-full border border-white/15 bg-black/60 px-4 py-2 text-sm font-semibold backdrop-blur ${w.length < 2 ? "text-2xl text-fuchsia" : ""}`}
              style={{ left: x, top: y }} initial={reduce ? false : { opacity: 0, scale: 0.5 }} animate={reduce ? {} : { opacity: 1, scale: 1, y: [0, -14, 0] }}
              transition={{ opacity: { delay: 0.6 + i * 0.1 }, scale: { delay: 0.6 + i * 0.1 }, y: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" } }}>{w}</motion.span>
          ))}
        </div>
      </section>

      {/* ───────── QUOTE ───────── */}
      <section className="relative px-4 py-24 sm:px-8 lg:px-12">
        <motion.blockquote className="mx-auto max-w-5xl text-center font-display text-4xl leading-tight sm:text-6xl"
          initial="h" whileInView="s" viewport={{ once: true, margin: "-20% 0px" }}>
          <span className="text-fuchsia">“</span>
          {(gu ? "ગાયિકા, પર્ફોર્મર અને ગુજરાતી લોકસંગીતનો અવાજ" : "Singer, performer & voice of Gujarati folk music").split(" ").map((w, i) => (
            <motion.span key={i} className="inline-block" variants={{ h: { opacity: 0.12, y: 10 }, s: { opacity: 1, y: 0 } }} transition={{ delay: i * 0.08, duration: 0.6 }}>{w}&nbsp;</motion.span>
          ))}
          <span className="text-fuchsia">”</span>
        </motion.blockquote>
        <p className="mt-6 text-center text-xs uppercase tracking-[.3em] text-mist">— {gu ? "સત્તાવાર યુટ્યુબ ચેનલ પરથી" : "In her own words, official YouTube channel"}</p>
      </section>

      {/* ───────── HORIZONTAL CHAPTERS ───────── */}
      <section ref={track} className="relative" style={{ height: `${d.chapters.length * 100}svh` }} aria-label={gu ? "સફરના અધ્યાય" : "Story chapters"}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-24 sm:px-8 lg:px-12">
            <Kicker n="01">{gu ? "અધ્યાય" : "Chapters"}</Kicker>
            <div className="hidden w-64 items-center gap-3 sm:flex">
              <span className="text-[10px] uppercase tracking-[.3em] text-mist">{gu ? "પ્રગતિ" : "Progress"}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-fuchsia" style={{ width: bar }} /></div>
            </div>
          </div>
          <motion.div className="flex flex-1" style={{ x: reduce ? 0 : x }}>
            {d.chapters.map((c, i) => (
              <article key={c.k} className="relative grid w-screen shrink-0 items-center gap-8 px-4 sm:px-8 lg:grid-cols-12 lg:px-12">
                <span aria-hidden className="pointer-events-none absolute -bottom-10 right-4 select-none font-black leading-none text-white/[.04]" style={{ ...body, fontSize: "clamp(10rem, 30vw, 28rem)" }}>0{i + 1}</span>
                <div className="relative lg:col-span-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[.35em] text-fuchsia">0{i + 1} · {c.k}</p>
                  <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl" style={body}>{c.t}</h2>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">{c.d}</p>
                  <div aria-hidden className="mt-8 flex h-8 items-end gap-1">
                    {Array.from({ length: 16 }).map((_, k) => (
                      <span key={k} className="w-1 origin-bottom animate-[eq_1.1s_ease-in-out_infinite] rounded-full bg-fuchsia/80" style={{ height: `${30 + ((k * 37) % 70)}%`, animationDelay: `${k * 0.07}s` }} />
                    ))}
                  </div>
                </div>
                <div aria-hidden className="relative hidden h-[62svh] items-center justify-center lg:col-span-6 lg:flex">
                  {[0, 1, 2].map((k) => (
                    <motion.span key={k} className="absolute aspect-square rounded-full border border-fuchsia/40" style={{ width: `${40 + k * 20}%` }}
                      animate={reduce ? {} : { scale: [0.9, 1.15, 0.9], opacity: [0.6, 0.15, 0.6] }} transition={{ duration: 3, repeat: Infinity, delay: k * 0.6 }} />
                  ))}
                  <motion.span className="relative grid aspect-square w-[34%] place-items-center rounded-[2rem] bg-fuchsia shadow-[0_0_80px_rgba(214,40,40,.6)]"
                    animate={reduce ? {} : { rotate: [i % 2 ? 6 : -6, i % 2 ? -6 : 6] }} transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}>
                    <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{CH_ICONS[i % CH_ICONS.length]}</svg>
                  </motion.span>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────── RELEASES ───────── */}
      <section className="relative px-4 py-24 sm:px-8 lg:px-12">
        <Kicker n="02">{gu ? "રિલીઝ" : "Releases"}</Kicker>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl" style={body}>
          {gu ? <>રેકોર્ડ થયેલો <span className="font-display font-normal italic text-fuchsia">અવાજ</span></> : <>The recorded <span className="font-display font-normal italic text-fuchsia">voice</span></>}
        </h2>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RELEASES.map((r, i) => (
            <motion.li key={r.title} initial={reduce ? false : { opacity: 0, y: 60, rotateX: -20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease }} style={{ transformPerspective: 900 }}>
              <a href={r.href} target="_blank" rel="noopener noreferrer"
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[.06] to-transparent p-7 transition hover:-translate-y-1 hover:border-fuchsia/60">
                {/* spinning vinyl */}
                <span aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[repeating-radial-gradient(circle,#1d1d1d_0_2px,#121212_2px_5px)] opacity-60 ring-1 ring-white/10 transition-transform duration-[3s] group-hover:rotate-[360deg]">
                  <span className="absolute inset-[38%] rounded-full bg-fuchsia" />
                </span>
                <div className="relative flex items-center gap-3">
                  {r.year && <span className="rounded-full bg-fuchsia px-3 py-1 text-xs font-bold">{r.year}</span>}
                  <span className="text-[11px] uppercase tracking-[.25em] text-mist">{gu ? r.type.gu : r.type.en}</span>
                </div>
                <h3 className="relative mt-10 font-display text-4xl leading-tight">{gu ? r.gu : r.title}</h3>
                <p className="relative mt-3 text-sm text-mist">{gu ? "સાથે" : "With"} {r.with}</p>
                {r.label && <p className="relative mt-1 text-xs text-mist/70">℗ {r.label}</p>}
                <span className="relative mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                  <span className="text-fuchsia">{gu ? "સાંભળો" : "Listen on"} {r.where}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition group-hover:-rotate-45 group-hover:border-fuchsia group-hover:bg-fuchsia">→</span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* ───────── COLLABORATORS ───────── */}
      <section className="relative overflow-hidden py-24">
        <div className="px-4 sm:px-8 lg:px-12">
          <Kicker n="03">{gu ? "સહયોગી કલાકારો" : "Collaborators"}</Kicker>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl" style={body}>
            {gu ? <>સાથે <span className="font-display font-normal italic text-fuchsia">ગાયું</span></> : <>Voices she has <span className="font-display font-normal italic text-fuchsia">sung with</span></>}
          </h2>
        </div>
        {[0, 1].map((row) => (
          <div key={row} className={`mt-10 overflow-hidden ${row ? "" : "-rotate-1"}`}>
            <motion.div className="flex w-max gap-6 whitespace-nowrap" animate={reduce ? {} : { x: row ? ["-50%", "0%"] : ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
              {[...PEOPLE, ...PEOPLE].map((p, i) => (
                <span key={`${p}-${i}`} className={`flex items-center gap-6 font-black tracking-tight ${(i + row) % 3 === 0 ? "text-fuchsia" : "text-transparent [-webkit-text-stroke:1.2px_rgba(255,255,255,.45)]"}`}
                  style={{ ...body, fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
                  {p}<span className="text-white/30 [-webkit-text-stroke:0]">✦</span>
                </span>
              ))}
            </motion.div>
          </div>
        ))}
      </section>

      {/* ───────── AT A GLANCE ───────── */}
      <section className="px-4 py-24 sm:px-8 lg:px-12">
        <Kicker n="04">{d.factsTitle}</Kicker>
        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [d.facts.profession, d.facts.professionV],
            [d.facts.base, d.facts.baseV],
            [gu ? "રિલીઝ" : "Releases", gu ? "હોકારો · જનની ની જોડ · ગરબા રૂમ 2" : "Hokaro · Janani Ni Jod · Garba Room 2"],
            [gu ? "લાઇવ" : "Live", gu ? "ગુજરાત · સિડની · બ્રિસ્બેન" : "Gujarat · Sydney · Brisbane"],
          ].map(([k, v], i) => (
            <motion.div key={k} className="rounded-[1.5rem] border border-white/10 bg-white/[.03] p-6 transition hover:border-fuchsia/60"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 180, damping: 18 }}>
              <dt className="text-[10px] uppercase tracking-[.3em] text-fuchsia">{k}</dt>
              <dd className="mt-3 text-xl font-semibold leading-snug">{v}</dd>
            </motion.div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-mist/80">{d.note}</p>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="px-4 pb-8 sm:px-8 lg:px-12">
        <motion.div className="relative overflow-hidden rounded-[2.5rem] border border-fuchsia/30 bg-[radial-gradient(120%_120%_at_100%_0%,#3a1414,#111_60%)] px-6 py-16 sm:px-16 sm:py-24"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
          <div aria-hidden className="bandhani absolute inset-0 opacity-15" />
          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl" style={body}>
              {gu ? <>આગળનો અધ્યાય <span className="font-display font-normal italic text-fuchsia">તમારા મંચ</span> પર</> : <>The next chapter, <span className="font-display font-normal italic text-fuchsia">on your stage</span></>}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${lang}/booking`} className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-fuchsia py-2 pl-8 pr-2 font-semibold shadow-[0_0_40px_rgba(214,40,40,.5)]">
                {gu ? "શો બુક કરો" : "Book a show"}<span className="grid h-10 w-10 place-items-center rounded-full bg-black transition-transform group-hover:-rotate-45">→</span>
              </Link>
              <Link href={`/${lang}/music`} className="inline-flex min-h-14 items-center rounded-full border border-white/20 px-8 hover:border-fuchsia">{gu ? "સંગીત સાંભળો" : "Hear the music"}</Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
