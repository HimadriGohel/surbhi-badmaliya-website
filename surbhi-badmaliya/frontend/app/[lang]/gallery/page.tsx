import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, t, type Locale } from "@/content/i18n";
import { SITE_URL, profile } from "@/content/profile";
import { folkReels, liveReels, reelPoster } from "@/content/reels";
import { videos, ytPoster } from "@/content/works";
import { pageLd, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Scene3D from "@/components/Scene3D";
import GallerySlider, { type Slide } from "@/components/GallerySlider";

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : "en") as Locale;
  return pageMeta(l, "/gallery", t(l).gallery.metaTitle, t(l).gallery.metaDesc, reelPoster("m0WUxwHPiYI"));
}

export default async function GalleryPage({ params }: P) {
  const { lang } = await params;
  const l = lang as Locale;
  const D = t(l);
  const gu = l === "gu";

  const reelIds = new Set([...folkReels, ...liveReels].map((r) => r.id));
  const slides: Slide[] = [
    ...[...folkReels, ...liveReels].map((r) => ({
      src: reelPoster(r.id), title: gu && r.gu ? r.gu : r.title, tag: r.tag ?? "Reel", kind: "reel" as const, w: 1080, h: 1920,
    })),
    ...videos.filter((v) => !reelIds.has(v.id) && !v.vertical).map((v) => ({
      src: ytPoster(v), title: v.title, tag: v.context ?? "Video", kind: "video" as const, w: 1280, h: 720,
    })),
  ];

  const ld = [
    ...pageLd(l, "/gallery", D.gallery.metaTitle, [[D.nav.home, ""], [D.nav.gallery, "/gallery"]]),
    {
      "@context": "https://schema.org", "@type": "ImageGallery", name: D.gallery.metaTitle, url: `${SITE_URL}/${l}/gallery`,
      image: slides.map((s) => ({ "@type": "ImageObject", contentUrl: s.src, caption: `${s.title} — ${profile.name}`, width: s.w, height: s.h })),
    },
  ];

  return (
    <div className="relative">
      <Scene3D variant="cube" className="absolute right-[-20px] top-20 z-[15] origin-top-right scale-[.5] sm:right-8 sm:scale-75 lg:left-[40%] lg:right-auto lg:top-16 lg:scale-75" images={slides.slice(0, 6).map((s) => s.src)} />
      <JsonLd data={ld} />
      <header className="relative overflow-hidden px-4 pb-10 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-fuchsia/20 blur-[150px]" />
        <nav aria-label="Breadcrumb" className="relative text-xs text-mist">
          <Link href={`/${l}`} className="hover:text-ivory">{D.nav.home}</Link> <span aria-hidden>/</span> <span aria-current="page">{D.nav.gallery}</span>
        </nav>
        <div className="relative mt-8 flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-6xl font-black leading-[0.9] tracking-tight sm:text-8xl xl:text-9xl" style={{ fontFamily: "var(--nf-body), var(--nf-gu), system-ui" }}>
            {gu ? "ગેલેરી" : "Gallery"}<span className="text-fuchsia">.</span>
          </h1>
          <p className="max-w-md text-mist">
            {gu ? "સ્ટેજ, ગરબા અને લાઇવ પળોની Full HD ફ્રેમ્સ. તીર, થંબનેલ અથવા કીબોર્ડ ← → થી જુઓ." : "Full HD frames from the stage, Garba nights and live moments. Browse with the arrows, the thumbnails, or your keyboard ← →."}
          </p>
        </div>
      </header>
      <section className="px-4 pb-16 sm:px-8 lg:px-12">
        <GallerySlider slides={slides} lang={l} />
      </section>
    </div>
  );
}
