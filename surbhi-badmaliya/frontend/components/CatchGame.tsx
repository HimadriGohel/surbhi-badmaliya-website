"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/content/i18n";

// "Catch DARJIDA" — catch the falling letters in order to unlock the song.
const WORD = "DARJIDA";
const DECOYS = "BCEGHKLMNOPSTUVWY";
const DARJIDA_ID = "m0WUxwHPiYI";
const LIVES = 3;

type Drop = { id: number; ch: string; x: number; y: number; v: number; rot: number; target: boolean };

export default function CatchGame({ lang, audio }: { lang: Locale; audio: string | null }) {
  const gu = lang === "gu";
  const box = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "win" | "lose">("idle");
  const [got, setGot] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [px, setPx] = useState(50); // catcher x, %
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const st = useRef({ got: 0, lives: LIVES, px: 50, id: 0, last: 0, spawn: 0, keys: { l: false, r: false } });
  const raf = useRef(0);
  const dropsRef = useRef<Drop[]>([]);

  const start = () => {
    st.current = { ...st.current, got: 0, lives: LIVES, px: 50, id: 0, last: performance.now(), spawn: 0 };
    setGot(0); setLives(LIVES); setDrops([]); dropsRef.current = []; setPx(50); setPhase("play");
    audioRef.current?.load(); // unlock audio on this user gesture
  };

  const win = useCallback(() => {
    setPhase("win");
    const a = audioRef.current;
    if (a) { a.currentTime = 0; void a.play().catch(() => {}); }
  }, []);

  // pointer / touch control
  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect(); if (!r) return;
    const p = Math.min(94, Math.max(6, ((clientX - r.left) / r.width) * 100));
    st.current.px = p; setPx(p);
  };

  // keyboard
  useEffect(() => {
    const d = (e: KeyboardEvent, v: boolean) => {
      if (phase !== "play") return;
      if (e.key === "ArrowLeft" || e.key === "a") { st.current.keys.l = v; e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "d") { st.current.keys.r = v; e.preventDefault(); }
    };
    const dn = (e: KeyboardEvent) => d(e, true), up = (e: KeyboardEvent) => d(e, false);
    window.addEventListener("keydown", dn); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, [phase]);

  // game loop
  useEffect(() => {
    if (phase !== "play") return;
    const tick = (now: number) => {
      const s = st.current;
      const dt = Math.min(0.05, (now - s.last) / 1000); s.last = now;
      if (s.keys.l) { s.px = Math.max(6, s.px - 70 * dt); setPx(s.px); }
      if (s.keys.r) { s.px = Math.min(94, s.px + 70 * dt); setPx(s.px); }

      {
        let next = dropsRef.current.map((d) => ({ ...d, y: d.y + d.v * dt, rot: d.rot + 40 * dt }));
        // spawn
        s.spawn -= dt;
        if (s.spawn <= 0) {
          s.spawn = 0.85 - Math.min(0.35, s.got * 0.04);
          const need = WORD[s.got];
          const target = Math.random() < 0.55;
          next.push({ id: ++s.id, ch: target ? need : DECOYS[Math.floor(Math.random() * DECOYS.length)], x: 6 + Math.random() * 88,
            y: -8, v: 22 + Math.random() * 10 + s.got * 2, rot: Math.random() * 40 - 20, target });
        }
        // collisions with catcher (bottom ~ 86–94%)
        const keep: Drop[] = [];
        for (const d of next) {
          const caught = d.y > 82 && d.y < 94 && Math.abs(d.x - s.px) < 8;
          if (caught) {
            if (d.ch === WORD[s.got]) {
              s.got++; setGot(s.got); setFlash("ok");
              if (s.got >= WORD.length) { win(); break; }
            } else {
              s.lives--; setLives(s.lives); setFlash("bad");
              if (s.lives <= 0) { setPhase("lose"); break; }
            }
            setTimeout(() => setFlash(null), 250);
            continue;
          }
          if (d.y < 110) keep.push(d);
        }
        dropsRef.current = keep;
        setDrops(keep);
      }
      raf.current = requestAnimationFrame(tick);
    };
    st.current.last = performance.now();
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, win]);

  const t = {
    title: gu ? "દરજીડા પકડો" : "Catch DARJIDA",
    sub: gu ? "ઉપરથી પડતા અક્ષરો ક્રમમાં પકડો — D A R J I D A. બધા પકડાય એટલે ગીત વાગશે!" : "Catch the falling letters in order — D A R J I D A. Spell it all and the song starts playing!",
    how: gu ? "માઉસ / ટચથી માઇક ખસેડો અથવા ← → દબાવો. ખોટો અક્ષર = એક જીવ ઓછો." : "Move the mic with your mouse / finger or ← → keys. Wrong letter = one life lost.",
    play: gu ? "રમો" : "Play", again: gu ? "ફરી રમો" : "Play again",
    win: gu ? "શાબાશ! દરજીડા વાગી રહ્યું છે 🎶" : "You did it! Darjida is playing 🎶",
    lose: gu ? "અરે! ફરી પ્રયત્ન કરો" : "Oops! Try again",
  };

  return (
    <section aria-labelledby="game" className="relative overflow-hidden px-4 py-16 sm:px-8 lg:px-12">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-fuchsia/15 blur-[140px]" />
      {audio && <audio ref={audioRef} src={audio} preload="auto" />}
      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm italic text-fuchsia">05</span><span className="h-px w-16 bg-fuchsia" />
            <span className="text-[11px] uppercase tracking-[.35em] text-mist">{gu ? "રમત" : "Play"}</span>
          </div>
          <h2 id="game" className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}>{t.title}</h2>
          <p className="mt-4 max-w-sm text-mist">{t.sub}</p>
          <p className="mt-2 max-w-sm text-sm text-mist/70">{t.how}</p>

          {/* word progress */}
          <div className="mt-8 flex gap-1.5 sm:gap-2" aria-label={`${got} / ${WORD.length}`}>
            {WORD.split("").map((c, i) => (
              <motion.span key={i} className={`grid h-12 w-9 place-items-center rounded-xl border text-xl font-black sm:h-14 sm:w-11 sm:text-2xl ${i < got ? "border-fuchsia bg-fuchsia text-white shadow-[0_0_20px_rgba(214,40,40,.6)]" : "border-white/15 text-white/20"}`}
                animate={i === got - 1 ? { scale: [1.3, 1], rotate: [-8, 0] } : {}} transition={{ type: "spring", stiffness: 400, damping: 12 }}
                style={{ fontFamily: "var(--nf-body), system-ui" }}>{c}</motion.span>
            ))}
          </div>
          <p className="mt-5 text-2xl" aria-label={`${lives} lives`}>
            {Array.from({ length: LIVES }).map((_, i) => <span key={i} className={i < lives ? "" : "opacity-20 grayscale"}>❤️</span>)}
          </p>
        </div>

        <div className="relative lg:col-span-8">
          <div ref={box} onPointerMove={(e) => phase === "play" && move(e.clientX)} onPointerDown={(e) => phase === "play" && move(e.clientX)}
            className={`relative h-[70svh] max-h-[620px] min-h-[420px] touch-none select-none overflow-hidden rounded-[2rem] border bg-[linear-gradient(180deg,#160909,#0c0c0c)] transition-colors ${flash === "bad" ? "border-red-500" : flash === "ok" ? "border-fuchsia" : "border-white/10"}`}>
            <div aria-hidden className="bandhani absolute inset-0 opacity-10" />

            {/* falling letters */}
            {drops.map((d) => (
              <span key={d.id} aria-hidden className={`absolute grid h-14 w-14 -translate-x-1/2 place-items-center rounded-2xl text-3xl font-black shadow-lg ${d.ch === WORD[got] ? "bg-fuchsia text-white shadow-[0_0_24px_rgba(214,40,40,.7)]" : "bg-white/10 text-white/80 backdrop-blur"}`}
                style={{ left: `${d.x}%`, top: `${d.y}%`, transform: `translateX(-50%) rotate(${d.rot}deg)`, fontFamily: "var(--nf-body), system-ui" }}>{d.ch}</span>
            ))}

            {/* catcher: mic */}
            <div aria-hidden className="absolute bottom-4 -translate-x-1/2 transition-[left] duration-75" style={{ left: `${px}%` }}>
              <motion.div animate={flash === "ok" ? { scale: [1, 1.25, 1] } : flash === "bad" ? { x: [-8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.3 }}
                className="grid h-20 w-24 place-items-center rounded-t-[2.5rem] rounded-b-2xl bg-gradient-to-b from-fuchsia to-[#7a0f0f] shadow-[0_0_40px_rgba(214,40,40,.6)]">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3" /></svg>
              </motion.div>
            </div>

            {/* overlays */}
            <AnimatePresence>
              {phase !== "play" && (
                <motion.div className="absolute inset-0 z-10 grid place-items-center bg-black/75 p-6 text-center backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-full max-w-md">
                    {phase === "idle" && (
                      <div className="flex justify-center gap-1.5" aria-hidden>
                        {WORD.split("").map((c, i) => (
                          <motion.span key={i} className="grid h-12 w-10 place-items-center rounded-lg bg-fuchsia text-2xl font-black" style={{ fontFamily: "var(--nf-body), system-ui" }}
                            animate={{ y: [0, -14, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}>{c}</motion.span>
                        ))}
                      </div>
                    )}
                    {phase === "lose" && <p className="font-display text-4xl">{t.lose}</p>}
                    {phase === "win" && (
                      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
                        <p className="font-display text-3xl">{t.win}</p>
                        {/* confetti */}
                        {Array.from({ length: 24 }).map((_, i) => (
                          <motion.span key={i} aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-2 w-2 rounded-sm" style={{ background: i % 2 ? "#d62828" : "#fff" }}
                            initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: (Math.random() - 0.5) * 600, y: Math.random() * 400 - 100, opacity: 0, rotate: 360 }} transition={{ duration: 1.6, ease: "easeOut" }} />
                        ))}
                        {audio ? (
                          <div className="mt-6 flex items-center justify-center gap-3">
                            <span aria-hidden className="flex h-6 items-end gap-1">
                              {[0.5, 1, 0.7, 0.9, 0.6].map((h, k) => <span key={k} className="w-1.5 origin-bottom animate-[eq_0.9s_ease-in-out_infinite] rounded-full bg-fuchsia" style={{ height: `${h * 100}%`, animationDelay: `${k * 0.1}s` }} />)}
                            </span>
                            <button type="button" onClick={() => { const a = audioRef.current; if (!a) return; if (a.paused) void a.play(); else a.pause(); }}
                              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-fuchsia">❚❚ / ▶</button>
                          </div>
                        ) : (
                          <div className="mx-auto mt-6 aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
                            <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${DARJIDA_ID}?autoplay=1&rel=0&playsinline=1`}
                              title="Darjida — Surbhi Badmaliya & Raj Gadhvi" allow="autoplay; encrypted-media" />
                          </div>
                        )}
                      </motion.div>
                    )}
                    <button type="button" onClick={() => { audioRef.current?.pause(); start(); }}
                      className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-fuchsia px-10 text-lg font-semibold shadow-[0_0_50px_rgba(214,40,40,.6)] transition-transform hover:scale-105">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path d="M6 4l14 8-14 8z" fill="#fff" /></svg>
                      {phase === "idle" ? t.play : t.again}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
