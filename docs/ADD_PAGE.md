# How to Add a Brand-New Page / Route

> **Stamp**
> What this does: adds a completely new top-level route (like `/research`, `/talks`, `/now`) — not a new project or memo.
> What it touches: creates one new file under `src/app/<route>/page.tsx`, plus minor edits to `sitemap.ts`, command palette, and mobile menu.
> Time: ~20 minutes.

Only use this if you genuinely need a new page. For a project, use [ADD_PROJECT.md](./ADD_PROJECT.md). For a blog post, use [ADD_MEMO.md](./ADD_MEMO.md).

---

## Step 1 — Decide light or dark

Look at existing inner pages:
- **Light theme** (white bg, black ink): `/shipped`, `/internal-memos`. Pattern: see `src/app/shipped/page.tsx`.
- **Dark theme** (black bg, white ink, scanlines): `/core-identity`, `/ping`. Pattern: see `src/app/core-identity/page.tsx`.

Pick the one that matches the page's intent.

## Step 2 — Create the route folder

Pick a route. Use lowercase, single-word if possible. Examples that fit the brutalist vocab: `/research`, `/uplink-log`, `/recon`, `/cache`, `/threadlog`.

```
src/app/<your-route>/
  page.tsx          ← the page itself
  layout.tsx        ← OPTIONAL — only if you need a wrapping layout
  loading.tsx       ← OPTIONAL — shown while the page loads
```

## Step 3 — Light-theme page template

Save this as `src/app/<your-route>/page.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { PageHeaderNav } from "@/components/PageHeaderNav";
import { usePageScrollable } from "@/hooks/usePageScrollable";

export default function YourPage() {
  usePageScrollable();

  return (
    <main className="w-full min-h-screen text-black flex flex-col p-4 md:p-8 lg:p-24 bg-black md:pl-[19rem]">
      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-8 md:gap-12 bg-white/90 p-4 md:p-8 border-2 md:border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">

        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="border-b-4 border-black pb-8 flex flex-col md:flex-row justify-between md:items-end gap-4"
        >
          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest opacity-50 mb-2">// SECTION_LABEL</h4>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">/your-route</h1>
            <p className="font-mono mt-4 text-sm max-w-xl">
              [SYS_LOG]: One-sentence description of this page.
            </p>
          </div>
          <PageHeaderNav theme="light" />
        </motion.header>

        {/* YOUR CONTENT HERE */}
        <section>
          <p>Replace this with your content.</p>
        </section>

        <footer className="border-t-4 border-black pt-8 flex justify-between items-center font-mono text-xs uppercase opacity-70">
          <span>// END OF FILE</span>
          <span>MAYANK_HIMMATSINGKA</span>
        </footer>
      </div>
    </main>
  );
}
```

## Step 4 — Dark-theme page template

If you picked dark, swap the `<main>` and content wrapper to match `/core-identity/page.tsx`:

```tsx
<main className="w-full min-h-screen bg-black text-white flex flex-col p-4 lg:p-12 overflow-visible relative md:pl-[19rem]">
  <div className="max-w-5xl mx-auto w-full z-10 flex flex-col gap-8">
    <header className="border-b-4 border-white pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8 md:mt-0">
      <div>
        <h4 className="font-mono text-sm uppercase tracking-widest opacity-50 mb-2 text-white">// SECTION_LABEL</h4>
        <h1 className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter">/your-route</h1>
      </div>
      <PageHeaderNav theme="dark" />
    </header>

    {/* YOUR CONTENT */}
  </div>
</main>
```

## Step 5 — Register the route for indexing

Open `src/app/sitemap.ts`. Add an entry so your sitemap picks it up:

```typescript
{
  url: `${BASE_URL}/your-route`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.7,
},
```

## Step 6 — Add to navigation

**Command Palette:** Open `src/components/CommandPalette.tsx`. Find the routes list (search for `/shipped` to locate the pattern). Add your route so power users can `Ctrl+K` to it.

**Mobile Menu:** Open `src/components/mobile/MobileMenu.tsx:12-19`. Add an entry to `MENU_ITEMS`:

```typescript
{ path: "/your-route", label: "Display Name", desc: "Short description" },
```

## Step 7 — Save and check

1. Visit `/your-route` — page renders.
2. Visit `/sitemap.xml` — your URL appears.
3. Open `Ctrl+K` — your route is searchable.
4. On mobile, open the menu — your route is listed.
5. `npx tsc --noEmit` — exit 0.

## Common errors

- **Route not found** → folder/file naming. Must be `src/app/<route>/page.tsx` exactly, with `default export`.
- **`usePageScrollable` not enabling scroll** → make sure `"use client"` is at the top.
- **Page header nav doesn't match the bg** → `theme="light"` for light pages, `theme="dark"` for dark.
