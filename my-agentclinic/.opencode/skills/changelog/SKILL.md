---
name: changelog
description: Use when maintaining CHANGELOG.md in the project root — e.g. "update the changelog", "create a changelog from git history", or manually before merging work.
---

# Changelog maintenance

Keep `CHANGELOG.md` in the project root, with a `## YYYY-MM-DD` heading per
date and concise bullets beneath it describing what changed that day.

Invoke this skill manually before merging changes. Do not wait to be asked —
if a merge is about to happen, run this skill first.

## Steps

1. Locate `CHANGELOG.md` in the project root. If it does not exist, create it
   from git history (see "Creating from scratch" below). Otherwise, update it
   (see "Updating").

## Creating from scratch

- Run:
  `git log --pretty=format:'%h|%ad|%s' --date=short`
- Group commits by author date and write one `## YYYY-MM-DD` heading per date,
  newest date at the top (reverse chronological).
- Under each heading, write one bullet per commit. Keep bullets concise and
  strip the conventional-commit prefix clutter (`feat:`, `fix:`) unless the
  category adds signal — e.g. `feat:`, `fix:`, `docs:`, `refactor:`,
  `chore:`, `test:`, `build:`.
- If multiple commits are one logical change, condense them into a single
  bullet. If a date contains only course-repo/history noise (renames,
  unrelated scaffold commits), summarise them in one clearly-labelled bullet
  rather than listing each.

## Updating (normal, incremental workflow)

- Determine what changed since the changelog's last entry:
  - Find the newest existing date heading.
  - Run `git log --pretty=format:'%h|%ad|%s' --date=short --since=<that date>`
    (or since the last merge) and inspect the relevant commits with
    `git show --stat <hash>` when a bullet needs more context.
- If commits belong to a date heading that already exists, add those bullets
  under it. If a new date is involved, add a `## YYYY-MM-DD` heading at the
  top (reverse chronological) and insert the bullets there.
- Never rewrite, reword, or delete existing entries — the changelog is an
  append-only record. Only add.
- Cover user-facing and repo-visible changes: features, fixes, refactors,
  docs, spec changes, tooling. Omit churn that leaves no observable change.

## After updating

- If the changes were committed with meaningful messages, the changelog
  update itself should be included in the merge: `git add CHANGELOG.md` and
  commit it (e.g. `docs: update changelog`) before merging.
- If the changelog entry reveals changes that are not yet committed, flag
  that to the user instead of silently committing.

## Format reference

```markdown
# Changelog

## 2026-09-15
- feat: Responsive design (mobile-first media queries, scrollable tables)
- test: Add Vitest tests for escapeHtml
- refactor: Merge roadmap phases 2 and 3

## 2026-09-14
- docs: Add implementation plan, requirements, and validation documents
```