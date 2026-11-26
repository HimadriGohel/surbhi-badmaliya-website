import type { Metadata } from "next";
import { SITE_URL, profile, sameAs } from "@/content/profile";
import { locales, type Locale } from "@/content/i18n";

export const routes = ["", "/music", "/on-stage", "/story", "/gallery", "/booking"] as const;
export type Route = (typeof routes)[number];

export const url = (l: Locale, r: Route | string = "") => `${SITE_URL}/${l}${r}`;
const OG_IMAGE = "/images/surbhi-badmaliya-garba-stage-wide.jpg";

export function pageMeta(l: Locale, r: Route, title: string, description: string, image = OG_IMAGE): Metadata {
  const languages = Object.fromEntries(locales.map((x) => [x === "gu" ? "gu-IN" : "en", url(x, r)]));
  return {
    title,
    description,
    alternates: { canonical: url(l, r), languages: { ...languages, "x-default": url("en", r) } },
    openGraph: {
      title, description, url: url(l, r), siteName: `${profile.name} · Star.bio`, type: "profile",
      locale: l === "gu" ? "gu_IN" : "en_IN",
      images: [{ url: image, width: 405, height: 720, alt: `${profile.name} performing live` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function personLd(l: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    alternateName: profile.nameGu,
    url: url(l),
    image: `${SITE_URL}/images/surbhi-badmaliya-portrait-closeup.jpg`,
    description,
    jobTitle: "Singer",
    knowsAbout: ["Gujarati folk music", "Garba", "Devotional music", "Live performance"],
    sameAs,
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: `${profile.name} · Star.bio`,
    url: SITE_URL,
    inLanguage: ["en", "gu-IN"],
    about: { "@id": `${SITE_URL}/#person` },
  };
}

export function pageLd(l: Locale, r: Route, name: string, crumbs: [string, string][]) {
  return [
    { "@context": "https://schema.org", "@type": "WebPage", name, url: url(l, r), inLanguage: l === "gu" ? "gu-IN" : "en", about: { "@id": `${SITE_URL}/#person` }, isPartOf: { "@id": `${SITE_URL}/#website` } },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: crumbs.map(([n, path], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: url(l, path) })),
    },
  ];
}
