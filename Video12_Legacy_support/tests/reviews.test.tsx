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

function postReview(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return app.request("/reviews", { method: "POST", body: formData });
}

describe("GET /reviews", () => {
  it("returns 200 with HTML", async () => {
    const res = await app.request("/reviews");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("shows a seeded review author and body", async () => {
    const res = await app.request("/reviews");
    const html = await res.text();
    expect(html).toContain("Margot the Marketer");
    expect(html).toContain("Booked a session");
  });

  it("renders each rating as readable numeric text", async () => {
    const res = await app.request("/reviews");
    const html = await res.text();
    expect(html).toContain("5/5");
  });

  it("sits inside the shared layout", async () => {
    const res = await app.request("/reviews");
    const html = await res.text();
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain("<footer");
  });

  it("links to the review form", async () => {
    const res = await app.request("/reviews");
    const html = await res.text();
    expect(html).toContain('href="/reviews/new"');
  });
});

describe("Homepage review section", () => {
  it("renders a Customer Reviews section with a seeded review", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain("Customer Reviews");
    expect(html).toContain("Sara, SRE");
  });

  it("links to /reviews and /reviews/new", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain('href="/reviews"');
    expect(html).toContain('href="/reviews/new"');
  });
});

describe("GET /reviews/new", () => {
  it("returns 200 with a form", async () => {
    const res = await app.request("/reviews/new");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("<form");
    expect(html).toContain('name="author"');
    expect(html).toContain('name="rating"');
    expect(html).toContain('name="body"');
  });

  it("offers ratings 1 through 5", async () => {
    const res = await app.request("/reviews/new");
    const html = await res.text();
    for (const n of ["1", "2", "3", "4", "5"]) {
      expect(html).toContain(`value="${n}"`);
    }
  });
});

describe("POST /reviews", () => {
  it("redirects to the confirmation page on valid submission", async () => {
    const res = await postReview({
      author: "Ted the Temp",
      rating: "5",
      body: "This is a pleasantly written review of adequate length.",
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/reviews/thanks");
  });

  it("GET /reviews/thanks returns 200 with a thank-you phrase", async () => {
    const res = await app.request("/reviews/thanks");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Review Received");
  });

  it("shows the new review on /reviews after submit", async () => {
    await postReview({
      author: "Carol the Contractor",
      rating: "4",
      body: "Context calibration worked wonders for my summariser's panic.",
    });
    const res = await app.request("/reviews");
    const html = await res.text();
    expect(html).toContain("Carol the Contractor");
    expect(html).toContain("Context calibration worked wonders");
  });

  it("lists newest-first, with a recent review above the oldest seed", async () => {
    const res = await app.request("/reviews");
    const html = await res.text();
    expect(html.indexOf("Carol the Contractor")).toBeLessThan(
      html.indexOf("Margot the Marketer")
    );
  });

  it("returns 200 with errors when fields are missing", async () => {
    const res = await postReview({ author: "", rating: "", body: "" });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("required");
    expect(html).toContain('name="author"');
    expect(html).toContain('name="body"');
  });

  it("rejects a rating below 1 with an error", async () => {
    const res = await postReview({
      author: "Zero-Zoë",
      rating: "0",
      body: "This is a perfectly reasonable review of correct length.",
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Rating must be a whole number from 1 to 5");
  });

  it("rejects a rating above 5 with an error", async () => {
    const res = await postReview({
      author: "Ten-out-of-Tenny",
      rating: "6",
      body: "This is a perfectly reasonable review of correct length.",
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Rating must be a whole number from 1 to 5");
  });

  it("rejects a non-numeric rating with an error", async () => {
    const res = await postReview({
      author: "Confused Claude",
      rating: "excellent",
      body: "This is a perfectly reasonable review of correct length.",
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Rating must be a whole number from 1 to 5");
  });

  it("returns a min-length error for a short body", async () => {
    const res = await postReview({
      author: "Lil Lenny",
      rating: "5",
      body: "ok",
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("at least 20");
  });

  it("returns a length error for a body over 500 characters", async () => {
    const res = await postReview({
      author: "Verbose Vera",
      rating: "5",
      body: "x".repeat(501),
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("500 characters or fewer");
  });

  it("returns a length error for an author over 100 characters", async () => {
    const res = await postReview({
      author: "A".repeat(101),
      rating: "5",
      body: "This is a perfectly reasonable review of correct length.",
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("100 characters or fewer");
  });

  it("sanitizes HTML tags from author and body", async () => {
    const res = await postReview({
      author: "<script>alert(1)</script>Sam",
      rating: "5",
      body: "<script>alert(1)</script>Genuinely helped my agent calm down.",
    });
    expect(res.status).toBe(302);
    const listRes = await app.request("/reviews");
    const html = await listRes.text();
    expect(html).not.toContain("<script>");
    expect(html).toContain("Sam");
    expect(html).toContain("Genuinely helped my agent calm down.");
  });
});

describe("Review empty state", () => {
  it("GET /reviews shows a witty message when no reviews exist", async () => {
    const db = createDb(":memory:");
    migrate(db);
    const emptyApp = createApp(db);
    const res = await emptyApp.request("/reviews");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("No reviews yet");
  });

  it("homepage shows the empty-state message and a form link", async () => {
    const db = createDb(":memory:");
    migrate(db);
    const emptyApp = createApp(db);
    const res = await emptyApp.request("/");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("No reviews yet");
    expect(html).toContain('href="/reviews/new"');
  });
});

describe("404 handling", () => {
  it("returns 404 for an unknown reviews subroute", async () => {
    const res = await app.request("/reviews/nope");
    expect(res.status).toBe(404);
  });
});