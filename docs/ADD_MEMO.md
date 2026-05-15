# How to Add a New Memo / Blog Post

> **Stamp**
> What this does: adds a new entry to the Intelligence Archive at `/internal-memos` and an auto-generated reader page at `/internal-memos/<slug>`.
> What it touches: only `src/data/memos.ts`.
> Time: ~5 minutes (plus however long the writing takes).

---

## Step 1 — Open the file

`src/data/memos.ts`. Find the `MEMOS_DATA:` array. Each `{}` is one memo.

## Step 2 — Paste this template into the array

```typescript
{
  slug: "your-memo-slug",            // URL: /internal-memos/your-memo-slug — kebab-case, no spaces
  title: "Memo Title in Title Case",
  date: "2026-05-14",                // YYYY-MM-DD
  tags: ["SYSTEMS", "ARCHITECTURE"], // 1-4 short uppercase tags
  excerpt: "One-sentence hook shown on the index page. Make it pull people in.",

  // The body. Each string in this array is one paragraph.
  // Don't add HTML or markdown — paragraphs render as plain text.
  content: [
    "[INITIALIZATION_LOG]: First paragraph. Optionally start with a bracketed system tag like [INITIALIZATION_LOG], [SYS_REPORT], [SYSTEM_ANALYSIS] for the brutalist vibe.",
    "Second paragraph. Plain prose works fine too — no need to force terminal language into every paragraph.",
    "Third paragraph. Write as many as you want; they all render in order.",
    "[SYS_CONCLUSION]: Optional closing tag at the end of the final paragraph."
  ]
}
```

## Step 3 — Save and check

1. Save the file.
2. Visit `/internal-memos` — your memo should appear in the list.
3. Click it — `/internal-memos/<your-slug>` renders the full memo.
4. `npx tsc --noEmit` — exit 0.

## Style guide for memos

- Write like you're a senior engineer explaining to a peer, not a marketer pitching.
- Length: 5-15 paragraphs is the sweet spot. Match the existing 4 memos for reference.
- Avoid the same bracket tag twice in one paragraph — feels like spam.
- Date determines the order shown in the index (newest first if the index is sorted by date — verify how it renders).
- Tags are uppercase, underscore-separated if multi-word: `ZERO_TRUST`, `ALGO_WARFARE`, `PRODUCT`.

## Common errors

- **"Property 'classification' does not exist"** → the type uses `tags:`, not `classification:`. Older docs may have shown the wrong name.
- **"Property 'summary' does not exist"** → it's `excerpt:`, not `summary:`.
- **Memo not appearing in the list** → check that `MEMOS_DATA` is exported and you added inside the `[...]`, not next to it.
