"use client";

import { useRef } from "react";
import type { Locale } from "@/content/i18n";
import { profile } from "@/content/profile";
import { useScrollScrub } from "@/lib/useScrollScrub";

// "Where her voice has travelled" — a scroll-scrubbed camera flight. The stage curtain opens, then the
// camera flies through the cities and venues documented on her official channel (see content/sources.md).
// Photos are mood images from the owner's set; they are not claimed to be from the named venue.
const img = (n: string) => `/images/surbhi-badmaliya-${n}.jpg`;
const STOPS = [
  { sky: "temple", city: "Gujarat", cityGu: "ગુજરાત", note: "Home · Garba nights", noteGu: "ઘર · ગરબાની રાત", src: img("garba-stage-wide") },
  { sky: "towers", city: "Surat", cityGu: "સુરત", note: "Concert · standing ovations", noteGu: "કોન્સર્ટ · સ્ટેન્ડિંગ ઓવેશન", src: img("sunehre-nagme-concert") },
  { sky: "club", city: "Bageshree Club", cityGu: "બાગેશ્રી ક્લબ", note: "Live club set", noteGu: "લાઇવ ક્લબ સેટ", src: img("stage-purple-spotlight") },
  { sky: "club", city: "Farmaish Club", cityGu: "ફરમાઇશ ક્લબ", note: "Duets & film classics", noteGu: "યુગલ ગીતો અને ફિલ્મી ગીતો", src: img("stage-pink-performing") },
  { sky: "bridge", city: "Brisbane", cityGu: "બ્રિસ્બેન", note: "Khamma Khamma · with Raj Gadhvi", noteGu: "ખમ્મા ખમ્મા · રાજ ગઢવી સાથે", src: img("stage-pyro-moment") },
  { sky: "opera", city: "Sydney", cityGu: "સિડની", note: "Live in Australia · Darjida", noteGu: "ઓસ્ટ્રેલિયામાં લાઇવ · દરજીડા", src: img("garba-live-red-chaniya") },
];
const GAP = 1500; // depth between stops (px)

// Line-art skylines (viewBox 0 0 400 160), drawn on as the camera approaches each stop.
const SKY: Record<string, string> = {
  temple: "M0 160V120h40v-20h10v20h30V90l20-40 20 40v30h20V70l30-50 30 50v50h20V90l20-40 20 40v30h30v-20h10v20h40v40 M140 70h60 M200 20v-12 M110 50v-8 M290 50v-8",
  towers: "M0 160V110h30V60h30v50h20V30h40v80h20V80h30v30h40V50h30v60h20V90h30v20h40V70h30v90 M0 135h400 M60 135q70-40 140 0t140 0",
  club: "M60 160V40h280v120 M60 40l20-25h240l20 25 M90 70h220v60H90z M80 28h4m20 0h4m20 0h4m20 0h4m20 0h4m20 0h4m20 0h4m20 0h4m20 0h4m20 0h4m20 0h4",
  bridge: "M0 160V100h25V50h25v50h20V20h30v80h20V70h25v30 M150 120h250 M170 120l30-45 30 45 30-45 30 45 30-45 30 45 30-45 20 30 M170 120V75h220v45 M320 160V120",
  opera: "M0 140h400 M30 140q10-60 60-90q-10 50 0 90 M80 140q15-70 70-100q-15 60-5 100 M140 140q20-60 70-75q-20 45-10 75 M250 140q55-120 140-10 M262 140V98 M290 140V70 M320 140V60 M350 140V65 M378 140V90",
};
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// fixed pseudo-random dust so server and client render the same markup
const DUST = Array.from({ length: 40 }, (_, i) => ({
  x: ((i * 37) % 100) - 50, y: ((i * 61) % 80) - 40, z: -((i * 211) % (STOPS.length * GAP)), s: 2 + (i % 4),
}));

