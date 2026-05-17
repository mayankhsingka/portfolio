# How to Add a Brand-New Page / Route

> **Stamp**
> What this does: adds a completely new top-level route (like `/research`, `/talks`, `/now`) — not a new project or memo.
> What it touches: one new file under `src/app/<route>/page.tsx`, plus minor edits to `sitemap.ts`, command palette, and mobile menu.
> Time: ~15 minutes.

Only use this for a genuinely new page. For a project → [ADD_PROJECT.md](./ADD_PROJECT.md). For a memo → [ADD_MEMO.md](./ADD_MEMO.md).

---

## Step 1 — Create the route folder

Pick a lowercase route. Examples that match the existing vocabulary: `/research`, `/uplink-log`, `/recon`, `/cache`.

```
src/app/<your-route>/
  page.tsx          ← the page itself (required)
  layout.tsx        ← OPTIONAL — wrapping layout if needed
  loading.tsx       ← OPTIONAL — shown while the page loads
```

## Step 2 — Use this template

Save as `src/app/<your-route>/page.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { PageHeaderNav } from "@/components/PageHeaderNav";
import { usePageScrollable } from "@/hooks/usePageScrollable";

export default function YourPage() {
  usePageScrollable();

  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col">
      {/* Sticky top status bar */}
      <div className="sticky top-0 z-30 bg-[var(--background)] border-b-2 border-current">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest opacity-50">
            // your_route
          </div>
          <PageHeaderNav theme="light" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 pb-32 flex flex-col gap-10 sm:gap-14">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest opacity-50">
            // section_label
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.92]">
            Page Title<br />Here.
          </h1>
          <p className="text-base sm:text-lg opacity-75 max-w-2xl leading-relaxed">
            One-sentence description of what this page is for.
          </p>
        </motion.section>

        {/* Sections */}
        <section className="flex flex-col gap-4">
          <div className="border-b-2 border-current pb-2">
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
              // section_one
            </h2>
          </div>
          <p>Your content here. Use the same cream bg + black borders + hard-shadow brutalist vocabulary as the rest of the site.</p>
        </section>
      </div>
    </main>
  );
}
```

### Theme conventions

All inner pages use **theme variables**, not hardcoded colours:

| Token | Use for |
|---|---|
| `bg-[var(--background)]` | Page background — cream by default, adapts to phosphor themes |
| `text-[var(--foreground)]` | Body text — black by default |
| `border-current` | Borders, dividers — inherits the foreground colour |
| `bg-current text-[var(--background)]` | Inverted accents (badges, CTAs) — black bg, cream text |
| `bg-current/10`, `border-current/20` | Subtle highlights and faint dividers |

**Do not** use `bg-black`/`text-white` for the page wrapper. That's how the dark-frame look snuck in before the cream refactor (commit `aba57ee`).

## Step 3 — Register in sitemap

Open `src/app/sitemap.ts`. Add:

```ts
{
  url: `${BASE_URL}/your-route`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.7,
},
```

## Step 4 — Add to navigation

**Command Palette** (`src/components/CommandPalette.tsx`) — add to `STATIC_NAV`:

```ts
{ path: "/your-route", label: "Display", description: "What this page does" },
```

**Mobile Menu** (`src/components/mobile/MobileMenu.tsx`) — add to `MENU_ITEMS`:

```ts
{ path: "/your-route", label: "Display Name", desc: "Short description" },
```

**(Optional) Top ChainNav** (`src/components/ChainNav.tsx`) — only if this is a primary top-level route. Add to `NAV_ITEMS` (and an icon glyph):

```ts
{ id: "your", label: "YOUR", sublabel: "tagline", route: "/your-route", icon: "◇" },
```

## Step 5 — Verify

1. Visit `/your-route` — renders.
2. Visit `/sitemap.xml` — URL appears.
3. `Ctrl+K` → search "your" — palette finds the route.
4. Mobile → menu → your route is listed.
5. `npx tsc --noEmit` — exit 0.

## Common errors

- **404** → folder/file naming. Must be `src/app/<route>/page.tsx` exactly, with `export default`.
- **Page doesn't scroll** → forgot `"use client"` at the top, or forgot to call `usePageScrollable()`.
- **Colours look broken in dark-ops mode** → you used `bg-white` / `text-black` instead of `var(--background)` / `var(--foreground)`. Phosphor themes only swap the CSS variables, not Tailwind's hex colours.
