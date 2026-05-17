# How to Add a New Project / Experience

> **Stamp**
> What this does: adds a new node to the canvas, a new card on `/shipped`, a new auto-generated case-file page at `/shipped/<slug>`, and a card on mobile.
> What it touches: only `src/data/portfolio.ts` and optionally `public/media/<slug>/`.
> Time: ~10 minutes.

---

## Step 1 — Open the file

Open `src/data/portfolio.ts`. Find the `nodes:` array (starts near line 26). Each `{}` inside is one node.

## Step 2 — Decide: project or info?

- **`kind: "project"`** = full case file. Use this for shipped products, real client work, experiences. Generates a `/shipped/<slug>` page automatically.
- **`kind: "info"`** = canvas card only, no case file. Use for things like "Core Stack" or "Reading List."

Most of what you want to add is `"project"`.

## Step 3 — Copy this template into `nodes` array

Paste the whole block as a new element in `nodes: [...]`. **Every field is required for a project** (TypeScript will error if you skip one). Optional fields are marked.

```typescript
{
  kind: "project",
  id: "exp_3",                       // unique short id (exp_3, exp_4, ...)
  title: "Project Title",            // shown on canvas, case file, ticker
  slug: "project-title",             // URL slug — final URL: /shipped/project-title
  status: "ACTIVE",                  // "ACTIVE" | "SCALING" | "CLASSIFIED" | "LOCKED"
  description: "One sentence brutalist tagline. ~150 chars.",

  // ── Canvas position ──
  // OPTIONAL. If you omit `top`/`left`, applyAutoLayout (utils/autoLayout.ts)
  // assigns this node a stable slot on a golden-ratio spiral around `core`.
  // Only set them by hand if you want to override that for a specific node.
  // top:  "calc(140vh - 60px)",
  // left: "calc(160vw - 125px)",

  // ── Links shown on case file ──
  sourceUrl: "https://github.com/mayankhsingka/project-title",
  liveUrl: "https://project.com",

  // ── Case-file header ──
  fileId: "CASE_003",                // CASE_001 = Manasya, CASE_002 = Producive
  created: "2026-05-01",             // YYYY-MM-DD
  modified: "2026-05-14",
  revision: 1,
  telemetry: "SNAPSHOT_2026-05-14: USERS: 120 | UPTIME: 12d",

  // ── Case-file body ──
  problem: "What real problem did this solve? 2-4 sentences. Plain language, not metaphor.",

  architectureDecisions: [
    "Decision 1 — why you picked X over Y (one sentence each).",
    "Decision 2 — ...",
    "Decision 3 — ...",
  ],

  challenges: [
    { title: "Short Title", detail: "What was hard, what you tried, how you solved it. 1-2 sentences." },
    { title: "Another One", detail: "..." },
  ],

  impact: "What changed because this shipped. Concrete if possible (users, metrics, outcomes).",

  techStack: [
    { label: "FWD",  value: "Next.js 16", reason: "Why this stack choice — one sentence." },
    { label: "DB",   value: "Supabase",   reason: "..." },
    { label: "AUTH", value: "Clerk",      reason: "..." },
    // Add as many as needed. Label is your category short-code; value is the tech; reason is optional but recommended.
  ],

  // ── Canvas card metrics ──
  metrics: [
    { label: "Type",    value: "Web App" },
    { label: "Users",   value: "120" },
  ],

  // ── OPTIONAL: gallery (only include if you have real screenshots) ──
  gallery: [
    { type: "image", url: "/media/project-title/dashboard.png", caption: "What the user sees." },
    { type: "image", url: "/media/project-title/flow.png", caption: "Internal flow." },
  ],

  // ── OPTIONAL: clearance gate ──
  // clearance: "OPERATOR",   // node only visible to OPERATOR+
  // clearance: "ROOT",       // node only visible after /breach
}
```

## Step 4 — Add screenshots (optional but strongly recommended)

1. Create a folder: `public/media/<your-slug>/`
2. Drop PNG or JPG screenshots in there. Suggested names: `dashboard.png`, `hero.png`, `flow.png`.
3. In your node's `gallery:` array, set each `url` to `/media/<your-slug>/<filename>` (no `public` prefix — that's the web root).
4. If you have **no screenshots yet**, delete the entire `gallery:` line from your node. The case file will still render perfectly — it just won't show a gallery section. **Do not leave placeholder URLs in.**

## Step 5 — Canvas position (usually skip this)

Positions are auto-assigned. `utils/autoLayout.ts` keeps a stable per-id slot table and places each new node on a golden-ratio spiral around the core. Adding a project automatically lands it at a clean orbit — no math required.

**Only override if you have a specific reason** (e.g., you want a project to sit visually close to another for a story beat). To override, uncomment `top:` and `left:` in the template above. Canvas is 300vw × 300vh, center is `150vw × 150vh`, subtract `60px` from top and `125px` from left in the `calc()` to match the existing centering math.

If you add a new node, register its slot in `SLOT_BY_ID` inside `utils/autoLayout.ts` so it gets a deterministic position (otherwise it falls back to a hash). One line:

```ts
const SLOT_BY_ID: Record<string, number> = {
  exp_1: 0,
  exp_2: 1,
  skill_matrix: 2,
  reading_list: 3,
  exp_3: 4,        // ← your new node, next slot
};
```

## Step 6 — Save and check

1. Save `portfolio.ts`. The dev server hot-reloads.
2. Visit `/` — your node should appear on the canvas in the position you set.
3. Visit `/shipped` — your card should be at the bottom of the list.
4. Visit `/shipped/<your-slug>` — the full case file should render.
5. Run `npx tsc --noEmit` — exit 0 means types are clean.

## Common errors

- **"Type 'X' is not assignable to type 'ArchNode'"** → you missed a required field. Open `src/data/types.ts:15-31` and compare against your node.
- **"Status must be one of ACTIVE | SCALING | CLASSIFIED | LOCKED"** → typo in your `status:` value.
- **404 on `/shipped/<slug>`** → typo in the `slug:` field, or you forgot to save the file.
- **Image broken** → wrong path. Should be `/media/...` not `/public/media/...`.

## Step 7 — Wire it up on the canvas (recommended)

Open `src/data/portfolio.ts` and add a row to the `connections:` array near the bottom:

```ts
connections: [
  { from: "core", to: "exp_1" },
  { from: "core", to: "exp_2" },
  { from: "core", to: "skill_matrix" },
  { from: "core", to: "reading_list" },
  { from: "core", to: "exp_3" },   // ← your new node
],
```

`DataFlowLines` reads this array and draws an animated wire from `core` to your node, snapping to the visible left/right port dots based on relative position. No code changes needed — the canvas observes mutations and re-traces automatically.

Cross-edges work too (e.g. `{ from: "exp_3", to: "skill_matrix" }`) if you want to show a project linking to a capability.

## Verifying everything propagated

After saving, your one node should now be present at all of these surfaces — no extra editing required:

- ✅ Desktop canvas — node visible, wire to `core`, draggable
- ✅ `/shipped` — card appears in the registry list
- ✅ `/shipped/<your-slug>` — full case file renders
- ✅ Mobile PDA — card appears under CASE_FILES tab
- ✅ `/sitemap.xml` — URL is indexed
- ✅ Command palette (Ctrl+K) — no entry needed; palette only surfaces routes, not nodes
