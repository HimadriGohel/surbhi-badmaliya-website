"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = { children: React.ReactNode; className?: string; delay?: number; mask?: boolean; as?: "div" | "section" | "li" };

/** Scroll-triggered reveal. `mask` = image clip reveal; otherwise a soft rise. Content is visible without JS. */
export default function Reveal({ children, className, delay = 0, mask = false, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const M = motion[as];
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M className={className}
      initial={mask ? { clipPath: "inset(18% 0 18% 0 round 0px)", opacity: 0.4 } : { opacity: 0, y: 32 }}
      whileInView={mask ? { clipPath: "inset(0% 0 0% 0 round 0px)", opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: mask ? 1.1 : 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </M>
  );
}
