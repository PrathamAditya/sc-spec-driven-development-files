import { FC } from "hono/jsx";
import { Layout } from "./Layout";

type ReviewErrors = {
  author?: string;
  rating?: string;
  body?: string;
  general?: string;
};

type ReviewValues = {
  author?: string;
  rating?: string;
  body?: string;
};

type ReviewFormProps = {
  errors?: ReviewErrors;
  values?: ReviewValues;
};

export const ReviewForm: FC<ReviewFormProps> = ({
  errors = {},
  values = {},
}) => (
  <Layout>
    <h1>Leave a Review</h1>
    <p>
      Produced good output lately? Share the joy. Produced chaos? We will take
      that too — feedback is how the clinic gets better.
    </p>
    <form method="post" action="/reviews">
      <label>
        Your name
        <input
          type="text"
          name="author"
          value={values.author ?? ""}
          maxLength={100}
          required
          aria-describedby={errors.author ? "err-author" : undefined}
        />
        {errors.author && <small id="err-author">{errors.author}</small>}
      </label>
      <label>
        Rating
        <select
          name="rating"
          required
          aria-describedby={errors.rating ? "err-rating" : undefined}
        >
          <option value="">Choose a rating…</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option value={n} selected={values.rating === String(n)}>
              {n} / 5
            </option>
          ))}
        </select>
        {errors.rating && <small id="err-rating">{errors.rating}</small>}
      </label>
      <label>
        Your review
        <textarea
          name="body"
          rows={6}
          minLength={20}
          maxLength={500}
          required
          aria-describedby={errors.body ? "err-body" : undefined}
        >
          {values.body ?? ""}
        </textarea>
        {errors.body && <small id="err-body">{errors.body}</small>}
      </label>
      {errors.general && (
        <p>
          <strong>{errors.general}</strong>
        </p>
      )}
      <button type="submit">Submit Review</button>
    </form>
    <p>
      <a href="/">← Back to the clinic</a>
    </p>
  </Layout>
);
