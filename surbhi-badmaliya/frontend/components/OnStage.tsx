"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Locale } from "@/content/i18n";

const ease = [0.22, 1, 0.36, 1] as const;
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const I: Record<string, React.ReactNode> = {
  garba: <path {...S} d="M5 19 15 5M9 19 19 5M4 20l2-2M18 6l2-2M8 20l2-2M18 4l2 2" />,
  folk: <><circle {...S} cx="12" cy="12" r="9" /><path {...S} d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" /></>,
  devotional: <path {...S} d="M12 3c1.5 2 1.5 3.5 0 5-1.5-1.5-1.5-3 0-5ZM3 12h18c0 4-4 7-9 7s-9-3-9-7Z" />,
  duet: <><circle {...S} cx="8" cy="8" r="3" /><circle {...S} cx="16" cy="8" r="3" /><path {...S} d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /></>,
  club: <><path {...S} d="M9 18V5l11-2v13" /><circle {...S} cx="6" cy="18" r="3" /><circle {...S} cx="17" cy="16" r="3" /></>,
  world: <><circle {...S} cx="12" cy="12" r="9" /><path {...S} d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>,
  dhol: <><ellipse {...S} cx="12" cy="7" rx="7" ry="3" /><path {...S} d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7M7 9l4 9M17 9l-4 9" /></>,
  tabla: <><ellipse {...S} cx="8" cy="9" rx="4" ry="1.6" /><path {...S} d="M4 9v7c0 1 1.8 2 4 2s4-1 4-2V9" /><ellipse {...S} cx="17" cy="11" rx="4" ry="1.6" /><path {...S} d="M13 11c0 3 .5 6 4 7 3.5-1 4-4 4-7" /></>,
  keys: <><rect {...S} x="2" y="6" width="20" height="12" rx="1.5" /><path {...S} d="M6 6v7M10 6v7M14 6v7M18 6v7" /></>,
  pad: <><rect {...S} x="3" y="3" width="18" height="18" rx="3" /><circle {...S} cx="8.5" cy="8.5" r="2" /><circle {...S} cx="15.5" cy="8.5" r="2" /><circle {...S} cx="8.5" cy="15.5" r="2" /><circle {...S} cx="15.5" cy="15.5" r="2" /></>,
  guitar: <path {...S} d="M19 3l2 2-6 6M14 10a4 4 0 0 0-5.6 0L4 14.4a4 4 0 1 0 5.6 5.6L14 15.6a4 4 0 0 0 0-5.6ZM8 16l-.01.01" />,
  mic: <path {...S} d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3" />,
};

type L = { en: string; gu: string };
const tr = (x: L, l: Locale) => x[l];

