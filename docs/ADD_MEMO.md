# How to Add a New Memo / Blog Post

> **Stamp**
> What this does: drops a new entry on `/internal-memos` and auto-generates a reader page at `/internal-memos/<slug>`.
> What it touches: creates **one** new markdown file under `content/memos/`. Nothing else.
> Time: ~3 minutes (plus however long the writing takes).

---

## How the memo system works

Memos are plain markdown files in `content/memos/`. The filename **is** the URL slug — `building-manasya-safe-space.md` → `/internal-memos/building-manasya-safe-space`.

The reader page reads frontmatter (title, date, tags, excerpt) via `gray-matter`, splits the body into paragraphs on blank lines, and renders everything with `react-markdown`. There is **no** database, no CMS, no admin panel.

The full list at `/internal-memos` is built server-side from `src/lib/memos.ts:getAllMemos()`. The `sitemap.ts` also reads from the same source, so every new memo automatically:
- Appears in the index
- Has its own reader page
- Gets indexed in `/sitemap.xml`

---

## Step 1 — Create the file

Pick a slug. Lowercase, hyphenated, no spaces:
```
content/memos/<your-slug>.md
```

Examples that fit the existing style:
- `content/memos/architecture-of-influence.md`
- `content/memos/producive-extension-depth.md`

## Step 2 — Paste this template

```markdown
---
title: "Memo Title in Title Case"
date: "2026-05-17"
tags: ["SYSTEMS", "ARCHITECTURE"]
excerpt: "One-sentence hook shown on the index. Make it pull people in."
---

[INITIALIZATION_LOG]: First paragraph. Optionally start with a bracketed system tag for the brutalist vibe: [SYS_REPORT], [SYSTEM_ANALYSIS], [INITIALIZATION_LOG], [ANALYSIS_START], etc.

Second paragraph. Plain prose works fine too — no need to force terminal language into every paragraph. Each blank line starts a new paragraph in the reader.

Third paragraph. Write as many as you want; they all render in order.

[SYS_CONCLUSION]: Optional closing tag at the end of the final paragraph.
```

## Step 3 — Frontmatter fields

| Field | Required | Format | Notes |
|---|---|---|---|
| `title` | yes | string | Wrapped in quotes. Title Case. |
| `date` | yes | `"YYYY-MM-DD"` | Drives index sort order (newest first). |
| `tags` | yes | `["TAG_1", "TAG_2"]` | 1–4 short uppercase tags. Use `_` for multi-word: `ZERO_TRUST`, `ALGO_WARFARE`. |
| `excerpt` | yes | string | One sentence. Shown on the index card. ≤ 150 chars works best. |

## Step 4 — Save and check

1. Save the file. Dev server hot-reloads.
2. Visit `/internal-memos` — your memo appears at the top (sorted by date).
3. Click it — `/internal-memos/<your-slug>` renders the full memo.
4. Run `npx tsc --noEmit` — exit 0.

That's it. No imports to touch, no array to update, no route to register.

---

## Style guide

- **Voice**: Write like a senior engineer explaining to a peer, not a marketer pitching.
- **Length**: 5–15 paragraphs is the sweet spot. Compare against the existing 4 memos for tone.
- **Bracket tags**: One per paragraph max. Looks like spam otherwise.
- **Tags**: Uppercase, underscore-separated. New tags are free — they show up as filterable pills on the index.

## Common errors

- **Memo not in the list** → check the file is in `content/memos/` (not anywhere else) and ends in `.md`.
- **Frontmatter parsing error** → quotes are required for the `title`. Tags must be an actual array `["X"]`, not a comma string.
- **404 on the reader page** → the slug is the filename (minus `.md`). `My Awesome Memo.md` would 404 because spaces aren't URL-safe — use `my-awesome-memo.md`.

## Where the plumbing lives

If you ever need to change how memos are read or rendered:

- `src/lib/memos.ts` — `getAllMemos()` and `getMemoBySlug()`
- `src/app/internal-memos/page.tsx` — server-rendered index
- `src/app/internal-memos/[slug]/page.tsx` — server-rendered reader
- `src/app/internal-memos/[slug]/MemoReaderClient.tsx` — client-side reader (bookmarks, copy link, dark reading mode)
- `src/app/sitemap.ts` — emits one URL per memo
