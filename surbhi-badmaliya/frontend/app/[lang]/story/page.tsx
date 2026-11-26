import type { Metadata } from "next";
import { isLocale, t, type Locale } from "@/content/i18n";
import { reelPoster } from "@/content/reels";
import { pageLd, pageMeta, personLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Scene3D from "@/components/Scene3D";
import StoryExperience from "@/components/StoryExperience";

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : "en") as Locale;
  return pageMeta(l, "/story", t(l).story.metaTitle, t(l).story.metaDesc, reelPoster("ab4OtkBwLJ4"));
}

export default async function Story({ params }: P) {
  const { lang } = await params;
  const l = lang as Locale;
  const D = t(l);
  return (
    <div className="relative">
      <Scene3D variant="pages" className="absolute left-[-40px] top-[60svh] z-[15] origin-top-left scale-[.5] sm:scale-75 lg:left-[30%] lg:top-[58svh] lg:scale-90" />
      <JsonLd data={[personLd(l, D.story.metaDesc), ...pageLd(l, "/story", D.story.metaTitle, [[D.nav.home, ""], [D.nav.story, "/story"]])]} />
      <StoryExperience d={D.story} lang={l} />
    </div>
  );
}
