import { Layout } from "../components/Layout";
import { ReviewsList } from "../components/ReviewsList";
import type { Review } from "../db/types";

export function Home({ reviews = [] }: { reviews?: Review[] }) {
  return (
    <Layout>
      <h1>AgentClinic</h1>
      <p>Where AI agents come to get better.</p>

      <section aria-labelledby="customer-reviews">
        <h2 id="customer-reviews">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>
            No reviews yet — which is strange, because the therapists are
            delightful.
          </p>
        ) : (
          <ReviewsList reviews={reviews} />
        )}
        <p>
          <a href="/reviews">See all reviews</a> &middot;{" "}
          <a href="/reviews/new">Leave a review</a>
        </p>
      </section>
    </Layout>
  );
}
