"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Dict } from "@/content/i18n";
import { track } from "@/lib/analytics";

const KEY = "sb-intro-seen";
const NAME = ["SURBHI", "BADMALIYA"];

export default function Splash({ d, nameGu, lang }: { d: Dict["splash"]; nameGu: string; lang: string }) {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const reduce = useReducedMotion();
  const cta = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen) setShow(false);
    else {
      document.documentElement.style.overflow = "hidden";
      const id = setTimeout(() => cta.current?.focus({ preventScroll: true }), reduce ? 50 : 1800);
      return () => clearTimeout(id);
    }
  }, [reduce]);

  const enter = (how: "cta" | "skip") => {
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    track("intro_exit", { how });
    setLeaving(true);
    setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = "";
      document.getElementById("main")?.focus?.();
    }, reduce ? 0 : 900);
  };

  useEffect(() => {
    if (!show) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && enter("skip");
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const dur = reduce ? 0 : 1;

  return (
    <AnimatePresence>
      {show && (
        <motion.div role="dialog" aria-modal="true" aria-label="Surbhi Badmaliya — intro"
          className="fixed inset-0 z-[70] overflow-hidden bg-night text-ivory"
          exit={{ opacity: 0 }} transition={{ duration: 0.3 * dur }}>
          <motion.div aria-hidden
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 30% 55% at var(--x,50%) 0%, rgba(214,40,40,.28), rgba(214,40,40,.10) 45%, transparent 75%), radial-gradient(60% 40% at 50% 100%, rgba(255,90,80,.12), transparent 70%), #111111" }}
            initial={{ ["--x" as string]: "-10%" }}
            animate={{ ["--x" as string]: ["-10%", "90%", "50%"] }}
            transition={{ duration: 2.6 * dur, ease: "easeInOut" }} />
          <div aria-hidden className="bandhani absolute inset-0 opacity-[.07]" />
          <div aria-hidden className="grain absolute inset-0" />

          {/* light dust — a handful, fades once */}
          {!reduce && Array.from({ length: 14 }).map((_, i) => (
            <motion.span key={i} aria-hidden className="absolute h-1 w-1 rounded-full bg-saffron/70"
              style={{ left: `${(i * 37) % 100}%`, top: `${20 + ((i * 53) % 60)}%` }}
              initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.8, 0], y: -40 }}
              transition={{ duration: 4, delay: 0.8 + i * 0.12 }} />
          ))}

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <motion.p className="mb-6 text-[11px] uppercase tracking-[.4em] text-saffron sm:text-xs"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 * dur, duration: 0.8 * dur }}>
              {d.kicker}
            </motion.p>

            <p className="font-display leading-[.9]" aria-label="Surbhi Badmaliya">
              {NAME.map((word, wi) => (
                <span key={word} className="block overflow-hidden" aria-hidden>
                  {word.split("").map((ch, ci) => (
                    <motion.span key={ci} className={`inline-block ${wi === 1 ? "italic text-rose" : ""} text-[13vw] sm:text-[9vw] lg:text-[8rem]`}
                      initial={{ y: "110%", letterSpacing: "0.3em", opacity: 0 }}
                      animate={{ y: 0, letterSpacing: "0.02em", opacity: 1 }}
                      transition={{ delay: (0.9 + wi * 0.35 + ci * 0.045) * dur, duration: 0.9 * dur, ease: [0.22, 1, 0.36, 1] }}>
                      {ch}
                    </motion.span>
                  ))}
                </span>
              ))}
            </p>
            {lang === "gu" && <p className="mt-3 font-gu text-xl text-ivory/80">{nameGu}</p>}

            {/* single-pass light sweep across the name */}
            {!reduce && (
              <motion.span aria-hidden className="pointer-events-none absolute top-1/2 h-48 w-24 -translate-y-1/2 rotate-12 bg-gradient-to-r from-transparent via-ivory/25 to-transparent blur-md"
                initial={{ left: "-10%" }} animate={{ left: "110%" }} transition={{ delay: 2.1, duration: 1.4, ease: "easeInOut" }} />
            )}

            {/* restrained beat line */}
            <svg aria-hidden viewBox="0 0 300 40" className="mt-6 h-8 w-64">
              <motion.path d="M0 20 H110 L120 6 L132 34 L142 12 L150 26 L158 20 H300" fill="none" stroke="url(#sg)" strokeWidth="2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8 * dur, duration: 1.6 * dur }} />
              <defs><linearGradient id="sg"><stop stopColor="#d62828" /><stop offset="1" stopColor="#ff8a7a" /></linearGradient></defs>
            </svg>

            <motion.button ref={cta} type="button" onClick={() => enter("cta")}
              className="group relative mt-8 min-h-12 overflow-hidden rounded-full border border-ivory/40 px-8 py-3 text-sm uppercase tracking-[.3em]"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 * dur, duration: 0.7 * dur }}>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-fuchsia to-saffron transition-transform duration-500 group-hover:translate-x-0 group-focus-visible:translate-x-0" />
              <span className="relative">{d.cta}</span>
            </motion.button>
          </div>

          <button type="button" onClick={() => enter("skip")}
            className="absolute right-4 top-4 z-20 min-h-11 rounded-full px-4 text-xs uppercase tracking-[.25em] text-mist hover:text-ivory">
            {d.skipIntro}
          </button>

          {/* curtain wash on exit */}
          <AnimatePresence>
            {leaving && !reduce && (
              <>
                <motion.div className="absolute inset-y-0 left-0 z-30 w-1/2 bg-gradient-to-r from-plum to-fuchsia" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 0.45, ease: "easeIn" }} />
                <motion.div className="absolute inset-y-0 right-0 z-30 w-1/2 bg-gradient-to-l from-plum to-fuchsia" initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ duration: 0.45, ease: "easeIn" }} />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