const FORMATS: { icon: string; t: L; d: L; songs: string }[] = [
  { icon: "garba", t: { en: "Garba & Navratri nights", gu: "ગરબા અને નવરાત્રિ" }, d: { en: "Non-stop Garba sets that move from slow, graceful rounds to high-tempo raas — the heart of her live calendar.", gu: "ધીમા ગરબાથી ઝડપી રાસ સુધીના નોન-સ્ટોપ સેટ — તેમના લાઇવ કાર્યક્રમોનું હૃદય." }, songs: "Lal Darvaje · Pethalpur Ma Pavo Vagyo · Aaso Ni Radhiyali" },
  { icon: "folk", t: { en: "Gujarati folk evenings", gu: "ગુજરાતી લોકસંગીત સંધ્યા" }, d: { en: "Traditional folk songs of Gujarat sung live, often with a duet partner and a full folk band.", gu: "ગુજરાતનાં પરંપરાગત લોકગીતો, ઘણીવાર યુગલ ગાયક અને સંપૂર્ણ બેન્ડ સાથે." }, songs: "Darjida · Dheldi Mara Malakma Aav · Indhana Vinva" },
  { icon: "devotional", t: { en: "Devotional & Maataji", gu: "ભક્તિ અને માતાજી" }, d: { en: "Garba and bhajans dedicated to the Goddess, sung with reverence before the dancing begins.", gu: "માતાજીને અર્પણ ગરબા અને ભજન, શ્રદ્ધાપૂર્વક." }, songs: "Khamkare Khodiyar · Aavjo Mavdiyu · Maa Ae Garbo Korvyo" },
  { icon: "duet", t: { en: "Duet stages", gu: "યુગલ ગીતો" }, d: { en: "Shared stages with fellow singers — Raj Gadhvi in Australia, Mukhtar Shah and Vishwanath Batunge at club evenings.", gu: "રાજ ગઢવી, મુખ્તાર શાહ અને વિશ્વનાથ બટુંગે જેવા ગાયકો સાથે." }, songs: "Darjida · Khamma Khamma · Je Hum Tum Chori Se" },
  { icon: "club", t: { en: "Film-song club evenings", gu: "ફિલ્મી ગીતોની સાંજ" }, d: { en: "Classic Hindi film songs for seated audiences at music clubs such as Bageshree Club and Farmaish Club.", gu: "બાગેશ્રી ક્લબ અને ફરમાઇશ ક્લબ જેવી મ્યુઝિક ક્લબમાં ક્લાસિક હિન્દી ગીતો." }, songs: "Hungama Ho Gaya · Aa Jaane Jaa · Gunguna Rahe Hain Bhanware" },
  { icon: "world", t: { en: "International shows", gu: "આંતરરાષ્ટ્રીય કાર્યક્રમો" }, d: { en: "Garba and folk for the Gujarati diaspora — her channel shows live sets in Sydney and Brisbane, Australia.", gu: "વિદેશમાં વસતા ગુજરાતીઓ માટે — સિડની અને બ્રિસ્બેન, ઑસ્ટ્રેલિયામાં લાઇવ." }, songs: "Pari Hu Main · Khamkare Khodiyar · Khamma Khamma" },
];

const FLOW: { t: L; d: L }[] = [
  { t: { en: "Soundcheck", gu: "સાઉન્ડચેક" }, d: { en: "Band and vocals are balanced for the hall or ground.", gu: "હોલ કે મેદાન મુજબ અવાજ ગોઠવાય છે." } },
  { t: { en: "Stuti & Aarti", gu: "સ્તુતિ અને આરતી" }, d: { en: "Garba nights traditionally open with a prayer to the Goddess.", gu: "ગરબાની રાત પરંપરાગત રીતે માતાજીની સ્તુતિથી શરૂ થાય છે." } },
  { t: { en: "Slow Garba", gu: "ધીમા ગરબા" }, d: { en: "Graceful two- and three-clap rounds warm up the circle.", gu: "બે અને ત્રણ તાળીના ગરબાથી શરૂઆત." } },
  { t: { en: "Raas & Dandiya", gu: "રાસ અને દાંડિયા" }, d: { en: "Tempo rises; dandiya sticks join the dhol.", gu: "લય વધે છે, દાંડિયા અને ઢોલ સાથે." } },
  { t: { en: "Non-stop & Dakla", gu: "નોન-સ્ટોપ અને ડાકલા" }, d: { en: "High-energy medleys keep the crowd moving.", gu: "ઊર્જાભર્યા મેડલી પ્રેક્ષકોને નચાવે છે." } },
  { t: { en: "Finale", gu: "સમાપન" }, d: { en: "A last singalong and thanks to the audience.", gu: "અંતિમ ગીત અને પ્રેક્ષકોનો આભાર." } },
];

const BAND: { icon: string; t: L }[] = [
  { icon: "mic", t: { en: "Lead vocals", gu: "મુખ્ય ગાયન" } },
  { icon: "dhol", t: { en: "Dhol", gu: "ઢોલ" } },
  { icon: "tabla", t: { en: "Tabla", gu: "તબલા" } },
  { icon: "pad", t: { en: "Rhythm pad", gu: "રિધમ પેડ" } },
  { icon: "keys", t: { en: "Keyboard", gu: "કીબોર્ડ" } },
  { icon: "guitar", t: { en: "Guitar", gu: "ગિટાર" } },
];

