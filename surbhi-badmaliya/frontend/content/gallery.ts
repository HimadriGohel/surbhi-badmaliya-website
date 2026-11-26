// Images supplied by the site owner in /images. Usage status tracked in content/media-sources.md.

export type Photo = {
  src: string;
  w: number;
  h: number;
  alt: string;
  altGu: string;
  focus?: string; // CSS object-position
  chapter: "stage" | "garba" | "studio" | "portrait";
};

const p = (file: string) => `/images/surbhi-badmaliya-${file}.jpg`;

export const photos: Photo[] = [
  { src: p("garba-stage-wide"), w: 405, h: 720, chapter: "garba", focus: "50% 35%", alt: "Surbhi Badmaliya singing on a festival stage in an indigo chaniya choli under blue stage lights", altGu: "વાદળી સ્ટેજ લાઇટ હેઠળ જાંબલી ચણિયાચોળીમાં ગાતાં સુરભિ બડમલિયા" },
  { src: p("stage-pink-blue-light"), w: 335, h: 597, chapter: "stage", focus: "50% 30%", alt: "Surbhi Badmaliya smiling with a microphone in a pink outfit under blue concert light", altGu: "વાદળી પ્રકાશમાં ગુલાબી પોશાકમાં માઇક સાથે સ્મિત કરતાં સુરભિ બડમલિયા" },
  { src: p("studio-recording"), w: 405, h: 608, chapter: "studio", focus: "45% 35%", alt: "Surbhi Badmaliya recording vocals at a studio condenser microphone", altGu: "સ્ટુડિયોમાં માઇક સામે રેકોર્ડિંગ કરતાં સુરભિ બડમલિયા" },
  { src: p("garba-live-red-chaniya"), w: 335, h: 597, chapter: "garba", focus: "50% 30%", alt: "Surbhi Badmaliya performing live with her band in a red chaniya choli", altGu: "લાલ ચણિયાચોળીમાં બેન્ડ સાથે લાઇવ ગાતાં સુરભિ બડમલિયા" },
  { src: p("stage-pyro-moment"), w: 335, h: 597, chapter: "stage", focus: "50% 40%", alt: "Surbhi Badmaliya on stage as a flame effect lights up behind her", altGu: "પાછળ અગ્નિ ઇફેક્ટ સાથે સ્ટેજ પર સુરભિ બડમલિયા" },
  { src: p("sunehre-nagme-concert"), w: 335, h: 597, chapter: "stage", focus: "50% 40%", alt: "Surbhi Badmaliya singing at a ticketed musical evening", altGu: "સંગીત સંધ્યામાં ગાતાં સુરભિ બડમલિયા" },
  { src: p("portrait-closeup"), w: 557, h: 556, chapter: "portrait", focus: "50% 30%", alt: "Close-up portrait of Surbhi Badmaliya", altGu: "સુરભિ બડમલિયાનું ક્લોઝ-અપ પોર્ટ્રેટ" },
  { src: p("stage-pink-performing"), w: 365, h: 547, chapter: "stage", focus: "50% 30%", alt: "Surbhi Badmaliya gesturing to the audience mid-song in a pink lehenga", altGu: "ગુલાબી લહેંગામાં પ્રેક્ષકો તરફ હાથ ફેલાવી ગાતાં સુરભિ બડમલિયા" },
  { src: p("garba-indigo-stage"), w: 335, h: 597, chapter: "garba", focus: "50% 35%", alt: "Surbhi Badmaliya raising her hand during a Garba performance", altGu: "ગરબા કાર્યક્રમમાં હાથ ઊંચો કરી ગાતાં સુરભિ બડમલિયા" },
  { src: p("stage-violet-lights"), w: 335, h: 597, chapter: "stage", focus: "50% 45%", alt: "Surbhi Badmaliya under violet stage lights", altGu: "જાંબલી સ્ટેજ લાઇટમાં સુરભિ બડમલિયા" },
  { src: p("garba-stage-duet"), w: 335, h: 597, chapter: "garba", focus: "50% 40%", alt: "Surbhi Badmaliya performing alongside a fellow artist on a Garba stage", altGu: "ગરબા સ્ટેજ પર સાથી કલાકાર સાથે સુરભિ બડમલિયા" },
  { src: p("portrait-warm-red"), w: 335, h: 597, chapter: "portrait", focus: "50% 25%", alt: "Surbhi Badmaliya smiling in warm red light", altGu: "લાલ પ્રકાશમાં સ્મિત કરતાં સુરભિ બડમલિયા" },
  { src: p("stage-red-haze"), w: 335, h: 597, chapter: "stage", focus: "50% 45%", alt: "Surbhi Badmaliya singing through red stage haze", altGu: "લાલ ધુમ્મસભર્યા સ્ટેજ પર ગાતાં સુરભિ બડમલિયા" },
  { src: p("stage-pink-chaniya"), w: 365, h: 547, chapter: "stage", focus: "50% 30%", alt: "Surbhi Badmaliya on stage in a pink chaniya choli with dupatta", altGu: "ગુલાબી ચણિયાચોળીમાં સ્ટેજ પર સુરભિ બડમલિયા" },
  { src: p("event-blue-gown"), w: 399, h: 501, chapter: "portrait", focus: "50% 25%", alt: "Surbhi Badmaliya at an event in a blue gown", altGu: "વાદળી ગાઉનમાં કાર્યક્રમમાં સુરભિ બડમલિયા" },
  { src: p("stage-purple-spotlight"), w: 447, h: 447, chapter: "stage", focus: "50% 30%", alt: "Surbhi Badmaliya singing in a purple spotlight", altGu: "જાંબલી સ્પોટલાઇટમાં ગાતાં સુરભિ બડમલિયા" },
  { src: p("portrait-red-light"), w: 335, h: 597, chapter: "portrait", focus: "50% 30%", alt: "Surbhi Badmaliya in a moody red-lit portrait", altGu: "લાલ પ્રકાશમાં સુરભિ બડમલિયાનું પોર્ટ્રેટ" },
  { src: p("candid-garba-tee"), w: 335, h: 597, chapter: "portrait", focus: "50% 30%", alt: "Candid moment of Surbhi Badmaliya humming a tune", altGu: "ગીત ગણગણતાં સુરભિ બડમલિયાની સહજ પળ" },
];

export const photo = (slug: string) => photos.find((x) => x.src.includes(slug))!;
