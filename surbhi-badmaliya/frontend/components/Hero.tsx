"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { track } from "@/lib/analytics";
import type { Dict, Locale } from "@/content/i18n";
import { profile } from "@/content/profile";

// Until an HD clip exists at public/videos/surbhi-hero.mp4, a 12s photo motion loop plays in the card.
const REEL = ["garba-stage-wide", "stage-pink-blue-light", "garba-live-red-chaniya", "stage-pyro-moment"].map((n) => `/images/surbhi-badmaliya-${n}.jpg`);

// Official upload: "દરજીડા (Darjida)" — Surbhi Badmaliya & Raj Gadhvi, live in Australia.
const DARJIDA = "m0WUxwHPiYI";

const lines = { en: ["Sing.", "Garba.", "Live."], gu: ["ગાઓ.", "ગરબે ઘૂમો.", "લાઇવ."] };

export default function Hero({ d, lang, video, audio }: { d: Dict["home"]; lang: Locale; video: string | null; audio: string | null }) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const [song, setSong] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const onMic = () => {
    track("song_play", { id: DARJIDA, title: "Darjida", from: "hero_badge" });
    if (!audio) return setSong(true); // no audio file yet → fallback player
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { a.pause(); setPlaying(false); }
  };
  useEffect(() => {
    if (!song) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setSong(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [song]);

  return (
    <section aria-labelledby="hero-title"
      className="relative"
      style={{ background: "linear-gradient(135deg, #3a1d1d 0%, #8f1d1d 45%, #c4232b 100%)" }}>
      <div className="relative min-h-[100svh] w-full overflow-hidden"
        style={{ background: "radial-gradient(120% 90% at 50% 40%, #161616 55%, rgba(17,17,17,.6) 100%)" }}>

        {/* giant name — first name + surname in the same bold red, behind the card */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-[42%] select-none text-center font-black leading-[0.82] tracking-[-0.06em] text-fuchsia"
          style={{ fontFamily: "var(--nf-body), system-ui, sans-serif" }}>
          {[["surbhi", "clamp(5rem, 19vw, 17rem)"], ["badmaliya", "clamp(3.6rem, 13vw, 11.5rem)"]].map(([w, size], i) => (
            <span key={w} className="block overflow-hidden pb-[0.14em]">
              <motion.span className="block" style={{ fontSize: size }}
                initial={reduce ? false : { y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.2, duration: 1.1, ease }}>{w}</motion.span>
            </span>
          ))}
        </div>

        {/* rotating badge, top-right */}
        <motion.div className="absolute right-6 top-24 z-30 h-28 w-28 sm:h-36 sm:w-36 lg:right-20 lg:top-28 lg:h-44 lg:w-44"
          initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 0.8, ease }}>
          <motion.svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none h-full w-full" animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
            <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
            <text fill="#fff" fontSize="15" letterSpacing="4.2" style={{ fontFamily: "var(--nf-body)" }}>
              <textPath href="#circ">GUJARATI FOLK • GARBA • LIVE • BADMALIYA • </textPath>
            </text>
          </motion.svg>
          <motion.button type="button" onClick={onMic} aria-pressed={audio ? playing : undefined}
            aria-label={lang === "gu" ? "દરજીડા ગીત વગાડો" : "Play Darjida — Surbhi Badmaliya's famous Garba song"}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
            className="absolute inset-0 m-auto grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-fuchsia shadow-[0_0_30px_rgba(214,40,40,.7)] sm:h-14 sm:w-14 lg:h-16 lg:w-16">
            {!reduce && <motion.span aria-hidden className="absolute inset-0 rounded-full border-2 border-fuchsia"
              animate={{ scale: [1, 1.7], opacity: [0.7, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />}
            {playing
              ? <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6"><path fill="#fff" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
              : <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6"><path fill="none" stroke="#fff" strokeWidth="1.8" d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3" /></svg>}
          </motion.button>
          {audio && <audio ref={audioRef} src={audio} preload="none" onEnded={() => setPlaying(false)} />}
          <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] tracking-wide text-ivory/70">{playing ? "❚❚ " : "▶ "}{lang === "gu" ? "દરજીડા સાંભળો" : "Play “Darjida”"}</span>
        </motion.div>

        {/* "now singing" tag beside the card */}
        <motion.div aria-hidden className="absolute left-[calc(50%+19svh)] top-[28%] z-30 hidden items-center gap-3 rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur lg:flex"
          initial={reduce ? false : { opacity: 0, x: -20 }} animate={reduce ? {} : { opacity: 1, x: 0, y: [0, -8, 0] }}
          transition={{ opacity: { delay: 1.2 }, x: { delay: 1.2 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}>
          <span className="flex h-4 items-end gap-[3px]">
            {[0.4, 1, 0.6, 0.85].map((h, i) => (
              <motion.span key={i} className="w-[3px] rounded-full bg-fuchsia" style={{ height: "100%", originY: 1 }}
                animate={reduce ? { scaleY: h } : { scaleY: [h, 1, 0.3, h] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </span>
          <span className="text-xs font-semibold tracking-wide">Now singing · Live</span>
        </motion.div>

        <div className="relative grid min-h-[inherit] grid-rows-[auto_1fr_auto] gap-6 px-6 pb-10 pt-24 sm:px-12 lg:px-20">
          {/* headline */}
          <h1 id="hero-title" className="relative z-20 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui, sans-serif" }}>
            <span className="sr-only">{profile.name} — </span>
            {lines[lang].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.08em]">
                <motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.8, ease }}>{w}</motion.span>
              </span>
            ))}
          </h1>

          {/* phone with HD video */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              className="relative aspect-[9/17] w-[min(62vw,280px)] overflow-hidden rounded-[1.75rem] bg-night shadow-[0_30px_80px_-20px_rgba(0,0,0,.9)] lg:absolute lg:left-1/2 lg:top-1/2 lg:h-[66svh] lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2"
              initial={reduce ? false : { y: 80, opacity: 0, rotate: -4 }} animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.35, duration: 1.1, ease }}>
              {video ? (
                <video className="absolute inset-0 h-full w-full object-cover" src={video} poster="/images/surbhi-badmaliya-garba-stage-wide.jpg"
                  autoPlay muted loop playsInline preload="auto" aria-label={`${profile.name} performing live`} />
              ) : (
                <div className="absolute inset-0" aria-label={`${profile.name} on stage`} role="img">
                  {REEL.map((src, i) => (
                    <motion.img key={src} src={src} alt="" className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: "50% 30%" }}
                      initial={{ opacity: i === 0 ? 1 : 0, scale: 1.12 }}
                      animate={reduce ? { opacity: i === 0 ? 1 : 0 } : { opacity: [0, 1, 1, 0], scale: [1.12, 1.0] }}
                      transition={reduce ? {} : { duration: 4, delay: i * 3, repeat: Infinity, repeatDelay: REEL.length * 3 - 4, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }} />
                  ))}
                </div>
              )}
                </motion.div>
          </div>

          {/* bottom row */}
          <div className="relative z-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.p className="max-w-sm text-sm leading-relaxed text-ivory/85"
              initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              {d.heroLine}
            </motion.p>
            <motion.div className="flex flex-wrap gap-3" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
              <a href={profile.youtube.url} target="_blank" rel="noopener noreferrer"
                className="flex min-h-12 items-center gap-3 rounded-xl border border-white/25 bg-black px-4 py-2 shadow-[0_0_24px_-6px_rgba(214,40,40,.9)] transition hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden><path fill="#ff0000" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8Z"/><path fill="#fff" d="M9.8 15.3V8.7L15.5 12z"/></svg>
                <span className="leading-tight"><span className="block text-[10px] text-ivory/70">WATCH ON</span><span className="block text-sm font-semibold">YouTube</span></span>
              </a>
              <Link href={`/${lang}/booking`}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-white/25 bg-black px-4 py-2 shadow-[0_0_24px_-6px_rgba(214,40,40,.9)] transition hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden><path fill="none" stroke="#fff" strokeWidth="1.8" d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3"/></svg>
                <span className="leading-tight"><span className="block text-[10px] text-ivory/70">{lang === "gu" ? "શો માટે" : "BOOK A"}</span><span className="block text-sm font-semibold">{lang === "gu" ? "બુક કરો" : "Live Show"}</span></span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {song && (
          <motion.div role="dialog" aria-modal="false" aria-label="Darjida — Surbhi Badmaliya & Raj Gadhvi"
            className="fixed bottom-4 right-4 z-[60] w-[min(86vw,340px)] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-10px_rgba(214,40,40,.6)]"
            initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }}>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">દરજીડા · Darjida</p>
                <p className="truncate text-xs text-mist">Surbhi Badmaliya &amp; Raj Gadhvi · Live in Australia</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" autoFocus onClick={() => setSong(false)} aria-label={lang === "gu" ? "બંધ કરો" : "Close player"}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-fuchsia">✕</button>
              </div>
            </div>
            <div className="relative aspect-[9/16] max-h-[70svh]">
              <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${DARJIDA}?autoplay=1&rel=0&playsinline=1`}
                title="Darjida — Surbhi Badmaliya & Raj Gadhvi" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
