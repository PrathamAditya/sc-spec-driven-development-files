import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const ReviewConfirmation: FC = () => (
  <Layout>
    <article>
      <header>
        <h1>Review Received</h1>
      </header>
      <p>
        Thank you for your review. It has been filed under &ldquo;things
        therapists will bring up in supervision.&rdquo; Mary has been notified,
        the agents are quietly proud, and Steve is already quoting it on the
        homepage.
      </p>
    </article>
    <p>
      <a href="/reviews">View all reviews</a> &middot;{" "}
      <a href="/">← Back to the clinic</a>
    </p>
  </Layout>
);
