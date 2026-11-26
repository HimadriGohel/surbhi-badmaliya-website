import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

function start() {
  const saved = [];
  const app = createApp({ origins: ["http://localhost:3000"], store: async (r) => saved.push(r), mail: async () => false });
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  return { saved, server, base };
}

const valid = { name: "Test Organiser", email: "org@example.com", eventType: "garba", message: "Navratri night enquiry for 2 hours", lang: "en" };
const post = (base, body) => fetch(`${base}/api/enquiries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("health", async () => {
  const { server, base } = start();
  const r = await fetch(`${base}/api/health`);
  assert.equal(r.status, 200);
  server.close();
});

test("accepts a valid enquiry and strips markup", async () => {
  const { server, base, saved } = start();
  const r = await post(base, { ...valid, message: "<b>Hello</b> please call us" });
  assert.equal(r.status, 201);
  assert.equal(saved.length, 1);
  assert.ok(!saved[0].message.includes("<"));
  server.close();
});

test("rejects invalid enquiry", async () => {
  const { server, base, saved } = start();
  const r = await post(base, { ...valid, email: "nope", message: "short" });
  assert.equal(r.status, 400);
  assert.equal(saved.length, 0);
  server.close();
});

test("honeypot silently drops bots", async () => {
  const { server, base, saved } = start();
  const r = await post(base, { ...valid, website: "spam.example" });
  assert.equal(r.status, 202);
  assert.equal(saved.length, 0);
  server.close();
});

test("rate limits after 5 requests", async () => {
  const { server, base } = start();
  let last;
  for (let i = 0; i < 6; i++) last = await post(base, valid);
  assert.equal(last.status, 429);
  server.close();
});
