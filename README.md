# System Blueprint Portfolio

A brutalist, interactive terminal-based portfolio built to simulate an internal operations dashboard / engineering blueprint.

## 🚀 Key Features

- **The Blueprint Grid:** A 300vw x 300vh infinite, draggable drafting canvas (`SystemGrid.tsx`).
- **Command Palette:** Primary navigation hub accessible via `Ctrl+K` or `/`.
- **System Terminals:** Interactive `BootSequence`, `SystemBreach`, and `InteractiveBios` for a gamified UX.
- **Hardware Integrations:** Web Audio API (`useSystemAudio`) for mechanical keystrokes, and ASCII surveillance overlays mapping webcam feed direct to DOM.

## 🏗️ Architecture Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 (PostCSS inline)
- **Animations/Physics**: Framer Motion
- **Data Management**: Zero CMS; completely hydrated via raw TypeScript objects in `src/data/`.

## 📂 Documentation

All architectural plans, audit logs, and development deep dives have been consolidated into the `docs/` registry:

- [System Context & Resumption Protocol](docs/CONTEXT.md)
- [Portfolio Deep Dive & Audit](docs/portfolio_deep_dive.md)
- [Mobile Architecture Plan](docs/mobile_architecture_plan.md)
- [Session Summary (Phase 1)](docs/session_summary.md)
- [System Blueprint Commit Plan](docs/system_blueprint_commit_plan.md)
- [Future Mobile Brainstorm](docs/plans.md)

---
> *Developed by Mayank Himmatsingka*