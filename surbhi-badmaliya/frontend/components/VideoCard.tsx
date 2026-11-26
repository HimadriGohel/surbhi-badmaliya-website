"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { type Video, ytEmbed, ytThumb, ytWatch } from "@/content/works";
import { track } from "@/lib/analytics";

type Props = { v: Video; playLabel: string; watchLabel: string; large?: boolean; index?: number };

/** Click-to-load privacy-enhanced YouTube embed. Nothing loads from YouTube's player until the visitor chooses to play. */
export default function VideoCard({ v, playLabel, watchLabel, large, index }: Props) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className="group">
      <div className={`relative overflow-hidden rounded-2xl bg-indigo ring-1 ring-ivory/10 ${large ? "aspect-video" : "aspect-video"}`}>
        {playing ? (
          <iframe className="absolute inset-0 h-full w-full" src={ytEmbed(v.id)} title={`${v.title} — Surbhi Badmaliya`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin" />
        ) : (
          <motion.button type="button" initial="rest" whileHover="hover" whileFocus="hover" className="absolute inset-0 h-full w-full text-left" aria-label={`${playLabel}: ${v.title}`}
            onClick={() => { setPlaying(true); track("song_play", { id: v.id, title: v.title }); }}>
            <Image src={ytThumb(v.id)} alt="" fill sizes={large ? "(min-width:1024px) 60vw, 100vw" : "(min-width:1024px) 30vw, 100vw"}
              className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
            <span className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
            {/* equalizer accent: animates only on hover/focus */}
            <span aria-hidden className="absolute bottom-4 right-4 flex h-6 items-end gap-[3px]">
              {[0.5, 1, 0.7, 0.9].map((h, i) => (
                <motion.span key={i} className="w-[3px] rounded-full bg-saffron" style={{ height: `${h * 100}%` }}
                  variants={{ rest: { scaleY: 0.4 }, hover: { scaleY: [0.4, 1, 0.5, 0.9] } }}
                  transition={{ duration: 0.8, repeat: 2, delay: i * 0.08 }} />
              ))}
            </span>
            <span className="absolute left-4 top-4 grid h-14 w-14 place-items-center rounded-full bg-ivory/90 text-night transition group-hover:scale-110 group-hover:bg-saffron">
              <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5" aria-hidden><path d="M6 4l14 8-14 8z" fill="currentColor" /></svg>
            </span>
            {index !== undefined && <span aria-hidden className="absolute bottom-3 left-4 font-display text-5xl italic text-ivory/30">{String(index + 1).padStart(2, "0")}</span>}
          </motion.button>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className={`font-display ${large ? "text-3xl" : "text-xl"}`}>{v.title}</h3>
          {v.context && <p className="mt-1 text-sm text-mist">{v.context}</p>}
        </div>
        <a href={ytWatch(v.id)} target="_blank" rel="noopener noreferrer" onClick={() => track("official_link", { to: "youtube", id: v.id })}
          className="shrink-0 rounded-full border border-ivory/20 px-3 py-1.5 text-xs text-mist hover:border-rose hover:text-rose">
          {watchLabel} ↗
        </a>
      </div>
    </article>
  );
}
