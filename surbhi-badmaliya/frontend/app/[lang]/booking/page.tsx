import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, t, type Locale } from "@/content/i18n";
import { profile } from "@/content/profile";
import { pageLd, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Scene3D from "@/components/Scene3D";
import BookingContact from "@/components/BookingContact";

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : "en") as Locale;
  return pageMeta(l, "/booking", t(l).contact.metaTitle, t(l).contact.metaDesc);
}

export default async function Booking({ params }: P) {
  const { lang } = await params;
  const l = lang as Locale;
  const D = t(l);
  const d = D.contact;
  return (
    <div className="relative">
      <Scene3D variant="mic" className="absolute right-[-10px] top-24 z-[5] origin-top-right scale-[.5] sm:right-8 sm:scale-75 lg:right-16 lg:scale-90" />
      <JsonLd data={[
        ...pageLd(l, "/booking", d.metaTitle, [[D.nav.home, ""], [D.nav.contact, "/booking"]]),
        { "@context": "https://schema.org", "@type": "ContactPage", name: d.metaTitle, about: { "@type": "Person", name: profile.name, email: profile.bookingEmail, telephone: profile.bookingPhone } },
      ]} />
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[560px] w-[560px] rounded-full bg-fuchsia/20 blur-[150px]" />
        <nav aria-label="Breadcrumb" className="relative text-xs text-mist">
          <Link href={`/${l}`} className="hover:text-ivory">{D.nav.home}</Link> <span aria-hidden>/</span> <span aria-current="page">{D.nav.contact}</span>
        </nav>
        <BookingContact lang={l} title={d.h1} />
      </section>
    </div>
  );
}
