"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { t, type Locale } from "@/content/i18n";
import { profile } from "@/content/profile";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Footer({ lang }: { lang: Locale }) {
  const d = t(lang);
  const gu = lang === "gu";
  const reduce = useReducedMotion();
  const name = (gu ? profile.nameGu : profile.name).split(" ");
  const tags = gu ? ["ગરબા", "લોકસંગીત", "ભક્તિ", "લાઇવ", "બોલિવૂડ"] : ["Garba", "Folk", "Devotional", "Live", "Bollywood"];
  const nav = [
    ["music", "/music"], ["stage", "/on-stage"], ["story", "/story"], ["gallery", "/gallery"], ["contact", "/booking"],
  ] as const;

  return (
    <footer className="relative mt-24 overflow-hidden bg-black text-ivory">
      {/* tag marquee */}
      <div className="relative -rotate-1 border-y border-fuchsia/40 bg-fuchsia py-3">
        <motion.div className="flex w-max gap-10 whitespace-nowrap text-lg font-extrabold uppercase tracking-[.2em] text-black"
          animate={reduce ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex gap-10">
              {Array.from({ length: 3 }).flatMap((__, r) => tags.map((tg) => (
                <span key={`${r}-${tg}`} className="flex items-center gap-10">{tg}<span aria-hidden>✦</span></span>
              )))}
            </span>
          ))}
        </motion.div>
      </div>

      <div aria-hidden className="pointer-events-none absolute -left-40 top-40 h-[520px] w-[520px] rounded-full bg-fuchsia/20 blur-[150px]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia/10 blur-[140px]" />

      <div className="relative px-6 pt-20 sm:px-10 lg:px-16">
        {/* CTA row */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <motion.div className="lg:col-span-7" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
            <p className="text-[11px] uppercase tracking-[.35em] text-fuchsia">{gu ? "ચાલો સાથે ગાઈએ" : "Let's make music"}</p>
            <h2 className="mt-4 font-display text-5xl leading-[1.02] sm:text-7xl">
              {gu ? "તમારા પ્રસંગને" : "Bring the"} <span className="italic text-fuchsia">{gu ? "સૂરમય" : "Garba"}</span>{" "}
              {gu ? "બનાવો" : "to your stage."}
            </h2>
          </motion.div>
          <motion.div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.8, ease }}>
            <Link href={`/${lang}/booking`} className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-fuchsia py-2 pl-7 pr-2 font-semibold shadow-[0_0_40px_rgba(214,40,40,.45)]">
              {d.home.book}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black transition-transform duration-300 group-hover:-rotate-45">→</span>
            </Link>
            <a href={profile.youtube.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center gap-3 rounded-full border border-white/20 px-7 transition hover:border-fuchsia">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path fill="#ff0000" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8Z"/><path fill="#fff" d="M9.8 15.3V8.7L15.5 12z"/></svg>
              YouTube
            </a>
          </motion.div>
        </div>

        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* columns */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-3xl italic">{gu ? profile.nameGu : profile.name}<span className="text-fuchsia">.</span></p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">{d.footer.independent}</p>
            {/* mini equalizer */}
            <div aria-hidden className="mt-6 flex h-8 items-end gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.span key={i} className="w-1 rounded-full bg-fuchsia/80" style={{ height: "100%", originY: 1 }}
                  animate={reduce ? { scaleY: 0.4 } : { scaleY: [0.2, 1, 0.4, 0.8, 0.2] }}
                  transition={{ duration: 1.2 + (i % 5) * 0.2, repeat: Infinity, delay: i * 0.06 }} />
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="text-[11px] uppercase tracking-[.35em] text-fuchsia">{gu ? "પેજ" : "Explore"}</p>
            <ul className="mt-5 space-y-3">
              {nav.map(([k, href]) => (
                <li key={k}>
                  <Link href={`/${lang}${href}`} className="group inline-flex items-center gap-3 text-lg text-ivory/80 transition hover:text-ivory">
                    <span className="h-px w-0 bg-fuchsia transition-all duration-300 group-hover:w-6" />
                    {d.nav[k]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="text-[11px] uppercase tracking-[.35em] text-fuchsia">{d.footer.links}</p>
            <ul className="mt-5 space-y-3">
              {[
                { href: profile.youtube.url, label: profile.youtube.handle, sub: "YouTube", ext: true },
                { href: `mailto:${profile.bookingEmail}`, label: profile.bookingEmail, sub: gu ? "બુકિંગ" : "Bookings", ext: false },
                { href: profile.bookingPhoneHref, label: profile.bookingPhone, sub: gu ? "ફોન" : "Phone", ext: false },
                { href: "https://www.jiosaavn.com/artist/surbhi-badmaliya-songs/JarG2fMdILw_", label: "JioSaavn", sub: gu ? "ગીતો સાંભળો" : "Stream", ext: true },
                { href: "https://music.apple.com/us/album/hokaro/1769844159", label: "Apple Music", sub: gu ? "હોકારો આલ્બમ" : "Hokaro album", ext: true },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 transition hover:border-fuchsia/60 hover:bg-fuchsia/10">
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-[.25em] text-mist">{l.sub}</span>
                      <span className="block truncate">{l.label}</span>
                    </span>
                    <span className="text-fuchsia transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* giant name */}
      <div aria-hidden className="relative select-none overflow-hidden px-2">
        <motion.p className="flex justify-center gap-[0.15em] whitespace-nowrap text-center font-black leading-[0.8] tracking-[-0.05em]"
          style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui", fontSize: "clamp(2rem, 10.5vw, 14rem)" }}
          initial="hide" whileInView="show" viewport={{ once: true }}>
          {name.map((w, i) => (
            <span key={w} className="inline-block overflow-hidden pb-[0.08em]">
              <motion.span className={`inline-block ${i ? "text-fuchsia" : "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.5)]"}`}
                variants={{ hide: { y: reduce ? 0 : "100%" }, show: { y: 0 } }} transition={{ delay: i * 0.15, duration: 1.1, ease }}>{w}</motion.span>
            </span>
          ))}
        </motion.p>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/10 px-6 py-6 sm:px-10 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-mist md:flex-row">
          <p>© {new Date().getFullYear()} · {d.footer.rights}</p>
          <p className="text-center">
            {gu ? "વેબસાઇટ યોગદાન અને કન્ટેન્ટ રિસર્ચ — " : "Website contributed & content research by "}
            <span className="font-semibold text-ivory">Himadri Gohel</span>
            <span className="text-fuchsia"> ♥</span>
          </p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-ivory transition hover:border-fuchsia">
            {gu ? "ઉપર જાઓ" : "Back to top"}
            <span className="transition-transform group-hover:-translate-y-1">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
