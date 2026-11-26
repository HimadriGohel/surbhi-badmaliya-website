import { createApp } from "./app.js";

const origins = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",").map((s) => s.trim()).filter(Boolean);
const port = Number(process.env.PORT || 4000);

createApp({ origins }).listen(port, () => console.log(`API listening on http://localhost:${port}`));
