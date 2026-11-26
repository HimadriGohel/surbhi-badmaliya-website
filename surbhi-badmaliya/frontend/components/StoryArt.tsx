"use client";

import { motion, useReducedMotion } from "framer-motion";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

// Singer-related line icons (24×24)
const ICONS: Record<string, React.ReactNode> = {
  headphones: <path {...S} d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H5a1 1 0 0 1-1-1v-4Zm16 0h-3v5h2a1 1 0 0 0 1-1v-4Z" />,
  note: <path {...S} d="M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm11-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z" />,
  dhol: <><ellipse {...S} cx="12" cy="7" rx="7" ry="3" /><path {...S} d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7M7 9l4 9M17 9l-4 9" /></>,
  speaker: <><rect {...S} x="6" y="3" width="12" height="18" rx="2" /><circle {...S} cx="12" cy="14" r="3.5" /><circle {...S} cx="12" cy="7.5" r="1.3" /></>,
  harmonium: <><rect {...S} x="3" y="8" width="18" height="10" rx="1.5" /><path {...S} d="M3 13h18M7 13v5M11 13v5M15 13v5M6 8l2-3h8l2 3" /></>,
  dandiya: <path {...S} d="M5 19 15 5M9 19 19 5M4 20l2-2M18 6l2-2M8 20l2-2M18 4l2 2" />,
  vinyl: <><circle {...S} cx="12" cy="12" r="9" /><circle {...S} cx="12" cy="12" r="3" /><path {...S} d="M12 5.5a6.5 6.5 0 0 1 6.5 6.5" /></>,
  star: <path {...S} d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7Z" />,
};

const FLOAT = [
  { k: "headphones", x: "12%", y: "16%", s: 64, d: 5 },
  { k: "note", x: "76%", y: "12%", s: 52, d: 6 },
  { k: "dhol", x: "6%", y: "52%", s: 60, d: 7 },
  { k: "speaker", x: "80%", y: "46%", s: 58, d: 5.5 },
  { k: "harmonium", x: "14%", y: "80%", s: 62, d: 6.5 },
  { k: "dandiya", x: "74%", y: "80%", s: 56, d: 5 },
  { k: "star", x: "46%", y: "6%", s: 36, d: 4 },
];

export default function StoryArt() {
  const reduce = useReducedMotion();
  const loop = (d: number, delay = 0) => ({ duration: d, repeat: Infinity, ease: "easeInOut" as const, delay });

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full bg-[radial-gradient(circle_at_50%_45%,#3a1414_0%,#1a0b0b_55%,#0e0e0e_100%)] ring-1 ring-white/10"
      role="img" aria-label="Animated illustration: microphone surrounded by music icons">
      {/* bandhani dots + grain */}
      <div aria-hidden className="bandhani absolute inset-0 opacity-15" />

      {/* rotating vinyl behind the mic */}
      <div aria-hidden className="absolute left-1/2 top-[46%] aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2">
      <motion.div className="relative h-full w-full rounded-full bg-[repeating-radial-gradient(circle,#1d1d1d_0_2px,#121212_2px_5px)] ring-1 ring-white/10"
        animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
        <span className="absolute inset-[38%] rounded-full bg-fuchsia" />
        <span className="absolute left-1/2 top-[6%] h-[10%] w-[2px] -translate-x-1/2 bg-white/40" />
      </motion.div>
      </div>

      {/* expanding sound rings */}
      {!reduce && [0, 1, 2].map((i) => (
        <div key={i} aria-hidden className="absolute left-1/2 top-[46%] aspect-square w-[50%] -translate-x-1/2 -translate-y-1/2">
          <motion.span className="block h-full w-full rounded-full border-2 border-fuchsia/60"
            animate={{ scale: [0.8, 2.1], opacity: [0.7, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i, ease: "easeOut" }} />
        </div>
      ))}

      {/* big microphone */}
      <div aria-hidden className="absolute left-1/2 top-[46%] h-[52%] -translate-x-1/2 -translate-y-1/2">
      <motion.svg viewBox="0 0 120 200" className="h-full w-auto drop-shadow-[0_0_30px_rgba(214,40,40,.6)]"
        animate={reduce ? {} : { rotate: [-4, 4, -4], y: [0, -6, 0] }} transition={loop(4)}>
        <defs>
          <linearGradient id="micBody" x1="0" x2="1"><stop offset="0" stopColor="#3a3a3a" /><stop offset=".5" stopColor="#8a8a8a" /><stop offset="1" stopColor="#2a2a2a" /></linearGradient>
          <radialGradient id="micHead" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#ff6b6b" /><stop offset="1" stopColor="#8f1414" /></radialGradient>
        </defs>
        <circle cx="60" cy="48" r="38" fill="url(#micHead)" />
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${26 + i * 2} ${30 + i * 6}h${68 - i * 4}`} stroke="#000" strokeOpacity=".35" strokeWidth="2" />)}
        <rect x="40" y="84" width="40" height="12" rx="4" fill="#d62828" />
        <path d="M44 96h32l-6 92a10 10 0 0 1-20 0Z" fill="url(#micBody)" />
        <motion.circle cx="60" cy="122" r="4" fill="#ff4b4b" animate={reduce ? {} : { opacity: [1, 0.2, 1] }} transition={loop(1.2)} />
      </motion.svg>
      </div>

      {/* equalizer at the bottom */}
      <div aria-hidden className="absolute bottom-[10%] left-1/2 flex h-12 -translate-x-1/2 items-end gap-1.5">
        {Array.from({ length: 13 }).map((_, i) => (
          <motion.span key={i} className="w-2 rounded-full bg-gradient-to-t from-fuchsia to-rose" style={{ height: "100%", originY: 1 }}
            animate={reduce ? { scaleY: 0.5 } : { scaleY: [0.2, 1, 0.4, 0.85, 0.2] }} transition={loop(1.1 + (i % 4) * 0.25, i * 0.07)} />
        ))}
      </div>

      {/* floating singer icons */}
      {FLOAT.map((f, i) => (
        <motion.div key={f.k} aria-hidden className="absolute grid place-items-center rounded-2xl border border-white/10 bg-black/50 text-white backdrop-blur-sm"
          style={{ left: f.x, top: f.y, width: f.s, height: f.s }}
          initial={reduce ? false : { opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          animate={reduce ? {} : { y: [0, -14, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
          transition={{ opacity: { delay: 0.2 + i * 0.1 }, scale: { delay: 0.2 + i * 0.1, type: "spring" }, y: loop(f.d, i * 0.3), rotate: loop(f.d, i * 0.3) }}
          whileHover={{ scale: 1.2, color: "#ff4b4b" }}>
          <svg viewBox="0 0 24 24" className="h-1/2 w-1/2">{ICONS[f.k]}</svg>
        </motion.div>
      ))}

      {/* drifting notes */}
      {!reduce && ["♪", "♫", "♬", "♩"].map((n, i) => (
        <motion.span key={i} aria-hidden className="absolute bottom-[22%] select-none text-2xl text-fuchsia"
          style={{ left: `${30 + i * 13}%` }}
          animate={{ y: [0, -220], opacity: [0, 1, 0], x: [0, i % 2 ? 20 : -20] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }}>{n}</motion.span>
      ))}
    </div>
  );
}
