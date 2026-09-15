import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const FeedbackConfirmation: FC = () => (
  <Layout>
    <article>
      <header>
        <h1>Feedback Received</h1>
      </header>
      <p>
        Thanks! The humans have been notified and mildly embarrassed. Your
        words are now part of the official clinic record, right where Mary can
        find them.
      </p>
    </article>
    <p>
      <a href="/">← Back to the clinic</a>
    </p>
  </Layout>
);