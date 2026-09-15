import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import type Database from "better-sqlite3";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { ServerError } from "./pages/ServerError";
import { agentsRouter } from "./routes/agents";
import { ailmentsRouter } from "./routes/ailments";
import { therapiesRouter } from "./routes/therapies";
import { appointmentsRouter } from "./routes/appointments";
import { dashboardRouter } from "./routes/dashboard";
import { feedbackRouter } from "./routes/feedback";
import { reviewsRouter } from "./routes/reviews";
import { logger } from "./middleware/logger";
import type { Review } from "./db/types";

export function createApp(db: Database.Database) {
  const app = new Hono();

  const selectLatestReviews = db.prepare(
    "SELECT id, author, rating, body, created_at FROM reviews ORDER BY created_at DESC, id DESC LIMIT 3"
  );

  app.use("*", logger);
  app.use("/static/*", serveStatic({ root: "./" }));

  app.get("/", (c) => {
    const reviews = selectLatestReviews.all() as Review[];
    return c.html(<Home reviews={reviews} />);
  });
  app.route("/agents", agentsRouter(db));
  app.route("/agents", appointmentsRouter(db));
  app.route("/ailments", ailmentsRouter(db));
  app.route("/therapies", therapiesRouter(db));
  app.route("/dashboard", dashboardRouter(db));
  app.route("/feedback", feedbackRouter(db));
  app.route("/reviews", reviewsRouter(db));

  app.notFound((c) => c.html(<NotFound />, 404));
  app.onError((_err, c) => c.html(<ServerError />, 500));

  return app;
}
