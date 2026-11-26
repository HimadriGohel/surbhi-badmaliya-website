"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/content/i18n";
import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;

export default function BookingContact({ lang, title }: { lang: Locale; title: string }) {
  const gu = lang === "gu";
  const reduce = useReducedMotion();
  const cards = [
    {
      k: "email", label: gu ? "ઇમેઇલ" : "Email", value: profile.bookingEmail, href: `mailto:${profile.bookingEmail}`,
      cta: gu ? "ઇમેઇલ લખો" : "Write an email",
      icon: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
    },
    {
      k: "phone", label: gu ? "ફોન" : "Phone", value: profile.bookingPhone, href: profile.bookingPhoneHref,
      cta: gu ? "કૉલ કરો" : "Call now",
      icon: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    },
  ];

  return (
    <div className="relative">
      <motion.h1 className="mt-8 text-6xl font-black leading-[0.9] tracking-tight sm:text-8xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}
        initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
        {gu ? "બુકિંગ" : "Booking"}<span className="text-fuchsia">.</span>
      </motion.h1>
      <motion.p className="mt-6 max-w-xl text-lg text-mist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {gu ? "ગરબા, નવરાત્રિ, કોન્સર્ટ, ખાનગી કાર્યક્રમ કે સહયોગ માટે સીધો સંપર્ક કરો." : `${title} — Garba, Navratri, concerts, private events and collaborations. Get in touch directly.`}
      </motion.p>

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {cards.map((c, i) => (
          <motion.a key={c.k} href={c.href} onClick={() => track("booking_contact", { via: c.k })}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[.06] to-transparent p-8 transition hover:border-fuchsia/60 sm:p-12"
            initial={reduce ? false : { opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.12, duration: 0.8, ease }}>
            <span aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia/0 blur-3xl transition duration-700 group-hover:bg-fuchsia/30" />
            <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-fuchsia text-white shadow-[0_0_40px_rgba(214,40,40,.5)] transition group-hover:rotate-[-8deg] group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{c.icon}</svg>
            </span>
            <p className="relative mt-10 text-[11px] uppercase tracking-[.35em] text-fuchsia">{c.label}</p>
            <p className="relative mt-3 break-all text-3xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--nf-body), system-ui" }}>{c.value}</p>
            <span className="relative mt-10 inline-flex items-center gap-3 font-semibold">
              {c.cta}
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition group-hover:-rotate-45 group-hover:border-fuchsia group-hover:bg-fuchsia">→</span>
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