const RECORD: { place: string; where: L; what: L; id: string }[] = [
  { place: "Sydney", where: { en: "Australia", gu: "ઑસ્ટ્રેલિયા" }, what: { en: "Indhana Vinva Gai Ti · Khamkare Khodiyar · Pari Hu Main", gu: "ઇંધણા વીણવા ગઇ'તી · ખમકારે ખોડિયાર · પરી હું મૈં" }, id: "Nhh5sh316zY" },
  { place: "Brisbane", where: { en: "Australia · with Raj Gadhvi", gu: "ઑસ્ટ્રેલિયા · રાજ ગઢવી સાથે" }, what: { en: "Khamma Khamma · Dakla", gu: "ખમ્મા ખમ્મા · ડાકલા" }, id: "xi7FuBjzLXU" },
  { place: "Australia", where: { en: "with Raj Gadhvi", gu: "રાજ ગઢવી સાથે" }, what: { en: "Darjida", gu: "દરજીડા" }, id: "m0WUxwHPiYI" },
  { place: "Surat", where: { en: "Gujarat · concert", gu: "ગુજરાત · કોન્સર્ટ" }, what: { en: "Standing ovations at a full-house concert", gu: "પ્રેક્ષકોએ ઊભા થઈ તાળીઓ પાડી" }, id: "Yf0EJlpupFM" },
  { place: "Bageshree Club", where: { en: "Music club", gu: "મ્યુઝિક ક્લબ" }, what: { en: "Hungama Ho Gaya", gu: "હંગામા હો ગયા" }, id: "5GU8RxWuimc" },
  { place: "Farmaish Club", where: { en: "Music club", gu: "મ્યુઝિક ક્લબ" }, what: { en: "Aa Jaane Jaa · Gunguna Rahe Hain Bhanware", gu: "આ જાને જા · ગુનગુના રહે હૈં ભંવરે" }, id: "6SvtVF4ePig" },
];

const SONGS = ["Darjida", "Khamma Khamma", "Lal Darvaje", "Ramva Aave Madi", "Khamkare Khodiyar", "Pethalpur Ma Pavo Vagyo", "Aaso Ni Radhiyali", "Dheldi Mara Malakma", "Indhana Vinva Gai Ti", "Mahisagar Ni Aare", "Aavjo Mavdiyu", "Maa Ae Garbo Korvyo", "Pari Hu Main", "Hungama Ho Gaya", "Aa Jaane Jaa", "Tari Aankh No Afini", "Rang Morla", "Khamma Vira Ne"];

function Kicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
      <span className="font-display text-sm italic text-fuchsia">{n}</span>
      <motion.span className="h-px bg-fuchsia" initial={{ width: 0 }} whileInView={{ width: 64 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} />
      <span className="text-[11px] uppercase tracking-[.35em] text-mist">{children}</span>
    </motion.div>
  );
}
const H2 = ({ children }: { children: React.ReactNode }) => (
  <motion.h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}
    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>{children}</motion.h2>
);

