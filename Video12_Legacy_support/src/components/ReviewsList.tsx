import { FC } from "hono/jsx";
import type { Review } from "../db/types";

function Stars({ rating }: { rating: number }) {
  const full = "\u2605".repeat(rating);
  const empty = "\u2606".repeat(5 - rating);
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">
        {full}
        {empty}
      </span>{" "}
      {rating}/5
    </span>
  );
}

type ReviewsListProps = { reviews: Review[] };

export const ReviewsList: FC<ReviewsListProps> = ({ reviews }) => (
  <div class="reviews-grid">
    {reviews.map((r) => (
      <article class="review-card" key={r.id}>
        <Stars rating={r.rating} />
        <h3>{r.author}</h3>
        <p>{r.body}</p>
        <small>{r.created_at}</small>
      </article>
    ))}
  </div>
);
