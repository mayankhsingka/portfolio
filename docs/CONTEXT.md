# System Blueprint: Context & Resumption Protocol

## Operator Profile
* **Name**: Mayank Himmatsingka
* **Age**: 20
* **Identity**: Product Builder & System Architect
* **Ethos**: Ships innovative products extremely fast. Values operational leverage, zero-fluff execution, and system-level problem-solving over generic web development tropes.

## The Aesthetic Paradigm (Engineering Graphics & Design)
This portfolio is **NOT** a standard website. It must look and feel like an internal dashboard, a system terminal, or a structural engineering blueprint.
**Strict Rules:**
1. **Colors**: Pure white (`#FFFFFF`) backgrounds. Pure black (`#000000`) text, borders, and UI elements. No grays, no shadows (except sharp block shadows: `[8px_8px_0px_0px_rgba(0,0,0,1)]`), no gradients. (Exception: Deep blue `#0000a0` for the BIOS mode).
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

## The "Mindblowing" Interactive Layer (High-End Polish)
This project incorporates extreme edge-case capabilities disguised as retro-hardware UI elements. DO NOT REMOVE or refactor these without explicit permission:
1. **`useSystemAudio.ts`**: Pure mathematical Web Audio API generator (Oscillators) creating mechanical keystrokes and snaps without external `.mp3` payloads.
2. **`SurveillanceCamera.tsx`**: Uses `getUserMedia` and an invisible `<canvas>` to dump frame-by-frame luminance data straight into a `<pre>` tag's `.textContent` via a raw React ref. It maps the camera feed to pure ASCII at 60fps, entirely bypassing React's state reconciliation engine to prevent lag.
3. **Grid Physics (`DataFlowLines.tsx`)**: Unlike standard components, the SVG red wire constraints run on a constant `requestAnimationFrame` loop to track DOM geometries (`getBoundingClientRect()`) at 60fps, allowing taut rubber-band physics equations when nodes are tossed across the screen.
4. **`useScrambleText.ts`**: A high-efficiency render loop that intercepts `window.dispatchEvent("system-decrypt")` to shatter the text of DOM nodes into random HEX characters when users execute the `/breach` command to gain `$ ROOT` clearance.
5. **`InteractiveBios.tsx`**: Hitting `[DEL]` or `[Backspace]` during the cold-boot terminal sequence `BootSequence` intercepts the startup code directly into a fully hardware-mapped MS-DOS/AMI BIOS interactive portfolio configuration panel utilizing pure arrow-key DOM logic (`preventDefault`).

## Data Management
There is no CMS or database to keep infrastructure hyper-lean. All content is hydrated via raw TypeScript objects:
- `src/data/portfolio.ts`: Stores the `nodes`, `logs`, `commands`, setup configurations, and central developer identity.
- `src/data/memos.ts`: Stores the markdown/paragraph logic for the `/internal-memos` transmissions.

## Stack Profile
- **Framework**: Next.js 16.2.2 (App Router, strict Client/Server boundaries, Turbopack enabled)
- **Styling**: Tailwind CSS v4 (PostCSS inline via `globals.css`)
- **Animation/Physics**: `framer-motion` (used strictly for layout transitions, node throwing physics `dragMomentum`, and mechanical bounce states).
