# Surbhi Badmaliya — Star.bio

```
frontend/   Next.js 15 + TypeScript + Tailwind v4 + Framer Motion (the website)
backend/    Express 5 API (booking enquiries: validation, rate limit, honeypot, SMTP forward)
images/     Original photos supplied by the owner (untouched)
```

## Run locally
```bash
cd backend && npm install && npm start          # http://localhost:4000
cd frontend && npm install && npm run build && npm start   # http://localhost:3000 → /en
```
Dev mode: `npm run dev` in each folder. Copy `.env.example` → `.env` / `.env.local` and set values.

## Frontend
- Routes: `/en` `/gu` + `/music` `/on-stage` `/story` `/gallery` `/booking` (English default, Gujarati translation).
- Splash intro (name only + spotlight, skip button, Esc, reduced-motion aware, shown once per session).
- Content lives in `frontend/content/*.ts` (typed); research audit in `content/sources.md`, media rights in `content/media-sources.md`.
- SEO: per-page title/description/canonical/hreflang/OG/Twitter, JSON-LD (Person, WebSite, WebPage, Breadcrumb, VideoObject list, ImageGallery), `robots.txt`, `sitemap.xml` with image entries.
- YouTube embeds are click-to-load via `youtube-nocookie.com`; nothing autoplays.
- Analytics hook: `lib/analytics.ts` (calls `window.gtag` if present).
- Listing handoff: `frontend/handoff/starbio-listing.json`.

## Backend
- `GET /api/health`, `POST /api/enquiries` (zod validation, 5 req / 15 min / IP, honeypot `website` field).
- Stores to `backend/data/enquiries.jsonl`; also emails `ENQUIRY_TO` when `SMTP_*` is set.
- Tests: `npm test` (5 tests).

## Deploy
Frontend: any Node host (`npm run build && npm start`) or Vercel; set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL`.
Backend: Node ≥ 20.6 behind HTTPS reverse proxy; set `CORS_ORIGINS` to the site origin. No DNS was created.

## QA report (2026-10-10)
- ✅ `next build` passes, strict TypeScript clean; all 12 pages prerendered static.
- ✅ All routes 200 in both languages; unknown routes/locales 404; hreflang + x-default present.
- ✅ Splash → Enter → homepage flow works; no console errors.
- ✅ Backend tests 5/5; live POST from frontend origin returns 201 with correct CORS.
- ⚠ Pending before production: HD images + usage permission from the artist; confirm the site is authorised/endorsed;
  Lighthouse/mobile device pass on real hardware; review Gujarati copy with a native speaker.
- Not published (unverified): DOB, hometown city, education, awards, follower counts.
