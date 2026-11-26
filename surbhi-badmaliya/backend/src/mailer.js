import nodemailer from "nodemailer";

let transport;

function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transport;
}

/** Forwards an enquiry by email when SMTP is configured; otherwise a no-op (records are still stored). */
export async function forwardEnquiry(r) {
  const t = getTransport();
  if (!t || !process.env.ENQUIRY_TO) return false;
  const lines = [
    `Name: ${r.name}`, `Email: ${r.email}`, r.phone && `Phone: ${r.phone}`,
    `Type: ${r.eventType}`, r.eventDate && `Date: ${r.eventDate}`, r.city && `City: ${r.city}`,
    `Language: ${r.lang}`, "", r.message,
  ].filter((x) => x !== undefined && x !== false);
  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ENQUIRY_TO,
    replyTo: r.email,
    subject: `Booking enquiry (${r.eventType}) — ${r.name}`,
    text: lines.join("\n"),
  });
  return true;
}
