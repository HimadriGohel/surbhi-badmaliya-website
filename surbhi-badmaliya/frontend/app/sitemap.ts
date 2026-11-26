import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/profile";
import { locales } from "@/content/i18n";
import { photos } from "@/content/gallery";
import { routes, url } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.flatMap((l) =>
    routes.map((r) => ({
      url: url(l, r),
      lastModified: now,
      changeFrequency: r === "/music" ? "weekly" : "monthly",
      priority: r === "" ? 1 : 0.8,
      alternates: { languages: { en: url("en", r), "gu-IN": url("gu", r), "x-default": url("en", r) } },
      images: r === "/gallery" ? photos.map((p) => `${SITE_URL}${p.src}`) : undefined,
    })),
  );
}
