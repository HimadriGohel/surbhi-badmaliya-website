"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/** Singer silhouette supplied by the site owner (converted to white), with animated sound waves. */
export default function SingerSilhouette({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative aspect-[332/372] ${className}`}>
      {/* sound waves from the mic (mic sits at the left of the figure) */}
      <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {[0, 1, 2].map((i) => (
          <motion.path key={i} d={`M ${30 - i * 7} ${22 - i * 6} A ${14 + i * 8} ${14 + i * 8} 0 0 0 ${16 - i * 9} ${46 + i * 5}`}
            fill="none" stroke="#d62828" strokeWidth="1.6" strokeLinecap="round"
            animate={reduce ? { opacity: 0.6 } : { opacity: [0, 1, 0], x: [3, -4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: i * 0.35 }} />
        ))}
      </svg>
      <motion.div className="absolute inset-0" style={{ originX: 0.5, originY: 1 }}
        animate={reduce ? {} : { y: [0, -4, 0], rotate: [0, -1.2, 0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <Image src="/images/singer-silhouette-white.png" alt="Silhouette of a woman singing into a microphone" fill sizes="300px"
          className="object-contain drop-shadow-[0_0_24px_rgba(214,40,40,.55)]" />
      </motion.div>
    </div>
  );
}
