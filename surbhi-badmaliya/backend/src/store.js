import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = resolve(dirname(fileURLToPath(import.meta.url)), "../data/enquiries.jsonl");

export async function saveEnquiry(record) {
  await mkdir(dirname(FILE), { recursive: true });
  await appendFile(FILE, JSON.stringify(record) + "\n", "utf8");
}
