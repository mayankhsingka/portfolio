# Mobile Architecture Plan: "Tactical PDA"

The "System Blueprint" portfolio currently relies on a Desktop OS metaphor (physics nodes, `Ctrl+K` command palettes, deep terminal interaction). This metaphor fails on a 6-inch vertical touchscreen. 

To maintain the brutalist, high-tech aesthetic while ensuring perfect usability, the mobile version will shift to a **"Secure Tactical PDA"** paradigm. 

---

## 1. The Home Screen (Tactical Feed)
**Problem:** A 2D physics canvas cannot be navigated gracefully with a thumb. Nodes will overlap and be impossible to drag/read.
**Solution:** 
* Disable the physics engine on viewports `< 768px`.
* Transform the node network into a **Vertical Data Feed**.
* Render the massive `MAYANK HIMMATSINGKA` watermark fixed to the background.
* Project case files and internal memos become full-width, stackable "Cards". 
* **Interaction:** Tapping a card expands an inline accordion with a brief summary and an `[ACCESS_FILE]` button.

## 2. Command Navigation (The Action Bar)
**Problem:** Mobile users do not have a physical keyboard to hit `Ctrl+K`, and typing commands on a mobile keyboard blocks 50% of the screen.
**Solution:**
* Implement a **Sticky Bottom Action Bar** (a brutalist tab bar).
* It remains fixed to the bottom of the viewport at all times.
* **Core Buttons:**
  1. `[ DIRECTORY ]` - Opens a full-screen, simple list menu of all available pages (Archive, Sandbox, Identity).
  2. `[ PHOSPHOR ]` - Instantly cycles the theme (Green/Amber/Dark-Ops) without typing.
  3. `[ UPLINK ]` - Immediate routing to the Secure Handshake contact funnel.

## 3. The Sandbox (`/commands`)
**Problem:** The terminal sandbox requires intense typing.
**Solution:**
* Add a row of "Quick Execute" macro buttons right above the mobile keyboard. 
* Buttons like `[ neofetch ]`, `[ ls ]`, `[ whoami ]` that auto-type and execute the command when tapped, reducing the need for manual typing while preserving the terminal aesthetic.

## 4. Escape Protocol (Gestures & Exits)
**Problem:** Features like the `/breach` Galaxy or Reading Mode rely on the physical `ESC` key to exit.
**Solution:**
* Introduce a sticky, high-contrast `[ < ABORT ]` or `[ X CLOSE ]` button anchored to the top-left or bottom-left corner in all modal/fullscreen states.
* Ensure standard iOS/Android edge-swipe gestures can gracefully navigate "Back" without breaking the single-page application routing.

## 5. Typography & Density
**Problem:** Brutalist monospace text can become unreadable if shrunk too much.
**Solution:**
* Increase the base font size for monospace elements on mobile.
* Increase padding and line-heights drastically. Touch targets must be a minimum of `48x48px` to prevent misclicks.
* Use the Serif "Reading Mode" aggressively for all long-form text on mobile to reduce cognitive load.
