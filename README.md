# System Blueprint — Portfolio of Mayank Himmatsingka

A brutalist, interactive terminal-based portfolio engineered as an internal operations dashboard. Designed to deliver a high-impact, developer-focused experience on desktop and a professional Tactical PDA interface on mobile.

**Live:** [mayankhimmatsingka.com](https://mayankhimmatsingka.com) *(or your deployed URL)*

---

## 🚀 Key Features

### Desktop (Power User Experience)
- **The Blueprint Grid** — A 300vw × 300vh infinite, draggable drafting canvas with physics-based node positioning (`SystemGrid.tsx`).
- **Command Palette** — Primary navigation hub (`Ctrl+K` / `/`). Supports system commands, route navigation, and classified directives.
- **Orbital Navigation** — GTA V-style radial menu for quick node access (`OrbitalNav.tsx`).
- **Chain Navigation** — Draggable, physics-linked button train for spatial navigation (`ChainNav.tsx`).
- **System Terminals** — Interactive `BootSequence`, `SystemBreach` (root access minigame), and `InteractiveBios` (DEL key POST intercept).
- **Hardware Integrations** — Web Audio API mechanical keystrokes (`useSystemAudio`), ASCII surveillance overlay mapping webcam feed to DOM.
- **Clearance System** — 3-tier access control (VISITOR → OPERATOR → ROOT) unlocking hidden nodes and classified content.

### Mobile (Tactical PDA Experience)
- **Vertical Feed** — Touch-optimized card-based layout replacing the infinite canvas. Sections: Identity, Shipped Projects, System Modules, Quick Access.
- **Docked Action Bar** — Sticky bottom navigation with Menu, Projects, Theme, and Contact buttons (56px, ≥48px touch targets).
- **Mobile Menu** — Full-screen slide-up navigation with all routes + Quick Actions (Resume, GitHub, LinkedIn).
- **Tap-to-Expand Cards** — Accordion-style project cards with metrics, case file links, and status badges (`MobileNodeCard.tsx`).
- **Mobile Abort Button** — Universal ESC key replacement for fullscreen overlays.
- **Device Gating** — Clean code separation via `useDevice` hook — desktop and mobile render entirely different component trees.

---

## 🏗️ Architecture Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 (PostCSS inline) |
| Animations | Framer Motion |
| Data | Zero CMS — raw TypeScript objects in `src/data/` |
| Themes | 5 phosphor themes (Default, Aviation, Amber, Matrix, Dark Ops) |

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage — branches desktop/mobile via useDevice
│   ├── commands/               # Terminal sandbox
│   ├── shipped/                # Project case files (deployment registry)
│   ├── internal-memos/         # Blog / intelligence archive
│   ├── matrix/                 # Interactive skill console
│   ├── core-identity/          # Operator profile / about page
│   ├── uplink/                 # Contact page (secure handshake)
│   └── ping/                   # Health check / status page
│
├── components/
│   ├── mobile/                 # Mobile-only components (isolated)
│   │   ├── MobilePDAShell.tsx  # Complete mobile homepage
│   │   ├── MobileNodeCard.tsx  # Tap-to-expand accordion cards
│   │   ├── DockedActionBar.tsx # Sticky bottom navigation
│   │   ├── MobileMenu.tsx      # Full-screen navigation menu
│   │   └── MobileAbortButton.tsx # ESC key replacement
│   │
│   ├── SystemGrid.tsx          # Desktop infinite canvas
│   ├── ArchitectureNode.tsx    # Desktop draggable node
│   ├── CommandPalette.tsx      # Ctrl+K command interface
│   ├── ChainNav.tsx            # Draggable chain navigation
│   ├── OrbitalNav.tsx          # Radial menu navigation
│   ├── BootSequence.tsx        # Terminal boot animation
│   ├── SystemBreach.tsx        # Root access minigame
│   └── ...                     # Other system components
│
├── hooks/
│   ├── useDevice.ts            # SSR-safe mobile/touch detection
│   ├── useTelemetryTab.ts      # Browser tab telemetry
│   └── useSystemAudio.ts       # Web Audio API integration
│
└── data/
    ├── portfolio.ts            # All project data, nodes, general info
    ├── memos.ts                # Blog/memo content
    └── types.ts                # TypeScript type definitions
```

---

## 📂 Documentation

All architectural plans and development logs are consolidated in `docs/`:

| Document | Purpose |
|---|---|
| [CONTEXT.md](docs/CONTEXT.md) | System context & session resumption protocol |
| [portfolio_deep_dive.md](docs/portfolio_deep_dive.md) | Full architectural audit |
| [mobile_architecture_plan.md](docs/mobile_architecture_plan.md) | Original mobile strategy (Tactical PDA concept) |
| [plans.md](docs/plans.md) | Future roadmap & brainstorm |
| [session_summary.md](docs/session_summary.md) | Phase 1 development log |
| [system_blueprint_commit_plan.md](docs/system_blueprint_commit_plan.md) | Atomic commit history plan |

Additional guides:
| Document | Purpose |
|---|---|
| [HOW_TO_UPDATE.md](HOW_TO_UPDATE.md) | Step-by-step guide for adding projects, blogs, and experiences |
| [AGENTS.md](AGENTS.md) | AI agent configuration |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
```

---

## 🔐 Easter Eggs & Classified Features

> These are meant to be discovered, not documented. But if you're reading the source...
>
> - Type `/breach` in the Command Palette
> - Type `/engage_surveillance` to activate the ASCII camera feed
> - Type `/play` for the Signal Lost game
> - Spam the `DEL` key 5 times to enter the BIOS
> - Check the browser console for a classified warning

---

> *Developed by Mayank Himmatsingka*