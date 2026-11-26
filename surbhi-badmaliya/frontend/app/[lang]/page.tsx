import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, t, type Locale } from "@/content/i18n";
import { profile } from "@/content/profile";
import { featured, videos } from "@/content/works";
import { photo, photos } from "@/content/gallery";
import { pageMeta, personLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Scene3D from "@/components/Scene3D";
import Splash from "@/components/Splash";
import Hero from "@/components/Hero";
import JourneyHero from "@/components/JourneyHero";
import SignatureSound from "@/components/SignatureSound";
import MusicShowcase from "@/components/MusicShowcase";
import StageWall from "@/components/StageWall";
import StoryArt from "@/components/StoryArt";
import CatchGame from "@/components/CatchGame";
import Reveal from "@/components/Reveal";
import VideoCard from "@/components/VideoCard";
import Waveform from "@/components/Waveform";

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : "en") as Locale;
  const d = t(l).home;
  return pageMeta(l, "", d.metaTitle, d.metaDesc);
}

export default async function Home({ params }: P) {
  const { lang } = await params;
  const l = lang as Locale;
  const D = t(l);
  const d = D.home;
  const [lead, ...rest] = featured;
  const strip = ["stage-pyro-moment", "garba-live-red-chaniya", "stage-pink-performing", "garba-indigo-stage", "sunehre-nagme-concert", "stage-red-haze"].map(photo);

  return (
    <div className="relative">
      <Scene3D variant="rings" className="absolute left-[-60px] top-[calc(100dvh+62svh)] z-[5] origin-top-left scale-[.6] sm:left-6 sm:scale-90 lg:left-16 lg:top-[calc(100dvh+55svh)] lg:scale-100" />
      <JsonLd data={personLd(l, d.metaDesc)} />
      <Splash d={D.splash} nameGu={profile.nameGu} lang={l} />
      <JourneyHero lang={l} />
      <Hero d={d} lang={l} video={existsSync(join(process.cwd(), "public/videos/surbhi-hero.mp4")) ? "/videos/surbhi-hero.mp4" : null} audio={existsSync(join(process.cwd(), "public/audio/darjida.mp3")) ? "/audio/darjida.mp3" : null} />

      <SignatureSound d={d} />

      <MusicShowcase list={featured} all={videos} d={d} music={D.music} lang={l} />

      <StageWall photos={photos.filter((p) => p.chapter !== "portrait")} d={d} lang={l} />

      {/* Story teaser */}
      <section aria-labelledby="story" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <StoryArt />
          <Reveal>
            <p className="text-xs uppercase tracking-[.35em] text-saffron">04</p>
            <h2 id="story" className="mt-3 font-display text-5xl sm:text-6xl">{d.storyTitle}</h2>
            <ol className="mt-8 space-y-6 border-l border-ivory/15 pl-6">
              {D.story.chapters.slice(0, 3).map((c) => (
                <li key={c.k}>
                  <p className="text-xs uppercase tracking-[.3em] text-rose">{c.k}</p>
                  <p className="mt-1 text-ivory/80">{c.d}</p>
                </li>
              ))}
            </ol>
            <Link href={`/${l}/story`} className="mt-8 inline-block border-b border-saffron pb-1 text-saffron">{d.storyCta} →</Link>
          </Reveal>
        </div>
      </section>

      <CatchGame lang={l} audio={existsSync(join(process.cwd(), "public/audio/darjida.mp3")) ? "/audio/darjida.mp3" : null} />

      {/* Connect */}
      <section aria-labelledby="connect" className="px-4 sm:px-8">
        <Reveal className="stage-glow grain relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-16 sm:py-24">
          <div aria-hidden className="bandhani absolute inset-0 opacity-20" />
          <h2 id="connect" className="relative font-display text-4xl sm:text-6xl">{d.connectTitle}</h2>
          <p className="relative mx-auto mt-5 max-w-xl text-mist">{d.connectBody}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/${l}/booking`} className="inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-fuchsia to-saffron px-8 font-semibold text-night">{d.book}</Link>
            <a href={profile.youtube.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full border border-ivory/30 px-8">YouTube ↗</a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
