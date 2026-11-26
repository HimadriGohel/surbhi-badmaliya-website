import { z } from "zod";

// Strip control chars and angle brackets; enquiries are rendered as plain text only.
const clean = (max) => z.string().trim().max(max).transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F<>]/g, ""));
const optional = (max) => clean(max).optional().or(z.literal("")).transform((v) => v || undefined);

export const enquirySchema = z.object({
  name: clean(120).pipe(z.string().min(2)),
  email: z.string().trim().email().max(160),
  phone: optional(30),
  eventType: z.enum(["garba", "concert", "private", "collab", "other"]),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")).transform((v) => v || undefined),
  city: optional(80),
  message: clean(2000).pipe(z.string().min(10)),
  lang: z.enum(["en", "gu"]).default("en"),
  website: z.string().optional(), // honeypot
});
