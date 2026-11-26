// Official uploads on the artist's YouTube channel. Titles verified via YouTube oEmbed (author: "Surbhi Badmaliya").
// No release dates or popularity ranks are claimed; none were verified.

export type VideoKind = "live" | "cover" | "duet" | "studio";

export type Video = {
  id: string;
  title: string;
  kind: VideoKind;
  context?: string;
  language?: string;
  vertical?: boolean; // YouTube Short (9:16)
};

export const videos: Video[] = [
  { id: "m0WUxwHPiYI", title: "Darjida (દરજીડા)", kind: "duet", context: "With Raj Gadhvi · Live in Australia", language: "gu", vertical: true },
  { id: "xi7FuBjzLXU", title: "Khamma Khamma · Dakla", kind: "duet", context: "With Raj Gadhvi · Live in Brisbane", language: "gu", vertical: true },
  { id: "Yf0EJlpupFM", title: "Live in Surat — thank-you reel", kind: "live", context: "Concert, Surat" },
  { id: "5GU8RxWuimc", title: "Hungama Ho Gaya", kind: "live", context: "Live at Bageshree Club" },
  { id: "6SvtVF4ePig", title: "Aa Jaane Jaa", kind: "live", context: "Farmaish Club · from Inteqam" },
  { id: "tEjrQ7-IY6E", title: "Gunguna Rahe Hain Bhanware", kind: "duet", context: "With Vishwanath Batunge · Farmaish Club" },
  { id: "YRf4fas7hcw", title: "Je Hum Tum Chori Se", kind: "duet", context: "With Mukhtar Shah" },
  { id: "PRfiS7mBDbI", title: "Zara Zara Behekta Hai", kind: "cover", context: "From Rehnaa Hai Terre Dil Mein" },
  { id: "jtQBfUnpyhQ", title: "Samajavaragamana", kind: "cover", context: "Telugu", language: "te" },
  { id: "6YhU0fIhdRw", title: "Priyathama Priyathama", kind: "cover", context: "Telugu", language: "te" },
  { id: "TazL77hPimk", title: "Sun Raha Hai Na", kind: "cover" },
  { id: "wPHBFghElgo", title: "Hum Rahe Ya Na Rahe", kind: "cover" },
  { id: "hvhLAU7TuQc", title: "Aaj Ki Raat Koi Aane Ko", kind: "cover" },
  { id: "tXb2tFuZgmk", title: "Ek Din Aap", kind: "cover" },
  { id: "5Ku-FHvR71M", title: "Aaja Teri Yaad Aayi", kind: "cover" },
  { id: "tljiJjCmZZY", title: "Babul Pyare", kind: "cover" },
  { id: "-esLKMeevOg", title: "Aa Jane Ja", kind: "cover" },
];

export const featured = ["m0WUxwHPiYI", "5GU8RxWuimc", "PRfiS7mBDbI", "jtQBfUnpyhQ", "YRf4fas7hcw", "TazL77hPimk"]
  .map((id) => videos.find((v) => v.id === id)!)
  .filter(Boolean);

export const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
// 1280×720 thumbnails where YouTube has them; these two uploads only have 640×480.
const NO_MAXRES = new Set(["5GU8RxWuimc", "YRf4fas7hcw"]);
export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/${NO_MAXRES.has(id) ? "sddefault" : "maxresdefault"}.jpg`;
export const ytEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

// Full-HD poster: 1080×1920 for Shorts, 1280×720 for regular uploads.
export const ytPoster = (v: Video) => (v.vertical ? `https://i.ytimg.com/vi/${v.id}/oardefault.jpg` : ytThumb(v.id));
