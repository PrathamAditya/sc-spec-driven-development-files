import { Hono } from "hono";
import type Database from "better-sqlite3";
import { Layout } from "../components/Layout";
import { ReviewsList } from "../components/ReviewsList";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewConfirmation } from "../components/ReviewConfirmation";
import type { Review } from "../db/types";

const MAX_AUTHOR_LENGTH = 100;
const MAX_BODY_LENGTH = 500;
const MIN_BODY_LENGTH = 20;

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function reviewsRouter(db: Database.Database) {
  const router = new Hono();

  const insertReview = db.prepare(
    "INSERT INTO reviews (author, rating, body) VALUES (?, ?, ?)"
  );
  const selectReviews = db.prepare(
    "SELECT id, author, rating, body, created_at FROM reviews ORDER BY created_at DESC, id DESC"
  );

  router.get("/", (c) => {
    const reviews = selectReviews.all() as Review[];
    return c.html(
      <Layout>
        <h1>Customer Reviews</h1>
        {reviews.length === 0 ? (
          <p>
            No reviews yet — the humans are bracing themselves. Be the first to
            weigh in.
          </p>
        ) : (
          <ReviewsList reviews={reviews} />
        )}
        <p>
          <a href="/reviews/new">Leave a review</a>
        </p>
      </Layout>
    );
  });

  router.get("/new", (c) => {
    return c.html(<ReviewForm />);
  });

  router.post("/", async (c) => {
    const body = await c.req.parseBody();
    const author = stripHtml(String(body.author ?? ""));
    const rawRating = String(body.rating ?? "");
    const rating = Math.trunc(Number(rawRating));
    const reviewBody = stripHtml(String(body.body ?? ""));

    const errors: Record<string, string> = {};
    if (!author) errors.author = "Name is required.";
    else if (author.length > MAX_AUTHOR_LENGTH)
      errors.author = `Name must be ${MAX_AUTHOR_LENGTH} characters or fewer.`;
    if (!rawRating) errors.rating = "Rating is required.";
    else if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      errors.rating = "Rating must be a whole number from 1 to 5.";
    if (!reviewBody) errors.body = "Review is required.";
    else if (reviewBody.length < MIN_BODY_LENGTH)
      errors.body = `Review must be at least ${MIN_BODY_LENGTH} characters.`;
    else if (reviewBody.length > MAX_BODY_LENGTH)
      errors.body = `Review must be ${MAX_BODY_LENGTH} characters or fewer.`;

    if (Object.keys(errors).length > 0) {
      return c.html(
        <ReviewForm
          errors={errors}
          values={{ author, rating: rawRating, body: reviewBody }}
        />
      );
    }

    insertReview.run(author, rating, reviewBody);
    return c.redirect("/reviews/thanks");
  });

  router.get("/thanks", (c) => {
    return c.html(<ReviewConfirmation />);
  });

  return router;
}
