import type { Metadata } from "next";
import { isLocale, t, type Locale } from "@/content/i18n";
import { pageLd, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Scene3D from "@/components/Scene3D";
import OnStage from "@/components/OnStage";

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : "en") as Locale;
  return pageMeta(l, "/on-stage", t(l).stage.metaTitle, t(l).stage.metaDesc, "/images/surbhi-badmaliya-stage-pyro-moment.jpg");
}

export default async function OnStagePage({ params }: P) {
  const { lang } = await params;
  const l = lang as Locale;
  const D = t(l);
  return (
    <div className="relative">
      <Scene3D variant="spotlights" className="absolute right-0 top-16 z-[5] origin-top-right scale-[.6] sm:right-10 sm:scale-90 lg:scale-100" />
      <JsonLd data={pageLd(l, "/on-stage", D.stage.metaTitle, [[D.nav.home, ""], [D.nav.stage, "/on-stage"]])} />
      <OnStage lang={l} />
    </div>
  );
}