export default function OnStage({ lang }: { lang: Locale }) {
  const gu = lang === "gu";
  const reduce = useReducedMotion();
  const flowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: flowRef, offset: ["start 75%", "end 40%"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* HERO */}
      <header className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[560px] w-[560px] rounded-full bg-fuchsia/20 blur-[150px]" />
        {/* spotlight beams */}
        {!reduce && [0, 1, 2].map((i) => (
          <motion.span key={i} aria-hidden className="pointer-events-none absolute -top-20 h-[140%] w-40 origin-top bg-gradient-to-b from-white/10 to-transparent blur-2xl"
            style={{ left: `${45 + i * 18}%` }} animate={{ rotate: [i % 2 ? 18 : -18, i % 2 ? -18 : 18] }}
            transition={{ duration: 6 + i, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} />
        ))}
        <nav aria-label="Breadcrumb" className="relative text-xs text-mist">
          <Link href={`/${lang}`} className="hover:text-ivory">{gu ? "હોમ" : "Home"}</Link> <span aria-hidden>/</span> <span aria-current="page">{gu ? "સ્ટેજ પર" : "On Stage"}</span>
        </nav>
        <p className="relative mt-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.35em] text-fuchsia">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-fuchsia" /></span>
          Live
        </p>
        <motion.h1 className="relative mt-4 text-[17vw] font-black leading-[0.82] tracking-[-0.05em] sm:text-[13vw] xl:text-[11rem]" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }} initial="h" animate="s">
          {(gu ? ["સ્ટેજ", "પર."] : ["On", "Stage."]).map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.14em]">
              <motion.span className={`block ${i ? "text-fuchsia" : ""}`} variants={{ h: { y: reduce ? 0 : "105%" }, s: { y: 0 } }} transition={{ delay: 0.1 + i * 0.15, duration: 1, ease }}>{w}</motion.span>
            </span>
          ))}
        </motion.h1>
        <motion.p className="relative mt-8 max-w-2xl text-lg leading-relaxed text-mist" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {gu ? "ગરબાનાં મેદાનોથી મ્યુઝિક ક્લબ અને ઑસ્ટ્રેલિયાના મંચ સુધી — સુરભિ બડમલિયા લાઇવ શું રજૂ કરે છે, અને એક ગરબા રાત કેવી રીતે આગળ વધે છે." : "From Garba grounds to music clubs and stages in Australia — what Surbhi Badmaliya brings to a live show, and how a Garba night unfolds."}
        </motion.p>
        <motion.dl className="relative mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {[["2", gu ? "દેશ" : "Countries"], ["6", gu ? "શો ફોર્મેટ" : "Show formats"], ["3", gu ? "યુગલ ગાયકો" : "Duet partners"], ["30", gu ? "રીલ્સ" : "Reels"]].map(([n, l]) => (
            <div key={l} className="border-l border-fuchsia/50 pl-4">
              <dd className="font-display text-5xl">{n}</dd>
              <dt className="mt-1 text-[10px] uppercase tracking-[.3em] text-mist">{l}</dt>
            </div>
          ))}
        </motion.dl>
      </header>

      {/* city marquee */}
      <div aria-hidden className="relative -rotate-1 overflow-hidden border-y border-white/10 bg-white/[.02] py-5">
        <motion.div className="flex w-max gap-12 whitespace-nowrap text-4xl font-black uppercase tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.35)] sm:text-6xl"
          animate={reduce ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
          {Array.from({ length: 2 }).flatMap((_, k) => ["Surat", "Sydney", "Brisbane", "Gujarat", "Navratri", "Garba"].map((c) => (
            <span key={`${k}-${c}`} className="flex items-center gap-12">{c}<span className="text-fuchsia [-webkit-text-stroke:0]">✦</span></span>
          )))}
        </motion.div>
      </div>

      {/* FORMATS */}
      <section className="px-4 py-24 sm:px-8 lg:px-12">
        <Kicker n="01">{gu ? "શું થાય છે" : "What happens on stage"}</Kicker>
        <H2>{gu ? <>છ પ્રકારના <span className="font-display font-normal italic text-fuchsia">લાઇવ</span> કાર્યક્રમ</> : <>Six kinds of <span className="font-display font-normal italic text-fuchsia">live</span> show</>}</H2>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map((f, i) => (
            <motion.li key={f.icon} initial={reduce ? false : { opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[.05] to-transparent p-7 transition hover:border-fuchsia/60">
              <span aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia/0 blur-3xl transition duration-700 group-hover:bg-fuchsia/30" />
              <div className="relative flex items-start justify-between">
                <motion.span className="grid h-14 w-14 place-items-center rounded-2xl bg-fuchsia/15 text-fuchsia transition group-hover:bg-fuchsia group-hover:text-white"
                  whileHover={{ rotate: -10, scale: 1.1 }}>
                  <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>{I[f.icon]}</svg>
                </motion.span>
                <span className="font-display text-4xl italic text-white/15 transition group-hover:text-fuchsia/60">0{i + 1}</span>
              </div>
              <h3 className="relative mt-8 text-2xl font-bold" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}>{tr(f.t, lang)}</h3>
              <p className="relative mt-3 leading-relaxed text-mist">{tr(f.d, lang)}</p>
              <p className="relative mt-6 border-t border-white/10 pt-4 text-xs uppercase tracking-[.18em] text-fuchsia/90">♪ {f.songs}</p>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* FLOW */}
      <section className="relative px-4 py-24 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <Kicker n="02">{gu ? "એક રાતનો ક્રમ" : "Inside a Garba night"}</Kicker>
            <H2>{gu ? <>રાત કેવી રીતે <span className="font-display font-normal italic text-fuchsia">ખીલે</span> છે</> : <>How the night <span className="font-display font-normal italic text-fuchsia">builds</span></>}</H2>
            <p className="mt-5 max-w-sm text-mist">{gu ? "પરંપરાગત ગરબા રાતનો સામાન્ય ક્રમ — દરેક આયોજન મુજબ થોડો બદલાઈ શકે." : "The usual shape of a traditional Garba night — every event varies a little."}</p>
          </div>
          <div ref={flowRef} className="relative lg:col-span-8">
            <div aria-hidden className="absolute bottom-0 left-[27px] top-0 w-px bg-white/10" />
            <motion.div aria-hidden className="absolute left-[27px] top-0 w-px bg-gradient-to-b from-fuchsia to-rose" style={{ height: line }} />
            <ol className="space-y-6">
              {FLOW.map((s, i) => (
                <motion.li key={s.t.en} className="relative flex gap-4 sm:gap-6" initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: 0.7, ease }}>
                  <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-fuchsia/60 bg-night font-display text-xl italic text-fuchsia">{i + 1}</span>
                  <div className="flex-1 rounded-3xl border border-white/10 bg-white/[.03] p-6 transition hover:border-fuchsia/50 hover:bg-fuchsia/[.06]">
                    <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}>{tr(s.t, lang)}</h3>
                    <p className="mt-2 text-mist">{tr(s.d, lang)}</p>
                    {/* tempo bar */}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-[.25em] text-mist">{gu ? "લય" : "Tempo"}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia to-rose" initial={{ width: 0 }}
                          whileInView={{ width: `${[15, 20, 40, 70, 100, 60][i]}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2, ease }} />
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* BAND */}
      <section className="px-4 py-24 sm:px-8 lg:px-12">
        <Kicker n="03">{gu ? "લાઇવ બેન્ડ" : "The live band"}</Kicker>
        <H2>{gu ? <>સૂર પાછળનો <span className="font-display font-normal italic text-fuchsia">તાલ</span></> : <>The rhythm behind <span className="font-display font-normal italic text-fuchsia">the voice</span></>}</H2>
        <p className="mt-5 max-w-xl text-mist">{gu ? "ગરબા ઓર્કેસ્ટ્રામાં સામાન્ય રીતે આ વાદ્યો હોય છે — કાર્યક્રમ મુજબ બદલાઈ શકે." : "A typical Garba orchestra is built around live dhol — line-ups vary by event."}</p>
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {BAND.map((b, i) => (
            <motion.li key={b.icon} initial={reduce ? false : { opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: i * 0.08 }}
              className="group flex aspect-square flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/[.03] transition hover:border-fuchsia/60 hover:bg-fuchsia/10">
              <motion.svg viewBox="0 0 24 24" className="h-14 w-14 text-ivory transition group-hover:text-fuchsia" aria-hidden
                animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}>{I[b.icon]}</motion.svg>
              <span className="text-sm font-semibold">{tr(b.t, lang)}</span>
              <span aria-hidden className="flex h-3 items-end gap-[2px] opacity-0 transition group-hover:opacity-100">
                {[0.5, 1, 0.7, 0.9].map((h, k) => <span key={k} className="w-[3px] origin-bottom animate-[eq_0.9s_ease-in-out_infinite] rounded-full bg-fuchsia" style={{ height: `${h * 100}%`, animationDelay: `${k * 0.12}s` }} />)}
              </span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* ON RECORD */}
      <section className="px-4 py-24 sm:px-8 lg:px-12">
        <Kicker n="04">{gu ? "નોંધાયેલા કાર્યક્રમો" : "On record"}</Kicker>
        <H2>{gu ? <>જ્યાં તેમણે <span className="font-display font-normal italic text-fuchsia">ગાયું</span> છે</> : <>Where she has <span className="font-display font-normal italic text-fuchsia">performed</span></>}</H2>
        <p className="mt-5 max-w-xl text-mist">{gu ? "માત્ર એ સ્થળો, જેના સત્તાવાર વિડિયો તેમની ચેનલ પર છે." : "Only places documented by official videos on her own channel."}</p>
        <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {RECORD.map((r, i) => (
            <motion.li key={r.place} initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.6, ease }}>
              <a href={`https://www.youtube.com/watch?v=${r.id}`} target="_blank" rel="noopener noreferrer"
                className="group relative grid items-center gap-2 overflow-hidden py-7 sm:grid-cols-12 sm:gap-6">
                <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-fuchsia/20 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                <span className="relative font-display text-sm italic text-fuchsia sm:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative text-4xl font-black tracking-tight transition-transform duration-500 group-hover:translate-x-3 sm:col-span-5 sm:text-6xl" style={{ fontFamily: "var(--nf-body), system-ui" }}>{r.place}</span>
                <span className="relative text-sm uppercase tracking-[.2em] text-mist sm:col-span-2">{tr(r.where, lang)}</span>
                <span className="relative text-ivory/80 sm:col-span-3">{tr(r.what, lang)}</span>
                <span className="relative hidden text-right text-2xl text-fuchsia transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:col-span-1 sm:block">↗</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* SONG CLOUD */}
      <section className="px-4 py-24 sm:px-8 lg:px-12">
        <Kicker n="05">{gu ? "સ્ટેજ પર ગવાતાં ગીતો" : "Heard on stage"}</Kicker>
        <H2>{gu ? <>ગીતો જે <span className="font-display font-normal italic text-fuchsia">ગુંજે</span> છે</> : <>Songs that <span className="font-display font-normal italic text-fuchsia">fill the ground</span></>}</H2>
        <ul className="mt-12 flex flex-wrap gap-3">
          {SONGS.map((s, i) => (
            <motion.li key={s} initial={reduce ? false : { opacity: 0, y: 20, scale: 0.8 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.035, type: "spring", stiffness: 220, damping: 18 }}
              whileHover={{ scale: 1.08, rotate: i % 2 ? 2 : -2 }}
              className={`cursor-default rounded-full border px-5 py-3 transition-colors ${i % 5 === 0 ? "border-fuchsia bg-fuchsia text-lg font-semibold" : "border-white/15 bg-white/[.03] hover:border-fuchsia"}`}>
              ♪ {s}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="px-4 pb-8 sm:px-8 lg:px-12">
        <motion.div className="relative overflow-hidden rounded-[2.5rem] border border-fuchsia/30 bg-[radial-gradient(120%_120%_at_0%_0%,#3a1414,#111_60%)] px-6 py-16 text-center sm:px-16 sm:py-24"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
          <div aria-hidden className="bandhani absolute inset-0 opacity-15" />
          <h2 className="relative text-4xl font-extrabold tracking-tight sm:text-6xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}>
            {gu ? "તમારા ગરબામાં સુરભિ" : <>Surbhi, <span className="font-display font-normal italic text-fuchsia">live</span> at your event</>}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-mist">{gu ? "નવરાત્રિ, લોકસંગીત સંધ્યા, ભક્તિ કાર્યક્રમ કે આંતરરાષ્ટ્રીય શો માટે સંપર્ક કરો." : "Navratri, folk evenings, devotional programmes or international shows — send an enquiry."}</p>
          <Link href={`/${lang}/booking`} className="group relative mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-fuchsia py-2 pl-8 pr-2 font-semibold shadow-[0_0_40px_rgba(214,40,40,.5)]">
            {gu ? "શો બુક કરો" : "Book a show"}
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black transition-transform group-hover:-rotate-45">→</span>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
