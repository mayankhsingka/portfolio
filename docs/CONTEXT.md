# System Blueprint: Context & Resumption Protocol

## Operator Profile
* **Name**: Mayank Himmatsingka
* **Age**: 20
* **Identity**: Product Builder & System Architect
* **Ethos**: Ships innovative products extremely fast. Values operational leverage, zero-fluff execution, and system-level problem-solving over generic web development tropes.

## The Aesthetic Paradigm (Engineering Graphics & Design)
This portfolio is **NOT** a standard website. It must look and feel like an internal dashboard, a system terminal, or a structural engineering blueprint.
**Strict Rules:**
1. **Colors**: Cream (`#FAF3E0`) page backgrounds (via `var(--background)` and Tailwind's themed `bg-white`). Pure black (`#000000`) text, borders, and UI elements (via `var(--foreground)` and themed `bg-black`). No raw grays, no soft shadows (only sharp block shadows: `shadow-[Npx_Npx_0px_0px_currentColor]`), no gradients. Exception: Deep blue `#0000a0` for the BIOS easter egg. All hardcoded hex must route through theme variables so the phosphor themes (Aviation / Amber / Matrix / Dark Ops) work correctly.
2. **Typography**: 
   - `Space Grotesk` (Sans-serif) for headers and massive architectural titles.
   - `JetBrains Mono` (Monospace) for logs, metrics, inputs, UI timestamps, and the `// section_labels`.
3. **Components**: Brutalist. Hard corners. Exposed borders (`border-2`, `border-4`). High contrast. Information density is prioritized over "clean/empty" minimal web design. If it looks like a generic SaaS landing page, it is wrong.
4. **Brand mark**: `<NumberPlate />` (MH · 04 · 2006 in Indian car-plate style) sits in fixed top-left of the landing canvas, in the /ping sticky status bar, and in the mobile PDA header.

## The UX Paradigm (OS / Terminal Operation)
1. **No Standard Navbars/Footers**: Unconventional navigation is enforced.
2. **The Blueprint Grid (`SystemGrid.tsx`)**: The root landing page acts as an infinite, draggable drafting canvas.
3. **The Command Palette (`CommandPalette.tsx`)**: The primary navigation hub. Accessed globally via `Ctrl+K` or `/`.
4. **Overlay Modals (`SystemShortcuts.tsx`)**: Fast, instantaneous context shifting accessible via hotkeys (`Shift+A`, `Shift+C`).
5. **Terminal Logs (`TerminalLogs.tsx`)**: Streaming background operations replace traditional "bio" paragraphs.
6. **Memos / Blog (`/internal-memos`)**: An isolated, zero-distraction reading environment utilizing Next.js dynamic routes. Bookmarks are handled locally via `localStorage`.

## The "Mindblowing" Interactive Layer (High-End Polish)
This project incorporates extreme edge-case capabilities disguised as retro-hardware UI elements. DO NOT REMOVE or refactor these without explicit permission:
1. **`useSystemAudio.ts`**: Pure mathematical Web Audio API generator (Oscillators) creating mechanical keystrokes and snaps without external `.mp3` payloads.
2. **`SurveillanceCamera.tsx`**: Uses `getUserMedia` and an invisible `<canvas>` to dump frame-by-frame luminance data straight into a `<pre>` tag's `.textContent` via a raw React ref. It maps the camera feed to pure ASCII at 60fps, entirely bypassing React's state reconciliation engine to prevent lag.
3. **Grid Physics (`DataFlowLines.tsx`)**: The SVG wire constraints re-trace whenever a node moves — drag, expand/collapse (250 → 400 px), or clearance-driven layout shift. Implementation uses a `MutationObserver` on the canvas (`childList` + `style` attr changes) plus a `system-node-moved` event, all funneled through a `requestAnimationFrame`-coalesced schedule for tautness without per-frame thrash. Endpoints snap to the visible left/right port dots based on relative position.
4. **`useScrambleText.ts`**: A high-efficiency render loop that intercepts `window.dispatchEvent("system-decrypt")` to shatter the text of DOM nodes into random HEX characters when users execute the `/breach` command to gain `$ ROOT` clearance.
5. **`InteractiveBios.tsx`**: Hitting `[DEL]` or `[Backspace]` during the cold-boot terminal sequence `BootSequence` intercepts the startup code directly into a fully hardware-mapped MS-DOS/AMI BIOS interactive portfolio configuration panel utilizing pure arrow-key DOM logic (`preventDefault`).

## Data Management
There is no CMS or database to keep infrastructure hyper-lean. Content lives in two places:
- `src/data/portfolio.ts` — typed objects: `nodes`, `logs`, `commands`, `connections`, central operator identity (`general`).
- `content/memos/*.md` — one markdown file per memo. Frontmatter (title, date, tags, excerpt) parsed via `gray-matter`; body rendered via `react-markdown`. Server-loaded by `src/lib/memos.ts`.

Authoring guides: see `docs/ADD_PROJECT.md`, `docs/ADD_MEMO.md`, and `docs/ADD_PAGE.md`.

## Stack Profile
- **Framework**: Next.js 16.2.2 (App Router, strict Client/Server boundaries, Turbopack enabled)
- **Styling**: Tailwind CSS v4 (PostCSS inline via `globals.css`)
- **Animation/Physics**: `framer-motion` (used strictly for layout transitions, node throwing physics `dragMomentum`, and mechanical bounce states).
