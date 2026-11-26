"use client";

import { useState } from "react";
import type { Dict } from "@/content/i18n";
import { track } from "@/lib/analytics";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

type Status = "idle" | "sending" | "ok" | "err";

export default function EnquiryForm({ d, lang }: { d: Dict["contact"]["form"]; lang: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    setStatus("sending");
    try {
      const r = await fetch(`${API}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, lang }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setStatus("ok");
      track("booking_enquiry", { type: body.eventType });
      form.reset();
    } catch {
      setStatus("err");
    }
  }

  const field = "mt-2 w-full rounded-xl border border-ivory/15 bg-night/60 px-4 py-3 text-ivory placeholder:text-mist/50 focus:border-saffron focus:outline-none";
  const label = "block text-sm text-mist";

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className={label}>{d.name}<input className={field} name="name" required maxLength={120} autoComplete="name" /></label>
      <label className={label}>{d.email}<input className={field} type="email" name="email" required maxLength={160} autoComplete="email" /></label>
      <label className={label}>{d.phone}<input className={field} type="tel" name="phone" maxLength={30} autoComplete="tel" /></label>
      <label className={label}>{d.eventType}
        <select className={field} name="eventType" defaultValue="garba">
          {Object.entries(d.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label className={label}>{d.date}<input className={field} type="date" name="eventDate" /></label>
      <label className={label}>{d.city}<input className={field} name="city" maxLength={80} autoComplete="address-level2" /></label>
      <label className={`${label} sm:col-span-2`}>{d.message}<textarea className={`${field} min-h-36`} name="message" required minLength={10} maxLength={2000} /></label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status === "sending"}
          className="min-h-12 rounded-full bg-gradient-to-r from-fuchsia to-saffron px-8 font-semibold text-night disabled:opacity-60">
          {status === "sending" ? d.sending : d.submit}
        </button>
        <p role="status" aria-live="polite" className={`text-sm ${status === "err" ? "text-rose" : "text-saffron"}`}>
          {status === "ok" ? d.ok : status === "err" ? d.err : ""}
        </p>
      </div>
    </form>
  );
}
