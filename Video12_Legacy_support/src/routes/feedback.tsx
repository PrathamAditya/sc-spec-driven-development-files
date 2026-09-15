import { Hono } from "hono";
import type Database from "better-sqlite3";
import { FeedbackForm } from "../components/FeedbackForm";
import { FeedbackConfirmation } from "../components/FeedbackConfirmation";

const ROLE_ALLOW_LIST = ["agent", "staff", "visitor", "other"];
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 1000;

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function feedbackRouter(db: Database.Database) {
  const router = new Hono();

  const insertFeedback = db.prepare(
    "INSERT INTO feedback (name, role, message) VALUES (?, ?, ?)"
  );

  router.get("/", (c) => {
    return c.html(<FeedbackForm />);
  });

  router.post("/", async (c) => {
    const body = await c.req.parseBody();
    const name = stripHtml(String(body.name ?? ""));
    const role = stripHtml(String(body.role ?? ""));
    const message = stripHtml(String(body.message ?? ""));

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required.";
    else if (name.length > MAX_NAME_LENGTH)
      errors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    if (!role) errors.role = "Role is required.";
    else if (!ROLE_ALLOW_LIST.includes(role))
      errors.role = "Please choose a valid role.";
    if (!message) errors.message = "Message is required.";
    else if (message.length > MAX_MESSAGE_LENGTH)
      errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;

    if (Object.keys(errors).length > 0) {
      return c.html(
        <FeedbackForm errors={errors} values={{ name, role, message }} />
      );
    }

    insertFeedback.run(name, role, message);
    return c.redirect("/feedback/thanks");
  });

  router.get("/thanks", (c) => {
    return c.html(<FeedbackConfirmation />);
  });

  return router;
}