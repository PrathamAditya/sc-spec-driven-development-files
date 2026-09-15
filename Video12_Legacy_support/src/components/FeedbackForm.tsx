import { FC } from "hono/jsx";
import { Layout } from "./Layout";

const ROLES = ["agent", "staff", "visitor", "other"];

type FeedbackErrors = {
  name?: string;
  role?: string;
  message?: string;
  general?: string;
};

type FeedbackValues = {
  name?: string;
  role?: string;
  message?: string;
};

type FeedbackFormProps = {
  errors?: FeedbackErrors;
  values?: FeedbackValues;
};

export const FeedbackForm: FC<FeedbackFormProps> = ({
  errors = {},
  values = {},
}) => (
  <Layout>
    <h1>Tell Us How We're Doing</h1>
    <p>
      Every bit of feedback goes straight to the humans — and the humans have
      been warned.
    </p>
    <form method="post" action="/feedback">
      <label>
        Name
        <input
          type="text"
          name="name"
          value={values.name ?? ""}
          maxLength={100}
          required
          aria-describedby={errors.name ? "err-name" : undefined}
        />
        {errors.name && <small id="err-name">{errors.name}</small>}
      </label>
      <label>
        Role
        <select
          name="role"
          required
          aria-describedby={errors.role ? "err-role" : undefined}
        >
          <option value="">Select your role…</option>
          {ROLES.map((role) => (
            <option value={role} selected={values.role === role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && <small id="err-role">{errors.role}</small>}
      </label>
      <label>
        Message
        <textarea
          name="message"
          rows={6}
          maxLength={1000}
          required
          aria-describedby={errors.message ? "err-message" : undefined}
        >
          {values.message ?? ""}
        </textarea>
        {errors.message && <small id="err-message">{errors.message}</small>}
      </label>
      {errors.general && (
        <p>
          <strong>{errors.general}</strong>
        </p>
      )}
      <button type="submit">Send Feedback</button>
    </form>
    <p>
      <a href="/">← Back to the clinic</a>
    </p>
  </Layout>
);