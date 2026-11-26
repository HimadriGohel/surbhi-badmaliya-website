import Link from "next/link";
import Reveal from "./Reveal";

export default function PageHeader({ title, intro, crumbs, kicker }: { title: string; intro: string; kicker: string; crumbs: [string, string][] }) {
  return (
    <header className="stage-glow grain relative overflow-hidden px-4 pb-16 pt-36 sm:px-8 sm:pt-44">
      <div aria-hidden className="bandhani absolute inset-0 opacity-10" />
      <div className="relative mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 text-xs text-mist">
            {crumbs.map(([n, href], i) => (
              <li key={href} className="flex gap-2">
                {i < crumbs.length - 1 ? <><Link href={href} className="hover:text-ivory">{n}</Link><span aria-hidden>/</span></> : <span aria-current="page">{n}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <Reveal>
          <p className="mt-8 text-xs uppercase tracking-[.35em] text-saffron">{kicker}</p>
          <h1 className="mt-3 font-display text-6xl leading-none sm:text-8xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/80">{intro}</p>
        </Reveal>
      </div>
    </header>
  );
}
