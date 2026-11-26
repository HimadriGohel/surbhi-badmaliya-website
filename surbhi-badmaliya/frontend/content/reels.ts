// Official YouTube Shorts from @SurbhiBadmaliyaMusic (verified via oEmbed, author "Surbhi Badmaliya").
// Vertical 1080×1920 posters come from YouTube's oardefault thumbnail.

export type Reel = { id: string; title: string; gu?: string; tag?: string };

export const folkReels: Reel[] = [
  { id: "m0WUxwHPiYI", title: "Darjida", gu: "દરજીડા", tag: "With Raj Gadhvi · Australia" },
  { id: "pL0bOrLEQ2I", title: "Ramva Aave Madi", tag: "Live · Garba" },
  { id: "ab4OtkBwLJ4", title: "Dheldi Mara Malakma Aav", gu: "ઢેલડી મારા મલકમાં આવ", tag: "Folk" },
  { id: "Nhh5sh316zY", title: "Indhana Vinva Gai Ti", gu: "ઇંધણા વીણવા ગઇ'તી", tag: "Live in Sydney" },
  { id: "xi7FuBjzLXU", title: "Khamma Khamma · Dakla", tag: "With Raj Gadhvi · Brisbane" },
  { id: "jl4FGHfJlLk", title: "Mari Mahisagar Ni Aare", gu: "મારી મહીસાગરની આરે", tag: "Folk" },
  { id: "AtroRYkd2KU", title: "Aaj Gaganthi Chandan Dholay Re", gu: "આજ ગગનથી ચંદન ઢોળાય રે", tag: "Devotional" },
  { id: "giZ_KSTmKRc", title: "Khamkare Khodiyar", tag: "Live in Sydney" },
  { id: "AY8epDq43xY", title: "Khamma Vira Ne", tag: "Rakshabandhan tribute" },
  { id: "aFA4dlyZKPw", title: "Aavjo Mavdiyu", gu: "આવજો માવડીયું", tag: "Devotional" },
  { id: "DusrbWHnF6E", title: "Tari Aankh No Afini", gu: "તારી આંખ નો અફીણી", tag: "Folk" },
  { id: "cvYaDbjaHec", title: "Pari Hu Main", tag: "Live in Sydney" },
  { id: "ldwoZ_iOLZE", title: "Raatan Lambiyan", tag: "Cover" },
];

export const liveReels: Reel[] = [
  { id: "VIVitYvZKTg", title: "This crowd, this song", tag: "Live · Surat" },
  { id: "QFhox2zpXPQ", title: "He Aavi Aaso Ni Radhiyali", gu: "હે આવી આસોની રઢિયાળી", tag: "Navratri" },
  { id: "qu9tNm13RRU", title: "Pethalpur Ma Pavo Vagyo", gu: "પેથલપુર માં પાવો વાગ્યો", tag: "Navratri" },
  { id: "km1W6MCxsIE", title: "Lal Darvaje", tag: "Navratri" },
  { id: "2hpQfNNw35o", title: "Maa Ae Garbo Korvyo", gu: "માં એ ગરબો કોરવ્યો", tag: "Garba" },
  { id: "ZOfdUx7MfGQ", title: "Rang Morla", tag: "Navratri · Live" },
  { id: "3piG1TFIA7A", title: "Garba, sung live", tag: "Live singing" },
  { id: "QU4DHC9ROZM", title: "When music finds you", tag: "Singer life" },
  { id: "NnhPja8Ayuo", title: "Live moment", tag: "16 May 2026" },
  { id: "0fBGqRDZ_do", title: "Live moment", tag: "9 April 2026" },
  { id: "l5Yr7i4Wck4", title: "Live moment", tag: "6 April 2026" },
  { id: "V-frWm3h300", title: "Live moment", tag: "23 March 2026" },
  { id: "afaitLU2wVo", title: "Live moment", tag: "17 March 2026" },
  { id: "9V-vyqWzLcY", title: "Live moment", tag: "12 March 2026" },
  { id: "3s66U969eko", title: "Live moment", tag: "30 January 2026" },
  { id: "rpkyV_D8p54", title: "Live moment", tag: "13 January 2026" },
  { id: "RrG-rCjpP-w", title: "Live moment", tag: "10 January 2026" },
];

export const reelPoster = (id: string) => `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
export const reelEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1&loop=1&playlist=${id}`;
