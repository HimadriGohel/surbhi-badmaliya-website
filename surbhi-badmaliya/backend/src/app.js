import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { enquirySchema } from "./validation.js";
import { saveEnquiry } from "./store.js";
import { forwardEnquiry } from "./mailer.js";

export function createApp({ origins = [], store = saveEnquiry, mail = forwardEnquiry } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: origins.length ? origins : false, methods: ["GET", "POST"] }));
  app.use(express.json({ limit: "20kb" }));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  const enquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-7", legacyHeaders: false });

  app.post("/api/enquiries", enquiryLimiter, async (req, res) => {
    const parsed = enquirySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({ ok: false, errors: parsed.error.flatten().fieldErrors });
    }
    // Honeypot: pretend success so bots learn nothing.
    if (parsed.data.website) return res.status(202).json({ ok: true });

    const { website: _hp, ...data } = parsed.data;
    const record = { ...data, receivedAt: new Date().toISOString(), ip: req.ip };
    try {
      await store(record);
      await mail(record).catch((err) => console.error("[mail] forward failed:", err.message));
      return res.status(201).json({ ok: true });
    } catch (err) {
      console.error("[enquiry] store failed:", err);
      return res.status(500).json({ ok: false });
    }
  });

  app.use((_req, res) => res.status(404).json({ ok: false, error: "Not found" }));
  return app;
}
