import Link from "next/link";
import { t } from "@/content/i18n";
import Waveform from "@/components/Waveform";

export default function NotFound() {
  const d = t("en").notFound;
  return (
    <section className="stage-glow grain relative flex min-h-[80vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <p className="font-display text-[30vw] italic leading-none text-outline sm:text-[14rem]">404</p>
      <Waveform className="mt-2 h-10 w-64 opacity-60" bars={40} />
      <h1 className="mt-6 font-display text-4xl">{d.title}</h1>
      <p className="mt-3 text-mist">{d.body}</p>
      <Link href="/en" className="mt-8 rounded-full border border-ivory/30 px-6 py-3 hover:border-saffron">{d.back}</Link>
    </section>
  );
}
