"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/content/i18n";

// "Garba Beat" — a small rhythm game. Beats are synthesised with Web Audio (no recorded music).
const LANES = 4;
const KEYS = ["d", "f", "j", "k"];
const ICONS = ["🥁", "🎤", "🎵", "🎶"];
const COLORS = ["#d62828", "#ff4b4b", "#ff8a7a", "#ff6b6b"];
const ROUND = 30; // seconds
const BPM = 112;
const FALL = 1.6; // seconds from top to hit line
const HIT_Y = 0.86; // hit line, fraction of height
const WINDOW = 0.13; // seconds — hit tolerance

type Note = { t: number; lane: number; hit?: boolean; missed?: boolean };
type Burst = { id: number; lane: number; label: string };

function makeChart(): Note[] {
  const beat = 60 / BPM;
  const notes: Note[] = [];
  let lane = 0;
  for (let t = 1.2; t < ROUND - 0.5; t += beat / 2) {
    const r = Math.random();
    const onBeat = Math.round(t / beat * 2) % 2 === 0;
    if (onBeat ? r < 0.75 : r < 0.28) {
      lane = (lane + 1 + Math.floor(Math.random() * 3)) % LANES;
      notes.push({ t, lane });
    }
  }
  return notes;
}

export default function BeatGame({ lang }: { lang: Locale }) {
  const gu = lang === "gu";
  const canvas = useRef<HTMLCanvasElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const state = useRef({ start: 0, notes: [] as Note[], nextBeat: 0, pressed: [0, 0, 0, 0] });
  const raf = useRef(0);
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [time, setTime] = useState(ROUND);
  const [best, setBest] = useState(0);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);

  useEffect(() => { try { setBest(Number(localStorage.getItem("sb-beat-best") || 0)); } catch {} }, []);

  const drum = useCallback((freq: number, len = 0.18, vol = 0.5) => {
    const ac = audio.current; if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(freq, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq * 0.45, ac.currentTime + len);
    g.gain.setValueAtTime(vol, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + len);
    o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + len);
  }, []);

  const pop = (lane: number, label: string) => {
    const id = ++burstId.current;
    setBursts((b) => [...b.slice(-6), { id, lane, label }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 600);
  };

  const hit = useCallback((lane: number) => {
    if (phase !== "play") return;
    const s = state.current; const now = (performance.now() - s.start) / 1000;
    s.pressed[lane] = performance.now();
    const n = s.notes.find((x) => x.lane === lane && !x.hit && !x.missed && Math.abs(x.t - now) < WINDOW);
    if (n) {
      n.hit = true;
      const perfect = Math.abs(n.t - now) < WINDOW / 2;
      drum(perfect ? 330 : 260, 0.12, 0.35);
      setCombo((c) => { const nc = c + 1; setMaxCombo((m) => Math.max(m, nc)); setScore((sc) => sc + (perfect ? 100 : 60) * (1 + Math.floor(nc / 10))); return nc; });
      pop(lane, perfect ? (gu ? "સરસ!" : "Perfect!") : (gu ? "સારું" : "Good"));
    } else {
      setCombo(0);
    }
  }, [phase, drum, gu]);

  const start = () => {
    audio.current ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    void audio.current.resume();
    state.current = { start: performance.now() + 300, notes: makeChart(), nextBeat: 0, pressed: [0, 0, 0, 0] };
    setScore(0); setCombo(0); setMaxCombo(0); setTime(ROUND); setPhase("play");
  };

  // keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const i = KEYS.indexOf(e.key.toLowerCase());
      if (i >= 0 && phase === "play") { e.preventDefault(); hit(i); }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [hit, phase]);

  // render loop
  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const beat = 60 / BPM;
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const lw = w / LANES, hitY = h * HIT_Y;
      const s = state.current;
      const now = phase === "play" ? (performance.now() - s.start) / 1000 : 0;

      // lanes
      for (let i = 0; i < LANES; i++) {
        const glow = Math.max(0, 1 - (performance.now() - s.pressed[i]) / 200);
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, `rgba(214,40,40,${0.08 + glow * 0.35})`);
        ctx.fillStyle = g; ctx.fillRect(i * lw + 4, 0, lw - 8, h);
        ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.beginPath(); ctx.moveTo(i * lw, 0); ctx.lineTo(i * lw, h); ctx.stroke();
        // target ring
        ctx.beginPath(); ctx.arc(i * lw + lw / 2, hitY, Math.min(lw * 0.3, 30) + glow * 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.35 + glow * 0.6})`; ctx.lineWidth = 2; ctx.stroke();
      }
      // hit line
      ctx.fillStyle = "rgba(214,40,40,.8)"; ctx.fillRect(0, hitY - 1, w, 2);

      if (phase === "play") {
        // metronome beats
        while (s.nextBeat * beat <= now) { if (s.nextBeat >= 0) drum(s.nextBeat % 4 === 0 ? 90 : 140, 0.22, s.nextBeat % 4 === 0 ? 0.6 : 0.3); s.nextBeat++; }
        // notes
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        for (const n of s.notes) {
          if (n.hit) continue;
          const dt = n.t - now;
          if (dt < -WINDOW && !n.missed) { n.missed = true; setCombo(0); }
          if (dt > FALL || dt < -0.4) continue;
          const y = hitY - (dt / FALL) * hitY;
          const x = n.lane * lw + lw / 2, r = Math.min(lw * 0.28, 26);
          ctx.globalAlpha = n.missed ? 0.25 : 1;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = COLORS[n.lane]; ctx.shadowColor = COLORS[n.lane]; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0;
          ctx.font = `${r}px system-ui, "Segoe UI Emoji", "Apple Color Emoji"`; ctx.fillText(ICONS[n.lane], x, y + 1);
          ctx.globalAlpha = 1;
        }
        const left = Math.max(0, ROUND - now);
        setTime(Math.ceil(left));
        if (left <= 0) {
          setPhase("done");
          setScore((sc) => { setBest((b) => { const nb = Math.max(b, sc); try { localStorage.setItem("sb-beat-best", String(nb)); } catch {} return nb; }); return sc; });
        }
      }
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, drum]);

  const t = {
    title: gu ? "ગરબા બીટ" : "Garba Beat",
    sub: gu ? "તાલ પકડો! નોટ લાઇન પર પહોંચે ત્યારે D F J K દબાવો અથવા લેન પર ટેપ કરો." : "Catch the rhythm! Hit D F J K — or tap a lane — as each note reaches the line.",
    play: gu ? "રમો" : "Play",
    again: gu ? "ફરી રમો" : "Play again",
    score: gu ? "સ્કોર" : "Score", combo: gu ? "કોમ્બો" : "Combo", best: gu ? "બેસ્ટ" : "Best", time: gu ? "સમય" : "Time",
    done: gu ? "શાબાશ!" : "Round over!",
    max: gu ? "મહત્તમ કોમ્બો" : "Max combo",
  };

  return (
    <section aria-labelledby="game" className="relative overflow-hidden px-4 py-16 sm:px-8 lg:px-12">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-fuchsia/15 blur-[140px]" />
      <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm italic text-fuchsia">05</span>
            <span className="h-px w-16 bg-fuchsia" />
            <span className="text-[11px] uppercase tracking-[.35em] text-mist">{gu ? "રમત" : "Play"}</span>
          </div>
          <h2 id="game" className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}>
            {t.title} <span className="font-display font-normal italic text-fuchsia">♪</span>
          </h2>
          <p className="mt-4 max-w-sm text-mist">{t.sub}</p>
          <dl className="mt-8 grid grid-cols-2 gap-3">
            {[[t.score, score], [t.combo, `×${combo}`], [t.time, `${time}s`], [t.best, best]].map(([k, v]) => (
              <div key={String(k)} className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                <dt className="text-[10px] uppercase tracking-[.3em] text-mist">{k}</dt>
                <dd className="mt-1 font-display text-3xl tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 hidden gap-2 text-xs text-mist lg:flex">
            {KEYS.map((k) => <kbd key={k} className="rounded-md border border-white/20 px-2 py-1 font-mono uppercase">{k}</kbd>)}
          </p>
        </div>

        <div className="relative lg:col-span-8">
          <div className="relative h-[70svh] max-h-[620px] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#160909,#0c0c0c)]">
            <div aria-hidden className="bandhani absolute inset-0 opacity-10" />
            <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
            {/* tap zones */}
            <div className="absolute inset-0 grid grid-cols-4">
              {Array.from({ length: LANES }).map((_, i) => (
                <button key={i} type="button" aria-label={`Lane ${i + 1} (${KEYS[i].toUpperCase()})`} tabIndex={phase === "play" ? 0 : -1}
                  onPointerDown={(e) => { e.preventDefault(); hit(i); }} className="relative h-full touch-none focus-visible:outline-none">
                  <AnimatePresence>
                    {bursts.filter((b) => b.lane === i).map((b) => (
                      <motion.span key={b.id} className="pointer-events-none absolute left-1/2 top-[74%] -translate-x-1/2 whitespace-nowrap font-display text-lg italic text-rose"
                        initial={{ opacity: 0, y: 0, scale: 0.6 }} animate={{ opacity: 1, y: -40, scale: 1.1 }} exit={{ opacity: 0 }}>{b.label}</motion.span>
                    ))}
                  </AnimatePresence>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border border-white/15 px-2 py-0.5 font-mono text-xs uppercase text-white/50">{KEYS[i]}</span>
                </button>
              ))}
            </div>

            {/* overlays */}
            <AnimatePresence>
              {phase !== "play" && (
                <motion.div className="absolute inset-0 z-10 grid place-items-center bg-black/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="text-center">
                    {phase === "done" ? (
                      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
                        <p className="text-sm uppercase tracking-[.3em] text-fuchsia">{t.done}</p>
                        <p className="mt-2 font-display text-7xl tabular-nums">{score}</p>
                        <p className="mt-2 text-mist">{t.max}: ×{maxCombo} · {t.best}: {best}</p>
                      </motion.div>
                    ) : (
                      <motion.div className="mx-auto flex h-24 items-end justify-center gap-2" aria-hidden>
                        {ICONS.map((ic, i) => (
                          <motion.span key={i} className="text-4xl" animate={{ y: [0, -16, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}>{ic}</motion.span>
                        ))}
                      </motion.div>
                    )}
                    <button type="button" onClick={start}
                      className="relative mt-8 inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full bg-fuchsia px-10 text-lg font-semibold shadow-[0_0_50px_rgba(214,40,40,.6)] transition-transform hover:scale-105">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path d="M6 4l14 8-14 8z" fill="#fff" /></svg>
                      {phase === "done" ? t.again : t.play}
                    </button>
                    <p className="mt-4 text-xs text-mist">{gu ? "🔊 અવાજ ચાલુ રાખો" : "🔊 Sound on for the beat"}</p>
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
