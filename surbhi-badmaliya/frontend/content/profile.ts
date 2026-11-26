// Verified profile facts only. Every claim here is traced in content/sources.md.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const profile = {
  name: "Surbhi Badmaliya",
  nameGu: "સુરભિ બડમલિયા",
  roles: ["Singer", "Live Performer"],
  region: "Gujarat, India",
  genres: ["Gujarati Folk", "Garba", "Devotional", "Bollywood", "Covers & Originals"],
  youtube: {
    url: "https://www.youtube.com/@SurbhiBadmaliyaMusic",
    channelId: "UChzZ0Pa7plD3ztUveVseZug",
    handle: "@SurbhiBadmaliyaMusic",
  },
  // Published by the artist on the official YouTube channel "About" text.
  bookingEmail: "surbhibadmaliya@gmail.com",
  // Booking number supplied by the site owner.
  bookingPhone: "+91 82384 23142",
  bookingPhoneHref: "tel:+918238423142",
} as const;

export const sameAs = [profile.youtube.url];
