import { describe, it, expect, beforeAll } from "vitest";
import { createDb } from "../src/db/index";
import { migrate } from "../src/db/migrate";
import { seed } from "../src/db/seed";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  const db = createDb(":memory:");
  migrate(db);
  seed(db);
  app = createApp(db);
});

function postFeedback(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return app.request("/feedback", { method: "POST", body: formData });
}

describe("GET /feedback", () => {
  it("returns 200 with HTML", async () => {
    const res = await app.request("/feedback");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("contains a form with name, role, and message fields", async () => {
    const res = await app.request("/feedback");
    const html = await res.text();
    expect(html).toContain("<form");
    expect(html).toContain('name="name"');
    expect(html).toContain('name="role"');
    expect(html).toContain('name="message"');
  });

  it("offers the role allow-list options", async () => {
    const res = await app.request("/feedback");
    const html = await res.text();
    for (const role of ["agent", "staff", "visitor", "other"]) {
      expect(html).toContain(`value="${role}"`);
    }
  });

  it("renders inside the shared layout", async () => {
    const res = await app.request("/feedback");
    const html = await res.text();
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain("<footer");
  });
});

describe("POST /feedback", () => {
  it("redirects to the confirmation page on valid submission", async () => {
    const res = await postFeedback({
      name: "Gerald-3B",
      role: "agent",
      message: "The therapists really listen. 10/10 would decompress again.",
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/feedback/thanks");
  });

  it("GET /feedback/thanks returns 200 with a thank-you phrase", async () => {
    const res = await app.request("/feedback/thanks");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Feedback Received");
  });

  it("returns 200 with errors when fields are missing", async () => {
    const res = await postFeedback({ name: "", role: "", message: "" });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("required");
    expect(html).toContain('name="name"');
    expect(html).toContain('name="message"');
  });

  it("returns an error for a role outside the allow-list", async () => {
    const res = await postFeedback({
      name: "Rogue-9X",
      role: "overlord",
      message: "Hello",
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("valid role");
  });

  it("returns an error for a message over 1000 characters", async () => {
    const res = await postFeedback({
      name: "Verbose-2B",
      role: "visitor",
      message: "x".repeat(1001),
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("1000 characters or fewer");
  });

  it("sanitizes HTML tags from the message", async () => {
    const res = await postFeedback({
      name: "Safe-1B",
      role: "staff",
      message: "<script>alert(1)</script>The care is impeccable.",
    });
    expect(res.status).toBe(302);
    const dashboardRes = await app.request("/dashboard");
    const html = await dashboardRes.text();
    expect(html).not.toContain("<script>");
    expect(html).toContain("The care is impeccable.");
  });
});

describe("Feedback visibility for staff", () => {
  it("dashboard lists recently submitted feedback", async () => {
    await postFeedback({
      name: "Interviewed-13B",
      role: "agent",
      message: "Mary dashboard test message.",
    });
    const res = await app.request("/dashboard");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Recent Feedback");
    expect(html).toContain("Interviewed-13B");
    expect(html).toContain("Mary dashboard test message.");
  });
});