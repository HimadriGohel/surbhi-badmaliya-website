import "../globals.css";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bodoni_Moda, Manrope, Noto_Sans_Gujarati } from "next/font/google";
import { isLocale, locales, t } from "@/content/i18n";
import { SITE_URL } from "@/content/profile";
import { websiteLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--nf-display", display: "swap", style: ["normal", "italic"] });
const body = Manrope({ subsets: ["latin"], variable: "--nf-body", display: "swap" });
const gu = Noto_Sans_Gujarati({ subsets: ["gujarati"], variable: "--nf-gu", display: "swap", weight: ["400", "600", "700"] });

export const viewport: Viewport = { themeColor: "#111111", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
  },
  robots: { index: true, follow: true },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = t(lang);
  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${gu.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("sb-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}` }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ivory focus:px-4 focus:py-2 focus:text-night">
          {d.skip}
        </a>
        <JsonLd data={websiteLd()} />
        <Nav lang={lang} />
        <main id="main">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