export default function JourneyHero({ lang }: { lang: Locale }) {
  const gu = lang === "gu";
  const section = useRef<HTMLElement>(null);
  const curtainL = useRef<HTMLDivElement>(null), curtainR = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null), hint = useRef<HTMLDivElement>(null), finale = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null), beam = useRef<HTMLDivElement>(null);
  const skies = useRef<(SVGPathElement | null)[]>([]), flight = useRef<HTMLDivElement>(null), floor = useRef<HTMLDivElement>(null), plane = useRef<SVGGElement>(null), arc = useRef<SVGPathElement>(null);
  const stops = useRef<(HTMLDivElement | null)[]>([]), dots = useRef<(HTMLLIElement | null)[]>([]);

  useScrollScrub(section, (p, started) => {
    const open = clamp(p / 0.14);
    const fly = clamp((p - 0.1) / 0.8);
    const cam = fly * (STOPS.length - 1) * GAP + fly * 600;

    if (curtainL.current) curtainL.current.style.transform = `translateX(${-open * 102}%) skewY(${open * 4}deg)`;
    if (curtainR.current) curtainR.current.style.transform = `translateX(${open * 102}%) skewY(${-open * 4}deg)`;
    if (title.current) {
      const t = 1 - clamp(p / 0.08);
      title.current.style.opacity = String(t);
      title.current.style.transform = `scale(${1 + (1 - t) * 0.25})`;
      title.current.style.filter = `blur(${(1 - t) * 8}px)`;
    }
    if (hint.current) hint.current.style.opacity = started ? "0" : "1";
    if (world.current) world.current.style.transform = `translateZ(${cam}px)`;
    if (floor.current) floor.current.style.backgroundPosition = `0 ${-cam % 160}px`;
    if (beam.current) beam.current.style.transform = `translateX(-50%) rotate(${Math.sin(p * 18) * 22}deg)`;

    let active = 0;
    stops.current.forEach((el, i) => {
      if (!el) return;
      const z = -i * GAP + cam; // distance from camera plane (0 = at the lens)
      if (z > -GAP * 0.6) active = i;
      const o = z > 250 ? clamp(1 - (z - 250) / 350) : clamp(1 + z / (GAP * 2.2));
      el.style.opacity = String(open > 0.6 ? o : 0);
      const sk = skies.current[i];
      if (sk) sk.style.strokeDashoffset = String(1 - clamp(1 + z / (GAP * 0.9)));
    });
    dots.current.forEach((d, i) => d && (d.dataset.on = i <= active && fly > 0.01 ? "1" : ""));
    if (bar.current) bar.current.style.transform = `scaleX(${fly})`;
    // India → Australia flight between Farmaish Club and Brisbane
    const seg = fly * (STOPS.length - 1);
    const ft = clamp((seg - 3.15) / 0.75);
    if (flight.current) flight.current.style.opacity = String(ft > 0 && ft < 1 ? Math.sin(ft * Math.PI) : 0);
    if (arc.current && plane.current) {
      const len = arc.current.getTotalLength();
      const a = arc.current.getPointAtLength(ft * len), b = arc.current.getPointAtLength(Math.min(len, ft * len + 1));
      plane.current.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI})`);
      arc.current.style.strokeDashoffset = String(1 - ft);
    }
    if (finale.current) {
      const t = clamp((p - 0.9) / 0.1);
      finale.current.style.opacity = String(t);
      finale.current.style.transform = `translateY(${(1 - t) * 24}px)`;
    }
  }, 4200);

  return (
    <section ref={section} aria-label={gu ? "સુરભિની સંગીત યાત્રા" : "Where Surbhi's voice has travelled"}
      className="relative h-[100dvh] w-full select-none overflow-hidden bg-[#0b0b0b]" style={{ touchAction: "none" }}>
      {/* stage glow + moving spotlight */}
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 100%, rgba(214,40,40,.28), transparent 70%), radial-gradient(40% 40% at 50% 0%, rgba(214,40,40,.12), transparent 70%)" }} />
      <div ref={beam} aria-hidden className="absolute left-1/2 top-0 h-[120%] w-[38vw] origin-top"
        style={{ background: "linear-gradient(180deg, rgba(255,240,230,.16), transparent 75%)", clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)" }} />

      {/* 3D world */}
      <div aria-hidden className="absolute inset-0" style={{ perspective: "900px", perspectiveOrigin: "50% 45%" }}>
        {/* stage floor: a fixed grid plane whose texture scrolls with the camera (cheaper than a huge moving plane) */}
        <div ref={floor} className="absolute left-1/2 top-[72%] origin-top"
          style={{ width: "300vw", height: 2400, transform: "translateX(-50%) rotateX(-90deg)",
            backgroundImage: "linear-gradient(rgba(214,40,40,.5) 2px, transparent 2px), linear-gradient(90deg, rgba(214,40,40,.32) 2px, transparent 2px)",
            backgroundSize: "160px 160px", maskImage: "radial-gradient(60% 100% at 50% 0%, #000 30%, transparent 85%)" }} />
        <div ref={world} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {DUST.map((d, i) => (
            <span key={i} className="absolute left-1/2 top-1/2 rounded-full bg-[#d62828]"
              style={{ width: d.s, height: d.s, opacity: 0.55, boxShadow: "0 0 8px #d62828", transform: `translate3d(${d.x}vw, ${d.y}vh, ${d.z}px)` }} />
          ))}
          {STOPS.map((s, i) => {
            const left = i % 2 === 0;
            return (
              <div key={s.city} ref={(el) => { stops.current[i] = el; }} className="absolute inset-0" style={{ transform: `translateZ(${-i * GAP}px)`, opacity: 0, transformStyle: "preserve-3d" }}>
                {/* city skyline behind the stop */}
                <svg viewBox="0 0 400 160" className="absolute left-1/2 top-[72%] w-[150vw] max-w-none -translate-x-1/2 -translate-y-full" style={{ transform: "translate(-50%,-100%) translateZ(-400px)" }} fill="none">
                  <path ref={(el) => { skies.current[i] = el; }} d={SKY[s.sky]} pathLength={1} stroke="#d62828" strokeWidth="1.4" strokeLinejoin="round"
                    style={{ strokeDasharray: 1, strokeDashoffset: 1, filter: "drop-shadow(0 0 6px #d62828)" }} />
                </svg>
                {/* photo in an arched stage frame */}
                <div className="absolute top-1/2 h-[54vh] w-[36vh] -translate-y-1/2 overflow-hidden rounded-t-full ring-2 ring-[#d62828] shadow-[0_0_80px_rgba(214,40,40,.55)]"
                  style={{ [left ? "left" : "right"]: "max(4vw, calc(50% - 46vh))" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: "50% 30%" }} loading={i < 2 ? "eager" : "lazy"} />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                {/* city name */}
                <div className={`absolute top-1/2 max-w-[46vw] -translate-y-1/2 ${left ? "right-[5vw] text-right" : "left-[5vw] text-left"}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[.4em] text-[#d62828]">
                    {String(i + 1).padStart(2, "0")} / {String(STOPS.length).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-black uppercase leading-[.85] tracking-[-0.04em] text-white"
                    style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui", fontSize: "clamp(2.4rem, 7vw, 6.5rem)", textShadow: "0 0 40px rgba(214,40,40,.6)" }}>
                    {gu ? s.cityGu : s.city}
                  </p>
                  <p className="mt-3 text-sm text-white/75 sm:text-base">{gu ? s.noteGu : s.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* opening title (sits on the curtain) */}
      <div ref={title} className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[.45em] text-[#d62828]">{gu ? "એક અવાજની યાત્રા" : "One voice · Many stages"}</p>
        <h2 className="mt-4 font-black uppercase leading-[.85] tracking-[-0.04em] text-white"
          style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui", fontSize: "clamp(2.8rem, 10vw, 10rem)", textShadow: "0 6px 40px rgba(0,0,0,.6)" }}>
          {gu ? profile.nameGu : <>Surbhi<br />Badmaliya</>}
        </h2>
        <p className="mt-5 max-w-md text-white/80">{gu ? "પડદો ખૂલે છે… ગુજરાતથી ઓસ્ટ્રેલિયા સુધી." : "The curtain rises — from Gujarat to Australia."}</p>
      </div>

      {/* stage curtains */}
      {[curtainL, curtainR].map((r, i) => (
        <div key={i} ref={r} aria-hidden className={`absolute inset-y-0 z-10 w-1/2 ${i ? "right-0 origin-right" : "left-0 origin-left"}`}
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,.025), transparent 40%, rgba(255,255,255,.02) 70%, transparent), #161616",
            boxShadow: i ? "inset 30px 0 60px rgba(0,0,0,.6)" : "inset -30px 0 60px rgba(0,0,0,.6)",
          }}>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ))}
      <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-[9vh] bg-[#111111] shadow-[0_10px_30px_rgba(0,0,0,.7)]"
        style={{ background: "#111111", borderBottom: "1px solid rgba(214,40,40,.6)", clipPath: "polygon(0 0,100% 0,100% 70%, 96% 100%, 92% 70%, 88% 100%, 84% 70%, 80% 100%, 76% 70%, 72% 100%, 68% 70%, 64% 100%, 60% 70%, 56% 100%, 52% 70%, 48% 100%, 44% 70%, 40% 100%, 36% 70%, 32% 100%, 28% 70%, 24% 100%, 20% 70%, 16% 100%, 12% 70%, 8% 100%, 4% 70%, 0 100%)" }} />

      {/* flight HUD */}
      <div ref={flight} aria-hidden className="pointer-events-none absolute inset-x-0 top-[12vh] z-[15] flex justify-center opacity-0">
        <div className="w-[min(90vw,520px)] rounded-3xl border border-white/10 bg-black/80 p-5 backdrop-blur-md">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[.45em] text-[#d62828]">{gu ? "હવે સરહદ પાર" : "Now crossing oceans"}</p>
          <svg viewBox="0 0 600 200" className="mt-2 w-full">
            <path d="M60 150 Q300 -40 540 150" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2" strokeDasharray="6 8" />
            <path ref={arc} d="M60 150 Q300 -40 540 150" fill="none" stroke="#d62828" strokeWidth="3" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1, filter: "drop-shadow(0 0 6px #d62828)" }} />
            <circle cx="60" cy="150" r="7" fill="#d62828" /><circle cx="540" cy="150" r="7" fill="#d62828" />
            <text x="60" y="185" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">{gu ? "ભારત" : "INDIA"}</text>
            <text x="540" y="185" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">{gu ? "ઓસ્ટ્રેલિયા" : "AUSTRALIA"}</text>
            <g ref={plane}><path d="M-14 0 L10 -3 L14 0 L10 3 Z M-2 -1 L-8 -12 L-3 -12 L6 -1 Z M-2 1 L-8 12 L-3 12 L6 1 Z M-12 0 L-16 -6 L-13 -6 L-9 0 Z" fill="#fff" /></g>
          </svg>
        </div>
      </div>

      {/* finale */}
      <div ref={finale} className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55 px-6 text-center opacity-0">
        <p className="text-[11px] font-semibold uppercase tracking-[.45em] text-[#d62828]">{gu ? "ગુજરાત → ઓસ્ટ્રેલિયા" : "Gujarat → Australia"}</p>
        <p className="mt-4 max-w-3xl font-black leading-[1.02] tracking-tight text-white" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui", fontSize: "clamp(1.8rem, 4.6vw, 4rem)" }}>
          {gu ? "આગલો મંચ? તમારો." : "Next stage? Yours."}
        </p>
        <p className="mt-4 text-white/70">{gu ? "નીચે સ્ક્રોલ કરતા રહો" : "Keep scrolling"} ↓</p>
      </div>

      {/* route bar */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4 sm:px-10 sm:pb-6">
        <ol className="relative flex justify-between">
          <div aria-hidden className="absolute left-0 right-0 top-[5px] h-px bg-white/15">
            <div ref={bar} className="h-full origin-left bg-gradient-to-r from-[#d62828] to-[#d62828]" style={{ transform: "scaleX(0)" }} />
          </div>
          {STOPS.map((s, i) => (
            <li key={s.city} ref={(el) => { dots.current[i] = el; }} className="group relative flex flex-col items-center gap-2">
              <span className="h-[11px] w-[11px] rounded-full border border-white/40 bg-black transition group-data-[on=1]:border-[#d62828] group-data-[on=1]:bg-[#d62828] group-data-[on=1]:shadow-[0_0_14px_#d62828]" />
              <span className="hidden text-[10px] uppercase tracking-[.2em] text-white/45 transition group-data-[on=1]:text-white sm:block">{gu ? s.cityGu : s.city}</span>
            </li>
          ))}
        </ol>
      </div>

      <div ref={hint} className="pointer-events-none absolute bottom-16 left-1/2 z-30 -translate-x-1/2 text-center text-[11px] font-semibold uppercase tracking-[.35em] text-white/75 transition-opacity">
        {gu ? "પડદો ખોલવા સ્ક્રોલ કરો" : "Scroll to raise the curtain"}
        <span className="mt-2 block animate-bounce">↓</span>
      </div>
    </section>
  );
}
