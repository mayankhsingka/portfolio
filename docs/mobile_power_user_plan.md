# Power User Mobile Implementation Plan
# Architecture: "Tactical PDA"

**Goal:** Create a mobile experience that feels like a purpose-built hacker's field terminal. Not a shrunken version of the desktop — a distinct instrument for the same operator.

**Design Principles:**
- **Zero keyboard dependency.** Every interaction must work with thumbs only.
- **Every feature, zero compromise.** The mobile user must be able to reach the same content, easter eggs, and commands as the desktop user.
- **Swipe is the new drag.** Replace the infinite 2D canvas pan with gesture-driven channel navigation.
- **Code must be cleanly gated.** All mobile logic is isolated behind a `useDevice` hook so it never pollutes desktop code and can be upgraded independently.

---

## The Architecture: Code Gating Strategy

The single most important principle: **Desktop and Mobile render different component trees, not the same component with responsive CSS.**

```
page.tsx (HomeContent)
├── isMobile === false → <DesktopShell /> [Current working system, untouched]
└── isMobile === true  → <MobilePDAShell /> [What we are building]
```

All existing components (`SystemGrid`, `DataFlowLines`, `ChainNav`) remain **untouched**. The mobile shell is purely additive.

---

## Phase 1: The `useDevice` Hook
**File to Create:** `src/hooks/useDevice.ts`

Exposes: `isMobile: boolean`, `isTouch: boolean`, `orientation: 'portrait' | 'landscape'`

Uses `matchMedia('(max-width: 768px)')` with a resize listener. SSR-safe.

---

## Phase 2: The Tactical Feed (Core Mobile Layout)
**File to Create:** `src/components/mobile/TacticalFeed.tsx`

### 3 Horizontal Swipe Channels:
| Channel | Label | Contents |
|---|---|---|
| 1 | `IDENT` | Root Directive + watermark + TerminalLogs |
| 2 | `OPS` | All project nodes (Manasya, Producive, + future) |
| 3 | `DATA` | Skill Matrix + Reading Queue + Memos link |

A pinned channel indicator sits at the top: `[ ◀ IDENT · OPS · DATA ▶ ]`

### Node Cards (Mobile Format):
Collapsed:
```
┌──────────────────────────────────────────┐
│ [ACTIVE] MANASYA                         │
│ Mental wellness platform...              │
│                           [ ACCESS ▼ ]   │
└──────────────────────────────────────────┘
```
Expanded (tap to toggle):
```
┌──────────────────────────────────────────┐
│ [ACTIVE] MANASYA                         │
│ Counselors: 20   Students: 50            │
│                                          │
│ [ VIEW CASE FILE → ]  [ SOURCE_CODE ]    │
└──────────────────────────────────────────┘
```

---

## Phase 3: CRT Glitch Channel Transition
**File to Create:** `src/components/mobile/GlitchTransition.tsx`

200ms animation on channel swap — makes it feel like switching CCTV feeds.

Sequence:
1. **0–40ms:** Brightness flash + slight horizontal translate
2. **40–80ms:** Ghost image overlay (opacity 0.3)
3. **80–150ms:** Horizontal scanline artifacts scroll upward
4. **150–200ms:** New channel snaps in hard (no ease)

Implemented via Framer Motion `AnimatePresence` + custom CSS keyframe.

---

## Phase 4: Docked Action Bar
**File to Create:** `src/components/mobile/DockedActionBar.tsx`

Sticky 56px bar at the bottom of the viewport. Replaces `Ctrl+K`, `ChainNav`, and `ThemeToggle`.

```
│  [≡ MENU]  [> EXEC]  [◉ THEME]  [↗ GO]  │
```

| Button | Action |
|---|---|
| `[≡ MENU]` | Full-screen Command Palette slide-up |
| `[> EXEC]` | Opens Macro Keypad (Phase 5) |
| `[◉ THEME]` | Cycles theme instantly |
| `[↗ GO]` | Routes to focused node's case file |

---

## Phase 5: Macro Keypad (Quick Execute)
**File to Create:** `src/components/mobile/MacroKeypad.tsx`

Full-screen bottom sheet with tap-to-execute command buttons. Reuses the exact same `executeCommand()` logic from `CommandPalette.tsx` — no code duplication.

```
┌──────────────────────────────────────────┐
│ // QUICK EXECUTE                  [↓ X]  │
│──────────────────────────────────────────│
│ [ neofetch ]       [ whoami ]            │
│ [ ls ]             [ cat readme.md ]     │
│ [ /theme ]         [ /engage_night_ops ] │
│ [ /shipped ]       [ /internal-memos ]   │
│ ⚠ CLASSIFIED                            │
│ [ /engage_surveillance ]   [ /breach ]   │
└──────────────────────────────────────────┘
```

---

## Phase 6: Mobile Abort Button
**File to Create:** `src/components/mobile/MobileAbortButton.tsx`

Injected into fullscreen overlays when `isMobile === true`. Fixed position at `bottom: 80px`, calls the overlay's existing `onExit` prop. No refactoring of existing overlays needed.

---

## Phase 7: Boot Sequence Polish
After boot on mobile, show a brief: **"SWIPE LEFT TO BEGIN TACTICAL SCAN"** prompt to teach the swipe paradigm on first use.

---

## File Structure After Implementation

```
src/
├── hooks/
│   ├── useDevice.ts            ← NEW
│   └── ... (existing, untouched)
│
├── components/
│   ├── mobile/                 ← NEW directory
│   │   ├── TacticalFeed.tsx
│   │   ├── GlitchTransition.tsx
│   │   ├── DockedActionBar.tsx
│   │   ├── MacroKeypad.tsx
│   │   └── MobileAbortButton.tsx
│   │
│   └── ... (existing, untouched)
│
└── app/
    └── page.tsx                ← branches on isMobile
```

---

## What Works Automatically (No Changes Needed)
- **Clearance system** — `ClearanceProvider` wraps entire app
- **Themes** — CSS classes on `<html>`, `DockedActionBar` calls same logic
- **Case file pages** (`/shipped/[slug]`) — already scrollable pages
- **Memos pages** — already scrollable
- **Commands sandbox** — already works with mobile keyboard, Macro Keypad enhances it

---

## Discussion Points Before We Build

1. **Channel naming:** IDENT / OPS / DATA — or IDENTITY / REGISTRY / INTEL, or something else?
2. **Glitch intensity:** Subtle (< 100ms, barely perceptible) or Dramatic (heavy scanlines, ~300ms, memorable)?
3. **Boot swipe prompt:** Show "SWIPE LEFT TO BEGIN" or let users discover it naturally?
4. **Classified commands on mobile:** Should `/breach` and `/engage_surveillance` be hidden in the MacroKeypad until the user hits OPERATOR clearance?
