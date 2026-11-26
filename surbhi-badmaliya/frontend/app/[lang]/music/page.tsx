import type { Metadata } from "next";
import { isLocale, t, type Locale } from "@/content/i18n";
import { profile } from "@/content/profile";
import { videos, ytWatch } from "@/content/works";
import { folkReels, liveReels } from "@/content/reels";
import { pageLd, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Scene3D from "@/components/Scene3D";
import MusicHero from "@/components/MusicHero";
import ReelsSection from "@/components/Reels";
import MusicLibrary from "@/components/MusicLibrary";

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : "en") as Locale;
  return pageMeta(l, "/music", t(l).music.metaTitle, t(l).music.metaDesc);
}

export default async function Music({ params }: P) {
  const { lang } = await params;
  const l = lang as Locale;
  const D = t(l);
  const d = D.music;
  const allReels = [...folkReels, ...liveReels];
  const ld = [
    ...pageLd(l, "/music", d.metaTitle, [[D.nav.home, ""], [D.nav.music, "/music"]]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: d.h1,
      itemListElement: [...allReels.map((r) => ({ id: r.id, name: r.title })), ...videos.map((v) => ({ id: v.id, name: v.title }))].map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "VideoObject",
          name: `${v.name} — ${profile.name}`,
          description: `${v.name}, performed by ${profile.name}.`,
          thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
          contentUrl: ytWatch(v.id),
        },
      })),
    },
  ];
  return (
    <div className="relative">
      <Scene3D variant="vinyl" className="absolute right-[-30px] top-24 z-[5] origin-top-right scale-[.55] sm:right-8 sm:scale-75 lg:left-[36%] lg:right-auto lg:top-36 lg:scale-90" />
      <JsonLd data={ld} />
      <MusicHero lang={l} reels={allReels.length} songs={videos.length} posters={folkReels.map((r) => r.id)} />
      <ReelsSection folk={folkReels} live={liveReels} lang={l} />
      <section aria-labelledby="songs" className="px-4 py-16 sm:px-8 lg:px-12">
        <p className="text-[11px] uppercase tracking-[.35em] text-fuchsia">{l === "gu" ? "વિડિયો" : "Videos"} · {videos.length}</p>
        <h2 id="songs" className="mb-10 mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}>{d.h1}</h2>
        <MusicLibrary videos={videos} d={d} />
        <p className="mt-16 text-center">
          <a href={profile.youtube.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center rounded-full border border-ivory/30 px-8 hover:border-fuchsia hover:text-fuchsia">
            {d.channelCta} ↗
          </a>
        </p>
      </section>
    </div>
  );
}
