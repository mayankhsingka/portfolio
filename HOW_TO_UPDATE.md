# System Maintenance — Content Authoring Index

This portfolio is data-driven. To add a project, memo, or page you almost never touch component files — you edit content (TypeScript objects in `src/data/` or markdown files in `content/`) and the UI hydrates everything.

This file is the **index**. The step-by-step cookbooks live in `docs/`.

---

## What do you want to do?

| Task | Doc | Time |
|---|---|---|
| Add a new project / experience node | [`docs/ADD_PROJECT.md`](docs/ADD_PROJECT.md) | ~10 min |
| Add a new blog post (memo) | [`docs/ADD_MEMO.md`](docs/ADD_MEMO.md) | ~3 min |
| Add a brand-new page / route | [`docs/ADD_PAGE.md`](docs/ADD_PAGE.md) | ~15 min |
| Update boot logs, fake fs, command list, or general info | See "Quick edits" below | ~2 min |

---

## Quick edits (no doc needed)

All of these live in `src/data/portfolio.ts`:

- **Boot terminal logs** (the scrolling lines after page load) → edit the `logs` array.
- **Fake file system** (what `ls` and `cat` return in `/commands`) → edit the `fileSystem` object.
- **Command list shown in `/commands`** → edit the `commands` array.
- **Name / role / age / email / phone / GitHub / LinkedIn / philosophy** → edit the `general` object.
- **Wires drawn between nodes on the canvas** → edit the `connections` array.

Save the file. Dev server hot-reloads. Done.

---

## Sanity check after any edit

```bash
npx tsc --noEmit
```

Exit code 0 = clean. If TypeScript yells, the doc you followed lists which fields are required.

---

## Where files live

```
src/data/
  portfolio.ts        ← projects, info nodes, general info, terminal data, connections
  types.ts            ← TypeScript contract — don't edit, but READ when debugging types

src/lib/
  memos.ts            ← memo loader (reads content/memos/*.md via gray-matter)

content/memos/        ← one markdown file = one memo. Filename = slug.
src/app/              ← one folder per route (app/shipped/, app/ping/, app/matrix/, ...)
src/components/       ← reusable UI (don't touch unless rewriting a page)
public/               ← /resume.pdf, /favicon.svg, /media/<slug>/screenshots, etc.
```

Auto-generated routes (you do **not** write these by hand):

- `/shipped/<slug>` — generated from a project node in `portfolio.ts`
- `/internal-memos/<slug>` — generated from `content/memos/<slug>.md`
- `/sitemap.xml` — emits one URL per route + project + memo
