# System Maintenance — Content Authoring Index

This portfolio is data-driven. To add a project, blog, or page you almost never touch component files — you edit content in `src/data/` and the UI hydrates everything.

This file is the **index**. The actual step-by-step cookbooks live in `docs/`.

---

## What do you want to do?

| Task | Doc | Time |
|---|---|---|
| Add a new project / experience node | [`docs/ADD_PROJECT.md`](docs/ADD_PROJECT.md) | ~10 min |
| Add a new blog post (memo) | [`docs/ADD_MEMO.md`](docs/ADD_MEMO.md) | ~5 min |
| Add a brand-new page / route | [`docs/ADD_PAGE.md`](docs/ADD_PAGE.md) | ~20 min |
| Update boot logs, file system, or command list | See "Quick edits" below | ~2 min |

---

## Quick edits (no doc needed)

All of these live in `src/data/portfolio.ts`:

- **Boot terminal logs** (the scrolling lines after page load) → edit the `logs` array.
- **Fake file system** (what `ls` and `cat` return in `/commands`) → edit the `fileSystem` object.
- **Command list shown in `/commands`** → edit the `commands` array.
- **Your name, role, age, email, GitHub, LinkedIn, philosophy** → edit the `general` object.

Save the file. Next.js hot-reloads. Done.

---

## Sanity check after any edit

```bash
npx tsc --noEmit
```

Exit code 0 = clean. If TypeScript yells, the doc you followed will tell you which fields are required.

---

## Where files live

```
src/data/
  portfolio.ts   ← projects, info nodes, general info, terminal data
  memos.ts       ← blog posts
  types.ts       ← TypeScript contract — don't edit, but READ when debugging

src/app/         ← one folder per route (e.g. app/shipped/, app/uplink/)
src/components/  ← reusable UI (don't touch unless rewriting a page)
public/media/    ← project screenshots, organized per-project subfolder
```

The case-file page at `/shipped/<slug>` is **auto-generated** from a project node. You never write a new file for it.
The memo reader page at `/internal-memos/<slug>` is also auto-generated.
