# System Blueprint: Context & Resumption Protocol

## Operator Profile
* **Name**: Mayank Himmatsingka
* **Age**: 20
* **Identity**: Product Builder & System Architect
* **Ethos**: Ships innovative products extremely fast. Values operational leverage, zero-fluff execution, and system-level problem-solving over generic web development tropes.

## The Aesthetic Paradigm (Engineering Graphics & Design)
This portfolio is **NOT** a standard website. It must look and feel like an internal dashboard, a system terminal, or a structural engineering blueprint.
**Strict Rules:**
1. **Colors**: Pure white (`#FFFFFF`) backgrounds. Pure black (`#000000`) text, borders, and UI elements. No grays, no shadows (except sharp block shadows: `[8px_8px_0px_0px_rgba(0,0,0,1)]`), no gradients.
2. **Typography**: 
   - `Space Grotesk` (Sans-serif) for headers and massive architectural titles.
   - `JetBrains Mono` (Monospace) for logs, metrics, inputs, and UI timestamps.
3. **Components**: Brutalist. Hard corners. Exposed borders (`border-2`, `border-4`). High contrast. Information density is prioritized over "clean/empty" minimal web design. If it looks like a generic SaaS landing page, it is wrong.

## The UX Paradigm (OS / Terminal Operation)
1. **No Standard Navbars/Footers**: Unconventional navigation is enforced.
2. **The Blueprint Grid (`SystemGrid.tsx`)**: The root landing page acts as an infinite, draggable drafting canvas.
3. **The Command Palette (`CommandPalette.tsx`)**: The primary navigation hub. Accessed globally via `Ctrl+K` or `/`.
4. **Overlay Modals (`SystemShortcuts.tsx`)**: Fast, instantaneous context shifting accessible via hotkeys (`Shift+A`, `Shift+C`).
5. **Terminal Logs (`TerminalLogs.tsx`)**: Streaming background operations replace traditional "bio" paragraphs.
6. **Memos / Blog (`/internal-memos`)**: An isolated, zero-distraction reading environment utilizing Next.js dynamic routes. Bookmarks are handled locally via `localStorage`.

## Data Management
There is no CMS or database to keep infrastructure hyper-lean. All content is hydrated via raw TypeScript objects:
- `src/data/portfolio.ts`: Stores the `nodes`, `logs`, `commands`, and central developer identity.
- `src/data/memos.ts`: Stores the markdown/paragraph logic for the `/internal-memos` transmissions.

## Stack Profile
- **Framework**: Next.js (App Router, strict Client/Server boundaries)
- **Styling**: Tailwind CSS (PostCSS inline via `globals.css`)
- **Animation/Physics**: `framer-motion` (used strictly for layout transitions, dragging logic, and mechanical snaps—no bouncy, elastic fluff).
