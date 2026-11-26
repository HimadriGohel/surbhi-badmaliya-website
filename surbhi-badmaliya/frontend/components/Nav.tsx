"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { t, type Locale } from "@/content/i18n";
import { track } from "@/lib/analytics";
import ThemeToggle from "./ThemeToggle";

const items = [
  ["home", ""],
  ["music", "/music"],
  ["stage", "/on-stage"],
  ["story", "/story"],
  ["gallery", "/gallery"],
  ["contact", "/booking"],
] as const;

export default function Nav({ lang }: { lang: Locale }) {
  const d = t(lang);
  const path = usePathname() || `/${lang}`;
  const rest = path.replace(/^\/(en|gu)/, "");
  const other: Locale = lang === "en" ? "gu" : "en";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const switchLang = () => {
    try { localStorage.setItem("sb-lang", other); } catch {}
    track("language_switch", { to: other });
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? "bg-night/85 backdrop-blur-md" : "bg-transparent"}`}>
      <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href={`/${lang}`} className="font-display text-xl italic tracking-wide">
          Surbhi<span className="text-fuchsia">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {items.map(([k, href]) => {
            const active = rest === href;
            return (
              <li key={k} className="relative">
                <Link href={`/${lang}${href}`} aria-current={active ? "page" : undefined}
                  className={`relative block px-3 py-2 text-sm tracking-wide transition-colors ${active ? "text-ivory" : "text-mist hover:text-ivory"}`}>
                  {d.nav[k]}
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-fuchsia to-saffron" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href={`/${other}${rest}`} hrefLang={other === "gu" ? "gu-IN" : "en"} lang={other} onClick={switchLang}
            className="rounded-full border border-ivory/25 px-3 py-1.5 text-xs tracking-wide hover:border-saffron hover:text-saffron"
            aria-label={other === "gu" ? "ગુજરાતીમાં વાંચો" : "Read in English"}>
            {other === "gu" ? "ગુજરાતી" : "EN"}
          </Link>
          <button type="button" className="grid h-11 w-11 place-items-center md:hidden" aria-expanded={open} aria-controls="mobile-menu"
            aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-ivory transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-ivory transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul id="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ivory/10 px-4 md:hidden">
            {items.map(([k, href], i) => (
              <motion.li key={k} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.04 * i }}>
                <Link href={`/${lang}${href}`} className="block py-3 font-display text-2xl" aria-current={rest === href ? "page" : undefined}>
                  {d.nav[k]}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
