"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => { setLight(document.documentElement.dataset.theme === "light"); }, []);
  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.dataset.theme = next ? "light" : "dark";
    try { localStorage.setItem("sb-theme", next ? "light" : "dark"); } catch {}
  };
  return (
    <button type="button" onClick={toggle} aria-pressed={light} aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      className="relative flex h-9 w-16 items-center rounded-full border border-ivory/25 px-1 transition hover:border-fuchsia">
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`grid h-7 w-7 place-items-center rounded-full bg-ivory text-night ${light ? "ml-auto" : ""}`}>
        {light ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
        )}
      </motion.span>
    </button>
  );
}
